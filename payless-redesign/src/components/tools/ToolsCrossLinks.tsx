import { Link } from "react-router-dom";
import { ArrowRight, Calculator, CalendarDays, ListChecks, Sparkles } from "lucide-react";
import { GlassCard, Reveal, SectionHeading } from "@/components/ui/primitives";

const links = [
  { to: "/tools/consistency-calculator", icon: Calculator, title: "מחשבון עקביות", desc: "חישוב כללי עקביות לכל המסלולים" },
  { to: "/tools/match", icon: Sparkles, title: "חידון התאמה", desc: "מצא את חברת המימון שמתאימה לך" },
  { to: "/glossary", icon: ListChecks, title: "מילון מושגים", desc: "מונחי מסחר ומימון מוסברים" },
  { to: "/tools/news-tracker", icon: CalendarDays, title: "לוח אירועים", desc: "אירועים כלכליים בזמן אמת" },
];

/*
  "כלים נוספים" cross-links strip shared by the calculator pages.
  Copy ported from the original RiskCalculator chunk.
*/
export default function ToolsCrossLinks({ exclude }: { exclude?: string }) {
  return (
    <section className="container relative py-16">
      <SectionHeading title="כלים" highlight="נוספים" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links
          .filter((l) => l.to !== exclude)
          .map((l, i) => (
            <Reveal key={l.to} delay={i * 0.05}>
              <Link to={l.to} className="block h-full">
                <GlassCard className="flex h-full flex-col items-center gap-2 p-6 text-center transition-all hover:border-primary/40">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <l.icon className="h-5 w-5" />
                  </span>
                  <span className="font-bold">{l.title}</span>
                  <span className="text-xs text-muted-foreground">{l.desc}</span>
                </GlassCard>
              </Link>
            </Reveal>
          ))}
      </div>
      <Reveal className="mt-8 text-center">
        <Link
          to="/tools"
          className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-secondary"
        >
          <ArrowRight className="h-4 w-4" />
          חזרה לכל הכלים
        </Link>
      </Reveal>
    </section>
  );
}
