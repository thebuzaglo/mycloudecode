"""Order execution adapters.

- PaperExecutor: simulates fills against incoming bars (default; always start
  here until the stats prove the edge).
- WebhookExecutor: POSTs TradingView-alert-style JSON to an execution bridge
  (TradersPost / PickMyTrade / your own relay to the propfirm's platform).

Both share the same lifecycle: open(decision) -> on_bar(...) -> closed trade
callbacks feed the Journal and the Learner.
"""

from __future__ import annotations

import json
import urllib.request
from dataclasses import dataclass
from datetime import datetime
from typing import Callable, Optional

from .decision import Instrument, TradeDecision
from .market import Bar

# (trade_id, exit_price, exit_reason, now)
CloseCallback = Callable[[int, float, str, datetime], None]


@dataclass
class OpenPosition:
    trade_id: int
    direction: int
    entry: float
    stop: float
    target: float
    contracts: int


class PaperExecutor:
    """Fills at signal price; exits when a bar trades through stop/target."""

    def __init__(self, instrument: Instrument, on_close: CloseCallback) -> None:
        self.instrument = instrument
        self.on_close = on_close
        self.position: Optional[OpenPosition] = None

    @property
    def in_position(self) -> bool:
        return self.position is not None

    def open(self, trade_id: int, decision: TradeDecision) -> None:
        self.position = OpenPosition(
            trade_id=trade_id, direction=decision.direction,
            entry=decision.entry, stop=decision.stop,
            target=decision.target, contracts=decision.contracts)

    def on_bar(self, bar: Bar, now: datetime) -> None:
        pos = self.position
        if pos is None:
            return
        if pos.direction > 0:
            hit_stop = bar.low <= pos.stop
            hit_target = bar.high >= pos.target
        else:
            hit_stop = bar.high >= pos.stop
            hit_target = bar.low <= pos.target
        if hit_stop:  # conservative: when both touch, assume the stop filled
            self._close(pos.stop, "stop", now)
        elif hit_target:
            self._close(pos.target, "target", now)

    def flatten(self, price: float, now: datetime, reason: str = "flat_by") -> None:
        if self.position is not None:
            self._close(price, reason, now)

    def _close(self, price: float, reason: str, now: datetime) -> None:
        pos, self.position = self.position, None
        self.on_close(pos.trade_id, price, reason, now)


class WebhookExecutor(PaperExecutor):
    """Paper lifecycle + mirrors orders to an external execution webhook.

    The bridge receives standard TradingView-style order JSON; exits are
    still detected locally from bar data (stop/target are included in the
    order payload so the bridge places them as bracket orders).
    """

    def __init__(self, instrument: Instrument, on_close: CloseCallback,
                 url: str, secret: str = "") -> None:
        super().__init__(instrument, on_close)
        self.url = url
        self.secret = secret

    def open(self, trade_id: int, decision: TradeDecision) -> None:
        super().open(trade_id, decision)
        self._post({
            "action": "buy" if decision.direction > 0 else "sell",
            "ticker": self.instrument.symbol,
            "quantity": decision.contracts,
            "orderType": "market",
            "stopLoss": decision.stop,
            "takeProfit": decision.target,
            "meta": {"trade_id": trade_id, "score": decision.score},
        })

    def flatten(self, price: float, now: datetime, reason: str = "flat_by") -> None:
        if self.position is not None:
            self._post({"action": "exit", "ticker": self.instrument.symbol,
                        "reason": reason})
        super().flatten(price, now, reason)

    def _post(self, payload: dict) -> None:
        if self.secret:
            payload["secret"] = self.secret
        req = urllib.request.Request(
            self.url, data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json"}, method="POST")
        try:
            urllib.request.urlopen(req, timeout=10).read()
        except Exception as exc:  # never let the bridge kill the loop
            print(f"[execution] webhook post failed: {exc}")
