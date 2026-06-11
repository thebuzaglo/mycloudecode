"""Propfirm rules engine.

Loads a rule-set (from YAML config) and enforces it before every trade:
daily loss limit, trailing/static max drawdown, contract caps, allowed
trading hours, news blackouts and consistency buffer. The engine is the
single authority — the decision engine *asks* it for permission and for the
remaining risk budget.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, time as dtime
from typing import List, Optional, Tuple
from zoneinfo import ZoneInfo


@dataclass
class PropFirmRules:
    name: str = "generic"
    account_size: float = 50_000.0
    # Loss limits (positive numbers, in account currency)
    max_daily_loss: float = 1_000.0
    max_drawdown: float = 2_000.0
    drawdown_mode: str = "trailing_eod"  # static | trailing_eod | trailing_intraday
    # TPT-style: trailing stops once the floor reaches the starting balance
    drawdown_stops_at_start: bool = False
    profit_target: float = 3_000.0
    # Position limits
    max_contracts: int = 5
    # Risk policy (bot-side, stricter than the firm)
    risk_per_trade_pct: float = 0.5      # % of account risked per trade
    daily_loss_soft_stop_pct: float = 80  # stop trading at X% of daily limit
    # Consistency: no single day may exceed X% of total profit (0 = disabled)
    consistency_max_day_pct: float = 0.0
    # Sessions, in exchange timezone
    timezone: str = "America/Chicago"
    sessions: List[Tuple[str, str]] = field(
        default_factory=lambda: [("08:30", "15:00")])
    # Blackout windows (e.g. around news), list of (start, end) HH:MM
    blackouts: List[Tuple[str, str]] = field(default_factory=list)
    # Hard flat time before close, HH:MM (empty = disabled)
    flat_by: str = "15:55"

    @staticmethod
    def from_dict(d: dict) -> "PropFirmRules":
        rules = PropFirmRules()
        for key, value in d.items():
            if hasattr(rules, key):
                setattr(rules, key, value)
        rules.sessions = [tuple(s) for s in rules.sessions]
        rules.blackouts = [tuple(b) for b in rules.blackouts]
        return rules


def _parse_hhmm(s: str) -> dtime:
    hour, minute = s.split(":")
    return dtime(int(hour), int(minute))


@dataclass
class AccountState:
    equity: float
    day_realized_pnl: float = 0.0
    drawdown_anchor: float = 0.0   # highest watermark for trailing drawdown
    total_realized_pnl: float = 0.0
    best_day_pnl: float = 0.0


class RulesEngine:
    def __init__(self, rules: PropFirmRules) -> None:
        self.rules = rules
        self.state = AccountState(
            equity=rules.account_size,
            drawdown_anchor=rules.account_size,
        )
        self._tz = ZoneInfo(rules.timezone)
        self._current_day: Optional[str] = None

    # ------------------------------------------------------------------ pnl
    def on_realized_pnl(self, pnl: float, now: datetime) -> None:
        self._roll_day(now)
        self.state.equity += pnl
        self.state.day_realized_pnl += pnl
        self.state.total_realized_pnl += pnl
        self.state.best_day_pnl = max(self.state.best_day_pnl,
                                      self.state.day_realized_pnl)
        if self.rules.drawdown_mode == "trailing_intraday":
            self.state.drawdown_anchor = max(self.state.drawdown_anchor,
                                             self.state.equity)

    def _roll_day(self, now: datetime) -> None:
        day = now.astimezone(self._tz).strftime("%Y-%m-%d")
        if self._current_day != day:
            if (self._current_day is not None
                    and self.rules.drawdown_mode == "trailing_eod"):
                self.state.drawdown_anchor = max(self.state.drawdown_anchor,
                                                 self.state.equity)
            self._current_day = day
            self.state.day_realized_pnl = 0.0

    # -------------------------------------------------------------- queries
    def daily_loss_remaining(self) -> float:
        """$ left before the (soft) daily loss limit; gains don't extend it.

        max_daily_loss <= 0 means the firm has no daily limit (e.g. Apex);
        the drawdown and per-trade caps still apply."""
        if self.rules.max_daily_loss <= 0:
            return float("inf")
        soft_limit = (self.rules.max_daily_loss
                      * self.rules.daily_loss_soft_stop_pct / 100.0)
        return soft_limit + min(self.state.day_realized_pnl, 0.0)

    def drawdown_remaining(self) -> float:
        anchor = self.state.drawdown_anchor
        if self.rules.drawdown_stops_at_start:
            # floor never rises above the starting balance (e.g. TPT)
            anchor = min(anchor, self.rules.account_size + self.rules.max_drawdown)
        floor = anchor - self.rules.max_drawdown
        return self.state.equity - floor

    def risk_budget(self) -> float:
        """Max $ the bot may risk on the next trade."""
        per_trade = self.rules.account_size * self.rules.risk_per_trade_pct / 100.0
        return max(0.0, min(per_trade,
                            self.daily_loss_remaining(),
                            self.drawdown_remaining()))

    def can_trade(self, now: datetime) -> Tuple[bool, str]:
        self._roll_day(now)
        local = now.astimezone(self._tz)
        t = local.time()

        if self.daily_loss_remaining() <= 0:
            return False, "daily loss limit reached"
        if self.drawdown_remaining() <= 0:
            return False, "max drawdown reached"
        if (self.rules.consistency_max_day_pct > 0
                and self.state.total_realized_pnl > 0):
            cap = (self.state.total_realized_pnl
                   * self.rules.consistency_max_day_pct / 100.0)
            if self.state.day_realized_pnl >= cap:
                return False, "consistency cap for today reached"
        if self.rules.flat_by and t >= _parse_hhmm(self.rules.flat_by):
            return False, "past flat-by time"
        for start, end in self.rules.blackouts:
            if _parse_hhmm(start) <= t <= _parse_hhmm(end):
                return False, f"news blackout {start}-{end}"
        in_session = any(_parse_hhmm(start) <= t <= _parse_hhmm(end)
                         for start, end in self.rules.sessions)
        if not in_session:
            return False, "outside trading session"
        return True, "ok"

    def must_flatten(self, now: datetime) -> bool:
        if not self.rules.flat_by:
            return False
        return now.astimezone(self._tz).time() >= _parse_hhmm(self.rules.flat_by)
