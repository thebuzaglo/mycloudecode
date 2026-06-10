"""Market data hub: stores bar series per (symbol, timeframe).

Bars arrive either from TradingView alert webhooks (live mode) or from CSV
files (replay/backtest mode). Series are bounded deques so memory stays flat.
"""

from __future__ import annotations

import threading
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple


@dataclass(frozen=True)
class Bar:
    ts: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float = 0.0

    @staticmethod
    def from_payload(payload: dict) -> "Bar":
        """Build a bar from a TradingView alert JSON payload.

        Expected fields: time (unix seconds or ISO string), open, high, low,
        close, volume (optional).
        """
        raw_ts = payload.get("time")
        if isinstance(raw_ts, (int, float)):
            ts = datetime.fromtimestamp(float(raw_ts), tz=timezone.utc)
        elif isinstance(raw_ts, str):
            ts = datetime.fromisoformat(raw_ts.replace("Z", "+00:00"))
        else:
            ts = datetime.now(timezone.utc)
        return Bar(
            ts=ts,
            open=float(payload["open"]),
            high=float(payload["high"]),
            low=float(payload["low"]),
            close=float(payload["close"]),
            volume=float(payload.get("volume", 0.0)),
        )


@dataclass
class Series:
    symbol: str
    timeframe: str
    bars: deque = field(default_factory=lambda: deque(maxlen=2000))

    def add(self, bar: Bar) -> bool:
        """Append or replace the latest bar. Returns True if a *new* bar
        closed (i.e. timestamp advanced), which is the decision trigger."""
        if self.bars and bar.ts == self.bars[-1].ts:
            self.bars[-1] = bar
            return False
        if self.bars and bar.ts < self.bars[-1].ts:
            return False  # stale/out-of-order update
        self.bars.append(bar)
        return True

    def closes(self) -> List[float]:
        return [b.close for b in self.bars]

    def highs(self) -> List[float]:
        return [b.high for b in self.bars]

    def lows(self) -> List[float]:
        return [b.low for b in self.bars]

    def __len__(self) -> int:
        return len(self.bars)


class TimeframeAggregator:
    """Builds higher-timeframe bars from a stream of base-TF bars, so one
    TradingView alert per symbol is enough to feed the whole council."""

    def __init__(self, minutes: int) -> None:
        self.minutes = minutes
        self._bucket: Optional[datetime] = None
        self._open = self._high = self._low = self._close = 0.0
        self._volume = 0.0

    def update(self, bar: Bar) -> Bar:
        secs = self.minutes * 60
        bucket = datetime.fromtimestamp(
            int(bar.ts.timestamp()) // secs * secs, tz=timezone.utc)
        if bucket != self._bucket:
            self._bucket = bucket
            self._open, self._high, self._low = bar.open, bar.high, bar.low
            self._volume = 0.0
        self._high = max(self._high, bar.high)
        self._low = min(self._low, bar.low)
        self._close = bar.close
        self._volume += bar.volume
        return Bar(ts=bucket, open=self._open, high=self._high,
                   low=self._low, close=self._close, volume=self._volume)


class MarketHub:
    """Thread-safe store of all live series."""

    def __init__(self) -> None:
        self._series: Dict[Tuple[str, str], Series] = {}
        self._lock = threading.RLock()

    def ingest(self, symbol: str, timeframe: str, bar: Bar) -> bool:
        with self._lock:
            key = (symbol.upper(), timeframe)
            if key not in self._series:
                self._series[key] = Series(symbol.upper(), timeframe)
            return self._series[key].add(bar)

    def series(self, symbol: str, timeframe: str) -> Optional[Series]:
        with self._lock:
            return self._series.get((symbol.upper(), timeframe))

    def last_price(self, symbol: str) -> Optional[float]:
        with self._lock:
            best: Optional[Bar] = None
            for (sym, _tf), series in self._series.items():
                if sym == symbol.upper() and len(series):
                    bar = series.bars[-1]
                    if best is None or bar.ts >= best.ts:
                        best = bar
            return best.close if best else None
