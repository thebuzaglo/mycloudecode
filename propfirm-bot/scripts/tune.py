"""Parameter tuning with a train/validation split.

Runs the full bot (council + correlation + rules + learner) over a grid of
parameter combinations. The data is split chronologically: weights/params
adapt on the train window, then the *trained* state is evaluated on the
unseen validation window. Combos are ranked by validation expectancy with a
drawdown guard, which is what actually matters for surviving an eval.

    python scripts/tune.py --feed NQ:5=data/nq_5m.csv --feed ES:5=data/es_5m.csv \
        [--train-frac 0.6] [--config config]
"""

from __future__ import annotations

import argparse
import csv
import itertools
import json
import os
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from bot.app import App  # noqa: E402

GRID = {
    "entry_threshold": [0.30, 0.40, 0.50],
    "stop_atr_mult": [1.0, 1.5, 2.0],
    "reward_risk": [1.5, 2.0, 2.5],
}


def split_feeds(feeds: dict, train_frac: float, workdir: str):
    """Chronological split of every CSV into train/validation files."""
    all_ts = []
    rows_by_feed = {}
    for key, path in feeds.items():
        with open(path, newline="") as fh:
            rows = list(csv.DictReader(fh))
        rows_by_feed[key] = rows
        all_ts.extend(float(r["time"]) for r in rows)
    all_ts.sort()
    cutoff = all_ts[int(len(all_ts) * train_frac)]

    train, val = {}, {}
    for (symbol, tf), rows in rows_by_feed.items():
        for name, bucket, predicate in (
                ("train", train, lambda t: t < cutoff),
                ("val", val, lambda t: t >= cutoff)):
            out = os.path.join(workdir, f"{symbol}_{tf}_{name}.csv")
            with open(out, "w", newline="") as fh:
                writer = csv.DictWriter(fh, fieldnames=rows[0].keys())
                writer.writeheader()
                for row in rows:
                    if predicate(float(row["time"])):
                        writer.writerow(row)
            bucket[(symbol, tf)] = out
    return train, val


def run_combo(config: str, combo: dict, train, val, workdir: str) -> dict:
    train_db = tempfile.mktemp(suffix=".db", dir=workdir)
    app = App(config_dir=config, journal_path=train_db)
    app.params.update(combo)
    train_stats = app.replay(train)

    # fresh app on unseen data, seeded with the trained weights/params
    val_db = tempfile.mktemp(suffix=".db", dir=workdir)
    val_app = App(config_dir=config, journal_path=val_db)
    val_app.member_weights.update(app.member_weights)
    val_app.timeframe_weights.update(app.timeframe_weights)
    val_app.params.update(app.params)
    val_stats = val_app.replay(val)
    return {"combo": combo, "train": train_stats, "val": val_stats,
            "trained_weights": dict(app.member_weights),
            "trained_tf_weights": dict(app.timeframe_weights),
            "trained_params": dict(app.params)}


def score(result: dict, max_dd: float) -> float:
    val = result["val"]
    if val.get("trades", 0) < 6:
        return float("-inf")
    if (val.get("max_drawdown") or 0) > max_dd:
        return float("-inf")
    if (result["train"].get("max_drawdown") or 0) > max_dd:
        return float("-inf")
    return (val.get("expectancy_r") or 0.0) * min(val["trades"], 30)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--feed", action="append", required=True)
    parser.add_argument("--config", default="config")
    parser.add_argument("--train-frac", type=float, default=0.6)
    parser.add_argument("--max-dd", type=float, default=1200.0)
    args = parser.parse_args()

    feeds = {}
    for feed in args.feed:
        spec, path = feed.split("=", 1)
        symbol, tf = spec.split(":", 1)
        feeds[(symbol.upper(), tf)] = path

    with tempfile.TemporaryDirectory() as workdir:
        train, val = split_feeds(feeds, args.train_frac, workdir)
        results = []
        combos = [dict(zip(GRID, values))
                  for values in itertools.product(*GRID.values())]
        for i, combo in enumerate(combos, 1):
            result = run_combo(args.config, combo, train, val, workdir)
            results.append(result)
            v = result["val"]
            print(f"[{i:2d}/{len(combos)}] {combo} -> "
                  f"val: {v.get('trades', 0)} trades,"
                  f" pnl {v.get('net_pnl', 0)}, exp {v.get('expectancy_r')},"
                  f" dd {v.get('max_drawdown')}", file=sys.stderr)

        results.sort(key=lambda r: score(r, args.max_dd), reverse=True)
        top = [r for r in results if score(r, args.max_dd) > float("-inf")]
        print(json.dumps({
            "viable_combos": len(top),
            "best": top[0] if top else None,
            "runners_up": [{"combo": r["combo"], "val": r["val"]}
                           for r in top[1:4]],
        }, indent=2))


if __name__ == "__main__":
    main()
