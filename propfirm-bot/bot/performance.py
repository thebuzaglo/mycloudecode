"""Trade journal + performance statistics, backed by SQLite.

Every closed trade is stored together with the council votes that produced
it, so the Learner can attribute results back to individual members.
"""

from __future__ import annotations

import json
import math
import sqlite3
import threading
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List, Optional

SCHEMA = """
CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    opened_at TEXT NOT NULL,
    closed_at TEXT,
    symbol TEXT NOT NULL,
    direction INTEGER NOT NULL,
    contracts INTEGER NOT NULL,
    entry REAL NOT NULL,
    stop REAL NOT NULL,
    target REAL NOT NULL,
    exit_price REAL,
    exit_reason TEXT,
    pnl REAL,
    r_multiple REAL,
    score REAL,
    confirmation REAL,
    votes_json TEXT,
    params_json TEXT
);
CREATE TABLE IF NOT EXISTS learner_state (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
"""


@dataclass
class TradeRecord:
    trade_id: int
    direction: int
    entry: float
    stop: float
    target: float
    contracts: int
    pnl: Optional[float] = None
    r_multiple: Optional[float] = None
    votes: Optional[Dict[str, float]] = None


class Journal:
    def __init__(self, path: str = "journal.db") -> None:
        self._conn = sqlite3.connect(path, check_same_thread=False)
        self._conn.executescript(SCHEMA)
        self._lock = threading.RLock()

    # ----------------------------------------------------------- recording
    def open_trade(self, symbol: str, direction: int, contracts: int,
                   entry: float, stop: float, target: float,
                   score: float, confirmation: float,
                   votes: Dict[str, float], params: Dict[str, float],
                   now: Optional[datetime] = None) -> int:
        now = now or datetime.now(timezone.utc)
        with self._lock:
            cur = self._conn.execute(
                "INSERT INTO trades (opened_at, symbol, direction, contracts,"
                " entry, stop, target, score, confirmation, votes_json,"
                " params_json) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                (now.isoformat(), symbol, direction, contracts, entry, stop,
                 target, score, confirmation, json.dumps(votes),
                 json.dumps(params)))
            self._conn.commit()
            return int(cur.lastrowid)

    def close_trade(self, trade_id: int, exit_price: float, exit_reason: str,
                    point_value: float,
                    now: Optional[datetime] = None) -> TradeRecord:
        now = now or datetime.now(timezone.utc)
        with self._lock:
            row = self._conn.execute(
                "SELECT direction, entry, stop, target, contracts, votes_json"
                " FROM trades WHERE id=?", (trade_id,)).fetchone()
            if row is None:
                raise KeyError(f"unknown trade id {trade_id}")
            direction, entry, stop, target, contracts, votes_json = row
            pnl = (exit_price - entry) * direction * contracts * point_value
            risk = abs(entry - stop) * contracts * point_value
            r_multiple = pnl / risk if risk > 0 else 0.0
            self._conn.execute(
                "UPDATE trades SET closed_at=?, exit_price=?, exit_reason=?,"
                " pnl=?, r_multiple=? WHERE id=?",
                (now.isoformat(), exit_price, exit_reason, pnl, r_multiple,
                 trade_id))
            self._conn.commit()
        return TradeRecord(trade_id, direction, entry, stop, target,
                           contracts, pnl, r_multiple,
                           json.loads(votes_json or "{}"))

    # ---------------------------------------------------------- statistics
    def closed_trades(self, limit: int = 0) -> List[dict]:
        query = ("SELECT opened_at, closed_at, direction, contracts, entry,"
                 " exit_price, exit_reason, pnl, r_multiple FROM trades"
                 " WHERE closed_at IS NOT NULL ORDER BY id DESC")
        if limit:
            query += f" LIMIT {int(limit)}"
        with self._lock:
            rows = self._conn.execute(query).fetchall()
        keys = ["opened_at", "closed_at", "direction", "contracts", "entry",
                "exit_price", "exit_reason", "pnl", "r_multiple"]
        return [dict(zip(keys, r)) for r in rows]

    def stats(self) -> dict:
        trades = self.closed_trades()
        if not trades:
            return {"trades": 0}
        pnls = [t["pnl"] for t in trades if t["pnl"] is not None]
        wins = [p for p in pnls if p > 0]
        losses = [p for p in pnls if p <= 0]
        gross_win = sum(wins)
        gross_loss = -sum(losses)
        rs = [t["r_multiple"] for t in trades if t["r_multiple"] is not None]
        equity, peak, max_dd = 0.0, 0.0, 0.0
        for p in reversed(pnls):  # chronological
            equity += p
            peak = max(peak, equity)
            max_dd = max(max_dd, peak - equity)
        mean = sum(pnls) / len(pnls)
        std = (math.sqrt(sum((p - mean) ** 2 for p in pnls) / (len(pnls) - 1))
               if len(pnls) > 1 else 0.0)
        return {
            "trades": len(pnls),
            "net_pnl": round(sum(pnls), 2),
            "win_rate": round(len(wins) / len(pnls), 4),
            "profit_factor": round(gross_win / gross_loss, 3)
                             if gross_loss > 0 else None,
            "expectancy_r": round(sum(rs) / len(rs), 4) if rs else None,
            "avg_pnl": round(mean, 2),
            "pnl_std": round(std, 2),
            "max_drawdown": round(max_dd, 2),
        }

    # ------------------------------------------------------- learner state
    def save_state(self, key: str, value: dict) -> None:
        with self._lock:
            self._conn.execute(
                "INSERT INTO learner_state (key, value_json, updated_at)"
                " VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET"
                " value_json=excluded.value_json,"
                " updated_at=excluded.updated_at",
                (key, json.dumps(value),
                 datetime.now(timezone.utc).isoformat()))
            self._conn.commit()

    def load_state(self, key: str) -> Optional[dict]:
        with self._lock:
            row = self._conn.execute(
                "SELECT value_json FROM learner_state WHERE key=?",
                (key,)).fetchone()
        return json.loads(row[0]) if row else None
