"""Decision engine: turns council + correlation into a concrete NQ order.

Entry  = current price (market on signal)
Stop   = entry -/+ stop_atr_mult * ATR   (rounded to tick)
Target = entry +/- stop_distance * reward_risk (rounded to tick)
Size   = floor(risk_budget / (stop_distance * point_value)), firm-capped.

The entry threshold and ATR multipliers live in a mutable `params` dict so
the Learner can tune them online.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Optional

from . import indicators as ind
from .correlation import CorrelationMonitor
from .council import Council, CouncilVote
from .market import MarketHub
from .propfirm import RulesEngine


@dataclass
class Instrument:
    symbol: str = "NQ"
    tick_size: float = 0.25
    point_value: float = 20.0   # $ per full point per contract (MNQ: 2.0)


DEFAULT_PARAMS: Dict[str, float] = {
    "entry_threshold": 0.35,    # |blended score| required to trade
    "stop_atr_mult": 1.5,
    "reward_risk": 2.0,
    "min_coverage": 0.5,        # min share of members that must vote
}


@dataclass
class TradeDecision:
    direction: int              # +1 long, -1 short
    entry: float
    stop: float
    target: float
    contracts: int
    score: float
    confirmation: float
    reasons: Dict[str, float] = field(default_factory=dict)


def round_to_tick(price: float, tick: float) -> float:
    return round(round(price / tick) * tick, 10)


class DecisionEngine:
    def __init__(self, hub: MarketHub, council: Council,
                 correlation: CorrelationMonitor, rules: RulesEngine,
                 instrument: Instrument,
                 decision_timeframe: str = "5",
                 params: Optional[Dict[str, float]] = None) -> None:
        self.hub = hub
        self.council = council
        self.correlation = correlation
        self.rules = rules
        self.instrument = instrument
        self.decision_timeframe = decision_timeframe
        self.params = dict(DEFAULT_PARAMS)
        if params:
            self.params.update(params)
        self.last_vote: Optional[CouncilVote] = None

    def evaluate(self, now: datetime) -> Optional[TradeDecision]:
        allowed, reason = self.rules.can_trade(now)
        if not allowed:
            return None

        symbol = self.instrument.symbol
        vote = self.council.vote(lambda tf: self.hub.series(symbol, tf))
        self.last_vote = vote
        if vote.coverage < self.params["min_coverage"]:
            return None
        if abs(vote.score) < self.params["entry_threshold"]:
            return None
        direction = 1 if vote.score > 0 else -1

        corr = self.correlation.assess(
            direction, lambda sym, tf: self.hub.series(sym, tf))
        blended = vote.score * corr.confirmation
        if abs(blended) < self.params["entry_threshold"]:
            return None  # correlation veto

        series = self.hub.series(symbol, self.decision_timeframe)
        if series is None or len(series) < 20:
            return None
        a = ind.atr(series.highs(), series.lows(), series.closes(), 14)
        if not a:
            return None

        tick = self.instrument.tick_size
        entry = round_to_tick(series.closes()[-1], tick)
        stop_distance = self.params["stop_atr_mult"] * a
        stop = round_to_tick(entry - direction * stop_distance, tick)
        stop_distance = abs(entry - stop)
        if stop_distance < tick:
            return None
        target = round_to_tick(
            entry + direction * stop_distance * self.params["reward_risk"], tick)

        risk_per_contract = stop_distance * self.instrument.point_value
        budget = self.rules.risk_budget()
        contracts = int(budget // risk_per_contract)
        contracts = min(contracts, self.rules.rules.max_contracts)
        if contracts < 1:
            return None

        return TradeDecision(
            direction=direction, entry=entry, stop=stop, target=target,
            contracts=contracts, score=vote.score,
            confirmation=corr.confirmation,
            reasons={**vote.by_timeframe,
                     "blended": round(blended, 4),
                     "atr": round(a, 2)},
        )
