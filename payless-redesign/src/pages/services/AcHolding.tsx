import { useEffect, useState } from "react";
import { Building2, TrendingUp, Handshake, Languages, ChevronDown, ExternalLink, Snowflake, Waves, Star, Sparkles, PhoneCall, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { SectionHeading, GlassCard, Reveal, GoldButton, GhostButton, Badge, CountUp } from "@/components/ui/primitives";
import acLogo from "@/assets/logos/ac-holding-logo.png";
import makoImg from "@/assets/products/mako-dubai.png";

const SUPABASE_URL = "https://bkrtldtwnrlduzjmwsgt.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcnRsZHR3bnJsZHV6am13c2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNjg0MDEsImV4cCI6MjA3NDg0NDQwMX0.GCmjkeDspkteZWnUoAuPUW2cvytcl4wiSJGTFeuaiMg";

const whyItems = [
  { Icon: Building2, title: "פרויקטים בדובאי ובראס אל-חיימה", text: "השקעות בנכסים נבחרים באזורים המבוקשים ביותר, כולל אזור הקזינו החדש של RAK המרכז כיום השקעות ענק ממשלתיות וצמיחה דמוגרפית מואצת." },
  { Icon: TrendingUp, title: "תשואות אטרקטיביות", text: "מודלי השקעה מגוונים עם פוטנציאל תשואה והשבחה משמעותי, המבוססים על איתור מוקדם של אזורים בצמיחה." },
  { Icon: Handshake, title: "שותפות ברווחים", text: "רכישה בכמויות גדולות (Bulk Allocations) ופריסות תשלום של 0% ריבית." },
  { Icon: Languages, title: "ליווי בעברית מקצה לקצה", text: "צוות מקצועי דובר עברית המלווה אתכם משלב איתור הנכס, דרך הליווי המשפטי ועד לניהול הנכס בפועל." },
];

const iceBeach = [
  { Icon: Snowflake, title: "אדריכלות Ice Crystal", text: "עיצוב השואב השראה מתצורות קרח וגבישים בטבע, עם לוחות זכוכית פרימיום מהרצפה ועד התקרה." },
  { Icon: Waves, title: "מעל 60 מתקני ריזורט", text: "בריכת אינפיניטי על גשר שמיים, קאבנות קרח פרטיות, וטרקלין קרח וקוויאר בלעדי." },
  { Icon: Star, title: "התאמה מלאה למשקיע הישראלי", text: "חבילת ריהוט יוקרתית מלאה, ליווי 'ויזה מוזהבת', ומערכות שבת חכמות (מעליות שבת) מובנות." },
  { Icon: Sparkles, title: "האפקט של WYNN", text: "ממוקם ב-Marjan Beach, עם צפי תשואה פוטנציאלי של 35-50% על ההון הודות לקרבה למתחם הקזינו." },
];

const faq = [
  { q: "מה זה AC Holding?", a: 'חברת השקעות נדל"ן גלובלית המתמחה בנכסים יוקרתיים באמירויות, עם שירות אישי בעברית למשקיעים ישראלים.' },
  { q: "למה להשקיע בדובאי?", a: 'תשואות שנתיות מהגבוהות בעולם (7%-12%), אפס מס הכנסה על רווחי נדל"ן והשכרה, עיר בינלאומית חזקה ומתפתחת בקצב מסחרר, ומערכת רגולציה מתקדמת, ברורה ובטוחה.' },
  { q: "האם יש מיסים על הרווחים?", a: 'לא. בדובאי אין מס על הכנסות משכירות או רווחי נדל"ן.' },
  { q: "מה סכום ההשקעה המינימלי?", a: "סכומי ההשקעה משתנים בהתאם לפרויקט ולאפיק. צרו קשר לקבלת פרטים מלאים על האפשרויות הזמינות." },
  { q: "האם ההשקעה חוקית לישראלים?", a: "כן, ההשקעה חוקית לחלוטין ומלווה ביועצים מקצועיים בתחום המס והמשפט הבינלאומי." },
  { q: "איך מנהלים נכס מרחוק?", a: "חברות ניהול מקומיות מטפלות בכל ההיבטים - שיווק, חוזים, תחזוקה והשכרה, עם מעקב אונליין מלא דרך פלטפורמות דיגיטליות." },
  { q: "איך מתבצע רישום הנכס?", a: "לאחר הרכישה, מונפק לכם 'Title Deed' - מסמך טאבו רשמי של ממשלת דובאי המעיד על בעלותכם בנכס." },
  { q: "למה להשכיר לטווח ארוך?", a: "הכנסה יציבה וביקוש קבוע מצד תושבים ואנשי עסקים המחפשים מגורים איכותיים בדובאי." },
  { q: "למה להשכיר לטווח קצר?", a: "רווחיות גבוהה במיוחד באזורים תיירותיים באמצעות פלטפורמות כמו Airbnb ו-Booking." },
  { q: "מהו חשבון נאמנות (Escrow)?", a: "חשבון מפוקח על ידי הרגולטור בו מוחזקים כספי הרוכשים עד להשלמת שלבי הפרויקט, להגנה מלאה על המשקיע." },
  { q: "איך מעבירים כסף לדובאי?", a: "אנו עובדים עם חברות העברה בטוחות כמו Covercy לשירות מהיר, מקצועי ובטוח." },
  { q: "איך מתחילים?", a: "ממלאים טופס יצירת קשר, ונציג מהחברה יחזור אליכם לשיחת ייעוץ ראשונית ללא עלות." },
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

/* live USD→ILS purchasing-power widget, same data source as the original */
function CurrencyPower() {
  const [ils, setIls] = useState<number | null>(null);
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((d) => setIls(d?.rates?.ILS ?? null))
      .catch(() => setIls(null));
  }, []);
  return (
    <GlassCard className="p-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-sm font-bold">
          מדד כוח הקנייה - <span className="text-secondary">זמן אמת</span>
        </span>
        {ils && (
          <span className="mr-auto rounded-lg bg-white/[0.05] px-2.5 py-1 text-xs font-black text-primary" dir="ltr">
            $1 = ₪{ils.toFixed(2)}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        הדירהם האמירתי (AED) צמוד לדולר. יחסי ההמרה הנוכחיים מעניקים למשקיע הישראלי כוח
        קנייה חזק יותר, ומהווים הלכה למעשה{" "}
        <span className="font-bold text-secondary">הנחת מטבע</span> ברכישת נכסי יוקרה.
        בנוסף, הנכס מגן על הונך כגידור צמוד-דולר.
      </p>
    </GlassCard>
  );
}

function LeadForm() {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "" });
  const [marketing, setMarketing] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim()) return alert("נא להזין שם פרטי");
    if (!form.lastName.trim()) return alert("נא להזין שם משפחה");
    if (!/^0?5\d[-\s]?\d{7}$|^\+?\d{9,15}$/.test(form.phone)) return alert("מספר טלפון לא תקין");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return alert("כתובת מייל לא תקינה");
    setStatus("loading");
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-ac-holding-lead`, {
        method: "POST",
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, marketingConsent: marketing, source: "פנייה מאתר PAYLESS - שלומי בוזגלו" }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done")
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-emerald-500/10 px-6 py-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        <div className="text-lg font-extrabold text-emerald-400">נשלח בהצלחה</div>
        <p className="text-sm text-muted-foreground">פרטיך הועברו לצוות AC HOLDING. ניצור איתך קשר בהקדם.</p>
      </div>
    );

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-navy-950/60 px-4 py-3 font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-secondary/60";

  return (
    <form onSubmit={submit} className="space-y-3.5">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <input className={inputCls} placeholder="שם פרטי" value={form.firstName} onChange={set("firstName")} />
        <input className={inputCls} placeholder="שם משפחה" value={form.lastName} onChange={set("lastName")} />
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <input className={inputCls} dir="ltr" type="tel" placeholder="נייד" value={form.phone} onChange={set("phone")} />
        <input className={inputCls} dir="ltr" type="email" placeholder="כתובת מייל" value={form.email} onChange={set("email")} />
      </div>
      <label className="flex items-start gap-2.5 text-xs text-muted-foreground">
        <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[hsl(43,65%,58%)]" />
        אני נותן/ת הסכמה לקבלת מידע ותקשורת שיווקית במייל ובנייד
      </label>
      {status === "error" && (
        <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400">
          אירעה תקלה. נסו שוב בעוד רגע או פנו אלינו ישירות.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold px-7 py-3.5 font-bold text-navy-950 transition-all hover:shadow-glow-gold disabled:opacity-60"
      >
        {status === "loading" ? (<><Loader2 className="h-5 w-5 animate-spin" /> שולח...</>) : "שלח פרטים"}
      </button>
      <p className="text-center text-xs text-muted-foreground/70">פרטיך מאובטחים ולא יועברו לצד שלישי</p>
    </form>
  );
}

export default function AcHolding() {
  return (
    <>
      <Seo
        title="AC Holding - Luxury Real Estate באיחוד האמירויות | PAYLESS"
        description='השקעות נדל"ן יוקרה בדובאי ובראס אל-חיימה עם AC Holding — ליווי בעברית, ייעוץ ראשוני ללא עלות והטבות בלעדיות לקהילת PAYLESS.'
      />
      <PageHero
        eyebrow="הטבת PAYLESS — ייעוץ ראשוני ללא עלות לחברי הקהילה"
        title="השקעות נדל״ן יוקרה"
        highlight="באיחוד האמירויות"
        subtitle="שיחת ייעוץ אישית ואבחון צרכים השקעתיים - ללא התחייבות."
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <GoldButton href="https://wa.me/972557295593?text=%D7%94%D7%99%D7%99%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%93%D7%A8%D7%9A%20%D7%90%D7%AA%D7%A8%20PAYLESS%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A7%D7%91%D7%9C%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%A9%D7%A7%D7%A2%D7%95%D7%AA%20%D7%A0%D7%93%D7%9C%22%D7%9F" size="lg">
            <PhoneCall className="h-5 w-5" />
            קבע שיחה
          </GoldButton>
          <img src={acLogo} alt="AC Holding" className="h-14 w-auto opacity-90" />
        </div>
      </PageHero>

      {/* success story */}
      <section className="container relative pb-10">
        <SectionHeading
          eyebrow="סיפור הצלחה אמיתי"
          title="רכישה במרץ 2025."
          highlight="רווח של 601,000 AED בשנה."
          subtitle="נדל&quot;ן יוקרה באיחוד האמירויות — תוצאות בפועל של לקוח שרכש דרכנו דירת חדר במרכז ראס אל-ח'יימה."
        />
        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
          <Reveal>
            <GlassCard className="p-6 text-center">
              <div className="text-2xl font-black text-foreground" dir="ltr">
                <CountUp value={2243828} suffix=" AED" />
              </div>
              <div className="mt-1 text-sm font-bold">מחיר רכישה</div>
              <div className="text-xs text-muted-foreground">מרץ 2025 · לפי החוזה הרשמי</div>
            </GlassCard>
          </Reveal>
          <Reveal delay={0.07}>
            <GlassCard className="p-6 text-center">
              <div className="text-2xl font-black text-gradient-cyan" dir="ltr">
                <CountUp value={2844828} suffix=" AED" />
              </div>
              <div className="mt-1 text-sm font-bold">שווי נוכחי</div>
              <div className="text-xs text-muted-foreground">הערכה 2026 · לפי דוח שווי רשמי</div>
            </GlassCard>
          </Reveal>
          <Reveal delay={0.14}>
            <GlassCard glow className="p-6 text-center">
              <div className="text-2xl font-black text-gradient-gold" dir="ltr">
                +<CountUp value={601000} suffix=" AED" />
              </div>
              <div className="mt-1 text-sm font-bold">רווח בשנה אחת</div>
              <div className="text-xs text-muted-foreground">הפרש בין מחיר הרכישה לשווי הנוכחי · 12 חודשים</div>
            </GlassCard>
          </Reveal>
        </div>
        <Reveal className="mx-auto mt-5 max-w-4xl">
          <div className="grid gap-5 md:grid-cols-2">
            <CurrencyPower />
            <GlassCard className="p-6">
              <div className="mb-2 flex items-center gap-2">
                <Badge tone="gold">יתרון מס משמעותי</Badge>
              </div>
              <div className="text-sm font-bold">מס על הרווח</div>
              <div className="my-2 text-4xl font-black text-gradient-gold" dir="ltr">0%</div>
              <p className="text-sm text-muted-foreground">100% מהרווח נשאר אצלך.</p>
            </GlassCard>
          </div>
        </Reveal>
      </section>

      {/* mako feature */}
      <section className="container relative py-12">
        <SectionHeading eyebrow="כפי שנראה בתקשורת" title="חשיפה —" highlight="הנסיכות שכבשו את דובאי" />
        <Reveal className="mx-auto max-w-3xl">
          <a
            href="https://www.mako.co.il/mako-vod-keshet/exposure-s6/VOD-74b628c5834dd91026.htm"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="צפו בכתבה 'הנסיכות שכבשו את דובאי' באתר מאקו"
            className="group block overflow-hidden rounded-2xl glass"
          >
            <div className="relative aspect-video overflow-hidden">
              <img src={makoImg} alt="חשיפה - הנסיכות שכבשו את דובאי" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" />
              <span className="absolute bottom-4 right-4 text-sm font-bold text-white/90">מאקו · קשת 12 · חשיפה</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-extrabold">הנסיכות שכבשו את דובאי</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                הן הגיעו לדובאי כדי לעשות קצת כסף וגילו שהן יכולות לעשות ארגזים של כסף. הכירו
                את הישראליות שחושפות את השיטה לעשות כסף בדובאי — כולל הסיפור של אביטל.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors group-hover:text-secondary">
                צפו בכתבה במאקו <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </div>
          </a>
        </Reveal>
      </section>

      {/* why invest with */}
      <section className="container relative py-12">
        <SectionHeading title="למה להשקיע עם" highlight="AC Holding" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.07} className="h-full">
              <GlassCard className="flex h-full flex-col p-6">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <w.Icon className="h-6 w-6 text-primary" />
                </span>
                <h3 className="mb-2 font-extrabold">{w.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{w.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ICE BEACH flagship */}
      <section className="container relative py-12">
        <SectionHeading
          eyebrow="הזדמנות אסטרטגית"
          title="פרויקט הדגל —"
          highlight="ICE BEACH"
          subtitle="חוויית ריזורט 5 כוכבים, 3 דקות בלבד מאתר הנופש WYNN והקזינו. הזדמנות ההשקעה המדוברת ביותר בראס אל-ח'ימה."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {iceBeach.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.07} className="h-full">
              <GlassCard className="flex h-full flex-col p-6">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                  <w.Icon className="h-6 w-6 text-secondary" />
                </span>
                <h3 className="mb-2 font-extrabold">{w.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{w.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-8 max-w-3xl text-center">
          <p className="leading-relaxed text-muted-foreground">
            אנו גאים להוביל השקעות באחד ממיזמי הדגל של חברת Pantheon Development, בלב אזור
            הבילויים והתיירות העתידי של ראס אל-חיימה. השילוב האידיאלי של מיקום מנצח
            ופוטנציאל צמיחה חסר תקדים.
          </p>
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

      {/* lead form */}
      <section className="container relative py-14">
        <Reveal>
          <GlassCard glow className="mx-auto max-w-2xl p-8 md:p-10">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black md:text-3xl">
                <span className="text-gradient-ice">מוכן</span>{" "}
                <span className="text-gradient-gold">להתחיל להשקיע?</span>
              </h2>
              <p className="mt-2 text-muted-foreground">צוות AC Holding ישמח להציג בפניך את האפשרויות — השאירו פרטים</p>
            </div>
            <LeadForm />
          </GlassCard>
        </Reveal>
        <div className="mt-8 text-center">
          <GhostButton to="/services">חזור לשירותים נוספים</GhostButton>
        </div>
      </section>
    </>
  );
}
