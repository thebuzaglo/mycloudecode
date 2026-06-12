# PAYLESS Redesign — Design System Guide (for page builders)

Premium dark fintech aesthetic: deep navy glassmorphism, gold (secondary) + cyan (primary)
accents, Hebrew RTL, Heebo font. NOT a generic shadcn look — generous whitespace,
rounded-2xl glass cards, glow accents, scroll reveals, 3D tilts.

## Hard rules
1. **Content fidelity**: All Hebrew copy, prices, percentages, coupon codes, affiliate
   links, video IDs must be extracted EXACTLY from the original source chunks
   (/tmp/pp_pretty/*.js). NEVER invent, translate, or paraphrase content. If a section's
   content can't be found, omit the section — do not fabricate.
2. **RTL**: The document is `dir="rtl"`. Wrap numbers/prices/English tokens in
   `dir="ltr"` spans where needed.
3. Pages render inside Layout (Navbar+Footer exist). Do not add navbars/footers.
4. Every page starts with `<Seo title="..." description="..."/>` (Hebrew, from original
   meta where available) and usually `<PageHero .../>`.
5. External links: affiliate links exactly as extracted, `target="_blank" rel="noopener noreferrer"`.
6. Do not modify files outside your assignment. Do not edit App.tsx, index.css,
   tailwind.config.ts, or files in src/components/ui|layout|home|three.

## Components (import paths)
```tsx
import Seo from "@/components/Seo";                       // <Seo title description/>
import PageHero from "@/components/ui/PageHero";          // eyebrow,title,highlight,subtitle,children,compact
import {
  Reveal,          // scroll entrance: {children, delay?, y?, className?}
  SectionHeading,  // {eyebrow?, title, highlight?, subtitle?, align?: "center"|"right"}
  GlassCard,       // spotlight glass card: {children, className?, glow?} (rounded-2xl built in)
  TiltCard,        // 3D hover tilt wrapper: {children, max?=8}
  GoldButton,      // {to?|href?|onClick?, size?: "md"|"lg"} gold gradient CTA
  GhostButton,     // glass secondary button, same props
  CountUp,         // {value, prefix?, suffix?, duration?}
  Marquee,         // infinite strip {children, speed?: "normal"|"slow"}
  ArrowLink,       // {to?|href?, children} RTL arrow link
  Badge,           // {tone: "gold"|"cyan"|"hot"|"muted"}
  VideoCard,       // YouTube facade+lightbox: {videoId, title?, ratio?}
  StatPill,        // {icon?, value, label}
} from "@/components/ui/primitives";
```

## Data modules
```tsx
import { companies, platformLogos, getCompany } from "@/data/companies";
import { offers, activeOffers, offersForCompany, categoryLabels,
         companyCategory, companySlugs, extractPercent } from "@/data/offers";
import { socials, testimonials } from "@/data/site";
import { fetchBlogPosts, subscribeNewsletter, fetchLatestVideos } from "@/lib/supabase";
```

## Assets
Logos at `@/assets/logos/`: ac-holding-logo.png, alpha-futures-logo-hero.png,
alpha-futures-logo.webp, alpha-trader-logo.png, aslan-cpa-logo-hero.png,
deepchart-logo.png, dxfeed-logo.png, fff-hero-logo.png, funded-award-hero-logo.png,
funded-futures-family-logo.png, fundednext-logo-hero.png, fundednext-logo-optimized.webp,
interactive-israel-logo.png, lucid-trading-logo-hero.png, lucid-trading-logo-new.png,
mffu-logo-hero.png, mffu-logo-optimized.webp, ninjatrader-logo.png, quantower-logo-new.png,
replikanto-logo-nobg.png, rithmic-logo.png, tof-logo-hero.png, top-one-futures-logo.png,
tpt-logo-hero.png, tpt-logo-new.jpg, tradesea-logo.png, tradesyncer-logo-3d.webp,
tradezella-logo.png, tradingview-logo-hero.png, tradovate-logo.png, volumetrica-logo.png,
wealthcharts-logo.png. Brand: `@/assets/brand/payless-logo-optimized.webp`, avatar-1..4.webp.

## CSS utilities (index.css)
`glass`, `glass-bright`, `text-gradient-gold`, `text-gradient-cyan`, `text-gradient-ice`,
`noise-overlay`, `grid-overlay` (absolute backdrops), `beam-divider` (1px gradient hr),
`gold-shimmer-border`, `hairline-gold`, `scrollbar-none`.

## Tailwind tokens
Colors: `navy-950/900/850/800`, `gold`, `cyan`, `primary` (cyan in dark), `secondary` (gold),
`muted-foreground`, `border`. Gradients: `bg-gradient-gold|hot|cyber|brand`.
Shadows: `shadow-glow-gold`, `shadow-glow-cyan`, `shadow-card-deep`.
Animations: `animate-marquee|marquee-slow|pulse-glow|shimmer|float-y|spin-slow`.

## Layout patterns
- Section: `<section className="container relative py-20">` + `<SectionHeading/>`.
- Ambient glow: `<div className="pointer-events-none absolute ... rounded-full bg-primary/[0.07] blur-[120px]" />`
- Tables: see `src/components/home/ComparisonTeaser.tsx` (glass wrapper, hover rows, striped).
- Cards grid: `grid gap-6 md:grid-cols-2 xl:grid-cols-3` with `<Reveal delay={i*0.06}>`.
- FAQs: accordion via `<details>`/framer-motion AnimatePresence — style as glass cards.

## Validation
From payless-redesign/: `npx tsc -b --noCheck && npx vite build --outDir /tmp/dist-<yourname> --emptyOutDir`
(never write to ./dist — other agents build concurrently).
