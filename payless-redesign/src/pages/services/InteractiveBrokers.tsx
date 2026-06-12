import { useState } from "react";
import { Globe2, Layers, Repeat, Clock3, Monitor, TrendingDown, ShieldCheck, Landmark, ChevronDown, Gift, User, Users, Building, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { SectionHeading, GlassCard, Reveal, GoldButton, GhostButton, Badge } from "@/components/ui/primitives";
import ibLogo from "@/assets/logos/interactive-israel-logo.png";

const AFFILIATE_LINK = "https://lp3.inter-il.com/ab/788";

const whyItems = [
  { Icon: Globe2, title: "שירות וליווי בעברית", desc: "נציגות ישראלית מורשית של IBKR — תמיכה, פתיחת חשבון וייעוץ בעברית" },
  { Icon: Layers, title: "גישה לכל השווקים", desc: "מסחר ביותר מ־150 שווקים ב־33 מדינות ו־27 מטבעות שונים דרך IBKR" },
  { Icon: TrendingDown, title: "עמלות מהנמוכות בתעשייה", desc: 'תעריפים תחרותיים למניות, אופציות, חוזים עתידיים ומט"ח' },
  { Icon: ShieldCheck, title: "רגולציה ופיקוח", desc: 'אינטראקטיב שרותי בורסה בע"מ (ח.פ. 515259232) מול ברוקר אמריקאי מפוקח' },
];

const couponTerms = [
  "לקוחות חדשים בלבד (ללא חשבון פעיל ב־12 החודשים האחרונים)",
  "הפקדה ראשונית מינימלית של ₪10,000 (או שווה ערך)",
  "ביצוע פעולה אחת לפחות תוך 3 חודשים מפתיחת החשבון",
];

const accountTypes = [
  { Icon: User, title: "חשבון אישי", desc: "חשבון פרטי על שם הסוחר — הפתרון הנפוץ ביותר ליחידים." },
  { Icon: Users, title: "חשבון משותף", desc: "חשבון על שם שני בעלים — בני זוג או שותפים." },
  { Icon: Building, title: "חשבון חברה", desc: 'חשבון על שם חברה בע"מ עם מסמכי התאגדות.' },
];

const capabilities = [
  { Icon: Globe2, title: "150+ שווקים ב־33 מדינות", desc: "גישה לוול סטריט, אירופה, אסיה — מסחר גלובלי מחשבון יחיד" },
  { Icon: Layers, title: "מגוון נכסים רחב", desc: 'מניות, אופציות, חוזים עתידיים, מט"ח, אג"ח וקרנות סל' },
  { Icon: Repeat, title: "שברי מניות + הוראת קבע", desc: "השקעה אוטומטית חודשית במניות וקרנות סל — גם בסכומים קטנים" },
  { Icon: TrendingDown, title: "מסחר יומי גם מתחת ל־$25K", desc: "אפשרות פתיחת חשבון תחת הישות האירית של IBKR" },
  { Icon: Clock3, title: "Pre-Market מ־11:00", desc: "מסחר מוקדם בבורסה האמריקאית כבר משעות הצהריים בישראל" },
  { Icon: Monitor, title: "פלטפורמת TWS זוכת פרסים", desc: "TWS, IBKR Mobile ואינטגרציה מלאה עם TradingView" },
];

const fees = [
  { label: 'מניות ארה"ב', value: "1¢", sub: "למניה · מינ' $2.50 לפעולה" },
  { label: 'אופציות ארה"ב', value: "$2", sub: "לאופציה · ללא מינימום" },
  { label: "חוזים עתידיים", value: "$3", sub: "לחוזה" },
  { label: 'המרת מט"ח', value: "0.002%", sub: 'מינ\' 10 ש"ח (עד ½ מיליון ש"ח)' },
];

const protections = [
  { Icon: Landmark, title: "הפרדת כספים", desc: "כספי הלקוחות מופרדים ומוחזקים בבנקים מובילים בעולם, ביניהם J.P. Morgan." },
  { Icon: ShieldCheck, title: "ביטוח SIPC עד $500,000", desc: 'חשבונות תחת הישות האמריקאית מבוטחים ע"י SIPC עד $500K (ICF €20K לישות האירית).' },
  { Icon: ShieldCheck, title: "ביטוח עודף עד $30M", desc: "אפשרות הרחבה דרך Lloyd's of London — אחת מההגנות הגבוהות בענף." },
  { Icon: Landmark, title: "רגולציה מלאה", desc: "IBKR בשווי 30+ מיליארד דולר, תחת רגולציית SEC, FINRA ו־CFTC." },
];

const profiles = [
  {
    title: "סוחרים אקטיביים",
    items: [
      "עמלות מהנמוכות בענף — חיסכון משמעותי בנפח גבוה",
      "פלטפורמה מתקדמת + כלי ניתוח סיכונים וסורקי שוק",
      "גישה לאופציות, חוזים עתידיים ומסחר אלגוריתמי",
    ],
  },
  {
    title: "משקיעים פסיביים",
    items: [
      "שברי מניות + הוראת קבע חודשית להשקעה אוטומטית",
      "ניכוי מס אוטומטי בחינם — ללא צורך ברואה חשבון",
      "ללא דמי ניהול, ללא דמי משמרת, ללא מינימום פתיחה",
    ],
  },
];

const faq = [
  { q: "מה ההבדל בין פתיחה דרך אינטראקטיב ישראל לבין IBKR ישירות?", a: "אינטראקטיב שרותי בורסה היא הנציגות הישראלית של Interactive Brokers — אתם מקבלים את אותה פלטפורמה ואותם שווקים, אך עם ליווי בעברית, נציגים מקומיים, וגישה להטבות ייעודיות לישראלים כמו קופון $50 החזר עמלות." },
  { q: "איך מקבלים את הקופון של $50?", a: "פותחים חשבון דרך הקישור האישי שבעמוד זה, עומדים בשלושת התנאים: לקוח חדש, הפקדה של ₪10,000 לפחות וביצוע פעולה אחת תוך 3 חודשים — והקופון מזכה אתכם בעד $50 כנגד עמלות קנייה ומכירה במהלך 3 החודשים הראשונים." },
  { q: "מהו סכום ההפקדה המינימלי?", a: "להפעלת קופון ההטבה נדרשת הפקדה ראשונית של ₪10,000 לפחות (או שווה ערך דולרי). פתיחת החשבון עצמה אפשרית גם בסכומים נמוכים יותר, אך אז הקופון לא יחול." },
  { q: "האם השירות בעברית?", a: "כן. כל תהליך פתיחת החשבון, התמיכה והליווי השוטף מתבצעים בעברית מול נציגי אינטראקטיב ישראל, כולל זמינות בוואטסאפ." },
  { q: "האם יש דמי ניהול או דמי משמרת?", a: "לא. בחשבון אינטראקטיב ישראל אין דמי ניהול, אין דמי משמרת, אין דמי אי־פעילות ואין מינימום פתיחת חשבון. משלמים רק עמלות מסחר על פעולות שמבוצעות בפועל." },
  { q: "האם יש ניכוי מס אוטומטי לרשויות בישראל?", a: "כן — מיוני 2024 קיימת אפשרות לניכוי מס אוטומטי בחינם, ללא צורך בהגשת דוח שנתי עצמאי. השירות אופציונלי לבחירת הלקוח. מי שמעדיף להמשיך בדיווח עצמאי יכול להשאיר את החשבון כפי שהיה." },
  { q: "האם ניתן לרכוש שברי מניות ולהגדיר הוראת קבע?", a: "כן. ניתן לרכוש שברי מניות וגם להגדיר הוראת קבע חודשית לרכישה אוטומטית של מניות וקרנות סל. ההמרה משקלים לדולרים עבור כספי הוראת הקבע מתבצעת ללא עמלת המרה." },
  { q: "האם ניתן לסחור בבורסה הישראלית?", a: 'אינטראקטיב מיועדת בעיקר למסחר גלובלי בחו"ל ואינה מהווה תחליף לבית השקעות ישראלי. סוחרים שרוצים גם מסחר בבורסת תל אביב מחזיקים בנפרד גם חשבון בבית השקעות ישראלי לצד החשבון באינטראקטיב.' },
  { q: "מי יכול לפתוח חשבון?", a: "תושבי ישראל בגירים — באופן אישי, חשבון משותף או חשבון חברה. תהליך הפתיחה מתבצע אונליין וכולל אימות זהות והגשת מסמכים." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard className="overflow-hidden !rounded-xl">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right" aria-expanded={open}>
        <span className="font-bold">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-secondary transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="border-t border-white/5 px-5 py-4 leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

export default function InteractiveBrokers() {
  return (
    <>
      <Seo
        title="אינטראקטיב ישראל · Interactive Brokers + קופון $50 | PAYLESS"
        description="פתיחת חשבון Interactive Brokers דרך אינטראקטיב ישראל — שירות וליווי בעברית, גישה לכל השווקים בעולם וקופון $50 החזר עמלות ללקוחות חדשים."
      />
      <PageHero
        eyebrow="🎁 קופון $50 החזר עמלות"
        title="פתיחת חשבון Interactive Brokers דרך"
        highlight="אינטראקטיב ישראל"
        subtitle="הנציגות הרשמית של IBKR בישראל — שירות וליווי בעברית, גישה לכל השווקים בעולם, וקופון בלעדי של $50 החזר עמלות ללקוחות חדשים."
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <GoldButton href={AFFILIATE_LINK} size="lg">פתח חשבון + קבל $50</GoldButton>
          <GhostButton href="#accounts">צפה בסוגי חשבונות</GhostButton>
          <img src={ibLogo} alt="לוגו אינטראקטיב ישראל — Interactive Israel" className="h-12 w-auto" />
        </div>
      </PageHero>

      {/* coupon highlight */}
      <section className="container relative pb-8">
        <Reveal>
          <GlassCard glow className="mx-auto max-w-3xl p-8 text-center">
            <Badge tone="gold" className="mb-3"><Gift className="h-3.5 w-3.5" /> הטבה בלעדית</Badge>
            <h2 className="text-2xl font-black md:text-3xl">
              קופון <span className="text-gradient-gold">$50 החזר עמלות</span> ללקוחות חדשים
            </h2>
            <p className="mt-2 text-muted-foreground">
              החזר של עד $50 כנגד עמלות קנייה ומכירה במהלך 3 החודשים הראשונים מפתיחת החשבון.
            </p>
            <ul className="mx-auto mt-5 max-w-md space-y-2 text-right">
              {couponTerms.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-foreground/85">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <GoldButton href={AFFILIATE_LINK}>פתח חשבון וקבל את הקופון</GoldButton>
            </div>
          </GlassCard>
        </Reveal>
      </section>

      {/* why */}
      <section className="container relative py-14">
        <SectionHeading title="למה" highlight="אינטראקטיב ישראל?" subtitle="הדרך הקלה והמקומית לפתוח חשבון בברוקר הבינלאומי המוביל" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.07} className="h-full">
              <GlassCard className="flex h-full flex-col items-center p-7 text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <w.Icon className="h-7 w-7 text-primary" />
                </span>
                <h3 className="mb-2 font-extrabold">{w.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* account types */}
      <section id="accounts" className="container relative py-14">
        <SectionHeading title="סוגי" highlight="חשבונות" subtitle="בחרו את החשבון המתאים — נציג אינטראקטיב ישראל ילווה אתכם בכל התהליך" />
        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
          {accountTypes.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.07} className="h-full">
              <GlassCard className="flex h-full flex-col items-center p-7 text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
                  <a.Icon className="h-7 w-7 text-secondary" />
                </span>
                <h3 className="mb-2 font-extrabold">{a.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <GoldButton href={AFFILIATE_LINK}>התחל בתהליך פתיחת החשבון</GoldButton>
        </Reveal>
      </section>

      {/* capabilities */}
      <section className="container relative py-14">
        <SectionHeading title="מה תוכלו לעשות" highlight="עם החשבון" subtitle="חשבון מסחר עצמאי עם גישה גלובלית מלאה — לסוחרים, משקיעים והוראות קבע" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06} className="h-full">
              <GlassCard className="flex h-full items-start gap-4 p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <c.Icon className="h-6 w-6 text-primary" />
                </span>
                <div>
                  <h3 className="font-extrabold">{c.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* fees */}
      <section className="container relative py-14">
        <SectionHeading title="עמלות שקופות," highlight="ללא הפתעות" subtitle="ללא דמי ניהול · ללא דמי משמרת · ללא דמי אי־פעילות · ללא מינימום פתיחת חשבון" />
        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fees.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.06} className="h-full">
              <GlassCard className="flex h-full flex-col items-center p-6 text-center">
                <div className="text-sm font-bold text-muted-foreground">{f.label}</div>
                <div className="my-2 text-3xl font-black text-gradient-gold" dir="ltr">{f.value}</div>
                <div className="text-xs text-muted-foreground">{f.sub}</div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <GoldButton href={AFFILIATE_LINK}>פתח חשבון וקבל $50 החזר עמלות</GoldButton>
        </Reveal>
      </section>

      {/* auto tax */}
      <section className="container relative py-10">
        <Reveal>
          <GlassCard className="mx-auto max-w-3xl p-8">
            <Badge tone="cyan" className="mb-3">חדש מיוני 2024</Badge>
            <h2 className="text-xl font-extrabold md:text-2xl">
              ניכוי מס אוטומטי — <span className="text-gradient-gold">בחינם</span>
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              אופציה חדשה המאפשרת ניכוי מס על רווחי הון ודיבידנדים באופן אוטומטי, ללא צורך
              בהגשת דוח שנתי עצמאי או בשכירת רואה חשבון. השירות אופציונלי, לבחירת הלקוח,
              ללא עלות נוספת — מי שמעדיף להמשיך בדיווח עצמאי יכול להישאר כפי שהיה.
            </p>
          </GlassCard>
        </Reveal>
      </section>

      {/* protection */}
      <section className="container relative py-14">
        <SectionHeading title="ביטחון והגנה" highlight="על הכסף" subtitle="החשבון נפתח ישירות אצל IBKR — אחת מחברות הברוקראז' המפוקחות בעולם" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {protections.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06} className="h-full">
              <GlassCard className="flex h-full flex-col p-6">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <p.Icon className="h-6 w-6 text-emerald-400" />
                </span>
                <h3 className="mb-1.5 font-extrabold">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* who is it for */}
      <section className="container relative py-14">
        <SectionHeading title="למי זה" highlight="מתאים?" subtitle="שני פרופילים — חשבון אחד שמכסה את שניהם" />
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {profiles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07} className="h-full">
              <GlassCard className="h-full p-7">
                <h3 className="mb-4 text-xl font-extrabold text-gradient-gold">{p.title}</h3>
                <ul className="space-y-2.5">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      {it}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <GoldButton href={AFFILIATE_LINK}>פתח חשבון וקבל $50</GoldButton>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="container relative py-12">
        <SectionHeading title="שאלות" highlight="נפוצות" />
        <div className="mx-auto max-w-3xl space-y-3">
          {faq.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container relative py-16">
        <Reveal>
          <GlassCard glow className="mx-auto max-w-3xl p-10 text-center">
            <h2 className="text-2xl font-black md:text-3xl">
              <span className="text-gradient-ice">מוכנים</span>{" "}
              <span className="text-gradient-gold">להתחיל?</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              פתחו חשבון Interactive Brokers דרך הקישור האישי וקבלו את הטבת ה־$50 החזר עמלות
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <GoldButton href={AFFILIATE_LINK} size="lg">פתח חשבון + קופון $50</GoldButton>
              <GhostButton to="/services">חזור לשירותים נוספים</GhostButton>
            </div>
          </GlassCard>
        </Reveal>
      </section>
    </>
  );
}
