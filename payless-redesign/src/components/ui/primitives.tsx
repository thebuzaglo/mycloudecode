import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Reveal — scroll-triggered entrance                                   */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.65, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* SectionHeading — eyebrow + title + subtitle, RTL                     */
/* ------------------------------------------------------------------ */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "center" | "right";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mb-12 md:mb-16 flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-right",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full glass-bright px-4 py-1.5 text-sm font-medium text-secondary tracking-wide">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse-glow" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.15] text-gradient-ice">
        {title}{" "}
        {highlight && <span className="text-gradient-gold">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* GlassCard — spotlight-tracking premium card                          */
/* ------------------------------------------------------------------ */
export function GlassCard({
  children,
  className,
  glow = false,
  as: Tag = "div",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  as?: any;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "glass card-spotlight rounded-2xl",
        glow && "gold-shimmer-border",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* TiltCard — 3D perspective tilt on hover                              */
/* ------------------------------------------------------------------ */
export function TiltCard({
  children,
  className,
  max = 8,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rx = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 180, damping: 18 });

  return (
    <div className="perspective-1200">
      <motion.div
        style={{ rotateX: rx, rotateY: ry }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          x.set((e.clientX - r.left) / r.width);
          y.set((e.clientY - r.top) / r.height);
        }}
        onMouseLeave={() => {
          x.set(0.5);
          y.set(0.5);
        }}
        className={cn("preserve-3d will-change-transform", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* GoldButton / GhostButton                                             */
/* ------------------------------------------------------------------ */
export function GoldButton({
  children,
  to,
  href,
  className,
  size = "md",
  ...rest
}: {
  children: React.ReactNode;
  to?: string;
  href?: string;
  className?: string;
  size?: "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-bold",
    "bg-gradient-gold text-navy-950 text-secondary-foreground transition-all duration-300",
    "hover:shadow-glow-gold hover:-translate-y-0.5 active:translate-y-0",
    size === "lg" ? "px-8 py-4 text-lg" : "px-6 py-3 text-base",
    className
  );
  const inner = (
    <>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}

export function GhostButton({
  children,
  to,
  href,
  className,
  size = "md",
  ...rest
}: {
  children: React.ReactNode;
  to?: string;
  href?: string;
  className?: string;
  size?: "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold glass-bright",
    "text-foreground transition-all duration-300 hover:border-primary/50 hover:shadow-glow-cyan hover:-translate-y-0.5",
    size === "lg" ? "px-8 py-4 text-lg" : "px-6 py-3 text-base",
    className
  );
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* CountUp — animated number                                            */
/* ------------------------------------------------------------------ */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className} dir="ltr">
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee — infinite logo / content strip (RTL safe)                   */
/* ------------------------------------------------------------------ */
export function Marquee({
  children,
  speed = "normal",
  className,
}: {
  children: React.ReactNode;
  speed?: "normal" | "slow";
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden pause-on-hover", className)} dir="ltr">
      <div
        className={cn(
          "marquee-track",
          speed === "slow" ? "animate-marquee-slow" : "animate-marquee"
        )}
        style={{ transform: "translateX(0)" }}
      >
        <div className="flex shrink-0 items-center gap-12">{children}</div>
        <div className="flex shrink-0 items-center gap-12" aria-hidden>
          {children}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ArrowLink — RTL arrow link                                           */
/* ------------------------------------------------------------------ */
export function ArrowLink({
  to,
  href,
  children,
  className,
}: {
  to?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const cls = cn(
    "group inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-secondary",
    className
  );
  const inner = (
    <>
      {children}
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
    </>
  );
  if (href)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  return (
    <Link to={to || "#"} className={cls}>
      {inner}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Badge                                                                */
/* ------------------------------------------------------------------ */
export function Badge({
  children,
  tone = "gold",
  className,
}: {
  children: React.ReactNode;
  tone?: "gold" | "cyan" | "hot" | "muted";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold",
        tone === "gold" && "bg-secondary/15 text-secondary border border-secondary/30",
        tone === "cyan" && "bg-primary/15 text-primary border border-primary/30",
        tone === "hot" && "bg-gradient-hot text-white shadow-[0_0_18px_hsl(10_90%_55%/0.35)]",
        tone === "muted" && "bg-muted text-muted-foreground border border-border",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* VideoCard — YouTube embed with custom premium facade                 */
/* ------------------------------------------------------------------ */
export function VideoCard({
  videoId,
  title,
  className,
  ratio = "16/9",
}: {
  videoId: string;
  title?: string;
  className?: string;
  ratio?: string;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl glass",
        className
      )}
      style={{ aspectRatio: ratio }}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title || "וידאו"}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 h-full w-full text-right"
          aria-label={`נגן: ${title || "וידאו"}`}
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
            }}
            alt={title || "וידאו"}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold shadow-glow-gold transition-transform duration-300 group-hover:scale-110">
              <span className="absolute inset-0 rounded-full bg-secondary/40 animate-ping" style={{ animationDuration: "2.2s" }} />
              <svg viewBox="0 0 24 24" className="relative h-7 w-7 fill-navy-950 translate-x-[1px]">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
          {title && (
            <span className="absolute bottom-0 right-0 left-0 p-4 text-sm md:text-base font-bold text-white text-right">
              {title}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StatPill                                                             */
/* ------------------------------------------------------------------ */
export function StatPill({
  icon,
  value,
  label,
  className,
}: {
  icon?: React.ReactNode;
  value: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <GlassCard className={cn("flex flex-col items-center gap-1 px-6 py-5 text-center", className)}>
      {icon && <span className="mb-1 text-secondary">{icon}</span>}
      <span className="text-2xl md:text-3xl font-extrabold text-gradient-gold">{value}</span>
      <span className="text-xs md:text-sm text-muted-foreground">{label}</span>
    </GlassCard>
  );
}
