import { Scale, MousePointerClick, ClipboardCheck, Rocket, CheckCircle2 } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { SectionHeading, GlassCard, Reveal, GoldButton, VideoCard } from "@/components/ui/primitives";

const steps = [
  {
    Icon: Scale,
    title: "השוואה",
    text: "השוו בין חברות המימון השונות וצפו בכל הפרטים - תנאים, עמלות ומגבלות",
  },
  {
    Icon: MousePointerClick,
    title: "בחירת חברה",
    text: "בחרו את חברת המימון המתאימה ביותר לצרכים שלכם ולסגנון המסחר שלכם",
  },
  {
    Icon: ClipboardCheck,
    title: "מבחן",
    text: "עברו את מבחן המימון של החברה שבחרתם - כל חברה יש לה קריטריונים ומבחנים שונים",
  },
  {
    Icon: Rocket,
    title: "התחלת מסחר",
    text: "לאחר מעבר המבחן תקבלו גישה להון המסחר ותוכלו להתחיל לסחור ולהרוויח",
  },
];

const benefits = [
  "גישה להון גדול יותר מההון האישי",
  "מגבלת הפסד מוגדרת מראש - אין חוב אישי",
  "פוטנציאל לרווחים גבוהים יותר",
  "לא נדרש הון התחלתי גדול",
  "תמיכה וכלים מקצועיים מהחברה",
];

export default function HowItWorks() {
  return (
    <>
      <Seo
        title="איך זה עובד? - PAYLESS | המדריך המלא למציאת חברת מימון למסחר"
        description="המדריך המלא לשימוש בפלטפורמת PAYLESS - איך להשוות בין חברות מימון, איך לבחור את החברה המתאימה, תהליך המבחן והתחלת מסחר בחוזים עתידיים"
      />
      <PageHero
        eyebrow="המדריך המלא"
        title="איך זה"
        highlight="עובד?"
        subtitle="המדריך המלא לשימוש בפלטפורמת PAYLESS ומציאת חברת המימון המושלמת"
      />

      {/* steps timeline */}
      <section className="container relative pb-8">
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute right-[27px] top-8 bottom-8 hidden w-px bg-gradient-to-b from-secondary/60 via-primary/40 to-transparent md:block" />
          <div className="space-y-6">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="flex items-stretch gap-6">
                  <div className="relative hidden shrink-0 md:block">
                    <span className="sticky top-32 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold text-xl font-black text-navy-950 shadow-glow-gold">
                      {i + 1}
                    </span>
                  </div>
                  <GlassCard className="flex flex-1 items-center gap-5 p-6 md:p-7">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                      <s.Icon className="h-7 w-7 text-primary" />
                    </span>
                    <div>
                      <h3 className="text-xl font-extrabold">
                        <span className="md:hidden text-gradient-gold">{i + 1}. </span>
                        {s.title}
                      </h3>
                      <p className="mt-1.5 leading-relaxed text-muted-foreground">{s.text}</p>
                    </div>
                  </GlassCard>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* site walkthrough video */}
      <section className="container relative py-16">
        <SectionHeading
          eyebrow="סקירת האתר"
          title="סקירת אתר"
          highlight="PAYLESS"
          subtitle="סקירה מלאה של אתר PAYLESS - איך למצוא את חברת המימון המושלמת עבורכם"
        />
        <Reveal className="mx-auto max-w-3xl">
          <VideoCard videoId="o2xXszJcTwM" title="סקירת אתר PAYLESS" />
        </Reveal>
      </section>

      {/* what is a prop firm */}
      <section className="container relative py-12">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <Reveal>
            <GlassCard className="h-full p-8">
              <h2 className="mb-4 text-2xl font-extrabold text-gradient-gold">
                מה זה חברת מימון?
              </h2>
              <div className="space-y-3 leading-relaxed text-foreground/85">
                <p>
                  חברת מימון למסחר בחוזים עתידיים היא חברה המספקת הון למסחר לסוחרים מוכשרים
                  תמורת חלק מהרווחים.
                </p>
                <p>
                  במקום להשקיע הון אישי גדול, הסוחר מקבל גישה להון של החברה ומחלק איתה את
                  הרווחים לפי אחוזים מוגדרים מראש.
                </p>
                <p>זה מאפשר לסוחרים לקבל חשיפה גדולה יותר לשוק ללא סיכון אישי גבוה.</p>
              </div>
            </GlassCard>
          </Reveal>
          <Reveal delay={0.08}>
            <GlassCard className="h-full p-8">
              <h2 className="mb-4 text-2xl font-extrabold text-gradient-cyan">
                היתרונות של מימון חיצוני
              </h2>
              <ul className="space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 leading-relaxed text-foreground/85">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-secondary" />
                    {b}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="container relative py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black">
            <span className="text-gradient-ice">מוכנים</span>{" "}
            <span className="text-gradient-gold">להתחיל?</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            השוו בין חברות המימון השונות ומצאו את האופציה המתאימה ביותר לכם
          </p>
          <div className="mt-8">
            <GoldButton to="/companies" size="lg">
              התחלת השוואה
            </GoldButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
