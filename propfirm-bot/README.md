# PropFirm NQ Trading Bot

בוט מסחר לשימוש פרטי על NQ (נאסד"ק פיוצ'רס) שמנהל "מועצה סטטיסטית" בין
טיים־פריימים, מאשר עסקאות מול קורלציה בין נכסים, אוכף סט חוקים של חברת
propfirm, מתחבר ל־TradingView האישי שלך דרך התראות webhook, שומר את כל
הביצועים ב־SQLite — ומשפר את עצמו תוך כדי תנועה.

> ⚠️ **גילוי נאות:** הבוט מגיע במצב `paper` (סימולציה) כברירת מחדל.
> אל תחבר אותו לכסף אמיתי לפני שצברת מספיק עסקאות נייר עם סטטיסטיקה
> חיובית (`python -m bot report`). מסחר בפיוצ'רס כרוך בסיכון ממשי.

## ארכיטקטורה

```
TradingView (ההתראות שלך)
        │  webhook: נר נסגר (סימבול, TF, OHLCV)
        ▼
WebhookServer ──▶ MarketHub (סדרות לכל סימבול/TF + resample אוטומטי ל־15/60)
                        │
        ┌───────────────┼────────────────────┐
        ▼               ▼                    ▼
   Council          CorrelationMonitor   RulesEngine (propfirm)
   (5 חברים × 3     (ES/YM/RTY מאשרים    הפסד יומי, drawdown,
   טיים־פריימים,    או מחלישים סיגנל)    שעות מסחר, consistency,
   הצבעה משוקללת)                        תקציב סיכון לעסקה
        └───────────────┴────────────────────┘
                        ▼
                 DecisionEngine ──▶ כניסה / סטופ (ATR) / TP (R:R) / כמות חוזים
                        ▼
                 Executor (paper או גשר webhook לביצוע אמיתי)
                        ▼
                 Journal (SQLite) ──▶ Learner (משקולות + פרמטרים מתעדכנים)
```

**הלמידה העצמית** עובדת בשני מנגנונים, ושניהם נשמרים ב־DB ושורדים ריסטרט:

1. **משקולות מועצה (Hedge / multiplicative weights):** אחרי כל עסקה סגורה,
   כל "חבר מועצה" שהצביע מתוגמל/נקנס לפי (התאמת ההצבעה לכיוון העסקה) ×
   (תוצאת ה־R בפועל). חברים שתומכים בהפסדים מתכווצים; חברים שצודקים גדלים.
2. **כוונון פרמטרים (hill-climbing):** כל 20 עסקאות הבוט משווה את תוחלת
   ה־R של החלון האחרון מול הקודם ומזיז את `entry_threshold` /
   `stop_atr_mult` / `reward_risk` בכיוון שהשתפר — בתוך גבולות קשיחים.

## התקנה והרצה

```bash
pip install -r requirements.txt      # PyYAML בלבד; כל השאר stdlib
python -m unittest discover -s tests # 24 טסטים

python -m bot serve                  # שרת חי על פורט 8787
python -m bot report                 # דוח ביצועים מה־journal
python -m bot replay \               # בקטסט על CSV דרך אותו קוד בדיוק
    --feed NQ:5=data/nq_5m.csv --feed ES:5=data/es_5m.csv
```

## חיבור ל־TradingView (חשוב לקרוא)

ל־TradingView **אין API רשמי לשליחת פקודות**, ולכן הזרימה הנכונה היא
הפוכה: TradingView שולח לבוט נתוני נרות דרך התראות, והבוט מבצע דרך
גשר ביצוע (TradersPost / PickMyTrade / חיבור ישיר לפלטפורמת הקרן כמו
Tradovate/Rithmic) או במצב נייר.

1. פתח גרף NQ ב־TradingView על טיים־פריים **5 דקות**.
2. צור Alert עם תנאי שמופעל פעם בנר (למשל אינדיקטור טריוויאלי), בחר
   **"Once Per Bar Close"**, וב־Message הדבק:

   ```json
   {"secret": "CHANGE_ME",
    "symbol": "{{ticker}}", "timeframe": "{{interval}}",
    "time": {{timenow}},
    "open": {{open}}, "high": {{high}}, "low": {{low}},
    "close": {{close}}, "volume": {{volume}}}
   ```

3. ב־Notifications הפעל **Webhook URL** וכוון אל
   `http://<כתובת-השרת-שלך>:8787/webhook`
   (נדרש מנוי TV עם webhooks, והבוט צריך לרוץ על מכונה נגישה מהאינטרנט
   או דרך ngrok/Cloudflare Tunnel).
4. חזור על אותו אלרט גם עבור **ES, YM, RTY** (5 דקות) — אלה מזינים את
   מודול הקורלציה. אין צורך באלרטים ל־15/60 דקות: הבוט בונה אותם לבד
   (`auto_resample: true`).
5. החלף את `CHANGE_ME` ב־`config/strategy.yaml` ובאלרטים לסוד משלך.

מעקב חי: `GET /status` מחזיר מצב חשבון, תקציב סיכון, משקולות נוכחיות
וסטטיסטיקת ביצועים.

## הגדרת חוקי ה־propfirm

`config/propfirm_rules.yaml` מכיל פריסטים לדוגמה (Apex / Topstep / FTMO־style).
בחר עם `active_preset` או הוסף משלך. שדות עיקריים:

| שדה | משמעות |
|---|---|
| `max_daily_loss` | מגבלת הפסד יומי ($). `0` = אין (כמו Apex) |
| `max_drawdown` + `drawdown_mode` | `static` / `trailing_eod` / `trailing_intraday` |
| `daily_loss_soft_stop_pct` | הבוט עוצר ב־X% מהמגבלה — כרית ביטחון |
| `risk_per_trade_pct` | אחוז מהחשבון בסיכון לעסקה (קובע כמות חוזים) |
| `consistency_max_day_pct` | יום בודד לא יעלה על X% מסך הרווח |
| `sessions` / `blackouts` / `flat_by` | שעות מסחר, חלונות חדשות, יציאה כפויה |

**ודא כל מספר מול החוקים העדכניים של הקרן שלך** — הקובץ הזה הוא מה
שהבוט אוכף בפועל.

## מבנה הקוד

| קובץ | תפקיד |
|---|---|
| `bot/app.py` | אורקסטרטור — מחבר הכל; `serve` / `replay` חולקים 100% מהלוגיקה |
| `bot/council.py` | חברי המועצה (trend/momentum/mean-reversion/breakout/slope) והצבעה |
| `bot/correlation.py` | קורלציה מתגלגלת מול ES/YM/RTY — מאשרת או מחלישה |
| `bot/decision.py` | כניסה, סטופ מבוסס ATR, TP לפי R:R, גודל פוזיציה |
| `bot/propfirm.py` | מנוע אכיפת חוקי הקרן |
| `bot/learner.py` | הלמידה העצמית (משקולות + פרמטרים) |
| `bot/performance.py` | יומן עסקאות וסטטיסטיקות (SQLite) |
| `bot/execution.py` | ביצוע נייר / גשר webhook |
| `bot/tradingview.py` | שרת ה־webhook ונרמול סימבולים |
| `bot/market.py` | מחסן נתוני שוק + resample בין טיים־פריימים |

## כוונון פרמטרים (tune.py)

```bash
python scripts/fetch_data.py --days=60 NQ=F ES=F YM=F RTY=F
python scripts/tune.py --feed NQ:5=data/nq_5m.csv --feed ES:5=data/es_5m.csv \
    --feed YM:5=data/ym_5m.csv --feed RTY:5=data/rty_5m.csv
```

הסקריפט מפצל את הדאטה כרונולוגית (60% אימון / 40% ולידציה), מריץ את
הבוט המלא על רשת פרמטרים, ומדרג לפי תוחלת R על חלון הולידציה שלא
נראה — עם מסנן דרודאון. הקונפיג הנוכחי כבר מכיל את התוצאה של ריצה כזו
(2026-06-11) עבור פריסט `tpt_25k_test`.

## דרך עבודה מומלצת

1. הרץ `replay` על דאטה היסטורי (אפשר לייצא CSV מ־TradingView) כדי
   לאתחל את המשקולות ולוודא תוחלת חיובית.
2. הרץ `serve` במצב `paper` שבוע־שבועיים על שוק חי.
3. רק כששני השלבים מראים סטטיסטיקה טובה — העבר `execution.mode: webhook`
   וחבר גשר ביצוע, עם החוזה הקטן (MNQ, `point_value: 2.0`) בהתחלה.
