import { Scale, BadgePercent, Wrench, HeadphonesIcon } from "lucide-react";
import { SectionHeading, GlassCard, Reveal } from "@/components/ui/primitives";

const reasons = [
  {
    Icon: Scale,
    title: "השוואה מקצועית ושקופה",
    text: "כל המידע על חברות המימון במקום אחד - מאומת ועדכני יומית כדי שתוכלו לקבל החלטות מושכלות",
    stat: "השוואה מקיפה",
    statSub: "מידע מאומת ועדכני יומית",
  },
  {
    Icon: BadgePercent,
    title: "הנחות ומבצעים בלעדיים",
    text: "קודי הנחה ייחודיים עד 40% שלא תמצאו בשום מקום אחר - חיסכון אמיתי על כל מבחן",
    stat: "עד 50%",
    statSub: "קודי הנחה ומבצעים חמים",
  },
  {
    Icon: Wrench,
    title: "כלי עזר מתקדמים למסחר",
    text: "גישה לטכנולוגיות המובילות בתחום - פלטפורמות, כלי ניתוח ושירותי נתונים ברמה הגבוהה ביותר",
    stat: "כ-10",
    statSub: "טכנולוגיות מסחר מובילות",
  },
  {
    Icon: HeadphonesIcon,
    title: "תמיכה מקצועית ואישית",
    text: "צוות מומחים זמין לכל שאלה - אנחנו כאן כדי לוודא שתבחרו נכון ותצליחו במסע שלכם",
    stat: "תמיכה מקצועית",
    statSub: "ליווי וסיוע לכל שאלה",
  },
];

export default function WhyPayless() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute top-1/3 right-0 h-96 w-96 rounded-full bg-secondary/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/[0.07] blur-[120px]" />

      <div className="container relative">
        <SectionHeading
          eyebrow="למה PAYLESS?"
          title="הדרך החכמה לבחור"
          highlight="חברת מימון"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08} className="h-full">
              <GlassCard className="group flex h-full flex-col items-center p-7 text-center">
                <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
                  <span className="ring-conic absolute inset-0 rounded-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-100 animate-spin-slow" style={{ animationDuration: "14s" }} />
                  <span className="absolute inset-[2px] rounded-2xl bg-navy-900" />
                  <r.Icon className="relative h-7 w-7 text-secondary" />
                </div>
                <div className="text-xl font-black text-gradient-gold">{r.stat}</div>
                <div className="mb-3 text-xs text-muted-foreground">{r.statSub}</div>
                <h3 className="mb-2 text-lg font-extrabold">{r.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{r.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
