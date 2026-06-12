import { Link } from "react-router-dom";
import { Star, ExternalLink, Crown, Heart } from "lucide-react";
import {
  SectionHeading,
  GlassCard,
  TiltCard,
  Reveal,
  Badge,
  GoldButton,
  ArrowLink,
} from "@/components/ui/primitives";
import { companies, platformLogos } from "@/data/companies";
import type { Company } from "@/data/companies";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1" dir="ltr">
      <span className="font-extrabold text-secondary">{rating}</span>
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? "fill-secondary text-secondary" : "text-muted-foreground/40"}`}
          />
        ))}
      </span>
    </span>
  );
}

function CompanyCard({ company, large = false }: { company: Company; large?: boolean }) {
  return (
    <TiltCard max={large ? 5 : 7} className="h-full">
      <GlassCard
        glow={company.featured}
        className={`relative flex h-full flex-col p-6 ${large ? "md:p-8" : ""}`}
      >
        {/* top badges */}
        <div className="absolute -top-3 right-6 flex gap-2">
          {company.featured && (
            <Badge tone="hot">
              <Crown className="h-3 w-3" /> מומלץ
            </Badge>
          )}
          {company.communityFavorite && (
            <Badge tone="cyan">
              <Heart className="h-3 w-3" /> אהוב הקהילה
            </Badge>
          )}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className={`flex items-center justify-center rounded-2xl bg-white/[0.04] p-3 ${large ? "h-20 w-20" : "h-16 w-16"}`}>
            <img
              src={company.logo}
              alt={company.name}
              loading="lazy"
              className={`max-h-full max-w-full object-contain ${company.invertLogo ? "invert" : ""}`}
            />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <a
              href={company.trustpilotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label={`Trustpilot — ${company.name}`}
            >
              <Stars rating={company.rating} />
            </a>
            <Badge tone="gold">{company.tag}</Badge>
          </div>
        </div>

        <h3 className={`mt-5 font-extrabold ${large ? "text-2xl" : "text-xl"}`}>{company.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{company.shortDescription}</p>

        <ul className="mt-4 space-y-2">
          {company.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-foreground/85">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-gold" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
          <div className="text-xs text-muted-foreground">מימון מקסימלי</div>
          <div className="text-lg font-black text-gradient-cyan" dir="ltr">{company.maxAllocation}</div>
        </div>

        {/* platforms */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {company.platforms.slice(0, large ? 7 : 5).map((p) => (
            <span
              key={p}
              title={p}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] p-1.5"
            >
              <img src={platformLogos[p]} alt={p} loading="lazy" className="max-h-full max-w-full object-contain" />
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-1 flex-col justify-end gap-2.5">
          {company.promo && company.promoPercent > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-dashed border-secondary/40 bg-secondary/[0.07] px-4 py-2.5">
              <span className="text-xs font-bold text-secondary">קוד {company.promo}</span>
              <span className="text-sm font-black text-secondary" dir="ltr">עד {company.promoPercent}%-</span>
            </div>
          )}
          <div className="flex gap-2.5">
            <GoldButton href={company.signupLink} className="flex-1 !px-4 !py-2.5 text-sm">
              קבל מבצע
              <ExternalLink className="h-3.5 w-3.5" />
            </GoldButton>
            <Link
              to={`/company/${company.id}`}
              className="flex flex-1 items-center justify-center rounded-xl glass-bright px-4 py-2.5 text-sm font-bold transition-all hover:border-primary/50 hover:text-primary"
            >
              סקירה מלאה
            </Link>
          </div>
        </div>
      </GlassCard>
    </TiltCard>
  );
}

export default function FeaturedCompanies() {
  const featured = companies.filter((c) => c.featured);
  const rest = companies.filter((c) => !c.featured);

  return (
    <section className="container relative py-20">
      <SectionHeading
        eyebrow="Prop Firms"
        title="חברות המימון"
        highlight="המובילות"
        subtitle="השוואה מקיפה בין חברות המימון הטובות בעולם — דירוגים אמיתיים, תנאים מלאים והנחות בלעדיות לקהילה"
      />
      <div className="grid gap-6 md:grid-cols-2">
        {featured.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.08}>
            <CompanyCard company={c} large />
          </Reveal>
        ))}
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {rest.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.06}>
            <CompanyCard company={c} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 text-center">
        <ArrowLink to="/companies" className="text-lg">
          לטבלת ההשוואה המלאה
        </ArrowLink>
      </Reveal>
    </section>
  );
}
