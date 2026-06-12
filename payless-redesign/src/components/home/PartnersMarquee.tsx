import { Link } from "react-router-dom";
import { Marquee, Reveal } from "@/components/ui/primitives";
import { companies } from "@/data/companies";

import tradingviewLogo from "@/assets/logos/tradingview-logo-hero.png";
import tradezellaLogo from "@/assets/logos/tradezella-logo.png";
import tradesyncerLogo from "@/assets/logos/tradesyncer-logo-3d.webp";
import replikantoLogo from "@/assets/logos/replikanto-logo-nobg.png";
import acHoldingLogo from "@/assets/logos/ac-holding-logo.png";
import interactiveLogo from "@/assets/logos/interactive-israel-logo.png";

const extraPartners = [
  { name: "TradingView", logo: tradingviewLogo, href: "/tools/tradingview" },
  { name: "TradeZella", logo: tradezellaLogo, href: "/tools/tradezella" },
  { name: "TradeSyncer", logo: tradesyncerLogo, href: "/tools/tradesyncer" },
  { name: "Replikanto", logo: replikantoLogo, href: "/tools/replikanto" },
  { name: "AC Holding", logo: acHoldingLogo, href: "/services/ac-holding" },
  { name: "Interactive Brokers", logo: interactiveLogo, href: "/services/interactive-brokers" },
];

export default function PartnersMarquee() {
  const items = [
    ...companies.map((c) => ({ name: c.name, logo: c.logo, href: `/company/${c.id}`, invert: c.invertLogo })),
    ...extraPartners.map((p) => ({ ...p, invert: false })),
  ];

  return (
    <section className="relative py-14">
      <Reveal className="container mb-8 text-center">
        <h2 className="text-lg font-bold text-foreground/90">מגוון שותפים שתומכים בנו</h2>
        <p className="mt-1 text-sm text-muted-foreground">לחצו על שותף למידע נוסף</p>
      </Reveal>
      <Marquee speed="slow">
        {items.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            title={item.name}
            className="group flex h-20 w-36 shrink-0 items-center justify-center rounded-2xl glass px-5 transition-all duration-300 hover:border-secondary/40 hover:shadow-glow-gold"
          >
            <img
              src={item.logo}
              alt={item.name}
              loading="lazy"
              className={`max-h-12 max-w-full object-contain opacity-75 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 ${item.invert ? "invert" : ""}`}
            />
          </Link>
        ))}
      </Marquee>
    </section>
  );
}
