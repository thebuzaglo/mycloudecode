"""Fetch recent 5-minute futures history from Yahoo Finance into CSVs the
bot's replay mode understands.

    python scripts/fetch_data.py            # NQ + ES, 30 days, into data/
    python scripts/fetch_data.py NQ=F ES=F YM=F RTY=F

Yahoo serves at most ~60 days of 5m bars; good enough to bootstrap the
learner and sanity-check the strategy.
"""

import csv
import json
import sys
import urllib.request
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent.parent / "data"


def fetch(symbol: str, days: int = 30) -> Path:
    url = (f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
           f"?interval=5m&range={days}d&includePrePost=false")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    data = json.loads(urllib.request.urlopen(req, timeout=30).read())
    result = data["chart"]["result"][0]
    timestamps = result["timestamp"]
    quote = result["indicators"]["quote"][0]

    OUT_DIR.mkdir(exist_ok=True)
    name = symbol.replace("=F", "").lower()
    out = OUT_DIR / f"{name}_5m.csv"
    count = 0
    with open(out, "w", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(["time", "open", "high", "low", "close", "volume"])
        for i, ts in enumerate(timestamps):
            if quote["close"][i] is None:
                continue
            writer.writerow([ts, quote["open"][i], quote["high"][i],
                             quote["low"][i], quote["close"][i],
                             quote["volume"][i] or 0])
            count += 1
    print(f"{symbol}: {count} bars -> {out}")
    return out


if __name__ == "__main__":
    symbols = sys.argv[1:] or ["NQ=F", "ES=F"]
    paths = [fetch(s) for s in symbols]
    feeds = " ".join(
        f"--feed {p.name.split('_')[0].upper()}:5={p}" for p in paths)
    print(f"\nnow run:\n  python -m bot replay {feeds}")
