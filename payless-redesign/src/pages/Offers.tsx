import { useMemo, useState } from "react";
import { Clock, ExternalLink, Filter, Flame, Loader2, Mail, PartyPopper, Sparkles, Tag, Ticket } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { Badge, GlassCard, GoldButton, Reveal } from "@/components/ui/primitives";
import Countdown from "@/components/tools/Countdown";
import CopyCode from "@/components/tools/CopyCode";
import { activeOffers, categoryLabels, companyCategory } from "@/data/offers";
import type { Offer } from "@/data/offers";
import { subscribeNewsletter } from "@/lib/supabase";

import mffuLogo from "@/assets/logos/mffu-logo-optimized.webp";
import tptLogo from "@/assets/logos/tpt-logo-new.jpg";
import fundednextLogo from "@/assets/logos/fundednext-logo-optimized.webp";
import alphaLogo from "@/assets/logos/alpha-futures-logo.webp";
import lucidLogo from "@/assets/logos/lucid-trading-logo-new.png";
import tofLogo from "@/assets/logos/top-one-futures-logo.png";
import fffLogo from "@/assets/logos/funded-futures-family-logo.png";
import tradesyncerLogo from "@/assets/logos/tradesyncer-logo-3d.webp";
import tradingviewLogo from "@/assets/logos/tradingview-logo-hero.png";
import replikantoLogo from "@/assets/logos/replikanto-logo-nobg.png";
import tradezellaLogo from "@/assets/logos/tradezella-logo.png";
import fundedAwardLogo from "@/assets/logos/funded-award-hero-logo.png";
import interactiveLogo from "@/assets/logos/interactive-israel-logo.png";
import acHoldingLogo from "@/assets/logos/ac-holding-logo.png";

const companyLogos: Record<string, string> = {
  MFFU: mffuLogo,
  TPT: tptLogo,
  FundedNext: fundednextLogo,
  AlphaFutures: alphaLogo,
  LucidTrading: lucidLogo,
  TopOneFutures: tofLogo,
  FundedFuturesFamily: fffLogo,
  TradeSyncer: tradesyncerLogo,
  TradingView: tradingviewLogo,
  Replikanto: replikantoLogo,
  TradeZella: tradezellaLogo,
  FundedAward: fundedAwardLogo,
  InteractiveBrokers: interactiveLogo,
  AcHolding: acHoldingLogo,
};

/* discount % extraction — ported from the original offers page */
const discountValue = (discount: string) => {
  const pct = discount.match(/(\d+)%/);
  if (pct) return parseInt(pct[1]);
  const num = discount.match(/\d+/);
  return num ? parseInt(num[0]) : 0;
};

/* expiry timestamp — ported from the original (Hebrew month parsing) */
const HEB_MONTHS: Record<string, number> = {
  ינואר: 0, פברואר: 1, מרץ: 2, אפריל: 3, מאי: 4, יוני: 5,
  יולי: 6, אוגוסט: 7, ספטמבר: 8, אוקטובר: 9, נובמבר: 10, דצמבר: 11,
};

const expiryTime = (o: Offer) => {
  if (o.countdown) return new Date(o.countdown).getTime();
  if (o.validUntil === "ללא תוקף" || !o.validUntil) return new Date("2099-12-31").getTime();
  for (const [name, m] of Object.entries(HEB_MONTHS)) {
    if (o.validUntil.includes(name)) {
      const day = o.validUntil.match(/(\d{1,2})/);
      const year = o.validUntil.match(/(20\d{2})/);
      return new Date(
        year ? parseInt(year[1]) : new Date().getFullYear(),
        m,
        day ? parseInt(day[1]) : 1
      ).getTime();
    }
  }
  return new Date("2099-12-31").getTime();
};

const SORTS = [
  { value: "popular", label: "הנבחרים ביותר" },
  { value: "discount-high", label: "הנחה: גבוה לנמוך" },
  { value: "discount-low", label: "הנחה: נמוך לגבוה" },
  { value: "expiry-short", label: "נגמר בקרוב" },
  { value: "expiry-long", label: "תוקף ארוך ביותר" },
];

const TYPE_FILTERS = [
  { value: "", label: "הכל" },
  { value: "hot", label: "מבצע חם" },
  { value: "exclusive", label: "בלעדי" },
  { value: "with-code", label: "עם קוד קופון" },
];

