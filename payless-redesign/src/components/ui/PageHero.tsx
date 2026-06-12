import React from "react";
import { motion } from "framer-motion";

/*
  PageHero — shared header for inner pages. Keeps the premium hero language
  (radial navy glow + grid + noise) consistent across the site.
*/
export default function PageHero({
  eyebrow,
  title,
  highlight,
  subtitle,
  children,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`relative overflow-hidden ${compact ? "pb-10 pt-14" : "pb-16 pt-20"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-20%,hsl(199_50%_15%)_0%,transparent_70%)]" />
      <div className="grid-overlay absolute inset-0 opacity-70" />
      <div className="noise-overlay" />

      <div className="container relative z-10 flex flex-col items-center text-center">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full glass-bright px-4 py-1.5 text-sm font-bold text-secondary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse-glow" />
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="max-w-3xl text-3xl font-black leading-[1.15] md:text-5xl"
        >
          <span className="text-gradient-ice">{title}</span>
          {highlight && <span className="text-gradient-gold"> {highlight}</span>}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
