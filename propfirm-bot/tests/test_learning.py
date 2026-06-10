import os
import tempfile
import unittest
from datetime import datetime, timezone

from bot.learner import Learner, WEIGHT_MIN, WEIGHT_MAX
from bot.performance import Journal


def open_and_close(journal: Journal, votes, direction=1, r_win=True) -> None:
    entry, stop = 20_000.0, 19_990.0
    target = 20_020.0
    trade_id = journal.open_trade("NQ", direction, 1, entry, stop, target,
                                  0.5, 1.0, votes, {},
                                  now=datetime.now(timezone.utc))
    exit_price = target if r_win else stop
    journal.close_trade(trade_id, exit_price, "target" if r_win else "stop",
                        20.0, now=datetime.now(timezone.utc))


class TestJournalAndLearner(unittest.TestCase):
    def setUp(self):
        fd, self.db = tempfile.mkstemp(suffix=".db")
        os.close(fd)
        self.journal = Journal(self.db)

    def tearDown(self):
        os.unlink(self.db)

    def test_pnl_and_r_multiple(self):
        trade_id = self.journal.open_trade("NQ", 1, 2, 20_000.0, 19_990.0,
                                           20_020.0, 0.5, 1.0, {}, {})
        record = self.journal.close_trade(trade_id, 20_020.0, "target", 20.0)
        self.assertAlmostEqual(record.pnl, 20 * 2 * 20.0)  # 20pts x 2 x $20
        self.assertAlmostEqual(record.r_multiple, 2.0)

    def test_stats(self):
        open_and_close(self.journal, {}, r_win=True)
        open_and_close(self.journal, {}, r_win=False)
        stats = self.journal.stats()
        self.assertEqual(stats["trades"], 2)
        self.assertAlmostEqual(stats["win_rate"], 0.5)
        self.assertAlmostEqual(stats["profit_factor"], 2.0)

    def test_weights_move_toward_winners(self):
        member_w = {"trend_ema": 1.0, "mean_reversion": 1.0}
        tf_w = {"5": 1.0}
        learner = Learner(self.journal, member_w, tf_w, {}, eta=0.2)
        votes = {"5/trend_ema": 1.0, "5/mean_reversion": -1.0, "5": 0.6}
        for _ in range(5):  # five winning longs
            trade_id = self.journal.open_trade("NQ", 1, 1, 20_000.0, 19_990.0,
                                               20_020.0, 0.5, 1.0, votes, {})
            record = self.journal.close_trade(trade_id, 20_020.0, "target", 20.0)
            learner.on_trade_closed(record)
        self.assertGreater(member_w["trend_ema"], 1.0)
        self.assertLess(member_w["mean_reversion"], 1.0)
        self.assertGreater(tf_w["5"], 1.0)

    def test_weights_bounded(self):
        member_w = {"trend_ema": 1.0}
        learner = Learner(self.journal, member_w, {}, {}, eta=1.0)
        votes = {"5/trend_ema": 1.0}
        for win in (True, False) * 30:
            trade_id = self.journal.open_trade("NQ", 1, 1, 20_000.0, 19_990.0,
                                               20_020.0, 0.5, 1.0, votes, {})
            record = self.journal.close_trade(
                trade_id, 20_020.0 if win else 19_990.0, "x", 20.0)
            learner.on_trade_closed(record)
        self.assertGreaterEqual(member_w["trend_ema"], WEIGHT_MIN)
        self.assertLessEqual(member_w["trend_ema"], WEIGHT_MAX)

    def test_learner_state_persists(self):
        member_w = {"trend_ema": 1.0}
        learner = Learner(self.journal, member_w, {}, {"entry_threshold": 0.35})
        member_w["trend_ema"] = 2.5
        learner.persist()
        fresh_w = {"trend_ema": 1.0}
        Learner(self.journal, fresh_w, {}, {})
        self.assertAlmostEqual(fresh_w["trend_ema"], 2.5)


if __name__ == "__main__":
    unittest.main()
