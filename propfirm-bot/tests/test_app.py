"""End-to-end: alert payloads in -> trades journaled, rules updated,
weights adapted. Uses the real App with a temp journal and test config."""

import json
import os
import shutil
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

from bot.app import App
from bot.tradingview import normalize_symbol

FIRM_YAML = """
active_preset: test
presets:
  test:
    account_size: 50000
    max_daily_loss: 1000
    max_drawdown: 2000
    drawdown_mode: trailing_eod
    max_contracts: 5
    risk_per_trade_pct: 1.0
    daily_loss_soft_stop_pct: 100
    timezone: America/Chicago
    sessions: [["00:00", "23:59"]]
    blackouts: []
    flat_by: ""
"""

STRAT_YAML = """
instrument: {symbol: NQ, tick_size: 0.25, point_value: 20.0}
timeframes: ["5"]
decision_timeframe: "5"
correlation: {references: [ES], timeframe: "5", window: 60}
webhook: {secret: "s3cret", port: 8790}
execution: {mode: paper}
"""


def alert(symbol, ts, o, h, l, c):
    return {"symbol": symbol, "timeframe": "5", "time": ts.timestamp(),
            "open": o, "high": h, "low": l, "close": c, "volume": 1}


class TestEndToEnd(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        cfg = Path(self.tmp) / "config"
        cfg.mkdir()
        (cfg / "propfirm_rules.yaml").write_text(FIRM_YAML)
        (cfg / "strategy.yaml").write_text(STRAT_YAML)
        self.app = App(config_dir=str(cfg),
                       journal_path=os.path.join(self.tmp, "j.db"))

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def test_normalize_symbol(self):
        self.assertEqual(normalize_symbol("CME_MINI:NQ1!"), "NQ")
        self.assertEqual(normalize_symbol("NQM2026"), "NQ")
        self.assertEqual(normalize_symbol("ES"), "ES")

    def test_trend_produces_trade_and_close_updates_rules(self):
        ts = datetime(2026, 6, 15, 14, 0, tzinfo=timezone.utc)
        price = 20_000.0
        for i in range(120):  # strong uptrend -> long entry at some point
            bar_ts = ts + timedelta(minutes=5 * i)
            self.app.on_alert(alert("NQ", bar_ts, price, price + 8,
                                    price - 4, price + 8))
            price += 8
        self.assertTrue(self.app.executor.in_position)

        # crash through the stop -> position closes, pnl realized
        bar_ts = ts + timedelta(minutes=5 * 121)
        self.app.on_alert(alert("NQ", bar_ts, price, price,
                                price - 300, price - 300))
        self.assertFalse(self.app.executor.in_position)
        # in a persistent trend the bot re-enters after each target, so
        # multiple trades close; the crash must close the last one at a loss
        trades = self.app.journal.closed_trades()
        self.assertGreaterEqual(len(trades), 1)
        last = trades[0]  # newest first
        self.assertEqual(last["exit_reason"], "stop")
        self.assertLess(last["pnl"], 0)
        self.assertAlmostEqual(self.app.rules.state.equity,
                               50_000 + self.app.journal.stats()["net_pnl"],
                               places=2)

        status = self.app.status()
        json.dumps(status)  # must be serializable for /status
        self.assertEqual(status["performance"]["trades"], len(trades))

    def test_bad_payload_rejected(self):
        self.assertFalse(self.app.on_alert({"timeframe": "5"}))


if __name__ == "__main__":
    unittest.main()
