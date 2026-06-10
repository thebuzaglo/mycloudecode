"""The statistical council.

Each timeframe seats several "members" — independent signal models (trend,
momentum, mean-reversion, breakout, volatility regime). Every member casts a
vote in [-1, +1] (short..long). Votes are combined twice:

1. within a timeframe, weighted by per-member weights, and
2. across timeframes, weighted by per-timeframe weights.

All weights are owned by the Learner and adapt to realized trade results, so
the council literally re-balances itself as performance data accumulates.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional

from . import indicators as ind
from .market import Series

MemberFn = Callable[[Series], Optional[float]]


# ----------------------------------------------------------------- members
def member_trend_ema(series: Series) -> Optional[float]:
    """EMA(9) vs EMA(21): scaled, clipped distance."""
    closes = series.closes()
    fast, slow = ind.ema(closes, 9), ind.ema(closes, 21)
    a = ind.atr(series.highs(), series.lows(), closes, 14)
    if fast is None or slow is None or not a:
        return None
    return max(-1.0, min(1.0, (fast - slow) / (1.5 * a)))


def member_momentum_rsi(series: Series) -> Optional[float]:
    """RSI mapped to [-1, 1] around 50, dampened in the neutral zone."""
    value = ind.rsi(series.closes(), 14)
    if value is None:
        return None
    score = (value - 50.0) / 50.0
    return score * abs(score)  # quadratic damping near 0


def member_mean_reversion(series: Series) -> Optional[float]:
    """Fade stretched z-scores: vote against the move beyond |z| > 2."""
    z = ind.zscore(series.closes(), 20)
    if z is None:
        return None
    if abs(z) <= 2.0:
        return 0.0
    return max(-1.0, min(1.0, -(z - 2.0) if z > 0 else -(z + 2.0)))


def member_breakout(series: Series) -> Optional[float]:
    """Donchian(20) breakout of the latest close."""
    channel = ind.donchian(series.highs(), series.lows(), 20)
    if channel is None:
        return None
    upper, lower = channel
    close = series.closes()[-1]
    if close > upper:
        return 1.0
    if close < lower:
        return -1.0
    return 0.0


def member_slope(series: Series) -> Optional[float]:
    """Linear-regression slope over 30 bars, normalized by ATR."""
    closes = series.closes()
    slope = ind.linreg_slope(closes, 30)
    a = ind.atr(series.highs(), series.lows(), closes, 14)
    if slope is None or not a:
        return None
    return max(-1.0, min(1.0, slope * 10.0 / a))


MEMBERS: Dict[str, MemberFn] = {
    "trend_ema": member_trend_ema,
    "momentum_rsi": member_momentum_rsi,
    "mean_reversion": member_mean_reversion,
    "breakout": member_breakout,
    "slope": member_slope,
}


# ------------------------------------------------------------------ result
@dataclass
class CouncilVote:
    score: float                          # final blended vote in [-1, 1]
    by_timeframe: Dict[str, float] = field(default_factory=dict)
    by_member: Dict[str, float] = field(default_factory=dict)  # "tf/member"
    coverage: float = 0.0                 # share of members able to vote


class Council:
    def __init__(self, timeframes: List[str],
                 member_weights: Dict[str, float],
                 timeframe_weights: Dict[str, float]) -> None:
        self.timeframes = timeframes
        self.member_weights = member_weights      # shared with Learner
        self.timeframe_weights = timeframe_weights

    def vote(self, get_series: Callable[[str], Optional[Series]]) -> CouncilVote:
        result = CouncilVote(score=0.0)
        total_tf_weight = 0.0
        voted, possible = 0, 0
        for tf in self.timeframes:
            series = get_series(tf)
            possible += len(MEMBERS)
            if series is None or len(series) < 35:
                continue
            tf_score, tf_weight_sum = 0.0, 0.0
            for name, fn in MEMBERS.items():
                vote = fn(series)
                if vote is None:
                    continue
                voted += 1
                weight = self.member_weights.get(name, 1.0)
                result.by_member[f"{tf}/{name}"] = vote
                tf_score += weight * vote
                tf_weight_sum += weight
            if tf_weight_sum > 0:
                tf_score /= tf_weight_sum
                result.by_timeframe[tf] = tf_score
                tfw = self.timeframe_weights.get(tf, 1.0)
                result.score += tfw * tf_score
                total_tf_weight += tfw
        if total_tf_weight > 0:
            result.score /= total_tf_weight
        result.coverage = voted / possible if possible else 0.0
        return result
