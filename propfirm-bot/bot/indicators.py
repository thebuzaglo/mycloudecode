"""Pure-python technical indicators operating on plain float sequences.

All functions return the *latest* value (or a series where noted) and are
defensive about short inputs: they return None when there is not enough data.
"""

from __future__ import annotations

import math
from typing import Optional, Sequence


def sma(values: Sequence[float], period: int) -> Optional[float]:
    if len(values) < period or period <= 0:
        return None
    return sum(values[-period:]) / period


def ema_series(values: Sequence[float], period: int) -> Optional[list]:
    if len(values) < period or period <= 0:
        return None
    k = 2.0 / (period + 1)
    out = [sum(values[:period]) / period]
    for v in values[period:]:
        out.append(out[-1] + k * (v - out[-1]))
    return out


def ema(values: Sequence[float], period: int) -> Optional[float]:
    series = ema_series(values, period)
    return series[-1] if series else None


def rsi(closes: Sequence[float], period: int = 14) -> Optional[float]:
    """Wilder's RSI."""
    if len(closes) < period + 1:
        return None
    gains, losses = 0.0, 0.0
    for i in range(1, period + 1):
        delta = closes[i] - closes[i - 1]
        gains += max(delta, 0.0)
        losses += max(-delta, 0.0)
    avg_gain, avg_loss = gains / period, losses / period
    for i in range(period + 1, len(closes)):
        delta = closes[i] - closes[i - 1]
        avg_gain = (avg_gain * (period - 1) + max(delta, 0.0)) / period
        avg_loss = (avg_loss * (period - 1) + max(-delta, 0.0)) / period
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100.0 - 100.0 / (1.0 + rs)


def true_range(high: float, low: float, prev_close: float) -> float:
    return max(high - low, abs(high - prev_close), abs(low - prev_close))


def atr(highs: Sequence[float], lows: Sequence[float], closes: Sequence[float],
        period: int = 14) -> Optional[float]:
    """Wilder-smoothed Average True Range."""
    n = len(closes)
    if n < period + 1:
        return None
    trs = [true_range(highs[i], lows[i], closes[i - 1]) for i in range(1, n)]
    value = sum(trs[:period]) / period
    for tr in trs[period:]:
        value = (value * (period - 1) + tr) / period
    return value


def rolling_std(values: Sequence[float], period: int) -> Optional[float]:
    if len(values) < period or period < 2:
        return None
    window = values[-period:]
    mean = sum(window) / period
    var = sum((v - mean) ** 2 for v in window) / (period - 1)
    return math.sqrt(var)


def zscore(values: Sequence[float], period: int) -> Optional[float]:
    """Z-score of the latest value vs the trailing window."""
    if len(values) < period:
        return None
    std = rolling_std(values, period)
    if not std:
        return None
    mean = sum(values[-period:]) / period
    return (values[-1] - mean) / std


def linreg_slope(values: Sequence[float], period: int) -> Optional[float]:
    """Least-squares slope over the last `period` values, per bar."""
    if len(values) < period or period < 2:
        return None
    ys = values[-period:]
    n = float(period)
    sum_x = n * (n - 1) / 2
    sum_x2 = (n - 1) * n * (2 * n - 1) / 6
    sum_y = sum(ys)
    sum_xy = sum(i * y for i, y in enumerate(ys))
    denom = n * sum_x2 - sum_x ** 2
    if denom == 0:
        return None
    return (n * sum_xy - sum_x * sum_y) / denom


def donchian(highs: Sequence[float], lows: Sequence[float],
             period: int) -> Optional[tuple]:
    """(upper, lower) channel over the last `period` bars excluding current."""
    if len(highs) < period + 1:
        return None
    return max(highs[-period - 1:-1]), min(lows[-period - 1:-1])


def returns(values: Sequence[float]) -> list:
    return [values[i] / values[i - 1] - 1.0 for i in range(1, len(values))
            if values[i - 1] != 0]


def pearson(xs: Sequence[float], ys: Sequence[float]) -> Optional[float]:
    n = min(len(xs), len(ys))
    if n < 3:
        return None
    xs, ys = xs[-n:], ys[-n:]
    mx, my = sum(xs) / n, sum(ys) / n
    cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    vx = sum((x - mx) ** 2 for x in xs)
    vy = sum((y - my) ** 2 for y in ys)
    if vx == 0 or vy == 0:
        return None
    return cov / math.sqrt(vx * vy)
