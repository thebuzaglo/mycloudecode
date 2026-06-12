import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Building2, Check, Copy, Flame } from "lucide-react";
import { GlassCard, GoldButton, GhostButton, Badge, ArrowLink, Reveal } from "@/components/ui/primitives";
import { activeOffers, companySlugs, companyCategory, type Offer } from "@/data/offers";
import { getCompany } from "@/data/companies";
import { cn } from "@/lib/utils";

import tradesyncerLogo from "@/assets/logos/tradesyncer-logo-3d.webp";
import replikantoLogo from "@/assets/logos/replikanto-logo-nobg.png";
import tradingviewLogo from "@/assets/logos/tradingview-logo-hero.png";
import tradezellaLogo from "@/assets/logos/tradezella-logo.png";
import fundedAwardLogo from "@/assets/logos/funded-award-hero-logo.png";
import interactiveLogo from "@/assets/logos/interactive-israel-logo.png";
import acHoldingLogo from "@/assets/logos/ac-holding-logo.png";

/*
  FeaturedOffers — renders the offers attached to a blog post (featured_offers ids).
  "ALL_OFFERS" → all-offers CTA card; "service-ac-holding" → AC Holding spotlight;
  any other id resolves to a live offer from @/data/offers via the company slug.
*/

const extraLogos: Record<string, string> = {
  tradesyncer: tradesyncerLogo,
  replikanto: replikantoLogo,
  tradingview: tradingviewLogo,
  tradezella: tradezellaLogo,
  "funded-award": fundedAwardLogo,
  "interactive-brokers": interactiveLogo,
  "ac-holding": acHoldingLogo,
};

const slugToCompanyKey = (slug: string) =>
  Object.entries(companySlugs).find(([, s]) => s === slug)?.[0] ?? null;

/* True if at least one of the ids resolves to a renderable card. */
export const hasRenderableOffers = (ids: string[]) =>
  ids.some((id) => {
    if (id === "ALL_OFFERS" || id === "service-ac-holding") return true;
    const companyKey = slugToCompanyKey(id.replace(/^service-/, ""));
    return companyKey !== null && activeOffers.some((o) => o.company === companyKey);
  });

const internalUrl = (companyKey: string, slug: string) => {
  const cat = companyCategory[companyKey];
  if (cat === "prop-firm") return `/company/${slug}`;
  if (cat === "trading-tool") return `/tools/${slug}`;
  return `/services/${slug}`;
};

function CouponBox({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "group/code relative w-full overflow-hidden rounded-xl border-2 border-dashed px-5 py-4 text-right transition-all duration-300",
        copied
          ? "border-emerald-400/80 bg-emerald-400/10"
          : "border-secondary/50 bg-secondary/[0.06] hover:border-secondary hover:bg-secondary/10"
      )}
    >
      <span className="flex items-center justify-between gap-4">
        <span>
          <span
            className={cn(
              "mb-1 flex items-center gap-1.5 text-xs font-semibold",
              copied ? "text-emerald-400" : "text-muted-foreground"
            )}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" /> הקוד הועתק בהצלחה!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> לחץ להעתקת הקוד
              </>
            )}
          </span>
          <span
            dir="ltr"
            className={cn(
              "block text-right font-mono text-xl font-black tracking-widest md:text-2xl",
              copied ? "text-emerald-400" : "text-secondary"
            )}
          >
            {code}
          </span>
        </span>
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors",
            copied ? "bg-emerald-400 text-navy-950" : "bg-secondary/15 text-secondary"
          )}
        >
          {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        </span>
      </span>
    </button>
  );
}

function OfferCard({ offer, slug }: { offer: Offer; slug: string }) {
  const company = getCompany(slug);
  const logo = company?.logo ?? extraLogos[slug];
  const isPropFirm = companyCategory[offer.company] === "prop-firm";
  const infoUrl = internalUrl(offer.company, slug);

  return (
    <GlassCard glow className="flex h-full flex-col gap-5 p-7">
      <div className="flex items-start justify-between gap-3">
        {logo && (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05] p-2.5">
            <img src={logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
          </div>
        )}
        <div className="flex gap-2">
          {offer.isHot && (
            <Badge tone="hot">
              <Flame className="h-3.5 w-3.5" /> HOT
            </Badge>
          )}
          {offer.isExclusive && <Badge tone="gold">בלעדי</Badge>}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-extrabold leading-snug md:text-xl">{offer.title}</h3>
        {isPropFirm && (
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Building2 className="h-4 w-4 text-primary/60" />
            חברת מימון מובילה
          </p>
        )}
      </div>

      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{offer.description}</p>

      <div className="text-xl font-black text-gradient-gold">
        <span dir="auto">{offer.discount}</span>
      </div>

      {offer.code && <CouponBox code={offer.code} />}

      <div className="mt-auto flex flex-col gap-3 sm:flex-row">
        <GhostButton to={infoUrl} className="flex-1">
          למידע מלא
        </GhostButton>
        <GoldButton href={offer.affiliateLink} className="flex-1">
          קבל עכשיו
        </GoldButton>
      </div>
    </GlassCard>
  );
}

