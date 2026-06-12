import { useState } from "react";
import { Link } from "react-router-dom";
import { Award, Building2, LineChart, Calculator, CheckCircle2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { SectionHeading, GlassCard, Reveal, Badge, GhostButton } from "@/components/ui/primitives";

import fundedAwardLogo from "@/assets/logos/funded-award-hero-logo.png";
import acHoldingLogo from "@/assets/logos/ac-holding-logo.png";
import interactiveLogo from "@/assets/logos/interactive-israel-logo.png";
import aslanLogo from "@/assets/logos/aslan-cpa-logo-hero.png";

const services = [
  {
    id: "funded-award",
    name: "Funded Award",
    category: "תעודות לסוחרים",
    Icon: Award,
    logo: fundedAwardLogo,
    pricing: "בתשלום" as const,
    description: "תעודות ממוסגרות יוקרתיות לסוחרים ממומנים — מזכרת מקצועית להישג שלך",
    bullets: [
      "איכות פרימיום עם מסגרת מהודרת",
      "מיתוג Payless בלעדי",
      "משלוח עולמי לכתובת שלך",
      "10% הנחה עם קוד PAYLESS",
    ],
  },
  {
    id: "ac-holding",
    name: "AC Holding",
    category: "השקעות נדל״ן",
    Icon: Building2,
    logo: acHoldingLogo,
    pricing: "הטבה" as const,
    description: "השקעות נדל״ן באיחוד האמירויות ואפיקי שותפות ברווחים בליווי מקצועי",
    bullets: [
      "פרויקטים יוקרתיים בדובאי ובאבו דאבי",
      "ליווי אישי בעברית לאורך כל התהליך",
      "אפיקי שותפות ברווחים גמישים",
      "ייעוץ ראשוני ללא עלות",
    ],
  },
  {
    id: "interactive-brokers",
    name: "Interactive Brokers",
    category: "ברוקרים",
    Icon: LineChart,
    logo: interactiveLogo,
    pricing: "הטבה" as const,
    description:
      "פתיחת חשבון Interactive Brokers דרך אינטראקטיב ישראל — שירות וליווי בעברית, וקופון $50 החזר עמלות ללקוחות חדשים",
    bullets: [
      "קופון $50 החזר עמלות ללקוחות חדשים",
      "שירות וליווי בעברית מנציגות מקומית",
      "גישה ל־150+ שווקים גלובליים דרך IBKR",
      "פלטפורמות מסחר מתקדמות (TWS / Mobile)",
    ],
  },
  {
    id: "aslan-cpa",
    name: "עידן אסלן - רואה חשבון וייעוץ עסקי",
    category: "ייעוץ כלכלי",
    Icon: Calculator,
    logo: aslanLogo,
    pricing: "בתשלום" as const,
    description: "רואה חשבון מוסמך המתמחה בסוחרי נוסטרו, תכנון מס, החזרי מס והדרכה כלכלית למשקי בית",
    bullets: [
      "התמחות בעוסקים מתחום מסחר הנוסטרו",
      "פתיחת עסק וליווי מול רשויות המס",
      "תכנון מס חכם והחזרי מס",
      'דוחות מס לארה"ב לאזרחים אמריקאים',
    ],
  },
];

const whyParagraphs = [
  "PAYLESS היא הפלטפורמה העברית הגדולה בישראל למסחר בחברות מימון. הרשימה כאן לא נבנתה מהאינטרנט — היא תוצאה של עבודה עם הספקים, בדיקת איכות, ניהול משא ומתן על הטבות, וליווי שוטף של אלפי סוחרים.",
  "כל ספק שמופיע בעמוד הזה עבר תהליך אישי שלנו: בדיקת השירות מקצה לקצה, אישור שהוא ניתן בעברית מלאה, ניהול משא ומתן על הטבה בלעדית ללקוחות PAYLESS, ובקרה רציפה על איכות התמיכה והמענה.",
  "אנחנו לא מקבלים את כל מי שפונה אלינו. בעבר דחינו ספקים שלא עמדו ברף האיכות שאנחנו דורשים — שירות לקוחות לקוי, מחירים לא תחרותיים, או חוסר שקיפות. הרשימה הקצרה הזו היא תוצאה של סינון אגרסיבי.",
  "אנחנו ב-PAYLESS מאמינים שסוחר מצליח צריך אקוסיסטם שלם — לא רק חברת מימון. ייעוץ מס נכון, ברוקר אישי, השקעה בנכסים בטוחים, ותעודה שמסכמת את ההישג. השירותים כאן נועדו לתת לכם את כל מה שמסביב.",
];

const serviceTypes = [
  {
    title: "תעודות לסוחרים ממומנים",
    body: "תעודה מודפסת על אקריליק יוקרתי לסוחרים שעברו אתגר מימון. שירות Funded Award מאפשר להזמין תעודה ממוסגרת מעוצבת אישית עם הלוגו של חברת המימון, הסכום שאושר וגודל החשבון. משלוח עולמי לכתובת שלכם, איכות פרימיום, ומיתוג PAYLESS בלעדי — 10% הנחה בקוד PAYLESS.",
  },
  {
    title: "השקעות נדל״ן באיחוד האמירויות",
    body: 'השקעות נדל"ן בדובאי ובאבו דאבי דרך AC Holding — חברה ישראלית שמתמחה בליווי משקיעים פרטיים בעולם הנדל"ן באיחוד האמירויות. אפס מס על רווחי שכירות, פרויקטים יוקרתיים, ליווי אישי בעברית מתחילת התהליך ועד מסירת המפתחות, ואפיקי שותפות ברווחים גמישים.',
  },
  {
    title: "ברוקרים בינלאומיים בעברית",
    body: "פתיחת חשבון Interactive Brokers דרך אינטראקטיב ישראל — הנציגה המקומית של IBKR. גישה ל-150+ שווקים גלובליים, פלטפורמות מסחר מתקדמות (TWS ו-Mobile), שירות וליווי בעברית מנציגות ישראלית, וקופון של $50 החזר עמלות ללקוחות חדשים שנפתחים דרך הקישור שלנו.",
  },
  {
    title: "ייעוץ מס ורואה חשבון לסוחרים",
    body: 'ייעוץ מס מקצועי דרך משרד עידן אסלן — רואה חשבון מוסמך שמתמחה בסוחרי נוסטרו. השירות כולל פתיחת עסק וליווי מול רשויות המס, תכנון מס חכם והחזרי מס לסוחרים פרטיים, דוחות מס לארה"ב לאזרחים אמריקאים, וליווי כלכלי למשפחות וניהול עובדים זרים.',
  },
];

const howToChoose = [
  "הבחירה תלויה בשלב שאתם נמצאים בו. אם בדיוק עברתם אתגר מימון — תעודת Funded Award היא דרך מהממת להנציח את ההישג ולשמור מזכרת פיזית. אם אתם כבר סוחרים פעילים עם הכנסות יציבות — ייעוץ מס נכון יכול לחסוך לכם אלפי שקלים בשנה.",
  'סוחרים שמחפשים פיזור מעבר לעולם המסחר ימצאו ערך בהשקעות נדל"ן באמירויות — תשואה יציבה, אפס מס על שכירות, ופרויקטים שנכנסים למחירים נגישים יחסית למשקיע הישראלי. ובכל מקרה — אם אתם רוצים גישה לשווקים גלובליים מעבר לחוזים העתידיים, חשבון Interactive Brokers הוא הסטנדרט הבינלאומי.',
];

const servicesFaq = [
  {
    q: "מה זה השירותים הנוספים של PAYLESS?",
    a: 'אלה שירותים משלימים לסוחרים מעבר לחברות מימון ולכלי המסחר — תעודות יוקרה לסוחרים ממומנים, השקעות נדל"ן באיחוד האמירויות, פתיחת חשבון ברוקר Interactive Brokers בליווי בעברית, וייעוץ מס מקצועי. כל שירות נבחר בקפידה אחרי שבדקנו אותו אישית.',
  },
  {
    q: "האם כל השירותים בעברית?",
    a: "כן. כל השירותים שאנחנו ממליצים עליהם זמינים בעברית מלאה — מהאתר, דרך השירות, ועד תמיכה אישית. זה תנאי בסיסי שאנחנו דורשים מכל ספק כדי שהוא יופיע כאן.",
  },
  {
    q: "האם השירותים בתשלום?",
    a: "חלק מהשירותים הם בתשלום ישיר (כמו תעודות Funded Award או ייעוץ רואה חשבון), וחלקם הטבות חינמיות שניתנות ללקוחות PAYLESS (כמו קופון $50 ב-Interactive Brokers או ייעוץ ראשוני ב-AC Holding). כל שירות מסומן בבירור עם תג מחיר או הטבה.",
  },
  {
    q: "איך מקבלים את ההטבות הבלעדיות של PAYLESS?",
    a: "בכל עמוד שירות יש קישור הפניה ייעודי או קוד קופון בלעדי (למשל PAYLESS להנחה של 10% ב-Funded Award). פשוט נכנסים דרך הקישור או מציינים את הקוד בעת הרכישה, וההטבה נכנסת אוטומטית.",
  },
  {
    q: "האם השירותים מתאימים לסוחרים מתחילים?",
    a: "חלקם כן וחלקם מתאימים יותר לסוחרים מנוסים. תעודות סוחר ממומן מתאימות רק למי שעבר אתגר. השקעות נדל\"ן וייעוץ מס מתאימים לכל מי שמחפש פתרון כולל לניהול הכספים שלו, ללא תלות בניסיון במסחר.",
  },
  {
    q: "האם יש אחריות על השירותים?",
    a: "אנחנו ב-PAYLESS משמשים כמפנים בלבד — האחריות המלאה על השירות ועל איכותו היא של הספק עצמו. עם זאת, אנחנו בודקים כל ספק לפני שהוא נכנס לרשימה, ומלווים את הלקוחות שלנו בכל בעיה שעולה.",
  },
  {
    q: "האם יתווספו עוד שירותים בעתיד?",
    a: "כן. אנחנו כל הזמן בודקים שירותים חדשים שיכולים לעזור לסוחרים ולמשקיעים בישראל. אם יש שירות שאתם מחפשים ולא מצאתם — אתם מוזמנים ליצור איתנו קשר וננסה להוסיף אותו.",
  },
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

export default function Services() {
  const [priceFilter, setPriceFilter] = useState<"הכל" | "הטבה" | "בתשלום">("הכל");
  const filtered = services.filter((s) => priceFilter === "הכל" || s.pricing === priceFilter);

  return (
    <>
      <Seo
        title="שירותים נוספים לסוחרים - PAYLESS | תעודות, נדל״ם וברוקרים"
        description="שירותים נוספים לסוחרים: תעודות Funded Award לסוחרים ממומנים, השקעות נדל״ן AC Holding באיחוד האמירויות, ופתיחת חשבון Interactive Brokers."
      />
      <PageHero
        eyebrow="Premium Services"
        title="שירותים נוספים"
        highlight="לסוחרים"
        subtitle="תעודות, השקעות נדל״ן וברוקרים בינלאומיים — הזדמנויות בלעדיות שנבדקו אישית עבור קהילת PAYLESS"
      />

      <section className="container relative pb-10">
        {/* price filter */}
        <Reveal className="mb-8 flex items-center justify-center gap-2.5">
          <span className="text-sm font-bold text-muted-foreground">מחיר:</span>
          {(["הכל", "הטבה", "בתשלום"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriceFilter(p)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                priceFilter === p ? "bg-gradient-gold text-navy-950 shadow-glow-gold" : "glass-bright text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
          <span className="text-xs text-muted-foreground">
            מציג {filtered.length} מתוך {services.length} שירותים
          </span>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06} className="h-full">
              <Link to={`/services/${s.id}`} aria-label={`עבור לעמוד ${s.name}`} className="block h-full">
                <GlassCard className="group flex h-full flex-col p-7">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05] p-2.5">
                      <img src={s.logo} alt={`${s.name} לוגו`} loading="lazy" className="max-h-full max-w-full object-contain" />
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge tone="muted">{s.category}</Badge>
                      <Badge tone={s.pricing === "הטבה" ? "cyan" : "gold"}>{s.pricing}</Badge>
                    </div>
                  </div>
                  <h3 className="text-xl font-extrabold transition-colors group-hover:text-secondary">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-foreground/85">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors group-hover:text-secondary">
                    קראו עוד על {s.name} ←
                  </span>
                </GlassCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* why payless */}
      <section className="container relative py-16">
        <SectionHeading eyebrow="למה PAYLESS" title="למה לבחור את השירותים" highlight="שאנחנו ממליצים עליהם" />
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          {whyParagraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <GlassCard className="h-full p-6">
                <p className="leading-relaxed text-foreground/85">{p}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* service types */}
      <section className="container relative py-12">
        <SectionHeading
          title="סוגי השירותים"
          highlight="שאנחנו מציעים"
          subtitle="הסבר מפורט על ארבע הקטגוריות המרכזיות של השירותים הנוספים בעמוד."
        />
        <div className="mx-auto max-w-4xl space-y-5">
          {serviceTypes.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.05}>
              <GlassCard className="p-7">
                <h3 className="mb-3 text-lg font-extrabold text-gradient-gold">{t.title}</h3>
                <p className="leading-relaxed text-foreground/85">{t.body}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* how to choose */}
      <section className="container relative py-12">
        <SectionHeading title="איך לבחור את השירות" highlight="המתאים לכם" />
        <div className="mx-auto max-w-4xl space-y-4">
          {howToChoose.map((p, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className="leading-relaxed text-muted-foreground">{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container relative py-12">
        <SectionHeading
          title="שאלות נפוצות"
          highlight="על השירותים הנוספים"
          subtitle="כל מה שרציתם לדעת על השירותים שאנחנו ממליצים עליהם — מהטבות וקופונים ועד אחריות ותמיכה"
        />
        <div className="mx-auto max-w-3xl space-y-3">
          {servicesFaq.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
      </section>

      {/* help CTA */}
      <section className="container relative py-14">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-black md:text-3xl">
            <span className="text-gradient-ice">צריך עזרה</span>{" "}
            <span className="text-gradient-gold">בבחירה?</span>
          </h2>
          <p className="mt-3 text-muted-foreground">צוות PAYLESS כאן כדי לעזור לך למצוא את השירות המתאים ביותר</p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <GhostButton to="/contact">צור קשר</GhostButton>
            <GhostButton to="/tools">כלי עזר</GhostButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
