import { Link, useParams } from "react-router-dom";
import { Calculator } from "lucide-react";
import Seo from "@/components/Seo";
import {
  Reveal,
  GlassCard,
  Badge,
  GoldButton,
  ArrowLink,
  VideoCard,
} from "@/components/ui/primitives";
import ShareRow from "@/components/blog/ShareRow";
import { glossaryTerms, glossaryCategoryLabels, getTerm } from "@/data/glossary";

const categoryTone: Record<string, "gold" | "cyan" | "hot" | "muted"> = {
  trading: "cyan",
  risk_management: "hot",
  company_terms: "gold",
  technical_analysis: "muted",
};

const extractYouTubeId = (url: string): string | null => {
  const m =
    url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/) ||
    url.match(/[?&]v=([a-zA-Z0-9_-]+)/) ||
    url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
};

export default function GlossaryTerm() {
  const { slug } = useParams<{ slug: string }>();
  const term = getTerm(slug || "");

  if (!term) {
    return (
      <>
        <Seo title="המושג לא נמצא | ספריית מושגים PayLess" />
        <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden text-center">
          <div className="grid-overlay absolute inset-0" />
          <div className="relative">
            <div className="text-[7rem] font-black leading-none text-gradient-gold md:text-[10rem]">404</div>
            <h1 className="mt-2 text-2xl font-extrabold">המושג לא נמצא</h1>
            <div className="mt-8">
              <GoldButton to="/glossary">חזרה לספרייה</GoldButton>
            </div>
          </div>
        </section>
      </>
    );
  }

  const related = glossaryTerms
    .filter((t) => t.category === term.category && t.slug !== term.slug)
    .slice(0, 3);

  const videoId = term.video_url ? extractYouTubeId(term.video_url) : null;

  return (
    <>
      <Seo
        title={`${term.term_he} - ${term.term_en} | ספריית מושגים PayLess`}
        description={term.definition}
      />

      {/* header */}
      <section className="relative overflow-hidden pb-10 pt-16 md:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-20%,hsl(199_50%_15%)_0%,transparent_70%)]" />
        <div className="grid-overlay absolute inset-0 opacity-70" />
        <div className="noise-overlay" />

        <div className="container relative z-10 max-w-4xl">
          <Reveal>
            <nav className="mb-7 flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="transition-colors hover:text-secondary">
                ראשי
              </Link>
              <span className="text-muted-foreground/50">/</span>
              <Link to="/glossary" className="transition-colors hover:text-secondary">
                ספריית מושגים
              </Link>
              <span className="text-muted-foreground/50">/</span>
              <span className="text-foreground/80">{term.term_he}</span>
            </nav>

            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <h1 className="text-3xl font-black leading-[1.15] text-gradient-ice md:text-5xl">
                  {term.term_he}
                </h1>
                <p className="mt-3 text-lg text-muted-foreground md:text-xl" dir="ltr">
                  {term.term_en}
                </p>
                <div className="mt-4">
                  <Badge tone={categoryTone[term.category] ?? "muted"}>
                    {glossaryCategoryLabels[term.category] ?? term.category}
                  </Badge>
                </div>
              </div>
              <ShareRow className="mt-1.5" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container relative max-w-4xl pb-24">
        <div className="pointer-events-none absolute left-1/2 top-20 h-[420px] w-[640px] max-w-full -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[120px]" />

        <div className="relative space-y-8">
          {/* definition */}
          <Reveal>
            <GlassCard glow className="p-7 md:p-9">
              <h2 className="mb-4 text-2xl font-extrabold text-gradient-gold">הגדרה</h2>
              <p className="text-base leading-8 text-foreground/90 md:text-lg md:leading-9">
                {term.definition}
              </p>
            </GlassCard>
          </Reveal>

          {/* explainer video */}
          {videoId && (
            <Reveal>
              <GlassCard className="p-7 md:p-9">
                <h2 className="mb-5 text-2xl font-extrabold text-gradient-gold">סרטון הסבר</h2>
                <VideoCard videoId={videoId} title={`הסבר על ${term.term_he}`} />
              </GlassCard>
            </Reveal>
          )}

          {/* detailed explanation */}
          {term.detailed_explanation && (
            <Reveal>
              <GlassCard className="p-7 md:p-9">
                <h2 className="mb-4 text-2xl font-extrabold text-gradient-gold">הסבר מפורט</h2>
                <p className="whitespace-pre-line leading-8 text-foreground/85">
                  {term.detailed_explanation}
                </p>
              </GlassCard>
            </Reveal>
          )}

          {/* consistency calculator CTA */}
          {term.slug === "consistency" && (
            <Reveal>
              <Link to="/tools/consistency-calculator" className="group block">
                <GlassCard glow className="flex flex-col items-start gap-5 p-7 md:flex-row md:items-center md:p-8">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                    <Calculator className="h-7 w-7" />
                  </span>
                  <span className="flex-1">
                    <h3 className="text-lg font-extrabold">מחשבון כלל העקביות</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      כלי חינמי שיעזור לך לבדוק אם אתה עומד בכלל העקביות — תומך ב-MFFU, TPT,
                      FundedNext, Alpha Futures ו-Lucid Trading.
                    </p>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors group-hover:text-secondary">
                    לחישוב עקביות ←
                  </span>
                </GlassCard>
              </Link>
            </Reveal>
          )}

          {/* related terms */}
          {related.length > 0 && (
            <Reveal>
              <h2 className="mb-5 text-2xl font-extrabold text-gradient-gold">מושגים קשורים</h2>
              <div className="grid gap-5 md:grid-cols-3">
                {related.map((t) => (
                  <Link key={t.slug} to={`/glossary/${t.slug}`} className="group block h-full">
                    <GlassCard className="flex h-full flex-col gap-2.5 p-6">
                      <h3 className="font-extrabold leading-snug transition-colors group-hover:text-secondary">
                        {t.term_he}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {t.definition}
                      </p>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          {/* back to library */}
          <Reveal className="pt-2">
            <ArrowLink to="/glossary">חזרה לספרייה</ArrowLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
