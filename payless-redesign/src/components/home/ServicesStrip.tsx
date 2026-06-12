import { Link } from "react-router-dom";
import { Building2, Award, LineChart } from "lucide-react";
import { SectionHeading, GlassCard, Reveal, ArrowLink } from "@/components/ui/primitives";

import acHoldingLogo from "@/assets/logos/ac-holding-logo.png";
import fundedAwardLogo from "@/assets/logos/funded-award-hero-logo.png";
import interactiveLogo from "@/assets/logos/interactive-israel-logo.png";

const services = [
  {
    href: "/services/ac-holding",
    logo: acHoldingLogo,
    Icon: Building2,
    title: "השקעות נדל\"ן יוקרה — AC Holding",
    text: "חברת השקעות נדל\"ן יוקרתית עבור סוחרים שמעוניינים להשקיע את הרווחים בנדל\"ן. ייעוץ פרטי ושיחת ייעוץ ללא עלות",
    cta: "קראו על AC Holding",
  },
  {
    href: "/services/funded-award",
    logo: fundedAwardLogo,
    Icon: Award,
    title: "תעודות אקריליק לסוחרים ממומנים — Funded Award",
    text: "תעודות פרימיום חתוכות לייזר המנציחות הישגי מסחר, עם 10% הנחה בקוד PAYLESS",
    cta: "קראו על Funded Award",
  },
  {
    href: "/services/interactive-brokers",
    logo: interactiveLogo,
    Icon: LineChart,
    title: "פתיחת חשבון Interactive Brokers בעברית",
    text: "אינטראקטיב ישראל — נציגות IBKR מורשית, ליווי בעברית וקופון $50 ללקוחות חדשים",
    cta: "קראו על Interactive Brokers",
  },
];

export default function ServicesStrip() {
  return (
    <section className="container relative py-20">
      <SectionHeading
        eyebrow="שירותים נוספים לסוחרים"
        title="שירותים משלימים"
        highlight="נבחרים"
        subtitle="מעבר לחברות מימון וכלי עזר — הזדמנויות בלעדיות שאספנו עבורכם"
      />
      <div className="grid gap-6 md:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.href} delay={i * 0.08} className="h-full">
            <Link to={s.href} className="block h-full">
              <GlassCard className="group flex h-full flex-col p-7">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05] p-2.5">
                    <img src={s.logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                  </div>
                  <s.Icon className="h-6 w-6 text-primary/50 transition-colors group-hover:text-secondary" />
                </div>
                <h3 className="mb-2 text-lg font-extrabold leading-snug">{s.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors group-hover:text-secondary">
                  {s.cta} ←
                </span>
              </GlassCard>
            </Link>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 text-center">
        <ArrowLink to="/services" className="text-lg">
          לכל השירותים הנוספים
        </ArrowLink>
      </Reveal>
    </section>
  );
}
