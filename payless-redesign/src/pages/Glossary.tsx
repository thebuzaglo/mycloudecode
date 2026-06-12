import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, BookOpen, Building2, BadgePercent, Calculator, Wrench } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { Reveal, SectionHeading, GlassCard, Badge } from "@/components/ui/primitives";
import { glossaryTerms, glossaryCategoryLabels } from "@/data/glossary";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER = ["trading", "risk_management", "company_terms", "technical_analysis"] as const;

const categoryTone: Record<string, "gold" | "cyan" | "hot" | "muted"> = {
  trading: "cyan",
  risk_management: "hot",
  company_terms: "gold",
  technical_analysis: "muted",
};

const popularTerms = [
  { slug: "account-renewal", label: "חידוש חשבון" },
  { slug: "account-reset", label: "איפוס חשבון" },
  { slug: "consistency", label: "כלל העקביות" },
  { slug: "eod-stop", label: "EOD Stop" },
  { slug: "intraday-stop", label: "Intraday Stop" },
  { slug: "drawdown", label: "Drawdown" },
].filter((p) => glossaryTerms.some((t) => t.slug === p.slug));

const howToUse = [
  "חיפוש חופשי: שורת החיפוש למעלה מקבלת את שם המושג בעברית או באנגלית, חלקי תיאור, או מילת מפתח. למשל, אם תקלידו 'דרודאון' תקבלו את כל הווריאציות (EOD, Intraday, Trailing, Static).",
  "סינון לפי קטגוריה: ארבע קטגוריות מרכזיות — מסחר כללי, ניהול סיכונים, כללי חברות מימון, וניתוח טכני. לחיצה על קטגוריה מציגה רק את המושגים השייכים אליה.",
  "דפדוף לפי אות: המושגים מסודרים אלפביתית. אם אתם רק רוצים להציץ ולגלות מושגים חדשים, פשוט גללו ותראו את כל הספרייה.",
];

const categoryBlocks = [
  {
    heading: "ניהול סיכונים (Risk Management)",
    body: "מושגי הליבה שמגדירים את גבולות המסחר בחברת מימון — Daily Loss Limit, Trailing Drawdown, Static Drawdown, EOD Stop, Intraday Stop, ו-Maximum Drawdown. הבנה מדויקת של המנגנונים האלה היא ההבדל בין סוחר שמחזיק חשבון ממומן לבין כזה שמאבד אותו ביום השני.",
  },
  {
    heading: "כללי חברות מימון (Company Terms)",
    body: "המושגים שמופיעים בחוזה של כל חברת מימון — Profit Split, Consistency Rule, Scaling Plan, Activation Fee, Payout Day, Account Reset ו-Account Renewal. כל חברה משתמשת בהגדרות שונות, וחשוב להבין את ההבדלים לפני שמשלמים על אתגר.",
  },
  {
    heading: "מסחר כללי (Trading)",
    body: "מושגי הבסיס של עולם המסחר בחוזים עתידיים — Long, Short, Tick, Pip, Margin, Leverage, Stop Loss, Take Profit, ו-Risk to Reward Ratio. גם סוחרים מנוסים מוצאים כאן ערך בהשוואה למקבילות הבינלאומיות.",
  },
  {
    heading: "ניתוח טכני (Technical Analysis)",
    body: "מבנים גרפיים, אינדיקטורים ומושגי תנועה — Support, Resistance, Trend, RSI, MACD, Moving Average, Order Block, Fair Value Gap, וכל מה שביניהם. הסברים תמציתיים עם דוגמאות גרפיות.",
  },
];

