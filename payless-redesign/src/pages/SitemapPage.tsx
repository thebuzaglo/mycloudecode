import { Link } from "react-router-dom";
import { Home, Building2, Flame, Wrench, Briefcase, BookOpen, Newspaper, Info, FileText } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { GlassCard, Reveal } from "@/components/ui/primitives";
import { companies } from "@/data/companies";

const groups = [
  {
    Icon: Home,
    title: "ראשי",
    links: [
      { href: "/", label: "עמוד הבית" },
      { href: "/about", label: "אודותינו" },
      { href: "/how-it-works", label: "איך זה עובד" },
      { href: "/faq", label: "שאלות נפוצות" },
      { href: "/contact", label: "צור קשר" },
    ],
  },
  {
    Icon: Building2,
    title: "חברות מימון",
    links: [
      { href: "/companies", label: "השוואת כל החברות" },
      ...companies.map((c) => ({ href: `/company/${c.id}`, label: c.name })),
    ],
  },
  {
    Icon: Flame,
    title: "מבצעים",
    links: [{ href: "/offers", label: "מבצעים והנחות בלעדיות" }],
  },
  {
    Icon: Wrench,
    title: "כלי עזר",
    links: [
      { href: "/tools", label: "כל הכלים" },
      { href: "/tools/consistency-calculator", label: "מחשבון עקביות" },
      { href: "/tools/risk-calculator", label: "מחשבון ניהול סיכונים" },
      { href: "/tools/match", label: "חידון התאמה" },
      { href: "/tools/certificate-generator", label: "מחולל תעודות" },
      { href: "/tools/news-tracker", label: "מעקב חדשות כלכליות" },
      { href: "/tools/tradingview", label: "TradingView" },
      { href: "/tools/tradezella", label: "TradeZella" },
      { href: "/tools/tradesyncer", label: "TradeSyncer" },
      { href: "/tools/replikanto", label: "Replikanto" },
    ],
  },
  {
    Icon: Briefcase,
    title: "שירותים נוספים",
    links: [
      { href: "/services", label: "כל השירותים" },
      { href: "/services/funded-award", label: "Funded Award — תעודות לסוחרים" },
      { href: "/services/ac-holding", label: "AC Holding — השקעות נדל״ן" },
      { href: "/services/interactive-brokers", label: "Interactive Brokers" },
      { href: "/services/aslan-cpa", label: "עידן אסלן — רואה חשבון" },
    ],
  },
  {
    Icon: BookOpen,
    title: "ידע ולמידה",
    links: [
      { href: "/glossary", label: "ספריית מושגים" },
      { href: "/blog", label: "בלוג" },
    ],
  },
  {
    Icon: FileText,
    title: "מסמכים משפטיים",
    links: [
      { href: "/terms", label: "תנאי שימוש" },
      { href: "/privacy", label: "מדיניות פרטיות" },
      { href: "/accessibility", label: "הצהרת נגישות" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <Seo
        title="מפת האתר - PAYLESS"
        description="מפת האתר של PAYLESS — כל העמודים, הכלים והשירותים במקום אחד"
      />
      <PageHero eyebrow="ניווט מהיר" title="מפת" highlight="האתר" compact />

      <section className="container relative pb-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.05} className="h-full">
              <GlassCard className="h-full p-6">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10">
                    <g.Icon className="h-4.5 w-4.5 text-secondary" />
                  </span>
                  <h2 className="font-extrabold">{g.title}</h2>
                </div>
                <ul className="space-y-2">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        to={l.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-secondary"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
