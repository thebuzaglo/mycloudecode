import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Flame, ChevronDown } from "lucide-react";
import { GoldButton, GhostButton, CountUp } from "@/components/ui/primitives";
import { companies } from "@/data/companies";
import { activeOffersCount } from "@/data/offers";

const MarketScene = lazy(() => import("@/components/three/MarketScene"));

const ease = [0.21, 0.65, 0.36, 1] as const;

export default function Hero() {
  const [show3d, setShow3d] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.innerWidth >= 768;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && wide && !reduced) setShow3d(true);
  }, []);

  return (
    <section className="relative flex min-h-[calc(100svh-88px)] flex-col justify-center overflow-hidden">
      {/* layered backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_-10%,hsl(199_50%_16%)_0%,hsl(202_40%_6%)_62%)]" />
      <div className="grid-overlay absolute inset-0" />
      {show3d && (
        <Suspense fallback={null}>
          <MarketScene className="absolute inset-0 opacity-80" />
        </Suspense>
      )}
      <div className="noise-overlay" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-background to-transparent" />

      <div className="container relative z-10 py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <span className="inline-flex items-center gap-2 rounded-full glass-bright px-5 py-2 text-sm font-bold text-secondary">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-secondary opacity-60" style={{ animationDuration: "2.4s" }} />
                <span className="relative h-2 w-2 rounded-full bg-secondary" />
              </span>
              אתר מספר 1# בישראל לסקירת חברות נוסטרו
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease }}
            className="mt-7 text-4xl font-black leading-[1.12] sm:text-6xl lg:text-7xl"
          >
            <span className="text-gradient-ice">פלטפורמת ההשוואה</span>
            <br />
            <span className="text-gradient-ice">המובילה </span>
            <span className="relative text-gradient-gold">
              לחברות מימון
              <svg
                viewBox="0 0 220 12"
                className="absolute -bottom-2 right-0 w-full"
                preserveAspectRatio="none"
                aria-hidden
              >
                <motion.path
                  d="M3 9 C 60 2, 160 2, 217 8"
                  fill="none"
                  stroke="hsl(43 60% 58% / 0.7)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
                />
              </svg>
            </span>
            <span className="text-gradient-ice"> למסחר</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.26, ease }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            אנחנו כאן כדי לעזור לך במסע — לבחירת חברת המימון המדויקת עבורך ולקבל
            את ההנחה הכי טובה שקיימת בכל רכישה
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
          >
            <GoldButton to="/companies" size="lg">
              <TrendingUp className="h-5 w-5" />
              צפה בהשוואה
            </GoldButton>
            <GhostButton to="/offers" size="lg">
              <Flame className="h-5 w-5 text-secondary" />
              מבצעים בלעדיים
            </GhostButton>
          </motion.div>

          {/* live stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease }}
            className="mt-14 grid w-full max-w-2xl grid-cols-3 overflow-hidden rounded-2xl glass"
          >
            <div className="flex flex-col items-center gap-1 border-l border-white/5 px-4 py-5">
              <span className="text-2xl font-black text-gradient-gold md:text-3xl">
                <CountUp value={companies.length} />
              </span>
              <span className="text-xs text-muted-foreground md:text-sm">חברות מימון מובילות</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-l border-white/5 px-4 py-5">
              <span className="text-2xl font-black text-gradient-gold md:text-3xl">
                <CountUp value={activeOffersCount} />
              </span>
              <span className="text-xs text-muted-foreground md:text-sm">מבצעים פעילים</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-4 py-5">
              <span className="flex items-center gap-1.5 text-2xl font-black text-gradient-gold md:text-3xl">
                <ShieldCheck className="h-6 w-6 text-secondary" />
                100%
              </span>
              <span className="text-xs text-muted-foreground md:text-sm">מידע מאומת ועדכני</span>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <ChevronDown className="h-6 w-6 animate-bounce text-muted-foreground/60" />
      </motion.div>
    </section>
  );
}
