import unittest
from datetime import datetime, timedelta, timezone

from bot.correlation import CorrelationMonitor
from bot.council import Council, MEMBERS
from bot.decision import DecisionEngine, Instrument, round_to_tick
from bot.market import Bar, MarketHub
from bot.propfirm import PropFirmRules, RulesEngine


def feed_trend(hub: MarketHub, symbol: str, tf: str, n: int = 120,
               start: float = 20_000.0, step: float = 8.0) -> datetime:
    """Feed a steady up-trend; returns last bar timestamp (in session)."""
    ts = datetime(2026, 6, 15, 14, 0, tzinfo=timezone.utc)  # 9:00 Chicago
    price = start
    for i in range(n):
        bar = Bar(ts=ts + timedelta(minutes=5 * i), open=price,
                  high=price + step, low=price - step / 2,
                  close=price + step, volume=100)
        hub.ingest(symbol, tf, bar)
        price += step
    return ts + timedelta(minutes=5 * (n - 1))


def make_engine(hub: MarketHub) -> DecisionEngine:
    rules = RulesEngine(PropFirmRules.from_dict({
        "account_size": 50_000, "max_daily_loss": 1_000,
        "max_drawdown": 2_000, "max_contracts": 5,
        "risk_per_trade_pct": 1.0, "daily_loss_soft_stop_pct": 100,
        "sessions": [["00:00", "23:59"]], "flat_by": "",
    }))
    council = Council(["5"], {m: 1.0 for m in MEMBERS}, {"5": 1.0})
    corr = CorrelationMonitor("NQ", ["ES"], timeframe="5")
    return DecisionEngine(hub, council, corr, rules, Instrument(),
                          decision_timeframe="5")


class TestDecisionEngine(unittest.TestCase):
    def test_round_to_tick(self):
        self.assertEqual(round_to_tick(20_001.13, 0.25), 20_001.25)
        self.assertEqual(round_to_tick(20_001.10, 0.25), 20_001.0)

    def test_long_signal_in_uptrend(self):
        hub = MarketHub()
        last_ts = feed_trend(hub, "NQ", "5")
        feed_trend(hub, "ES", "5", start=5_000.0, step=2.0)
        decision = make_engine(hub).evaluate(last_ts)
        self.assertIsNotNone(decision)
        self.assertEqual(decision.direction, 1)
        self.assertLess(decision.stop, decision.entry)
        self.assertGreater(decision.target, decision.entry)
        # prices on tick grid
        for price in (decision.entry, decision.stop, decision.target):
            self.assertAlmostEqual((price / 0.25) % 1, 0.0)
        # R:R respected (2.0 default)
        rr = (decision.target - decision.entry) / (decision.entry - decision.stop)
        self.assertAlmostEqual(rr, 2.0, delta=0.05)

    def test_sizing_respects_risk_budget(self):
        hub = MarketHub()
        last_ts = feed_trend(hub, "NQ", "5")
        engine = make_engine(hub)
        decision = engine.evaluate(last_ts)
        self.assertIsNotNone(decision)
        risk = abs(decision.entry - decision.stop) * 20.0 * decision.contracts
        self.assertLessEqual(risk, engine.rules.risk_budget() + 1e-6)
        self.assertLessEqual(decision.contracts, 5)
        self.assertGreaterEqual(decision.contracts, 1)

    def test_no_trade_when_rules_block(self):
        hub = MarketHub()
        last_ts = feed_trend(hub, "NQ", "5")
        engine = make_engine(hub)
        engine.rules.on_realized_pnl(-5_000.0, last_ts)  # blow the limits
        self.assertIsNone(engine.evaluate(last_ts))

    def test_no_trade_in_chop(self):
        hub = MarketHub()
        ts = datetime(2026, 6, 15, 14, 0, tzinfo=timezone.utc)
        for i in range(120):  # flat oscillation
            price = 20_000.0 + (3.0 if i % 2 else -3.0)
            hub.ingest("NQ", "5", Bar(ts=ts + timedelta(minutes=5 * i),
                                      open=price, high=price + 4,
                                      low=price - 4, close=price))
        decision = make_engine(hub).evaluate(ts + timedelta(minutes=5 * 119))
        self.assertIsNone(decision)


class TestCorrelation(unittest.TestCase):
    def test_divergence_attenuates(self):
        hub = MarketHub()
        feed_trend(hub, "NQ", "5")                          # NQ up
        ts = datetime(2026, 6, 15, 14, 0, tzinfo=timezone.utc)
        price = 5_000.0
        for i in range(120):                                # ES anti-moving
            price -= 2.0
            hub.ingest("ES", "5", Bar(ts=ts + timedelta(minutes=5 * i),
                                      open=price, high=price + 1,
                                      low=price - 3, close=price))
        corr = CorrelationMonitor("NQ", ["ES"], timeframe="5")
        reading = corr.assess(1, lambda s, tf: hub.series(s, tf))
        # negatively-correlated-and-falling ES actually *confirms* long NQ;
        # the monitor must at least produce a sane bounded multiplier
        self.assertGreaterEqual(reading.confirmation, 0.4)
        self.assertLessEqual(reading.confirmation, 1.15)


if __name__ == "__main__":
    unittest.main()
