import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, Scale, Coins, ShieldAlert, Workflow, Wrench, Flame } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { GlassCard, Reveal, GoldButton, GhostButton, VideoCard } from "@/components/ui/primitives";
import { faqGroups } from "@/data/faq";

const groupIcons: Record<string, any> = {
  intro: BookOpen,
  comparison: Scale,
  costs: Coins,
  rules: ShieldAlert,
  process: Workflow,
  tools: Wrench,
};

function FaqRow({ q, a, videoId }: { q: string; a: string; videoId?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard className="overflow-hidden !rounded-xl">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
        aria-expanded={open}
      >
        <span className="text-base font-bold md:text-lg">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-secondary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
          >
            <div className="border-t border-white/5 px-5 py-4 leading-relaxed text-muted-foreground">
              {a}
              {videoId && (
                <div className="mt-4 max-w-xl">
                  <VideoCard videoId={videoId} title={`מדריך וידאו: ${q}`} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

export default function FAQ() {
  const [active, setActive] = useState<string>("all");
  const groups = active === "all" ? faqGroups : faqGroups.filter((g) => g.id === active);

  return (
    <>
      <Seo
        title="שאלות נפוצות על חברות מימון למסחר 2026 | PAYLESS FAQ"
        description="תשובות ל-17 השאלות הנפוצות ביותר על חברות מימון למסחר: MFFU vs TPT, כלל עקביות, עלויות, משיכת רווחים, מסחר בחדשות ועוד. מידע מעודכן ל-2026"
      />
      <PageHero
        eyebrow="מרכז המידע"
        title="שאלות נפוצות"
        highlight="על חברות מימון למסחר"
        subtitle="תשובות מקיפות לשאלות הנפוצות ביותר על חברות מימון, תנאי מסחר, כלל העקביות ועוד"
      />

      <section className="container relative pb-10">
        {/* category filter */}
        <Reveal className="mb-10 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => setActive("all")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              active === "all"
                ? "bg-gradient-gold text-navy-950 shadow-glow-gold"
                : "glass-bright text-muted-foreground hover:text-foreground"
            }`}
          >
            הכל
          </button>
          {faqGroups.map((g) => {
            const Icon = groupIcons[g.id];
            return (
              <button
                key={g.id}
                onClick={() => setActive(g.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  active === g.id
                    ? "bg-gradient-gold text-navy-950 shadow-glow-gold"
                    : "glass-bright text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {g.label}
              </button>
            );
          })}
        </Reveal>

        <div className="mx-auto max-w-3xl space-y-10">
          {groups.map((g) => {
            const Icon = groupIcons[g.id];
            return (
              <Reveal key={g.id}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <h2 className="text-xl font-extrabold md:text-2xl">{g.label}</h2>
                  <span className="beam-divider flex-1" />
                </div>
                <div className="space-y-3">
                  {g.faqs.map((f) => (
                    <FaqRow key={f.q} {...f} />
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* bottom CTAs */}
      <section className="container relative py-16">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Reveal>
            <GlassCard className="flex h-full flex-col items-center p-8 text-center">
              <h3 className="text-xl font-extrabold">עדיין יש שאלות?</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                דברו עם הבוט החכם שלנו או פנו אלינו ישירות
              </p>
              <div className="mt-6">
                <GhostButton to="/contact">צור קשר</GhostButton>
              </div>
            </GlassCard>
          </Reveal>
          <Reveal delay={0.08}>
            <GlassCard glow className="flex h-full flex-col items-center p-8 text-center">
              <h3 className="flex items-center gap-2 text-xl font-extrabold">
                <Flame className="h-5 w-5 text-secondary" />
                התחילו לסחור עם הנחות בלעדיות
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                קודי הנחה בלעדיים לקהילת PAYLESS - עד 50% הנחה
              </p>
              <div className="mt-6">
                <GoldButton to="/offers">לכל המבצעים</GoldButton>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </>
  );
}
