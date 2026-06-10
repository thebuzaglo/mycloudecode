"""Cross-asset correlation confirmation.

NQ rarely moves alone. We track rolling correlations of returns between the
primary symbol (NQ) and a basket of reference assets (ES, YM, RTY, DXY, ZN…)
and compute a confirmation score for a proposed direction:

* a normally-correlated asset moving the same way  -> confirmation
* a normally-correlated asset diverging            -> warning
* anti-correlated assets are handled symmetrically.

The output multiplies the council score, so a trade against the whole
correlated complex gets attenuated instead of fired blindly.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional

from . import indicators as ind
from .market import Series


@dataclass
class CorrelationReading:
    confirmation: float = 1.0   # multiplier in [min_multiplier, 1.0+boost]
    details: Dict[str, dict] = field(default_factory=dict)


class CorrelationMonitor:
    def __init__(self, primary: str, references: List[str],
                 timeframe: str = "5", window: int = 60,
                 min_multiplier: float = 0.4, boost: float = 0.15) -> None:
        self.primary = primary.upper()
        self.references = [r.upper() for r in references]
        self.timeframe = timeframe
        self.window = window
        self.min_multiplier = min_multiplier
        self.boost = boost

    def assess(self, direction: int,
               get_series: Callable[[str, str], Optional[Series]]
               ) -> CorrelationReading:
        """direction: +1 long / -1 short on the primary symbol."""
        reading = CorrelationReading()
        primary_series = get_series(self.primary, self.timeframe)
        if primary_series is None or len(primary_series) < self.window + 2:
            return reading  # not enough data: neutral multiplier
        primary_returns = ind.returns(primary_series.closes()[-(self.window + 1):])

        agreement_scores: List[float] = []
        for ref in self.references:
            ref_series = get_series(ref, self.timeframe)
            if ref_series is None or len(ref_series) < self.window + 2:
                continue
            ref_returns = ind.returns(ref_series.closes()[-(self.window + 1):])
            corr = ind.pearson(primary_returns, ref_returns)
            if corr is None or abs(corr) < 0.25:
                continue  # no stable relationship -> ignore
            # short-term move of the reference asset (last ~5 bars)
            ref_closes = ref_series.closes()
            recent = ref_closes[-1] / ref_closes[-6] - 1.0 if len(ref_closes) >= 6 else 0.0
            ref_direction = 1 if recent > 0 else (-1 if recent < 0 else 0)
            if ref_direction == 0:
                continue
            # does the reference confirm the proposed trade?
            expected = direction if corr > 0 else -direction
            agree = 1.0 if ref_direction == expected else -1.0
            weight = abs(corr)
            agreement_scores.append(agree * weight)
            reading.details[ref] = {"corr": round(corr, 3),
                                    "recent_move": round(recent, 5),
                                    "agrees": agree > 0}

        if not agreement_scores:
            return reading
        net = sum(agreement_scores) / len(agreement_scores)  # [-1, 1]
        if net >= 0:
            reading.confirmation = 1.0 + self.boost * net
        else:
            span = 1.0 - self.min_multiplier
            reading.confirmation = 1.0 + span * net  # down to min_multiplier
        return reading
