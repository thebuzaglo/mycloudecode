import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, ExternalLink, Crown, Heart, LayoutGrid, Table2, ArrowUpDown, Sparkles } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { GlassCard, TiltCard, Reveal, Badge, GoldButton, GhostButton } from "@/components/ui/primitives";
import { companies, platformLogos, type Company } from "@/data/companies";

type SortKey = "featured" | "rating" | "allocation";

function allocationNum(a: string) {
  return parseInt(a.replace(/[^0-9]/g, "")) || 0;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1" dir="ltr">
      <span className="font-extrabold text-secondary">{rating}</span>
      <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
    </span>
  );
}

function CompanyCard({ c, i }: { c: Company; i: number }) {
  return (
    <Reveal delay={i * 0.05} className="h-full">
      <TiltCard max={6} className="h-full">
        <GlassCard glow={c.featured} className="relative flex h-full flex-col p-6">
          <div className="absolute -top-3 right-6 flex gap-2">
            {c.featured && <Badge tone="hot"><Crown className="h-3 w-3" /> מומלץ</Badge>}
            {c.communityFavorite && <Badge tone="cyan"><Heart className="h-3 w-3" /> אהוב הקהילה</Badge>}
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] p-3">
              <img src={c.logo} alt={c.name} loading="lazy" className={`max-h-full max-w-full object-contain ${c.invertLogo ? "invert" : ""}`} />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <a href={c.trustpilotUrl} target="_blank" rel="noopener noreferrer"><Stars rating={c.rating} /></a>
              <Badge tone="gold">{c.tag}</Badge>
            </div>
          </div>
          <h3 className="mt-5 text-xl font-extrabold">{c.name}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.shortDescription}</p>
          <ul className="mt-4 space-y-2">
            {c.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground/85">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-gold" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
            <span className="text-xs text-muted-foreground">מימון מקסימלי</span>
            <span className="text-lg font-black text-gradient-cyan" dir="ltr">{c.maxAllocation}</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {c.platforms.slice(0, 6).map((p) => (
              <span key={p} title={p} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] p-1.5">
                <img src={platformLogos[p]} alt={p} loading="lazy" className="max-h-full max-w-full object-contain" />
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-1 flex-col justify-end gap-2.5">
            {c.promo && c.promoPercent > 0 && (
              <div className="flex items-center justify-between rounded-xl border border-dashed border-secondary/40 bg-secondary/[0.07] px-4 py-2.5">
                <span className="text-xs font-bold text-secondary">קוד {c.promo}</span>
                <span className="text-sm font-black text-secondary" dir="ltr">עד {c.promoPercent}%-</span>
              </div>
            )}
            <div className="flex gap-2.5">
              <GoldButton href={c.signupLink} className="flex-1 !px-4 !py-2.5 text-sm">
                קבל מבצע <ExternalLink className="h-3.5 w-3.5" />
              </GoldButton>
              <Link to={`/company/${c.id}`} className="flex flex-1 items-center justify-center rounded-xl glass-bright px-4 py-2.5 text-sm font-bold transition-all hover:border-primary/50 hover:text-primary">
                סקירה מלאה
              </Link>
            </div>
          </div>
        </GlassCard>
      </TiltCard>
    </Reveal>
  );
}

export default function Companies() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [sort, setSort] = useState<SortKey>("featured");

  const sorted = useMemo(() => {
    const arr = [...companies];
    if (sort === "rating") arr.sort((a, b) => b.rating - a.rating);
    else if (sort === "allocation") arr.sort((a, b) => allocationNum(b.maxAllocation) - allocationNum(a.maxAllocation));
    else arr.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
    return arr;
  }, [sort]);

  return (
    <>
      <Seo
        title="השוואת חברות מימון למסחר 2026 | PAYLESS"
        description="השוואה מקיפה בין חברות המימון המובילות למסחר בחוזים עתידיים — דירוגים, מימון מקסימלי, חלוקת רווחים, פלטפורמות וקודי הנחה בלעדיים."
      />
      <PageHero
        eyebrow="Prop Firms · השוואה"
        title="כל חברות המימון"
        highlight="במקום אחד"
        subtitle="השוואה מקיפה, שקופה ומעודכנת בין חברות המימון המובילות בעולם — דירוגים אמיתיים, תנאים מלאים והנחות בלעדיות לקהילה"
      />

      <section className="container relative pb-8">
        {/* controls */}
        <Reveal className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-xl glass-bright p-1">
            <button onClick={() => setView("grid")} className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-all ${view === "grid" ? "bg-gradient-gold text-navy-950" : "text-muted-foreground"}`}>
              <LayoutGrid className="h-4 w-4" /> כרטיסים
            </button>
            <button onClick={() => setView("table")} className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-all ${view === "table" ? "bg-gradient-gold text-navy-950" : "text-muted-foreground"}`}>
              <Table2 className="h-4 w-4" /> טבלה
            </button>
          </div>
          <div className="inline-flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-bold text-muted-foreground">מיון:</span>
            {([["featured", "מומלצים"], ["rating", "דירוג"], ["allocation", "מימון"]] as [SortKey, string][]).map(([k, label]) => (
              <button key={k} onClick={() => setSort(k)} className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-all ${sort === k ? "bg-primary/20 text-primary" : "glass-bright text-muted-foreground hover:text-foreground"}`}>
                {label}
              </button>
            ))}
          </div>
        </Reveal>

        {view === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sorted.map((c, i) => <CompanyCard key={c.id} c={c} i={i} />)}
          </div>
        ) : (
          <Reveal>
            <div className="overflow-hidden rounded-2xl glass">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-right">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.03] text-sm text-muted-foreground">
                      <th className="px-5 py-4 font-bold">חברה</th>
                      <th className="px-5 py-4 font-bold">דירוג</th>
                      <th className="px-5 py-4 font-bold">מימון מקסימלי</th>
                      <th className="px-5 py-4 font-bold">יתרון בולט</th>
                      <th className="px-5 py-4 font-bold">פלטפורמות</th>
                      <th className="px-5 py-4 font-bold">קוד</th>
                      <th className="px-5 py-4 font-bold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((c, i) => (
                      <tr key={c.id} className={`group border-b border-white/5 transition-colors hover:bg-primary/[0.05] ${i % 2 ? "bg-white/[0.015]" : ""}`}>
                        <td className="px-5 py-4">
                          <Link to={`/company/${c.id}`} className="flex items-center gap-3 font-extrabold transition-colors hover:text-secondary">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] p-1.5">
                              <img src={c.logo} alt="" loading="lazy" className={`max-h-full max-w-full object-contain ${c.invertLogo ? "invert" : ""}`} />
                            </span>
                            {c.name}
                          </Link>
                        </td>
                        <td className="px-5 py-4"><Stars rating={c.rating} /></td>
                        <td className="px-5 py-4 font-black text-gradient-cyan" dir="ltr">{c.maxAllocation}</td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{c.features[0]}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-1">
                            {c.platforms.slice(0, 4).map((p) => (
                              <span key={p} title={p} className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.05] p-1">
                                <img src={platformLogos[p]} alt={p} loading="lazy" className="max-h-full max-w-full object-contain" />
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {c.promo ? <span className="rounded-lg border border-dashed border-secondary/50 bg-secondary/10 px-2.5 py-1 text-xs font-black text-secondary">{c.promo}</span> : <span className="text-xs text-muted-foreground/50">—</span>}
                        </td>
                        <td className="px-5 py-4">
                          <Link to={`/company/${c.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-secondary">סקירה</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        )}
      </section>

      {/* quiz CTA */}
      <section className="container relative py-12">
        <Reveal>
          <GlassCard glow className="relative mx-auto max-w-3xl overflow-hidden p-10 text-center">
            <div className="grid-overlay absolute inset-0 opacity-50" />
            <div className="relative">
              <Sparkles className="mx-auto mb-3 h-9 w-9 text-secondary" />
              <h2 className="text-2xl font-black md:text-3xl">
                <span className="text-gradient-ice">מצא את חברת המימון </span>
                <span className="text-gradient-gold">המושלמת עבורך</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                ענה על שאלון קצר ותקבל המלצות מותאמות אישית על סמך הרגלי המסחר וההעדפות שלך
              </p>
              <div className="mt-7">
                <GoldButton to="/tools/match" size="lg">התחל שאלון התאמה</GoldButton>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </section>
    </>
  );
}
