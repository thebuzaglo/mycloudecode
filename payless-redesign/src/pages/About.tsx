import { Scale, Monitor, Wrench, BadgePercent, Youtube, Mail, MessageCircle, Instagram, Facebook } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { SectionHeading, GlassCard, Reveal, GoldButton, GhostButton } from "@/components/ui/primitives";
import { socials } from "@/data/site";

const ourServices = [
  {
    Icon: Scale,
    title: "השוואת Prop Firms",
    text: "השוואה מקיפה של חברות המימון המובילות - תנאי מסחר, עמלות, מגבלות ותמיכה בחוזים עתידיים.",
  },
  {
    Icon: Monitor,
    title: "פלטפורמות מסחר",
    text: "מידע מפורט על כל הפלטפורמות הנתמכות - NinjaTrader, TradingView, Tradovate, Quantower ועוד.",
  },
  {
    Icon: Wrench,
    title: "כלי עזר למסחר",
    text: "סקירת יומני מסחר, כלי קופי טריידינג, מערכות ניתוח ואינדיקטורים שישדרגו את המסחר שלכם.",
  },
  {
    Icon: BadgePercent,
    title: "קודי הנחה",
    text: "קודי פרומו בלעדיים והנחות מיוחדות לחברי הקהילה שלנו בחברות המימון השונות.",
  },
];

const founderAge = (() => {
  const birth = new Date(1996, 6, 8);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
})();

const founderLinks = [
  { href: socials.youtube, label: "ערוץ היוטיוב", Icon: Youtube },
  { href: socials.email, label: "שלח מייל", Icon: Mail },
  { href: socials.whatsapp, label: "ווטסאפ", Icon: MessageCircle },
  { href: socials.instagram, label: "אינסטגרם", Icon: Instagram },
  { href: socials.facebook, label: "קבוצת פייסבוק", Icon: Facebook },
];

export default function About() {
  return (
    <>
      <Seo
        title="אודות PAYLESS - השוואת חברות מימון | שלומי בוזגלו"
        description="הכירו את PAYLESS - פלטפורמת ההשוואה המובילה של חברות מימון למסחר בישראל. מידע מקיף על שלומי בוזגלו, המייסד, והשירותים שאנו מספקים"
      />
      <PageHero
        eyebrow="הסיפור שלנו"
        title="אודותינו"
        subtitle="הפלטפורמה המובילה בישראל להשוואת חברות מימון למסחר"
      />

      <section className="container relative pb-6">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <Reveal>
            <GlassCard className="h-full p-8">
              <h2 className="mb-4 text-2xl font-extrabold text-gradient-gold">מי אנחנו</h2>
              <p className="leading-relaxed text-foreground/85">
                PAYLESS היא פלטפורמת השוואות מובילה המתמחה בהשוואה בין חברות מימון למסחר
                (Prop Firms) בדגש על מסחר בחוזים עתידיים (Futures). אנחנו מספקים מידע מקיף,
                השוואות מעמיקות וכלים חכמים שיעזרו לכם לבחור את חברת המימון המתאימה ביותר
                לצרכים שלכם.
              </p>
            </GlassCard>
          </Reveal>
          <Reveal delay={0.08}>
            <GlassCard className="h-full p-8">
              <h2 className="mb-4 text-2xl font-extrabold text-gradient-cyan">המטרה שלנו</h2>
              <p className="leading-relaxed text-foreground/85">
                אנחנו מאמינים שכל טריידר זכאי לשקיפות מלאה ולמידע נגיש בבחירת חברת המימון.
                המטרה שלנו היא לספק השוואה אובייקטיבית ומקצועית של Prop Firms, תנאי המסחר
                שלהן, הפלטפורמות הנתמכות וכלי העזר הזמינים - כדי שתוכלו לקבל החלטות מושכלות
                ולמקסם את הפוטנציאל שלכם בעולם המסחר.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      <section className="container relative py-16">
        <SectionHeading title="השירותים" highlight="שלנו" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ourServices.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07} className="h-full">
              <GlassCard className="flex h-full flex-col items-center p-7 text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold shadow-glow-gold">
                  <s.Icon className="h-7 w-7 text-navy-950" />
                </span>
                <h3 className="mb-2 text-lg font-extrabold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* founder */}
      <section className="container relative py-10">
        <Reveal>
          <GlassCard glow className="relative mx-auto max-w-4xl overflow-hidden p-8 md:p-12">
            <div className="grid-overlay absolute inset-0 opacity-50" />
            <div className="relative">
              <span className="text-sm font-bold uppercase tracking-widest text-secondary">
                בנימה קצת אישית:
              </span>
              <h2 className="mt-2 text-2xl font-black md:text-3xl">
                <span className="text-gradient-ice">שלומי בוזגלו — </span>
                <span className="text-gradient-gold">מייסד PAYLESS</span>
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-foreground/85">
                <p>
                  שמי שלומי בוזגלו, בן {founderAge}, ומייסד פלטפורמת PAYLESS. למדתי באופן
                  מקצועי את עולם המסחר החל משנת 2023 ומאז אני עוסק 100% בתחום חברות המימון
                  והמסחר בחוזים עתידיים. יצרתי את האתר הזה מתוך תשוקה לעזור לסוחרים להשוות
                  ולמצוא את חברת המימון המתאימה להם ביותר, לעזור להם לחסוך בעלויות הרכישה
                  ולספק להם את כל המידע הנדרש לקבלת החלטות נכונות במסע המסחר שלהם.
                </p>
                <p>
                  בעל ניסיון עשיר בתחום ההדרכה והליווי מגיל 16 - בתנועת הצופים, משלחות ושנת
                  שירות, המשך בפיקוד בצבא וניהול אזרחי במחלקת האשראי בישרכארט, שם התקדמתי
                  מרמת נציג למנהל צוות.
                </p>
                <p>
                  כיום אני משלב את הניסיון המקצועי והניהולי שצברתי עם הידע המעמיק בעולם
                  המסחר, כדי לספק לכם מידע אמין, השוואות מקצועיות וליווי בבחירת חברת המימון
                  הנכונה עבורכם.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {founderLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl glass-bright px-4 py-2.5 text-sm font-bold transition-all hover:border-secondary/50 hover:text-secondary hover:-translate-y-0.5"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </section>

      {/* contact CTA */}
      <section className="container relative py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black">
            <span className="text-gradient-ice">רוצים ליצור </span>
            <span className="text-gradient-gold">קשר?</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            יש לכם שאלות? רוצים להתייעץ? אשמח לעזור לכם למצוא את חברת המימון המתאימה ביותר
            עבורכם.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GoldButton to="/companies">השוואת חברות מימון</GoldButton>
            <GhostButton to="/offers">מבצעים והנחות בלעדיות</GhostButton>
            <GhostButton to="/contact">צור קשר עכשיו</GhostButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
