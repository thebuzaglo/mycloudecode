import unittest
from datetime import datetime
from zoneinfo import ZoneInfo

from bot.propfirm import PropFirmRules, RulesEngine

CHI = ZoneInfo("America/Chicago")


def in_session(day=15, hour=10) -> datetime:
    return datetime(2026, 6, day, hour, 0, tzinfo=CHI)


def make_engine(**overrides) -> RulesEngine:
    rules = PropFirmRules.from_dict({
        "account_size": 50_000, "max_daily_loss": 1_000,
        "max_drawdown": 2_000, "drawdown_mode": "trailing_eod",
        "max_contracts": 5, "risk_per_trade_pct": 1.0,
        "daily_loss_soft_stop_pct": 80,
        "sessions": [["08:30", "15:00"]], "flat_by": "15:55",
        **overrides,
    })
    return RulesEngine(rules)


class TestRulesEngine(unittest.TestCase):
    def test_allows_in_session(self):
        ok, reason = make_engine().can_trade(in_session())
        self.assertTrue(ok, reason)

    def test_blocks_outside_session(self):
        ok, reason = make_engine().can_trade(in_session(hour=6))
        self.assertFalse(ok)
        self.assertIn("session", reason)

    def test_blocks_after_flat_by(self):
        now = datetime(2026, 6, 15, 15, 56, tzinfo=CHI)
        ok, reason = make_engine().can_trade(now)
        self.assertFalse(ok)
        self.assertTrue(make_engine().must_flatten(now))

    def test_daily_loss_soft_stop(self):
        engine = make_engine()
        engine.on_realized_pnl(-799.0, in_session())
        self.assertTrue(engine.can_trade(in_session())[0])
        engine.on_realized_pnl(-2.0, in_session())  # past 80% of $1000
        ok, reason = engine.can_trade(in_session())
        self.assertFalse(ok)
        self.assertIn("daily", reason)

    def test_no_daily_limit_when_zero(self):
        engine = make_engine(max_daily_loss=0)
        engine.on_realized_pnl(-5_00.0, in_session())
        self.assertTrue(engine.can_trade(in_session())[0])
        self.assertEqual(engine.daily_loss_remaining(), float("inf"))

    def test_day_rollover_resets_daily_pnl(self):
        engine = make_engine()
        engine.on_realized_pnl(-900.0, in_session(day=15))
        self.assertFalse(engine.can_trade(in_session(day=15))[0])
        self.assertTrue(engine.can_trade(in_session(day=16))[0])

    def test_trailing_eod_drawdown(self):
        engine = make_engine()
        engine.on_realized_pnl(1_000.0, in_session(day=15))   # eq 51k
        engine.can_trade(in_session(day=16))                  # rolls anchor to 51k
        self.assertAlmostEqual(engine.state.drawdown_anchor, 51_000)
        engine.on_realized_pnl(-900.0, in_session(day=16))
        engine.on_realized_pnl(-900.0, in_session(day=17))
        engine.on_realized_pnl(-250.0, in_session(day=18))    # eq 48950 < 49k floor
        ok, reason = engine.can_trade(in_session(day=18))
        self.assertFalse(ok)
        self.assertIn("drawdown", reason)

    def test_drawdown_freeze_at_start_balance(self):
        engine = make_engine(drawdown_stops_at_start=True)
        engine.on_realized_pnl(5_000.0, in_session(day=15))   # eq 55k
        engine.can_trade(in_session(day=16))                  # anchor -> 55k
        # without the freeze the floor would be 53k; with it, 50k
        self.assertAlmostEqual(engine.drawdown_remaining(), 5_000.0)
        engine.rules.drawdown_stops_at_start = False
        self.assertAlmostEqual(engine.drawdown_remaining(), 2_000.0)

    def test_risk_budget_is_min_of_caps(self):
        engine = make_engine()  # per-trade 1% = $500
        self.assertAlmostEqual(engine.risk_budget(), 500.0)
        engine.on_realized_pnl(-600.0, in_session())  # daily room: 800-600=200
        self.assertAlmostEqual(engine.risk_budget(), 200.0)

    def test_blackout_window(self):
        engine = make_engine(blackouts=[["09:55", "10:05"]])
        ok, reason = engine.can_trade(in_session(hour=10))
        self.assertFalse(ok)
        self.assertIn("blackout", reason)

    def test_consistency_cap(self):
        engine = make_engine(consistency_max_day_pct=30)
        engine.on_realized_pnl(500.0, in_session(day=15))
        engine.on_realized_pnl(500.0, in_session(day=16))
        # day 17: +600 -> total 1600, cap = 30% = 480 < 600 -> blocked
        engine.on_realized_pnl(600.0, in_session(day=17))
        ok, reason = engine.can_trade(in_session(day=17))
        self.assertFalse(ok)
        self.assertIn("consistency", reason)


if __name__ == "__main__":
    unittest.main()
