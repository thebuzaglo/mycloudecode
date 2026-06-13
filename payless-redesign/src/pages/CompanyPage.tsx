import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, ExternalLink, Copy, Check, ChevronDown, ShieldCheck, Wallet,
  Layers, TrendingUp, CheckCircle2, AlertTriangle, Flame, ArrowLeft,
} from "lucide-react";
import Seo from "@/components/Seo";
import {
  SectionHeading, GlassCard, Reveal, Badge, GoldButton, GhostButton, VideoCard,
} from "@/components/ui/primitives";
import { getCompany, platformLogos } from "@/data/companies";
import { getCompanyDetail, planLabels } from "@/data/companyDetails";
import { offersForCompany } from "@/data/offers";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1.5" dir="ltr">
      <span className="text-lg font-black text-secondary">{rating}</span>
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={`h-4 w-4 ${i <= Math.round(rating) ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`} />
        ))}
      </span>
    </span>
  );
}

function CouponChip({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-dashed border-secondary/50 bg-secondary/10 px-4 py-2.5 font-black text-secondary transition-all hover:bg-secondary/15"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "הקוד הועתק!" : `קוד: ${code}`}
    </button>
  );
}

function FaqRow({ q, a, videoId }: { q: string; a: string; videoId?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard className="overflow-hidden !rounded-xl">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right" aria-expanded={open}>
        <span className="font-bold">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-secondary transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="border-t border-white/5 px-5 py-4 leading-relaxed text-muted-foreground" style={{ whiteSpace: "pre-line" }}>
              {a}
              {videoId && (
                <div className="mt-4 max-w-xl">
                  <VideoCard videoId={videoId} title={q} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

const sectionLinks = [
  { id: "overview", label: "סקירה" },
  { id: "plans", label: "מסלולים ותמחור" },
  { id: "platforms", label: "פלטפורמות" },
  { id: "offers", label: "מבצעים" },
  { id: "faq", label: "שאלות נפוצות" },
];

export default function CompanyPage() {
  const { id = "" } = useParams();
  const company = getCompany(id);
  const detail = getCompanyDetail(id);
  const offers = useMemo(() => offersForCompany(id), [id]);

  if (!company) {
    return (
      <>
        <Seo title="חברה לא נמצאה | PAYLESS" />
        <section className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="text-7xl font-black text-gradient-gold">404</div>
          <h1 className="mt-4 text-2xl font-extrabold">החברה שחיפשת לא נמצאה</h1>
          <p className="mt-2 text-muted-foreground">ייתכן שהקישור השתנה</p>
          <div className="mt-7 flex gap-3">
            <GoldButton to="/companies">לכל החברות</GoldButton>
            <GhostButton to="/">לעמוד הבית</GhostButton>
          </div>
        </section>
      </>
    );
  }

  const planCols = detail?.plans?.length
    ? Array.from(new Set(detail.plans.flatMap((p) => Object.keys(p))))
    : [];
  const hasPlans = planCols.length > 0;
  const hasTable = (detail?.comparisonTable?.length || 0) > 0;
  const availableLinks = sectionLinks.filter((l) => {
    if (l.id === "plans") return hasPlans || hasTable || (detail?.overview?.length || 0) > 0;
    if (l.id === "offers") return offers.length > 0;
    if (l.id === "faq") return (detail?.faqs?.length || 0) > 0;
    return true;
  });

  return (
    <>
      <Seo
        title={`${company.name} — סקירה, מסלולים וקוד הנחה | PAYLESS`}
        description={detail?.metaDescription || company.shortDescription}
      />

      {/* HERO */}
      <section className="relative overflow-hidden pb-12 pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-20%,hsl(199_50%_15%)_0%,transparent_70%)]" />
        <div className="grid-overlay absolute inset-0 opacity-60" />
        <div className="noise-overlay" />
        <div className="container relative z-10">
          <Reveal>
            <Link to="/companies" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-secondary">
              <ArrowLeft className="h-4 w-4" /> חזרה לכל החברות
            </Link>
          </Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <Reveal>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge tone="gold">{company.tag}</Badge>
                {company.communityFavorite && <Badge tone="cyan">אהוב הקהילה</Badge>}
                <a href={company.trustpilotUrl} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80">
                  <Stars rating={company.rating} />
                </a>
              </div>
              <h1 className="text-4xl font-black leading-tight md:text-5xl">
                <span className="text-gradient-ice">{company.name}</span>
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {detail?.description || company.shortDescription}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <GoldButton href={company.signupLink} size="lg">
                  להרשמה ל-{company.name}
                  <ExternalLink className="h-4 w-4" />
                </GoldButton>
                {company.promo && <CouponChip code={company.promo} />}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex h-40 w-40 items-center justify-center rounded-3xl glass p-6 md:h-52 md:w-52">
                <img
                  src={company.heroLogo}
                  alt={company.name}
                  className={`max-h-full max-w-full object-contain ${company.invertLogo ? "invert" : ""}`}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* sticky section nav */}
      <div className="sticky top-[76px] z-30 border-y border-white/5 bg-navy-950/80 backdrop-blur-xl">
        <div className="container flex gap-1 overflow-x-auto scrollbar-none py-2">
          {availableLinks.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-white/5 hover:text-secondary">
              {l.label}
            </a>
          ))}
        </div>
      </div>

      {/* quick facts */}
      <section id="overview" className="container relative scroll-mt-32 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: TrendingUp, label: "מימון מקסימלי", value: company.maxAllocation, ltr: true },
            { Icon: Star, label: "דירוג Trustpilot", value: `${company.rating} / 5`, ltr: true },
            { Icon: Wallet, label: "קוד הנחה", value: company.promo ? `${company.promo}${company.promoPercent ? ` · ${company.promoPercent}%` : ""}` : "—", ltr: true },
            { Icon: Layers, label: "פלטפורמות נתמכות", value: `${company.platforms.length}`, ltr: true },
          ].map((f, i) => (
            <Reveal key={f.label} delay={i * 0.05}>
              <GlassCard className="flex items-center gap-4 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <f.Icon className="h-6 w-6 text-primary" />
                </span>
                <div>
                  <div className="text-xs text-muted-foreground">{f.label}</div>
                  <div className="text-lg font-black text-gradient-gold" dir={f.ltr ? "ltr" : undefined}>{f.value}</div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        {detail?.overview && (
          <Reveal className="mx-auto mt-8 max-w-3xl">
            <GlassCard className="p-7">
              <div className="space-y-3 leading-relaxed text-foreground/85">
                {detail.overview.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
              </div>
            </GlassCard>
          </Reveal>
        )}
      </section>

      {/* plans */}
      {(hasPlans || hasTable) && (
        <section id="plans" className="container relative scroll-mt-32 py-12">
          <SectionHeading title="מסלולים" highlight="ותמחור" align="right" className="!mb-8 !items-start" />
          {hasPlans && (
            <Reveal>
              <div className="overflow-hidden rounded-2xl glass">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-right text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.03] text-muted-foreground">
                        {planCols.map((col) => (
                          <th key={col} className="px-4 py-3.5 font-bold">{planLabels[col] || col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detail!.plans!.map((p, ri) => (
                        <tr key={ri} className={`border-b border-white/5 transition-colors hover:bg-primary/[0.05] ${ri % 2 ? "bg-white/[0.015]" : ""}`}>
                          {planCols.map((col) => (
                            <td key={col} className={`px-4 py-3.5 ${col === "name" ? "font-bold text-foreground" : "text-muted-foreground"}`} dir={/[$%]|^\d/.test(p[col] || "") ? "ltr" : undefined}>
                              {p[col] || "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          )}

          {hasTable && (
            <Reveal>
              <div className="overflow-hidden rounded-2xl glass">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-right text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.03]">
                        <th className="px-4 py-3.5 font-bold text-muted-foreground">פרמטר</th>
                        {detail!.comparisonHeaders!.map((h) => (
                          <th key={h} className="px-4 py-3.5 font-black text-gradient-gold" dir="ltr">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detail!.comparisonTable!.map((row, ri) => (
                        <tr key={ri} className={`border-b border-white/5 transition-colors hover:bg-primary/[0.05] ${ri % 2 ? "bg-white/[0.015]" : ""}`}>
                          <td className="px-4 py-3.5 font-bold text-foreground">{row.label}</td>
                          {row.values.map((v, vi) => (
                            <td key={vi} className="px-4 py-3.5 text-muted-foreground" dir={/[$%]|^\d/.test(v) ? "ltr" : undefined}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          )}

          {/* features + restrictions */}
          {(detail?.features?.length || detail?.restrictions?.length) ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {detail?.features?.length ? (
                <Reveal>
                  <GlassCard className="h-full p-7">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-extrabold">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" /> יתרונות בולטים
                    </h3>
                    <ul className="space-y-2.5">
                      {detail.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-gold" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </Reveal>
              ) : null}
              {detail?.restrictions?.length ? (
                <Reveal delay={0.08}>
                  <GlassCard className="h-full p-7">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-extrabold">
                      <AlertTriangle className="h-5 w-5 text-secondary" /> חוקים ומגבלות
                    </h3>
                    <ul className="space-y-2.5">
                      {detail.restrictions.map((r) => (
                        <li key={r} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary/70" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </Reveal>
              ) : null}
            </div>
          ) : null}
        </section>
      )}

      {/* platforms */}
      <section id="platforms" className="container relative scroll-mt-32 py-12">
        <SectionHeading title="פלטפורמות" highlight="מסחר נתמכות" align="right" className="!mb-8 !items-start" />
        <div className="flex flex-wrap gap-4">
          {company.platforms.map((p) => (
            <div key={p} className="flex items-center gap-3 rounded-xl glass px-5 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] p-1.5">
                <img src={platformLogos[p]} alt={p} loading="lazy" className="max-h-full max-w-full object-contain" />
              </span>
              <span className="text-sm font-bold">{p}</span>
            </div>
          ))}
        </div>
      </section>

      {/* offers */}
      {offers.length > 0 && (
        <section id="offers" className="container relative scroll-mt-32 py-12">
          <SectionHeading title="מבצעים פעילים" highlight={`ל-${company.name}`} align="right" className="!mb-8 !items-start" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((o, i) => (
              <Reveal key={o.id} delay={i * 0.05} className="h-full">
                <GlassCard glow={o.isHot} className="flex h-full flex-col p-6">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h3 className="font-extrabold leading-snug">{o.title}</h3>
                    {o.isHot && <Badge tone="hot"><Flame className="h-3 w-3" />חם</Badge>}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{o.description}</p>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    {o.code ? <CouponChip code={o.code} /> : <span />}
                    <span className="text-lg font-black text-gradient-gold" dir="ltr">{o.discount}</span>
                  </div>
                  <GoldButton href={o.affiliateLink} className="mt-4 !py-2.5 text-sm">
                    למבצע <ExternalLink className="h-3.5 w-3.5" />
                  </GoldButton>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {detail?.faqs?.length ? (
        <section id="faq" className="container relative scroll-mt-32 py-12">
          <SectionHeading title="שאלות נפוצות" highlight={`על ${company.name}`} align="right" className="!mb-8 !items-start" />
          <div className="mx-auto max-w-3xl space-y-3">
            {detail.faqs.map((f) => (
              <FaqRow key={f.question} q={f.question} a={f.answer} videoId={f.videoId} />
            ))}
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="container relative py-16">
        <Reveal>
          <GlassCard glow className="relative mx-auto max-w-3xl overflow-hidden p-10 text-center">
            <div className="grid-overlay absolute inset-0 opacity-50" />
            <div className="relative">
              <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-secondary" />
              <h2 className="text-2xl font-black md:text-3xl">
                <span className="text-gradient-ice">מוכנים להתחיל עם </span>
                <span className="text-gradient-gold">{company.name}?</span>
              </h2>
              {company.promo && (
                <p className="mt-3 text-muted-foreground">
                  השתמשו בקוד <span className="font-black text-secondary">{company.promo}</span> בקופה
                </p>
              )}
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <GoldButton href={company.signupLink} size="lg">
                  להרשמה עכשיו <ExternalLink className="h-4 w-4" />
                </GoldButton>
                <GhostButton to="/companies">השוואה לחברות אחרות</GhostButton>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </section>
    </>
  );
}
