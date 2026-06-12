import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  Brain,
  CalendarDays,
  Calculator,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { ArrowLink, Badge, GlassCard, Reveal, TiltCard } from "@/components/ui/primitives";
import { toolsList } from "@/data/tools";
import type { ToolListItem } from "@/data/tools";

const toolIcons: Record<string, LucideIcon> = {
  "certificate-generator": Award,
  "consistency-calculator": Calculator,
  "risk-calculator": ShieldCheck,
  "news-tracker": CalendarDays,
  glossary: BookOpen,
  "trader-quiz": Brain,
};

function ToolCard({ tool }: { tool: ToolListItem }) {
  const Icon = toolIcons[tool.id];
  return (
    <TiltCard max={6} className="h-full">
      <GlassCard className="flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] p-3">
            {tool.logo ? (
              <img src={tool.logo} alt={tool.name} loading="lazy" className="max-h-full max-w-full object-contain" />
            ) : Icon ? (
              <Icon className="h-8 w-8 text-secondary" />
            ) : null}
          </span>
          <div className="flex flex-col items-end gap-1.5">
            <Badge tone={tool.isPaid ? "gold" : "cyan"}>{tool.price}</Badge>
            <Badge tone="muted">{tool.category}</Badge>
          </div>
        </div>

        <h3 className="mt-5 text-xl font-extrabold">{tool.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>

        <ul className="mt-4 space-y-2">
          {tool.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-gold" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-1 items-end">
          <Link
            to={tool.to}
            className="flex w-full items-center justify-center rounded-xl glass-bright px-4 py-2.5 text-sm font-bold transition-all hover:border-primary/50 hover:text-primary"
          >
            למידע נוסף
          </Link>
        </div>
      </GlassCard>
    </TiltCard>
  );
}

export default function Tools() {
  const categories = useMemo(() => Array.from(new Set(toolsList.map((t) => t.category))), []);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [price, setPrice] = useState<"" | "free" | "paid">("");

  const filtered = useMemo(
    () =>
      toolsList
        .filter((t) => {
          const priceOk = !price || (price === "free" && !t.isPaid) || (price === "paid" && t.isPaid);
          const catOk = activeCategories.length === 0 || activeCategories.includes(t.category);
          return priceOk && catOk;
        })
        .sort((a, b) => (a.isPaid && !b.isPaid ? -1 : !a.isPaid && b.isPaid ? 1 : 0)),
    [activeCategories, price]
  );

  const hasFilters = activeCategories.length > 0 || price !== "";

  const toggleCategory = (c: string) =>
    setActiveCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <>
      <Seo
        title="כלי עזר למסחר בחוזים עתידיים - PAYLESS | פלטפורמות, מחשבונים וכלי ניתוח"
        description="כלים מקצועיים למסחר: TradingView לניתוח טכני, TradeSyncer לקופי טריידינג, מחשבוני עקביות, יומן כלכלי T1 וספריית מושגים מקיפה. כל הכלים שסוחר צריך במקום אחד"
      />
      <PageHero
        eyebrow="ארגז הכלים של הסוחר"
        title="כלי עזר"
        highlight="למסחר"
        subtitle="מגוון כלים מקצועיים לסוחרים - יומני מסחר, קופי טריידרים, מחשבונים ועוד"
        compact
      />

      <section className="container relative pb-20">
        <div className="pointer-events-none absolute top-32 right-1/4 h-96 w-96 rounded-full bg-primary/[0.06] blur-[120px]" />

        {/* filters */}
        <Reveal>
          <div className="flex flex-col gap-4 rounded-2xl glass px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="ml-1 text-xs font-bold text-muted-foreground">קטגוריה</span>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCategory(c)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                    activeCategories.includes(c)
                      ? "bg-secondary/20 text-secondary border border-secondary/40"
                      : "bg-white/[0.04] text-muted-foreground border border-transparent hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="ml-1 text-xs font-bold text-muted-foreground">מחיר</span>
                {[
                  { value: "" as const, label: "הכל" },
                  { value: "free" as const, label: "חינמי" },
                  { value: "paid" as const, label: "בתשלום" },
                ].map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPrice(p.value)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                      price === p.value
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-white/[0.04] text-muted-foreground border border-transparent hover:text-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  מציג <span dir="ltr" className="font-black text-foreground">{filtered.length}</span> מתוך{" "}
                  <span dir="ltr" className="font-black text-foreground">{toolsList.length}</span> כלים
                </span>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategories([]);
                      setPrice("");
                    }}
                    className="text-xs font-bold text-secondary underline-offset-4 hover:underline"
                  >
                    נקה את כל הפילטרים
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* tool cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t, i) => (
            <Reveal key={t.id} delay={Math.min(i, 8) * 0.06} className="h-full">
              <ToolCard tool={t} />
            </Reveal>
          ))}
        </div>

        {/* help CTA */}
        <Reveal className="mt-16">
          <GlassCard glow className="relative overflow-hidden p-8 text-center md:p-12">
            <div className="grid-overlay absolute inset-0 opacity-50" />
            <div className="relative">
              <h2 className="text-2xl font-black md:text-3xl">
                <span className="text-gradient-ice">זקוק לעזרה</span>{" "}
                <span className="text-gradient-gold">בבחירת הכלים?</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                הצוות שלנו כאן כדי לעזור לך למצוא את חברת המימון והכלים המושלמים למסחר שלך
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-gold px-6 py-3 font-bold text-navy-950 transition-all hover:shadow-glow-gold hover:-translate-y-0.5"
                >
                  צור קשר
                </Link>
                <Link
                  to="/companies"
                  className="inline-flex items-center justify-center rounded-xl glass-bright px-6 py-3 font-bold transition-all hover:border-primary/50 hover:text-primary"
                >
                  השוואת חברות
                </Link>
                <Link
                  to="/glossary"
                  className="inline-flex items-center justify-center rounded-xl glass-bright px-6 py-3 font-bold transition-all hover:border-primary/50 hover:text-primary"
                >
                  ספריית מושגים
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center rounded-xl glass-bright px-6 py-3 font-bold transition-all hover:border-primary/50 hover:text-primary"
                >
                  שירותים נוספים
                </Link>
              </div>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal className="mt-10 text-center">
          <ArrowLink to="/offers" className="text-lg">
            כל המבצעים וההנחות
          </ArrowLink>
        </Reveal>
      </section>
    </>
  );
}
