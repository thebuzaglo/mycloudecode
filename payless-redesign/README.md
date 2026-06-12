# PAYLESS — Redesign 2.0 ✨

שדרוג עיצובי מלא של [propfirmpayless.com](https://propfirmpayless.com) — פלטפורמת ההשוואה המובילה בישראל לחברות מימון (Prop Firms) למסחר בחוזים עתידיים.

> **עותק עצמאי** — האתר המקורי והרפו המקורי לא נגעו בהם. כל התוכן, צבעי המותג,
> הלוגואים, קודי הקופון וקישורי האפיליאציה הועברו 1:1 מהאתר החי.

## מה חדש בעיצוב

- **Dark-first premium fintech** — זכוכית (glassmorphism) על נייבי עמוק, הדגשות זהב/טורקיז מהפלטה המקורית
- **Hero תלת־ממדי** — סצנת Three.js של גרף נרות הולוגרפי + רצפת חלקיקים גלית (דסקטופ בלבד, עם fallback)
- **אנימציות** — framer-motion: חשיפות גלילה, כרטיסים עם 3D tilt, ספירת מספרים, marquee אינסופי
- **וידאו** — פיד חי של סרטוני הערוץ (אותו Edge Function), נגני YouTube עם facade מהיר
- **טיקר שוק חי** — TradingView ticker-tape עם אינדיקטור שוק פתוח/סגור (שעון ישראל)
- **RTL מלא** + פונט Heebo, נגישות מקלדת, prefers-reduced-motion

## סטאק

Vite · React 18 · TypeScript · Tailwind CSS · framer-motion · three.js (@react-three/fiber + drei) · react-router v6 · react-helmet-async

הבקאנד נשאר ה-Supabase הקיים של האתר (בלוג, ניוזלטר, פיד יוטיוב) — אותו anon key ציבורי.

## הרצה

```bash
npm install
npm run dev        # פיתוח
npm run build      # בילד לפרודקשן (dist/)
npm run preview    # תצוגה של הבילד
```

## מבנה

```
src/
  components/
    layout/     # Navbar (mega-menu), Footer, MarketTicker, WhatsApp FAB
    ui/         # primitives: GlassCard, GoldButton, Reveal, Marquee, VideoCard...
    three/      # MarketScene — סצנת ה-3D של ה-hero
    home/       # סקשני עמוד הבית
  data/         # תוכן שחולץ מהאתר המקורי (חברות, מבצעים, ניווט...)
  pages/        # כל עמודי האתר (47 ראוטים ציבוריים)
  lib/          # supabase REST, utils
```

## נאמנות תוכן

הנתונים חולצו פרוגרמטית מהבאנדלים של האתר החי (`/tmp/pp_pretty`) ומה-API:
7 חברות מימון · 54 מבצעים · 9 פוסטים · מילון מושגים · כל העמודים הסטטיים.
אין תוכן מומצא; מה שלא נמצא במקור — הושמט.
