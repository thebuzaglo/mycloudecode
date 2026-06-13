import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clapperboard,
  ExternalLink,
  Gift,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import {
  Badge,
  GlassCard,
  GoldButton,
  Reveal,
  SectionHeading,
  TiltCard,
  VideoCard,
} from "@/components/ui/primitives";
import CopyCode from "@/components/tools/CopyCode";
import FaqList from "@/components/tools/FaqList";
import { econIndicators, newsRules, toolDetails } from "@/data/tools";
import { getCompany } from "@/data/companies";

/* ------------------------------------------------------------------ */
/* Cross promo — "יכול אולי לעניין אותך"                                */
/* ------------------------------------------------------------------ */
const crossPromos = [
  {
    id: "tradesyncer",
    title: "TRADESYNCER - קופי טריידר",
    description: "פלטפורמה מתקדמת להעתקת עסקאות אוטומטית בין חשבונות מסחר עם תמיכה במגוון פלטפורמות",
    chips: ["העתקה אוטומטית", "ניהול מרובה חשבונות", "7 ימי ניסיון חינם"],
  },
  {
    id: "replikanto",
    title: "REPLIKANTO - תוסף NinjaTrader",
    description: "תוסף העתקת עסקאות הראשון והאמין ביותר ל-NinjaTrader 8 עם תכונות בלעדיות כמו ATM Copy",
    chips: ["20% הנחה"],
  },
];

