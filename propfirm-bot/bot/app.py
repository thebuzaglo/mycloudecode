"""Bot orchestrator: wires every component together and drives the loop.

Live flow (serve mode):
    TradingView alert -> WebhookServer -> App.on_alert
        -> MarketHub.ingest
        -> (primary symbol, decision TF, bar closed?)
            -> Executor.on_bar (manage stop/target of the open position)
            -> flatten if past flat-by time
            -> DecisionEngine.evaluate -> open trade
    trade closed -> Journal -> RulesEngine pnl -> Learner update

Replay mode pushes CSV bars through the exact same path, so backtests and
live trading share 100% of the logic.
"""

from __future__ import annotations

import csv
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import yaml

from .correlation import CorrelationMonitor
from .council import Council, MEMBERS
from .decision import DecisionEngine, Instrument, DEFAULT_PARAMS
from .execution import PaperExecutor, WebhookExecutor
from .market import Bar, MarketHub, TimeframeAggregator
from .performance import Journal
from .propfirm import PropFirmRules, RulesEngine
from .learner import Learner
from .tradingview import WebhookServer, normalize_symbol


class App:
    def __init__(self, config_dir: str = "config",
                 journal_path: str = "journal.db") -> None:
        cfg_dir = Path(config_dir)
        firm_cfg = yaml.safe_load((cfg_dir / "propfirm_rules.yaml").read_text())
        strat_cfg = yaml.safe_load((cfg_dir / "strategy.yaml").read_text())

        preset = firm_cfg["active_preset"]
        self.rules = RulesEngine(PropFirmRules.from_dict(
            firm_cfg["presets"][preset]))

        inst_cfg = strat_cfg.get("instrument", {})
        self.instrument = Instrument(
            symbol=inst_cfg.get("symbol", "NQ"),
            tick_size=float(inst_cfg.get("tick_size", 0.25)),
            point_value=float(inst_cfg.get("point_value", 20.0)))

        self.timeframes: List[str] = [str(tf) for tf in
                                      strat_cfg.get("timeframes", ["5", "15", "60"])]
        self.decision_tf: str = str(strat_cfg.get("decision_timeframe",
                                                  self.timeframes[0]))
        # weights are *shared mutable dicts*: Council reads, Learner writes
        self.member_weights: Dict[str, float] = {m: 1.0 for m in MEMBERS}
        self.member_weights.update(strat_cfg.get("member_weights", {}))
        self.timeframe_weights: Dict[str, float] = {
            tf: 1.0 for tf in self.timeframes}
        self.timeframe_weights.update(
            {str(k): v for k, v in strat_cfg.get("timeframe_weights", {}).items()})
        self.params: Dict[str, float] = dict(DEFAULT_PARAMS)
        self.params.update(strat_cfg.get("params", {}))

        self.hub = MarketHub()
        self.council = Council(self.timeframes, self.member_weights,
                               self.timeframe_weights)
        corr_cfg = strat_cfg.get("correlation", {})
        self.correlation = CorrelationMonitor(
            primary=self.instrument.symbol,
            references=corr_cfg.get("references", ["ES", "YM", "RTY"]),
            timeframe=str(corr_cfg.get("timeframe", self.decision_tf)),
            window=int(corr_cfg.get("window", 60)),
            min_multiplier=float(corr_cfg.get("min_multiplier", 0.4)),
            boost=float(corr_cfg.get("boost", 0.15)))

        self.journal = Journal(journal_path)
        self.learner = Learner(self.journal, self.member_weights,
                               self.timeframe_weights, self.params,
                               eta=float(strat_cfg.get("learning", {}).get("eta", 0.10)),
                               review_every=int(strat_cfg.get("learning", {})
                                                .get("review_every", 20)))
        self.engine = DecisionEngine(self.hub, self.council, self.correlation,
                                     self.rules, self.instrument,
                                     decision_timeframe=self.decision_tf,
                                     params=self.params)
        self.engine.params = self.params  # keep the single shared dict

        exec_cfg = strat_cfg.get("execution", {})
        if exec_cfg.get("mode") == "webhook" and exec_cfg.get("url"):
            self.executor = WebhookExecutor(
                self.instrument, self._on_trade_closed,
                url=exec_cfg["url"], secret=exec_cfg.get("secret", ""))
        else:
            self.executor = PaperExecutor(self.instrument,
                                          self._on_trade_closed)
        # auto-resample: derive higher TFs from the decision-TF feed so a
        # single TradingView alert per symbol covers the whole council
        self.auto_resample: bool = bool(strat_cfg.get("auto_resample", True))
        self._aggregators: Dict[Tuple[str, str], TimeframeAggregator] = {}
        self.webhook_secret: str = strat_cfg.get("webhook", {}).get("secret", "")
        self._host: str = strat_cfg.get("webhook", {}).get("host", "0.0.0.0")
        self._port: int = int(strat_cfg.get("webhook", {}).get("port", 8787))

    # -------------------------------------------------------------- events
    def on_alert(self, payload: dict) -> bool:
        symbol = normalize_symbol(str(payload.get("symbol", "")))
        timeframe = str(payload.get("timeframe", ""))
        if not symbol or not timeframe:
            return False
        bar = Bar.from_payload(payload)
        new_bar = self.hub.ingest(symbol, timeframe, bar)
        if self.auto_resample and timeframe == self.decision_tf:
            self._resample(symbol, bar)
        if (symbol == self.instrument.symbol
                and timeframe == self.decision_tf and new_bar):
            self._on_decision_bar(bar)
        return True

    def _resample(self, symbol: str, bar: Bar) -> None:
        try:
            base_minutes = int(self.decision_tf)
        except ValueError:
            return
        for tf in self.timeframes:
            try:
                minutes = int(tf)
            except ValueError:
                continue
            if minutes <= base_minutes or minutes % base_minutes:
                continue
            key = (symbol, tf)
            if key not in self._aggregators:
                self._aggregators[key] = TimeframeAggregator(minutes)
            self.hub.ingest(symbol, tf, self._aggregators[key].update(bar))

    def _on_decision_bar(self, bar: Bar) -> None:
        now = bar.ts
        self.executor.on_bar(bar, now)
        if self.executor.in_position and self.rules.must_flatten(now):
            self.executor.flatten(bar.close, now)
            return
        if self.executor.in_position:
            return
        decision = self.engine.evaluate(now)
        if decision is None:
            return
        votes = dict(self.engine.last_vote.by_member)
        votes.update(self.engine.last_vote.by_timeframe)
        trade_id = self.journal.open_trade(
            self.instrument.symbol, decision.direction, decision.contracts,
            decision.entry, decision.stop, decision.target,
            decision.score, decision.confirmation, votes,
            dict(self.params), now=now)
        self.executor.open(trade_id, decision)
        print(f"[trade {trade_id}] {'LONG' if decision.direction > 0 else 'SHORT'}"
              f" {decision.contracts}x{self.instrument.symbol}"
              f" @ {decision.entry} SL {decision.stop} TP {decision.target}"
              f" (score {decision.score:+.3f},"
              f" corr x{decision.confirmation:.2f})")

    def _on_trade_closed(self, trade_id: int, exit_price: float,
                         reason: str, now: datetime) -> None:
        record = self.journal.close_trade(trade_id, exit_price, reason,
                                          self.instrument.point_value, now=now)
        self.rules.on_realized_pnl(record.pnl, now)
        self.learner.on_trade_closed(record)
        print(f"[trade {trade_id}] closed {reason} @ {exit_price}"
              f" pnl {record.pnl:+.2f} ({record.r_multiple:+.2f}R)"
              f" | day {self.rules.state.day_realized_pnl:+.2f}"
              f" eq {self.rules.state.equity:.2f}")

    # -------------------------------------------------------------- status
    def status(self) -> dict:
        allowed, reason = self.rules.can_trade(datetime.now(timezone.utc))
        return {
            "instrument": self.instrument.symbol,
            "can_trade": allowed,
            "gate_reason": reason,
            "equity": round(self.rules.state.equity, 2),
            "day_pnl": round(self.rules.state.day_realized_pnl, 2),
            "risk_budget": round(self.rules.risk_budget(), 2),
            "in_position": self.executor.in_position,
            "member_weights": {k: round(v, 3)
                               for k, v in self.member_weights.items()},
            "timeframe_weights": {k: round(v, 3)
                                  for k, v in self.timeframe_weights.items()},
            "params": self.params,
            "performance": self.journal.stats(),
        }

    # --------------------------------------------------------------- modes
    def serve(self) -> None:
        server = WebhookServer(self._host, self._port, self.webhook_secret,
                               self.on_alert, self.status)
        server.start()
        print(f"listening on http://{self._host}:{self._port}/webhook"
              f"  (status: /status)")
        try:
            import time
            while True:
                time.sleep(3600)
        except KeyboardInterrupt:
            server.stop()

    def replay(self, feeds: Dict[Tuple[str, str], str]) -> dict:
        """feeds: {(symbol, timeframe): csv_path} with columns
        time,open,high,low,close[,volume]; time = unix seconds or ISO."""
        rows: List[Tuple[datetime, str, str, dict]] = []
        for (symbol, timeframe), path in feeds.items():
            with open(path, newline="") as fh:
                for row in csv.DictReader(fh):
                    payload = {"symbol": symbol, "timeframe": timeframe,
                               "time": _parse_time(row["time"]),
                               "open": row["open"], "high": row["high"],
                               "low": row["low"], "close": row["close"],
                               "volume": row.get("volume", 0)}
                    ts = datetime.fromtimestamp(payload["time"], tz=timezone.utc)
                    rows.append((ts, symbol, timeframe, payload))
        rows.sort(key=lambda r: r[0])
        for _ts, _sym, _tf, payload in rows:
            self.on_alert(payload)
        return self.journal.stats()


def _parse_time(raw: str) -> float:
    try:
        return float(raw)
    except ValueError:
        return datetime.fromisoformat(raw.replace("Z", "+00:00")).timestamp()