function AcHoldingCard() {
  return (
    <section aria-label="השקעות נדל״ן יוקרתי בדובאי ובאבו דאבי — AC Holding" className="col-span-full">
      <GlassCard glow className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[240px] md:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=80"
              alt="קו הרקיע של דובאי בשעת הזהב — בורג׳ ח׳ליפה והמרינה"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-gradient-to-l from-navy-950/70 via-navy-950/20 to-transparent" />
          </div>
          <div className="flex flex-col gap-4 p-7 md:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="gold">בלעדי לקהילת PAYLESS</Badge>
              <span className="text-xs font-bold text-muted-foreground" dir="ltr">
                AC Holding
              </span>
            </div>
            <h3 className="text-2xl font-black leading-snug md:text-3xl">
              <span className="text-gradient-ice">השקעות נדל״ן</span>{" "}
              <span className="text-gradient-gold">יוקרתי</span>
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              הזדמנות בלעדית לפרויקטים יוקרתיים בדובאי ובאבו דאבי, בליווי מלא בעברית.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="glass rounded-xl px-3 py-3 text-center text-xs font-bold md:text-sm">
                פרויקטים בלעדיים
              </div>
              <div className="glass rounded-xl px-3 py-3 text-center text-xs font-bold md:text-sm">
                ליווי בעברית
              </div>
              <div className="glass rounded-xl px-3 py-3 text-center">
                <div className="text-sm font-black text-gradient-gold md:text-base">חינם</div>
                <div className="text-[11px] text-muted-foreground md:text-xs">ייעוץ ראשוני</div>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <GoldButton to="/services/ac-holding">קבלו סקירה מקצועית</GoldButton>
              <ArrowLink to="/services/ac-holding">מידע מלא על החברה</ArrowLink>
            </div>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}

function AllOffersCard() {
  return (
    <GlassCard glow className="col-span-full p-8 text-center md:p-12">
      <h3 className="text-2xl font-black text-gradient-gold md:text-3xl">
        צפה בכל המבצעים המיוחדים שלנו
      </h3>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
        גלה את המבצעים הבלעדיים, הנחות מיוחדות וקופונים חמים מכל חברות המימון והכלים המובילים
      </p>
      <div className="mt-7">
        <GoldButton to="/offers" size="lg">
          👈 לחץ כאן לצפייה בכל המבצעים
        </GoldButton>
      </div>
      <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-3">
        {[
          { value: "מבצעים חמים", label: "מעודכן יומי" },
          { value: "הנחות בלעדיות", label: "רק אצלנו" },
          { value: "קופונים חדשים", label: "חסוך עכשיו" },
        ].map((s) => (
          <div key={s.value} className="glass rounded-xl px-3 py-4">
            <div className="text-sm font-extrabold text-secondary md:text-base">{s.value}</div>
            <div className="mt-1 text-[11px] text-muted-foreground md:text-xs">{s.label}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export default function FeaturedOffers({ ids }: { ids: string[] }) {
  const cards: { key: string; node: ReactNode; wide: boolean }[] = [];

  for (const id of ids) {
    if (id === "ALL_OFFERS") {
      cards.push({ key: id, node: <AllOffersCard />, wide: true });
      continue;
    }
    if (id === "service-ac-holding") {
      cards.push({ key: id, node: <AcHoldingCard />, wide: true });
      continue;
    }
    const slug = id.replace(/^service-/, "");
    const companyKey = slugToCompanyKey(slug);
    if (!companyKey) continue;
    const offer = activeOffers.find((o) => o.company === companyKey);
    if (!offer) continue;
    cards.push({
      key: id,
      node: <OfferCard offer={offer} slug={slug} />,
      wide: false,
    });
  }

  if (cards.length === 0) return null;

  const narrowCount = cards.filter((c) => !c.wide).length;

  return (
    <div
      className={cn(
        "mx-auto grid max-w-5xl gap-6",
        narrowCount <= 1 && "grid-cols-1",
        narrowCount === 2 && "grid-cols-1 md:grid-cols-2",
        narrowCount >= 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {cards.map((c, i) => (
        <Reveal key={c.key} delay={i * 0.08} className={cn(c.wide && "col-span-full")}>
          {c.node}
        </Reveal>
      ))}
    </div>
  );
}