function CrossPromo({ currentId }: { currentId: string }) {
  const promos = crossPromos.filter((p) => p.id !== currentId);
  if (promos.length === 0) return null;
  return (
    <section className="container relative py-14">
      <SectionHeading title="יכול אולי" highlight="לעניין אותך" />
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {promos.map((p, i) => {
          const detail = toolDetails[p.id];
          return (
            <Reveal key={p.id} delay={i * 0.06} className="h-full">
              <GlassCard className="flex h-full flex-col p-6">
                <div className="flex items-center gap-3">
                  {detail?.logo && (
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] p-2">
                      <img src={detail.logo} alt={p.title} loading="lazy" className="max-h-full max-w-full object-contain" />
                    </span>
                  )}
                  <h3 className="font-extrabold">{p.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.chips.map((c) => (
                    <Badge key={c} tone="gold">{c}</Badge>
                  ))}
                </div>
                <div className="mt-5 flex flex-1 items-end">
                  <Link
                    to={`/tools/${p.id}`}
                    className="flex w-full items-center justify-center rounded-xl glass-bright px-4 py-2.5 text-sm font-bold transition-all hover:border-primary/50 hover:text-primary"
                  >
                    למידע נוסף
                  </Link>
                </div>
              </GlassCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* News tracker — economic calendar + rules + indicators guide          */
/* ------------------------------------------------------------------ */
const newsRuleCompanyId: Record<string, string> = {
  mffu: "mffu",
  tpt: "tpt",
  fundednext: "fundednext",
  "alpha-futures": "alpha-futures",
  "lucid-trading": "lucidtrading",
  "top-one-futures": "top-one-futures",
  "funded-futures-family": "funded-futures-family",
};

function AllowedBadge({ allowed }: { allowed: "yes" | "no" | "partial" }) {
  if (allowed === "yes")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
        <Check className="h-3 w-3" /> מותר
      </span>
    );
  if (allowed === "no")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-400">
        <X className="h-3 w-3" /> אסור
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400">
      <AlertTriangle className="h-3 w-3" /> חלקי
    </span>
  );
}

function NewsRulesSection() {
  const [activeId, setActiveId] = useState(newsRules[0].id);
  const active = newsRules.find((c) => c.id === activeId)!;

  return (
    <section className="container relative py-14">
      <SectionHeading
        eyebrow="חוקי מסחר בחדשות"
        title="בדוק מה מותר ואסור"
        highlight="לפי החברה שלך"
      />
      <Reveal>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {newsRules.map((c) => {
            const company = getCompany(newsRuleCompanyId[c.id]);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveId(c.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  activeId === c.id
                    ? "bg-gradient-gold text-navy-950 shadow-glow-gold"
                    : "glass-bright text-foreground/80 hover:border-secondary/40"
                }`}
              >
                {company && (
                  <img src={company.logo} alt={c.name} className="h-5 w-5 rounded object-contain" loading="lazy" />
                )}
                {c.name}
              </button>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <GlassCard className="mt-8 overflow-hidden p-0">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-white/5 bg-white/[0.03] px-5 py-3 text-xs font-black text-muted-foreground">
            <span>מסלול</span>
            <span className="w-32 text-center md:w-44">מבחן</span>
            <span className="w-32 text-center md:w-44">מימון</span>
          </div>
          {active.plans.map((p) => (
            <div
              key={p.name}
              className="grid grid-cols-[1fr_auto_auto] items-start gap-x-4 border-b border-white/5 px-5 py-4 last:border-0 hover:bg-white/[0.02]"
            >
              <span className="text-sm font-bold">{p.name}</span>
              <div className="flex w-32 flex-col items-center gap-1 text-center md:w-44">
                <AllowedBadge allowed={p.evaluation.allowed} />
                <span className="text-[11px] leading-snug text-muted-foreground">{p.evaluation.details}</span>
                {p.evaluation.timeRestriction && (
                  <span className="text-[11px] font-bold text-amber-400" dir="rtl">{p.evaluation.timeRestriction}</span>
                )}
              </div>
              <div className="flex w-32 flex-col items-center gap-1 text-center md:w-44">
                <AllowedBadge allowed={p.funded.allowed} />
                <span className="text-[11px] leading-snug text-muted-foreground">{p.funded.details}</span>
                {p.funded.timeRestriction && (
                  <span className="text-[11px] font-bold text-amber-400" dir="rtl">{p.funded.timeRestriction}</span>
                )}
              </div>
            </div>
          ))}
          {active.relevantNews && active.relevantNews.length > 0 && (
            <div className="border-t border-white/5 bg-white/[0.02] px-5 py-4">
              <p className="mb-3 text-xs font-black text-secondary">הודעות רלוונטיות (Tier 1)</p>
              <div className="flex flex-col gap-2">
                {active.relevantNews.map((r) => (
                  <div key={r.label} className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-foreground/85">{r.label}</span>
                    {r.events.map((ev) =>
                      r.link ? (
                        <a
                          key={ev}
                          href={r.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary transition-colors hover:bg-primary/20"
                          dir="ltr"
                        >
                          {ev}
                        </a>
                      ) : (
                        <span key={ev} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-muted-foreground" dir="ltr">
                          {ev}
                        </span>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </Reveal>
    </section>
  );
}

function IndicatorsGuide() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="container relative py-14">
      <SectionHeading
        eyebrow="מדריך למדדים כלכליים"
        title="הבנת המדדים היא המפתח"
        highlight="לקריאת השוק"
      />
      <div className="mx-auto max-w-3xl space-y-3">
        {econIndicators.map((ind, i) => (
          <Reveal key={ind.id} delay={Math.min(i, 6) * 0.04}>
            <GlassCard className="overflow-hidden !rounded-xl">
              <button
                type="button"
                onClick={() => setOpen(open === ind.id ? null : ind.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
                aria-expanded={open === ind.id}
              >
                <span className="flex items-center gap-3">
                  <span className="rounded-lg bg-secondary/10 px-2.5 py-1 font-mono text-xs font-black text-secondary" dir="ltr">
                    {ind.acronym}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-bold md:text-base">{ind.name}</span>
                    <span className="text-[11px] text-muted-foreground" dir="ltr">{ind.nameEn}</span>
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-secondary transition-transform duration-300 ${open === ind.id ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === ind.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.21, 0.65, 0.36, 1] }}
                  >
                    <div className="space-y-3 px-5 pb-5">
                      <p className="text-sm leading-relaxed text-muted-foreground">{ind.description}</p>
                      <div className="grid gap-2 text-[13px]">
                        <div className="flex items-start gap-2 rounded-lg bg-white/[0.03] px-3 py-2">
                          <span className="font-bold text-secondary shrink-0">רמת השפעה</span>
                          <span className="text-foreground/85">{ind.impact}</span>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg bg-white/[0.03] px-3 py-2">
                          <span className="font-bold text-secondary shrink-0">תדירות פרסום</span>
                          <span className="text-foreground/85">{ind.frequency}</span>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg bg-emerald-500/[0.06] px-3 py-2">
                          <span className="font-bold text-emerald-400 shrink-0">סיגנל חיובי (בולי)</span>
                          <span className="text-foreground/85">{ind.bullishSignal}</span>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg bg-red-500/[0.06] px-3 py-2">
                          <span className="font-bold text-red-400 shrink-0">סיגנל שלילי (דובי)</span>
                          <span className="text-foreground/85">{ind.bearishSignal}</span>
                        </div>
                        {ind.tradingTip && (
                          <div className="flex items-start gap-2 rounded-lg bg-secondary/[0.07] px-3 py-2">
                            <span className="font-bold text-secondary shrink-0">טיפ למסחר</span>
                            <span className="text-foreground/85">{ind.tradingTip}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">מקור: {ind.source}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function NewsTrackerPage() {
  const tool = toolDetails["news-tracker"];
  const widgetSettings = encodeURIComponent(
    JSON.stringify({
      colorTheme: "dark",
      isTransparent: true,
      width: "100%",
      height: 600,
      locale: "he_IL",
      importanceFilter: "1",
      countryFilter: "us",
    })
  );

  return (
    <>
      <Seo
        title="יומן כלכלי בעברית – Economic Calendar | אירועי T1 בזמן אמת | PAYLESS"
        description="יומן כלכלי בעברית עם אירועי חדשות T1 בזמן אמת (FOMC, NFP, CPI). לוח אירועים כלכליים אינטראקטיבי + מדריך חוקי מסחר בחדשות לכל חברת מימון. Economic Calendar חינמי."
      />
      <PageHero
        eyebrow="כלי עזר"
        title="יומן כלכלי – מעקב חדשות ואירועי T1"
        highlight="(Economic Calendar)"
        subtitle={tool.shortDescription}
        compact
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge tone="cyan">{tool.price}</Badge>
          <Badge tone="gold">{tool.category}</Badge>
        </div>
      </PageHero>

      {/* description + features */}
      <section className="container relative pb-4">
        <Reveal>
          <GlassCard className="mx-auto max-w-4xl p-7 md:p-9">
            <p className="text-base leading-relaxed text-foreground/90">{tool.fullDescription}</p>
            <div className="beam-divider my-6" />
            <h2 className="mb-4 text-lg font-extrabold text-gradient-gold">תכונות עיקריות</h2>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {tool.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  {f}
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      </section>

      {/* economic calendar widget */}
      <section className="container relative py-14">
        <SectionHeading eyebrow="אירועים כלכליים" title="לוח אירועים" highlight="כלכליים" />
        <Reveal>
          <GlassCard className="mx-auto max-w-4xl overflow-hidden p-2 md:p-3">
            <iframe
              title="לוח אירועים כלכליים"
              src={`https://s.tradingview.com/embed-widget/events/?locale=he_IL#${widgetSettings}`}
              className="h-[600px] w-full rounded-xl border-0"
              loading="lazy"
            />
          </GlassCard>
        </Reveal>
      </section>

      <NewsRulesSection />
      <IndicatorsGuide />

      {/* disclaimer */}
      <section className="container relative pb-4">
        <Reveal>
          <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-5 py-4">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div className="text-sm leading-relaxed">
              <p className="font-bold text-amber-300">⚠️ המידע מיועד ללמידה בלבד ואינו מהווה המלצה להשקעה</p>
              <p className="mt-1 text-muted-foreground">
                תמיד בצע מחקר עצמאי והתייעץ עם יועץ מוסמך לפני קבלת החלטות מסחר
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="container relative py-14">
        <SectionHeading title="שאלות" highlight="נפוצות" />
        <div className="mx-auto max-w-3xl">
          <FaqList items={tool.faqs} />
        </div>
      </section>

      {/* offers CTA */}
      <section className="container relative pb-16">
        <Reveal>
          <GlassCard glow className="relative overflow-hidden p-8 text-center md:p-12">
            <div className="grid-overlay absolute inset-0 opacity-50" />
            <div className="relative">
              <h2 className="text-2xl font-black md:text-3xl">
                <span className="text-gradient-ice">רוצה להתחמש בתיקים</span>{" "}
                <span className="text-gradient-gold">לקראת ההודעה הבאה?</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                גלה את המבצעים החמים שלנו והתחל לסחור בתנאים הכי טובים!
              </p>
              <div className="mt-7">
                <GoldButton to="/offers" size="lg">
                  לצפייה במבצעים
                </GoldButton>
              </div>
            </div>
          </GlassCard>
        </Reveal>
        <Reveal className="mt-8 text-center">
          <Link
            to="/tools"
            className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-secondary"
          >
            <ArrowRight className="h-4 w-4" />
            חזרה לכלי עזר
          </Link>
        </Reveal>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Generic platform-tool page                                          */
/* ------------------------------------------------------------------ */
export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const tool = useMemo(() => (id ? toolDetails[id] : undefined), [id]);

  if (id === "news-tracker") return <NewsTrackerPage />;
  if (!tool) return <Navigate to="/tools" replace />;

  return (
    <>
      <Seo title={`${tool.name} - כלי עזר למסחר | PAYLESS`} description={tool.shortDescription} />
      <PageHero eyebrow={tool.category} title={tool.name} subtitle={tool.shortDescription} compact>
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge tone={tool.isPaid ? "gold" : "cyan"}>{tool.price}</Badge>
            {tool.offer && <Badge tone="hot"><Gift className="h-3 w-3" /> {tool.offer}</Badge>}
          </div>
          {tool.logo && (
            <span className="flex h-24 w-24 items-center justify-center rounded-3xl glass p-4 shadow-card-deep">
              <img src={tool.logo} alt={tool.name} className="max-h-full max-w-full object-contain" />
            </span>
          )}
        </div>
      </PageHero>

      {/* description + features */}
      <section className="container relative pb-4">
        <div className="pointer-events-none absolute top-10 left-1/4 h-80 w-80 rounded-full bg-primary/[0.06] blur-[120px]" />
        <Reveal>
          <GlassCard className="mx-auto max-w-4xl p-7 md:p-9">
            <p className="text-base leading-relaxed text-foreground/90">{tool.fullDescription}</p>
            <div className="beam-divider my-6" />
            <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-gradient-gold">
              <Sparkles className="h-5 w-5 text-secondary" />
              תכונות עיקריות
            </h2>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {tool.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  {f}
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      </section>

      {/* video */}
      {tool.videoId && (
        <section className="container relative py-14">
          <SectionHeading eyebrow="סרטון הדרכה" title={`${tool.name} - סרטון הדרכה`} />
          <Reveal>
            <div className="mx-auto max-w-3xl">
              <VideoCard videoId={tool.videoId} title={`${tool.name} - סרטון הדרכה`} />
            </div>
          </Reveal>
        </section>
      )}
      {tool.videoPending && (
        <section className="container relative py-14">
          <Reveal>
            <GlassCard className="mx-auto flex max-w-3xl flex-col items-center gap-3 p-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Clapperboard className="h-7 w-7" />
              </span>
              <h2 className="text-xl font-extrabold">סרטון הסבר יעלה בקרוב</h2>
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                אנחנו עובדים על הכנת סרטון הסבר מפורט על Replikanto שיעלה בקרוב. הסרטון יכלול הדרכה מלאה על התקנה, הגדרה ושימוש בתוסף.
              </p>
            </GlassCard>
          </Reveal>
        </section>
      )}

      {/* pricing */}
      {tool.pricingPlans && tool.pricingPlans.length > 0 && (
        <section className="container relative py-14">
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-secondary/[0.05] blur-[120px]" />
          <SectionHeading eyebrow="מחירים" title="פירוט תוכנית" highlight="המנויים" />
          <div
            className={`grid gap-6 md:grid-cols-2 ${tool.pricingPlans.length > 3 ? "xl:grid-cols-4" : "xl:grid-cols-3"} ${tool.pricingPlans.length === 5 ? "xl:!grid-cols-5" : ""}`}
          >
            {tool.pricingPlans.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.06} className="h-full">
                <TiltCard max={5} className="h-full">
                  <GlassCard glow={p.highlighted} className="flex h-full flex-col p-6">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-extrabold" dir="ltr">{p.name}</h3>
                      {p.saveBadge && <Badge tone="hot">{p.saveBadge}</Badge>}
                    </div>
                    <div className="mt-3 flex flex-wrap items-baseline gap-2" dir="ltr">
                      <span className="text-2xl font-black text-gradient-gold">{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">{p.originalPrice}</span>
                      )}
                      {p.duration && <span className="text-sm text-muted-foreground">{p.duration}</span>}
                      {p.billedNote && <span className="text-xs text-muted-foreground">{p.billedNote}</span>}
                    </div>
                    {p.yearlyPrice && (
                      <p className="mt-1 text-xs font-bold text-primary" dir="ltr">
                        או {p.yearlyPrice}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                    <ul className="mt-4 space-y-2">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[13px] text-foreground/85">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* offer CTA */}
      {(tool.offerTitle || tool.couponCode) && (
        <section className="container relative pb-4">
          <Reveal>
            <GlassCard glow className="relative mx-auto max-w-3xl overflow-hidden p-8 text-center md:p-10">
              <div className="grid-overlay absolute inset-0 opacity-50" />
              <div className="relative flex flex-col items-center gap-4">
                {tool.offerTitle && <h2 className="text-2xl font-black text-gradient-gold">{tool.offerTitle}</h2>}
                {tool.offerBullets && (
                  <ul className="space-y-1.5">
                    {tool.offerBullets.map((b) => (
                      <li key={b} className="flex items-center justify-center gap-2 text-sm text-foreground/90">
                        <Gift className="h-4 w-4 text-secondary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {tool.couponCode && (
                  <div className="w-full max-w-xs">
                    <CopyCode code={tool.couponCode} />
                  </div>
                )}
                <GoldButton href={tool.officialUrl} size="lg">
                  {tool.offerCta || "בקר באתר הרשמי"}
                  <ExternalLink className="h-4 w-4" />
                </GoldButton>
              </div>
            </GlassCard>
          </Reveal>
        </section>
      )}

      {/* FAQ */}
      {tool.faqs.length > 0 && (
        <section className="container relative py-14">
          <SectionHeading title="שאלות" highlight="נפוצות" />
          <div className="mx-auto max-w-3xl">
            <FaqList items={tool.faqs} />
          </div>
        </section>
      )}

      {/* footer links */}
      <section className="container relative pb-6 text-center">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={tool.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-secondary"
            >
              בקר באתר הרשמי
              <ExternalLink className="h-4 w-4" />
            </a>
            <span className="text-muted-foreground/40">|</span>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-secondary"
            >
              <ArrowRight className="h-4 w-4" />
              חזרה לכלי עזר
            </Link>
          </div>
        </Reveal>
      </section>

      <CrossPromo currentId={tool.id} />
    </>
  );
}
