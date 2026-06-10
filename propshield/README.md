# PropShield — Funded Trader Risk Cockpit

A complete, sellable digital product for futures prop firm traders (Apex, Topstep, MyFundedFutures, TakeProfit Trader, Tradeify, Bulenox, Elite Trader Funding, or any custom firm).

**Zero infrastructure:** the entire product is static HTML/CSS/JS. No server, no database, no API keys. Data persists in the buyer's browser (localStorage) with JSON export/import.

## Files

| File | Purpose |
|---|---|
| `index.html` | Sales landing page (pricing, FAQ, risk disclosure). Replace the `#` checkout links with your Gumroad / Whop / Lemon Squeezy URL. |
| `app.html` | The product itself — the full 5-module app delivered to buyers. |
| `GO-TO-MARKET.md` | Launch & monetization playbook (Hebrew). |

## Modules

1. **Dashboard / Cockpit** — balance, high-water mark and exact drawdown breach level (intraday-trailing / EOD-trailing / static), profit-target & daily-loss progress, SAFE/CAUTION/DANGER status, pre-session checklist.
2. **Position Sizer** — contracts allowed per trade, sized off remaining drawdown room (or fixed $), for 16 CME contracts incl. micros, capped at the firm's contract limit.
3. **Pass Probability Engine** — 2,000-run Monte Carlo of the evaluation using the trader's win rate / avg win / avg loss vs. the firm's exact rules, with sample equity paths.
4. **Trade Journal** — auto P&L from entry/exit + tick specs, win rate, profit factor, expectancy, equity curve, automatic consistency-rule compliance check.
5. **Firm Rules Compare** — reference table + one-click presets (compiled 2025 — verify before relying on them).

## Run / deploy

No build step. Open `index.html` in a browser, or host the folder on GitHub Pages / Cloudflare Pages / Netlify as-is.

## Disclaimer

Educational/analytical tool. Not financial advice, no affiliation with any prop firm, no guarantee of evaluation success. Firm rules change — verify with the firm.