const faqs = [
  {
    question: "מה זו ספריית המושגים של PAYLESS?",
    answer:
      "ספריית המושגים היא מאגר עברי מקיף לכל המונחים שסוחר בחברות מימון נתקל בהם — מ-EOD Stop ו-Trailing Drawdown ועד Consistency Rule ו-Profit Split. כל מושג מוסבר בעברית פשוטה, עם הסבר טכני, דוגמאות חיות, וקישורים למידע נוסף.",
  },
  {
    question: "האם הספרייה מתאימה לסוחרים מתחילים?",
    answer:
      "כן. בנינו את הספרייה במיוחד כדי שגם מי שמתחיל את דרכו במסחר בפרופ ייקח ממנה ערך. כל מושג נכתב במקור בעברית פשוטה, עם הסבר קצר תחילה ואז העמקה למי שרוצה להבין יותר.",
  },
  {
    question: "מה ההבדל בין EOD Stop ל-Intraday Stop?",
    answer:
      "EOD Stop (End of Day Drawdown) הוא מנגנון שמחשב את ה-Drawdown על פי הסגירה היומית בלבד, ומאפשר לכם לרדת באמצע היום מתחת לרף בלי להיפסל. Intraday Stop הוא מנגנון מחמיר יותר שמתעדכן בזמן אמת — אם החשבון יורד מתחת לרף אפילו לרגע, החשבון נסגר. רוב הסוחרים מעדיפים EOD כי הוא נותן הרבה יותר גמישות.",
  },
  {
    question: "מה זה Consistency Rule (כלל העקביות)?",
    answer:
      'כלל העקביות הוא תנאי שדורש שיום אחד של רווח לא יהיה גדול מדי ביחס לסה"כ הרווח בחודש או בתקופה. למשל, אם הכלל הוא 30%, אז אסור שיום הרווח הכי גדול שלכם יהווה יותר מ-30% מהרווח הכולל. המטרה היא לעודד סוחרים לסחור בעקביות ולא להסתמך על יום ענק בודד.',
  },
  {
    question: "האם הספרייה מתעדכנת?",
    answer:
      "כן, באופן רציף. בכל פעם שחברת מימון משנה כללים או מציגה מנגנון חדש, אנחנו מעדכנים את הספרייה. כל המונחים מתויגים עם תאריך עדכון אחרון כדי שתדעו שאתם קוראים מידע עדכני.",
  },
  {
    question: "איך אני מוצא מושג ספציפי?",
    answer:
      "אפשר לחפש בשורת החיפוש למעלה לפי שם המושג בעברית או באנגלית, לפי הגדרה או לפי מילת מפתח. אפשר גם לסנן לפי קטגוריה (מסחר, ניהול סיכונים, חברות מימון, ניתוח טכני) או לדפדף לפי האות הראשונה.",
  },
];

const relatedTopics = [
  {
    title: "השוואת חברות מימון",
    description: "כל החברות, הכללים והמחירים במקום אחד — סננו לפי תקציב, פלטפורמה וכללי משיכה",
    href: "/companies",
    Icon: Building2,
  },
  {
    title: "מבצעים בלעדיים",
    description: "קופונים והנחות פעילים על כל חברות המימון — מעודכן בזמן אמת",
    href: "/offers",
    Icon: BadgePercent,
  },
  {
    title: "מחשבון Consistency",
    description: "בדקו אם אתם עומדים בכלל העקביות של חברת המימון שלכם — מחשבון חינמי",
    href: "/tools/consistency-calculator",
    Icon: Calculator,
  },
  {
    title: "כלי עזר למסחר",
    description: "פלטפורמות, מחשבונים וכלי ניתוח שיעזרו לכם לסחור טוב יותר",
    href: "/tools",
    Icon: Wrench,
  },
];

