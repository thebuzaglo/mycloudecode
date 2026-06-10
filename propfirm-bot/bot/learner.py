"""Online self-improvement.

Two mechanisms, both persisted to the journal DB so learning survives
restarts:

1. **Council weight adaptation** (multiplicative weights / Hedge): after each
   closed trade, every member that voted gets rewarded or penalized in
   proportion to (vote alignment with the trade) x (clipped R multiple).
   Members that keep backing losing trades shrink; members that back winners
   grow. Timeframe weights are updated the same way from per-timeframe votes.

2. **Parameter hill-climbing**: every `review_every` closed trades, the
   learner compares rolling expectancy of the recent window vs the previous
   one and nudges `entry_threshold` / `stop_atr_mult` in the direction that
   improved results (with bounds so it can never tune itself into nonsense).
"""

from __future__ import annotations

import math
from typing import Dict

from .council import MEMBERS
from .performance import Journal, TradeRecord

WEIGHT_MIN, WEIGHT_MAX = 0.2, 5.0

PARAM_BOUNDS: Dict[str, tuple] = {
    "entry_threshold": (0.2, 0.7, 0.05),   # (lo, hi, step)
    "stop_atr_mult": (0.75, 3.0, 0.25),
    "reward_risk": (1.0, 4.0, 0.25),
}


class Learner:
    def __init__(self, journal: Journal, member_weights: Dict[str, float],
                 timeframe_weights: Dict[str, float],
                 params: Dict[str, float],
                 eta: float = 0.10, review_every: int = 20) -> None:
        self.journal = journal
        self.member_weights = member_weights
        self.timeframe_weights = timeframe_weights
        self.params = params
        self.eta = eta
        self.review_every = review_every
        self._trades_since_review = 0
        self._last_direction: Dict[str, int] = {}
        self.restore()

    # ------------------------------------------------------------- weights
    def on_trade_closed(self, record: TradeRecord) -> None:
        votes = record.votes or {}
        r = max(-2.0, min(2.0, record.r_multiple or 0.0))
        for key, vote in votes.items():
            if not isinstance(vote, (int, float)):
                continue
            # keys look like "5/trend_ema" (member) or "15" (timeframe)
            alignment = max(-1.0, min(1.0, vote * record.direction))
            update = math.exp(self.eta * alignment * r)
            if "/" in key:
                member = key.split("/", 1)[1]
                if member in MEMBERS:
                    self._bump(self.member_weights, member, update)
            elif key in self.timeframe_weights:
                self._bump(self.timeframe_weights, key, update)
        self._trades_since_review += 1
        if self._trades_since_review >= self.review_every:
            self._review_params()
            self._trades_since_review = 0
        self.persist()

    @staticmethod
    def _bump(weights: Dict[str, float], key: str, factor: float) -> None:
        weights[key] = max(WEIGHT_MIN,
                           min(WEIGHT_MAX, weights.get(key, 1.0) * factor))

    # -------------------------------------------------------------- params
    def _review_params(self) -> None:
        window = self.review_every
        trades = self.journal.closed_trades(limit=window * 2)
        if len(trades) < window * 2:
            return
        recent = [t["r_multiple"] or 0.0 for t in trades[:window]]
        previous = [t["r_multiple"] or 0.0 for t in trades[window:window * 2]]
        recent_exp = sum(recent) / len(recent)
        prev_exp = sum(previous) / len(previous)

        for name, (lo, hi, step) in PARAM_BOUNDS.items():
            direction = self._last_direction.get(name, 0)
            if direction == 0:
                # bootstrap: if results are poor, get more selective/looser
                direction = 1 if recent_exp < 0 else 0
            elif recent_exp < prev_exp:
                direction = -direction  # last nudge hurt -> reverse it
            if direction:
                value = self.params.get(name, lo)
                self.params[name] = max(lo, min(hi, value + direction * step))
            self._last_direction[name] = direction

    # --------------------------------------------------------- persistence
    def persist(self) -> None:
        self.journal.save_state("learner", {
            "member_weights": self.member_weights,
            "timeframe_weights": self.timeframe_weights,
            "params": self.params,
            "last_direction": self._last_direction,
        })

    def restore(self) -> None:
        state = self.journal.load_state("learner")
        if not state:
            return
        # mutate shared dicts in place so Council/DecisionEngine see updates
        self.member_weights.update(state.get("member_weights", {}))
        self.timeframe_weights.update(state.get("timeframe_weights", {}))
        self.params.update(state.get("params", {}))
        self._last_direction = state.get("last_direction", {})
