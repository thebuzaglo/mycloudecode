import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Flame, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/data/site";
import { activeOffersCount } from "@/data/offers";
import logo from "@/assets/brand/payless-logo-optimized.webp";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenPanel(null);
    setMobileOpen(false);
  }, [location.pathname]);

  const enter = (label: string) => {
    clearTimeout(closeTimer.current);
    setOpenPanel(label);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpenPanel(null), 140);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto transition-all duration-500",
          scrolled ? "max-w-6xl px-3 pt-3" : "max-w-full px-0 pt-0"
        )}
      >
        <nav
          className={cn(
            "relative flex items-center justify-between gap-4 px-4 md:px-6 transition-all duration-500",
            scrolled
              ? "glass rounded-2xl py-2 shadow-card-deep"
              : "border-b border-white/5 bg-navy-950/70 py-3 backdrop-blur-xl"
          )}
        >
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="PAYLESS — עמוד הבית">
            <img
              src={logo}
              alt="PAYLESS - השוואות חכמות בעולם המימון"
              className={cn("w-auto transition-all duration-500", scrolled ? "h-12" : "h-16")}
              width={80}
              height={80}
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.panel ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => enter(item.label)}
                  onMouseLeave={leave}
                >
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-1 rounded-xl px-3.5 py-2 text-[15px] font-semibold text-foreground/80 transition-colors hover:text-secondary",
                        isActive && "text-secondary"
                      )
                    }
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-300",
                        openPanel === item.label && "rotate-180 text-secondary"
                      )}
                    />
                  </NavLink>
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "relative rounded-xl px-3.5 py-2 text-[15px] font-semibold text-foreground/80 transition-colors hover:text-secondary",
                      isActive && "text-secondary"
                    )
                  }
                >
                  {item.label}
                  {item.href === "/offers" && activeOffersCount > 0 && (
                    <span className="absolute -top-1 -left-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-hot px-1 text-[11px] font-black text-white shadow-[0_0_12px_hsl(10_90%_55%/0.5)]">
                      {activeOffersCount}
                    </span>
                  )}
                </NavLink>
              )
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/offers"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-5 py-2.5 text-sm font-bold text-navy-950 transition-all duration-300 hover:shadow-glow-gold hover:-translate-y-0.5"
            >
              <Flame className="h-4 w-4" />
              מבצעים חמים
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden rounded-xl glass-bright p-2.5 text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "סגור תפריט" : "פתח תפריט"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Mega panel */}
          <AnimatePresence>
            {openPanel &&
              (() => {
                const item = navItems.find((n) => n.label === openPanel);
                if (!item?.panel) return null;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.99 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    onMouseEnter={() => enter(openPanel)}
                    onMouseLeave={leave}
                    className="absolute left-0 right-0 top-full mt-3 overflow-hidden rounded-2xl glass shadow-card-deep"
                  >
                    <div className="relative grid grid-cols-[260px_1fr] gap-0">
                      <div className="relative flex flex-col justify-between border-l border-white/5 bg-gradient-to-b from-primary/10 to-transparent p-6">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                            {item.panel.eyebrow}
                          </span>
                          <h3 className="mt-2 text-xl font-extrabold">{item.panel.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {item.panel.description}
                          </p>
                        </div>
                        <Link
                          to={item.href}
                          className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-secondary transition-colors"
                        >
                          {item.panel.cta} ←
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 p-5">
                        {item.panel.groups.map((g) => (
                          <div key={g.title}>
                            <div className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              {g.title}
                            </div>
                            {g.items.map((child) => (
                              <Link
                                key={child.href + child.label}
                                to={child.href}
                                className="group flex flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
                              >
                                <span className="flex items-center gap-2 text-[15px] font-bold text-foreground group-hover:text-secondary transition-colors">
                                  <Sparkles className="h-3.5 w-3.5 text-primary/60" />
                                  {child.label}
                                </span>
                                {child.description && (
                                  <span className="pr-5 text-xs text-muted-foreground">{child.description}</span>
                                )}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="beam-divider" />
                  </motion.div>
                );
              })()}
          </AnimatePresence>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden mx-3 mt-2 overflow-hidden rounded-2xl glass shadow-card-deep"
          >
            <div className="max-h-[70vh] overflow-y-auto p-4">
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-white/5 last:border-0">
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between py-3.5 text-base font-bold",
                        isActive ? "text-secondary" : "text-foreground"
                      )
                    }
                  >
                    {item.label}
                    {item.href === "/offers" && activeOffersCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-hot px-1.5 text-[11px] font-black text-white">
                        {activeOffersCount}
                      </span>
                    )}
                  </NavLink>
                  {item.panel && (
                    <div className="grid grid-cols-2 gap-1 pb-3">
                      {item.panel.groups.flatMap((g) => g.items).map((c) => (
                        <Link
                          key={c.href + c.label}
                          to={c.href}
                          className="rounded-lg bg-white/[0.03] px-3 py-2 text-sm text-muted-foreground hover:text-secondary"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