export default function Glossary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return glossaryTerms.filter((t) => {
      const matchesQuery =
        !q ||
        t.term_he.toLowerCase().includes(q) ||
        t.term_en.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q));
      const matchesCategory = !category || t.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const groups = useMemo(() => {
    const byLetter = new Map<string, typeof glossaryTerms>();
    for (const t of filtered) {
      const letter = t.term_he.charAt(0);
      if (!byLetter.has(letter)) byLetter.set(letter, []);
      byLetter.get(letter)!.push(t);
    }
    return [...byLetter.entries()].sort(([a], [b]) => a.localeCompare(b, "he"));
  }, [filtered]);

  const chipCls = (active: boolean) =>
    cn(
      "rounded-full px-4 py-1.5 text-sm font-bold transition-all duration-300",
      active
        ? "bg-gradient-gold text-navy-950 shadow-glow-gold"
        : "glass-bright text-muted-foreground hover:text-foreground"
    );

  return (
    <>
      <Seo
        title="ספריית מושגים למסחר ומימון 2026 | PayLess - מדריך מקיף"
        description="ספריית מושגים דיגיטלית מקיפה למסחר ומימון. למד על EOD Stop, Drawdown, Consistency Rule, Trailing Stop ועוד. כל מושג מוסבר בפשטות עם סרטוני הדרכה."
      />

      <PageHero
        eyebrow="מדריך מקיף לסוחרים"
        title="ספריית מושגים"
        highlight="למסחר ולחברות מימון"
        subtitle="המאגר העברי הגדול ביותר למונחים של חברות מימון, חוזים עתידיים וניהול סיכונים. מעל למאה מושגים מוסברים בעברית פשוטה — מ-EOD Stop ו-Trailing Drawdown ועד Consistency Rule, Profit Split וכל מה שביניהם. מותאם לסוחרים בכל רמת ניסיון, עם דוגמאות חיות וקישורים למידע מעמיק."
      >
        <nav aria-label="מושגים פופולריים" className="flex max-w-2xl flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">מושגים פופולריים:</span>
          {popularTerms.map((p) => (
            <Link
              key={p.slug}
              to={`/glossary/${p.slug}`}
              className="glass-bright rounded-full px-3.5 py-1.5 text-sm font-semibold text-foreground/80 transition-all duration-300 hover:border-secondary/50 hover:text-secondary"
            >
              {p.label}
            </Link>
          ))}
        </nav>
      </PageHero>

      <section className="container relative pb-20">
        <div className="pointer-events-none absolute left-1/2 top-40 h-[420px] w-[680px] max-w-full -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[120px]" />

        {/* search + category filter */}
        <Reveal className="relative mx-auto mb-10 flex max-w-4xl flex-col gap-5">
          <div className="relative">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חפש מושג לפי שם, הגדרה או מילת מפתח..."
              className="glass w-full rounded-2xl py-3.5 pl-4 pr-12 text-base text-foreground outline-none transition-shadow placeholder:text-muted-foreground/70 focus:shadow-glow-cyan"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              סינון לפי קטגוריה:
            </span>
            <button type="button" onClick={() => setCategory(null)} className={chipCls(category === null)}>
              הכל
            </button>
            {CATEGORY_ORDER.map((c) => (
              <button key={c} type="button" onClick={() => setCategory(c)} className={chipCls(category === c)}>
                {glossaryCategoryLabels[c]}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            נמצאו <span dir="ltr" className="font-bold text-foreground/90">{filtered.length}</span> מושגים
          </p>
        </Reveal>

        {/* alphabetical groups */}
        {groups.length > 0 && (
          <div className="relative space-y-12">
            {groups.map(([letter, terms]) => (
              <div key={letter}>
                <Reveal>
                  <h2 className="mb-6 text-3xl font-black text-gradient-gold">{letter}</h2>
                </Reveal>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {terms.map((t, i) => (
                    <Reveal key={t.slug} delay={i * 0.06} className="h-full">
                      <Link to={`/glossary/${t.slug}`} className="group block h-full">
                        <GlassCard className="flex h-full flex-col gap-3 p-6">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-xl font-extrabold leading-snug transition-colors group-hover:text-secondary">
                              {t.term_he}
                            </h3>
                            <Badge tone={categoryTone[t.category] ?? "muted"}>
                              {glossaryCategoryLabels[t.category] ?? t.category}
                            </Badge>
                          </div>
                          <p className="text-sm font-semibold text-primary/80" dir="ltr">
                            {t.term_en}
                          </p>
                          <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                            {t.definition}
                          </p>
                        </GlassCard>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* empty state */}
        {filtered.length === 0 && (
          <Reveal className="relative py-16 text-center">
            <BookOpen className="mx-auto mb-5 h-14 w-14 text-muted-foreground/50" />
            <h3 className="text-2xl font-extrabold">לא נמצאו תוצאות</h3>
            <p className="mt-2 text-muted-foreground">נסה לחפש במילים אחרות או לשנות את הסינון</p>
          </Reveal>
        )}
      </section>

      {/* how to use */}
      <section className="container relative py-20">
        <div className="beam-divider absolute inset-x-0 top-0" />
        <SectionHeading
          eyebrow="איך להשתמש"
          title="איך להשתמש בספריית"
          highlight="המושגים"
          subtitle="הספרייה נבנתה כך שתוכלו למצוא תשובה לכל מושג בתוך פחות מ-10 שניות. שלוש דרכי שימוש מרכזיות."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {howToUse.map((p, i) => {
            const [head, ...rest] = p.split(":");
            return (
              <Reveal key={i} delay={i * 0.08} className="h-full">
                <GlassCard className="h-full p-7">
                  <h3 className="mb-3 text-lg font-extrabold text-secondary">{head}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{rest.join(":").trim()}</p>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* main categories */}
      <section className="container relative py-20">
        <SectionHeading title="קטגוריות מרכזיות" highlight="בספרייה" />
        <div className="grid gap-6 md:grid-cols-2">
          {categoryBlocks.map((b, i) => (
            <Reveal key={b.heading} delay={i * 0.08} className="h-full">
              <GlassCard className="h-full p-7">
                <h3 className="mb-3 text-lg font-extrabold">{b.heading}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container relative py-20">
        <SectionHeading
          title="שאלות נפוצות על מושגי מסחר"
          highlight="וחברות מימון"
          subtitle="התשובות לשאלות שאנחנו מקבלים הכי הרבה מסוחרים שמתחילים את דרכם בעולם הפרופ"
        />
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <details className="glass group rounded-2xl px-6 py-5 transition-colors open:border-secondary/30">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-extrabold [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <span className="text-secondary transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* related topics */}
      <section className="container relative pb-24 pt-4">
        <SectionHeading title="המשיכו לכלים ולמדריכים" highlight="שלנו" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {relatedTopics.map((t, i) => (
            <Reveal key={t.href} delay={i * 0.07} className="h-full">
              <Link to={t.href} className="group block h-full">
                <GlassCard className="flex h-full flex-col p-7">
                  <t.Icon className="mb-4 h-7 w-7 text-primary/60 transition-colors group-hover:text-secondary" />
                  <h3 className="mb-2 text-lg font-extrabold leading-snug">{t.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
                </GlassCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