function OfferCard({ offer }: { offer: Offer }) {
  const pct = discountValue(offer.discount);
  const logo = companyLogos[offer.company];

  return (
    <GlassCard
      glow={offer.isHot}
      className="relative flex h-full flex-col overflow-hidden"
    >
      {/* top accent strip */}
      <div className={`h-1 w-full ${offer.isHot ? "bg-gradient-hot" : "bg-gradient-gold"}`} />

      <div className="flex flex-1 flex-col gap-3.5 p-5 md:p-6">
        {/* badge row + discount */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {offer.isHot && (
              <Badge tone="hot">
                <Flame className="h-3 w-3" /> מבצע חם
              </Badge>
            )}
            {offer.isExclusive && (
              <Badge tone="cyan">
                <Sparkles className="h-3 w-3" /> בלעדי
              </Badge>
            )}
            {!offer.isHot && !offer.isExclusive && (
              <Badge tone="gold">
                <Tag className="h-3 w-3" /> הנחה
              </Badge>
            )}
          </div>
          {pct > 0 && (
            <div
              className={`flex items-baseline gap-0.5 font-black ${offer.isHot ? "text-gradient-gold" : "text-gradient-cyan"}`}
              dir="ltr"
            >
              <span className="text-3xl leading-none">{pct}</span>
              <span className="text-base">%</span>
            </div>
          )}
        </div>

        {/* company + title */}
        <div className="flex items-center gap-3">
          {logo && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] p-1.5">
              <img src={logo} alt={offer.company} loading="lazy" className="max-h-full max-w-full rounded-md object-contain" />
            </span>
          )}
          <h3 className="text-base font-extrabold leading-snug md:text-lg">{offer.title}</h3>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{offer.description}</p>

        {/* features */}
        {offer.features && offer.features.length > 0 && (
          <ul className="space-y-1.5">
            {offer.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-[13px] text-foreground/85">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-gold" />
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* prices + savings */}
        {(offer.originalPrice || offer.salePrice || offer.savings) && (
          <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-2.5">
            <div className="flex items-baseline gap-2" dir="ltr">
              {offer.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">{offer.originalPrice}</span>
              )}
              {offer.salePrice && (
                <span className="text-lg font-black text-gradient-cyan">{offer.salePrice}</span>
              )}
            </div>
            {offer.savings && (
              <div className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-center">
                <div className="text-[10px] text-muted-foreground">חוסכים</div>
                <div className="text-sm font-black text-emerald-400" dir="ltr">{offer.savings}</div>
              </div>
            )}
          </div>
        )}

        {/* countdown */}
        {offer.countdown && (
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-secondary/20 bg-secondary/[0.05] px-3 py-2.5">
            <span className="text-[11px] font-bold text-muted-foreground">זמן שנותר:</span>
            <Countdown endIso={offer.countdown} />
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2.5 pt-1">
          {/* validity + usage limit */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
            {offer.validUntil && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3 text-secondary/70" />
                בתוקף עד: {offer.validUntil}
              </span>
            )}
            {offer.usageLimit && (
              <span className="inline-flex items-center gap-1">
                <Ticket className="h-3 w-3 text-primary/70" />
                {offer.usageLimit}
              </span>
            )}
          </div>

          {offer.code && <CopyCode code={offer.code} />}

          <GoldButton href={offer.affiliateLink} className="w-full !py-3 text-sm">
            מימוש המבצע
            <ExternalLink className="h-3.5 w-3.5" />
          </GoldButton>
        </div>
      </div>
    </GlassCard>
  );
}

/* newsletter strip — copy from the original offers page */
function OffersNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "dup" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMsg("אנא הזן כתובת אימייל תקינה");
      return;
    }
    setStatus("loading");
    try {
      const res = await subscribeNewsletter(email, "newsletter_offers");
      if (res.duplicate) {
        setStatus("dup");
        setMsg("כתובת האימייל כבר רשומה לניוזלטר");
      } else {
        setStatus("done");
        setMsg("תודה על ההרשמה! נשלח לך עדכונים חשובים");
      }
    } catch {
      setStatus("error");
      setMsg("אירעה שגיאה בהרשמה, אנא נסה שוב");
    }
  };

  return (
    <section className="container relative pb-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl glass gold-shimmer-border px-6 py-12 text-center md:px-16">
          <div className="grid-overlay absolute inset-0 opacity-60" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-secondary/10 blur-[100px]" />
          <div className="relative">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold shadow-glow-gold">
              <Mail className="h-7 w-7 text-navy-950" />
            </span>
            <h2 className="text-2xl font-black md:text-3xl text-gradient-ice">לא רוצים לפספס מבצעים?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              הירשמו לקבלת עדכונים על מבצעים חדשים וקודי הנחה בלעדיים
            </p>
            {status === "done" || status === "dup" ? (
              <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 px-6 py-4 font-bold text-emerald-400">
                <PartyPopper className="h-5 w-5" />
                {msg}
              </div>
            ) : (
              <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="הכניסו כתובת דוא״ל"
                  className="flex-1 rounded-xl border border-white/10 bg-navy-950/60 px-5 py-3.5 text-left font-medium text-foreground outline-none transition-colors placeholder:text-right placeholder:text-muted-foreground/50 focus:border-secondary/60"
                  aria-label="כתובת דוא״ל"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-7 py-3.5 font-bold text-navy-950 transition-all hover:shadow-glow-gold disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> נרשם...
                    </>
                  ) : (
                    "הרשמה לניוזלטר"
                  )}
                </button>
              </form>
            )}
            {status === "error" && <p className="mt-3 text-sm font-semibold text-red-400">{msg}</p>}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function Offers() {
  const [category, setCategory] = useState<string>("all");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("popular");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: activeOffers.length };
    for (const o of activeOffers) {
      const cat = companyCategory[o.company];
      if (cat) c[cat] = (c[cat] || 0) + 1;
    }
    return c;
  }, []);

  const filtered = useMemo(() => {
    return activeOffers
      .filter((o) => {
        if (category !== "all" && companyCategory[o.company] !== category) return false;
        if (type === "hot" && !o.isHot) return false;
        if (type === "exclusive" && !o.isExclusive) return false;
        if (type === "with-code" && !o.code) return false;
        return true;
      })
      .slice()
      .sort((a, b) => {
        switch (sort) {
          case "discount-low":
            return discountValue(a.discount) - discountValue(b.discount);
          case "discount-high":
            return discountValue(b.discount) - discountValue(a.discount);
          case "expiry-short":
            return expiryTime(a) - expiryTime(b);
          case "expiry-long":
            return expiryTime(b) - expiryTime(a);
          default:
            return 0;
        }
      });
  }, [category, type, sort]);

  const hasFilters = category !== "all" || type !== "";

  return (
    <>
      <Seo
        title="מבצעים והנחות בלעדיות - קודי קופון על חברות מימון | PAYLESS"
        description="ההנחות והמבצעים הטובים ביותר מחברות המימון המובילות - קודי קופון בלעדיים, מבצעים חמים והנחות עד 40%"
      />
      <PageHero
        eyebrow="הנחות בלעדיות"
        title="מבצעים"
        highlight="בלעדיים"
        subtitle="קבלו את המבצעים הטובים ביותר מחברות המימון המובילות"
        compact
      />

      <section className="container relative pb-20">
        <div className="pointer-events-none absolute top-40 left-1/4 h-96 w-96 rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="pointer-events-none absolute bottom-40 right-1/4 h-96 w-96 rounded-full bg-secondary/[0.05] blur-[120px]" />

        {/* category tabs */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {[
              { value: "all", label: "הכל" },
              ...Object.entries(categoryLabels).map(([value, label]) => ({ value, label })),
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setCategory(tab.value)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                  category === tab.value
                    ? "bg-gradient-gold text-navy-950 shadow-glow-gold"
                    : "glass-bright text-foreground/80 hover:border-secondary/40 hover:text-secondary"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-black ${
                    category === tab.value ? "bg-navy-950/15" : "bg-white/[0.06] text-muted-foreground"
                  }`}
                  dir="ltr"
                >
                  {counts[tab.value] || 0}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* secondary filter row */}
        <Reveal delay={0.08}>
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl glass px-5 py-4 sm:flex-row">
            <div className="flex flex-wrap items-center gap-2">
              <span className="ml-1 inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                סוג מבצע
              </span>
              {TYPE_FILTERS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                    type === t.value
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-white/[0.04] text-muted-foreground border border-transparent hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              מיין לפי
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-white/10 bg-navy-950/70 px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-secondary/50"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Reveal>

        {/* cards */}
        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((o, i) => (
              <Reveal key={o.id} delay={Math.min(i, 8) * 0.05} className="h-full">
                <OfferCard offer={o} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="mt-16">
            <GlassCard className="mx-auto max-w-lg p-10 text-center">
              <p className="text-lg font-bold">לא נמצאו מבצעים התואמים לפילטרים שנבחרו</p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setCategory("all");
                    setType("");
                  }}
                  className="mt-5 inline-flex items-center justify-center rounded-xl glass-bright px-6 py-2.5 text-sm font-bold transition-all hover:border-primary/50 hover:text-primary"
                >
                  נקה פילטרים
                </button>
              )}
            </GlassCard>
          </Reveal>
        )}
      </section>

      <OffersNewsletter />
    </>
  );
}
