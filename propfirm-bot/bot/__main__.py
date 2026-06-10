"""CLI entry point.

    python -m bot serve  [--config config] [--journal journal.db]
    python -m bot replay --feed NQ:5=data/nq_5m.csv --feed ES:5=data/es_5m.csv
    python -m bot report [--journal journal.db]
"""

from __future__ import annotations

import argparse
import json

from .app import App
from .performance import Journal


def main() -> None:
    parser = argparse.ArgumentParser(prog="bot")
    parser.add_argument("--config", default="config")
    parser.add_argument("--journal", default="journal.db")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("serve", help="run live webhook server")
    replay = sub.add_parser("replay", help="replay CSV bars through the bot")
    replay.add_argument("--feed", action="append", required=True,
                        metavar="SYMBOL:TF=path.csv")
    sub.add_parser("report", help="print performance report")

    args = parser.parse_args()

    if args.command == "report":
        journal = Journal(args.journal)
        print(json.dumps(journal.stats(), indent=2))
        return

    app = App(config_dir=args.config, journal_path=args.journal)
    if args.command == "serve":
        app.serve()
    elif args.command == "replay":
        feeds = {}
        for feed in args.feed:
            spec, path = feed.split("=", 1)
            symbol, timeframe = spec.split(":", 1)
            feeds[(symbol.upper(), timeframe)] = path
        stats = app.replay(feeds)
        print(json.dumps({"performance": stats,
                          "weights": app.member_weights,
                          "timeframe_weights": app.timeframe_weights,
                          "params": app.params}, indent=2))


if __name__ == "__main__":
    main()
