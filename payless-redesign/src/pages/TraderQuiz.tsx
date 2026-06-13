import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, RotateCcw, Sparkles, Star, ChevronLeft, Trophy } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { GlassCard, Reveal, GoldButton, GhostButton } from "@/components/ui/primitives";
import { companies, getCompany, platformLogos } from "@/data/companies";

/*
  Trader-matching quiz — 7 questions ported from the original /tools/match.
  Each option carries `tags`; companies carry matching `traits`. The score is
  the count of overlapping tags (transparent, not a black box), producing a
  ranked top-3 from the real companies dataset.
*/
type Option = { value: string; label: string; tags: string[] };
type Question = { id: string; prompt: string; help?: string; multi?: boolean; options: Option[] };

const questions: Question[] = [
  {
    id: "experience",
    prompt: "מה רמת הניסיון שלך במסחר?",
    options: [
      { value: "beginner", label: "מתחיל (פחות משנה)", tags: ["easy", "low-budget"] },
      { value: "intermediate", label: "בינוני (1-3 שנים)", tags: ["balanced"] },
      { value: "advanced", label: "מתקדם (3+ שנים)", tags: ["pro", "high-allocation"] },
    ],
  },
  {
    id: "budget",
    prompt: "מה התקציב שלך למבחן?",
    options: [
      { value: "u100", label: "עד $100", tags: ["low-budget"] },
      { value: "100-200", label: "$100-$200", tags: ["balanced"] },
      { value: "200-350", label: "$200-$350", tags: ["pro"] },
      { value: "350+", label: "$350+", tags: ["pro", "high-allocation"] },
    ],
  },
  {
    id: "allocation",
    prompt: "איזה הון התחלתי אתה מעדיף?",
    options: [
      { value: "25k", label: "$25K", tags: ["low-budget"] },
      { value: "50k", label: "$50K", tags: ["balanced"] },
      { value: "75-100k", label: "$75K-$100K", tags: ["pro"] },
      { value: "150k+", label: "$150K+", tags: ["high-allocation"] },
    ],
  },
  {
    id: "pace",
    prompt: "מהו קצב המסחר היומי שלך?",
    options: [
      { value: "sniper", label: "סנייפר (1-2 עסקאות)", tags: ["balanced"] },
      { value: "active", label: "פעיל (3-10 עסקאות)", tags: ["active"] },
      { value: "scalper", label: "סקאלפר (10+ עסקאות)", tags: ["scalper", "fast-payout"] },
    ],
  },
  {
    id: "priorities",
    prompt: "מה הדברים שאתה לא מוכן לוותר עליהם?",
    help: "סמן את כל מה שרלוונטי עבורך (אופציונלי)",
    multi: true,
    options: [
      { value: "news", label: "מסחר בזמן חדשות כלכליות", tags: ["news-trading"] },
      { value: "eod", label: "ללא סטופ יומי (EOD Drawdown)", tags: ["no-daily-loss"] },
      { value: "consistency", label: "ללא כלל עקביות", tags: ["no-consistency"] },
      { value: "split", label: "חלוקת רווחים הכי גבוהה", tags: ["high-split"] },
    ],
  },
  {
    id: "payment",
    prompt: "באיזה אמצעי תשלום אתה מעדיף לשלם?",
    options: [
      { value: "credit", label: "כרטיס אשראי", tags: ["pay-credit"] },
      { value: "crypto", label: "קריפטו", tags: ["pay-crypto"] },
      { value: "paypal", label: "PayPal", tags: ["pay-paypal"] },
      { value: "applepay", label: "Apple Pay", tags: ["pay-wallet"] },
      { value: "googlepay", label: "Google Pay", tags: ["pay-wallet"] },
      { value: "skrill", label: "Skrill", tags: ["pay-skrill"] },
    ],
  },
  {
    id: "withdrawal",
    prompt: "באיזה אמצעי משיכה אתה מעדיף למשוך רווחים?",
    options: [
      { value: "bank", label: "העברה בנקאית", tags: ["wd-bank"] },
      { value: "paypal", label: "PayPal", tags: ["wd-paypal"] },
      { value: "crypto", label: "קריפטו", tags: ["wd-crypto"] },
    ],
  },
];

/* company traits (derived from the verbatim company descriptions/keywords) */
const traits: Record<string, string[]> = {
  mffu: ["balanced", "pro", "high-allocation", "no-daily-loss", "no-consistency", "fast-payout", "active", "pay-crypto", "pay-credit", "wd-crypto", "wd-bank", "high-split"],
  tpt: ["balanced", "fast-payout", "no-daily-loss", "active", "pay-credit", "pay-paypal", "wd-paypal", "high-split"],
  fundednext: ["low-budget", "easy", "balanced", "news-trading", "no-consistency", "high-allocation", "pay-crypto", "pay-paypal", "pay-wallet", "pay-skrill", "wd-paypal", "wd-crypto"],
  "alpha-futures": ["pro", "high-allocation", "no-daily-loss", "high-split", "fast-payout", "pay-crypto", "pay-credit", "wd-bank", "wd-crypto"],
  lucidtrading: ["balanced", "high-allocation", "high-split", "no-consistency", "fast-payout", "scalper", "active", "pay-crypto", "pay-credit", "wd-crypto"],
  "top-one-futures": ["low-budget", "high-allocation", "high-split", "fast-payout", "scalper", "news-trading", "pay-crypto", "pay-credit", "pay-wallet", "wd-crypto"],
  "funded-futures-family": ["high-allocation", "high-split", "news-trading", "no-consistency", "no-daily-loss", "balanced", "wd-crypto", "pay-crypto"],
};

const medalLabels = ["🏆 המלצה ראשונה", "🥈 המלצה שנייה", "🥉 המלצה שלישית"];
const loadingSteps = ["מנתח את נתוני המסחר שלך...", "סורק עשרות מסלולי מימון...", "מצליב נתונים למציאת ההתאמה המושלמת..."];

export default function TraderQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);

  const q = questions[step];
  const progress = ((step + (done ? 1 : 0)) / questions.length) * 100;

  const pick = (opt: Option) => {
    const cur = answers[q.id] || [];
    if (q.multi) {
      const next = cur.includes(opt.value) ? cur.filter((v) => v !== opt.value) : [...cur, opt.value];
      setAnswers({ ...answers, [q.id]: next });
    } else {
      setAnswers({ ...answers, [q.id]: [opt.value] });
      setTimeout(() => advance(), 220);
    }
  };

  const advance = () => {
    if (step < questions.length - 1) setStep((s) => s + 1);
    else finish();
  };

  const finish = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setDone(true);
    }, 2100);
  };

  const results = (() => {
    const chosenTags = new Set<string>();
    Object.entries(answers).forEach(([qid, vals]) => {
      const qq = questions.find((x) => x.id === qid)!;
      vals.forEach((v) => qq.options.find((o) => o.value === v)?.tags.forEach((t) => chosenTags.add(t)));
    });
    return companies
      .map((c) => {
        const t = traits[c.id] || [];
        const score = t.filter((x) => chosenTags.has(x)).length;
        return { company: c, score };
      })
      .sort((a, b) => b.score - a.score || b.company.rating - a.company.rating)
      .slice(0, 3);
  })();

  const reset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
    setAnalyzing(false);
  };

  return (
    <>
      <Seo
        title="שאלון התאמת חברת מימון למסחר 2026 | PAYLESS"
        description="ענו על שאלון קצר וקבלו המלצה מותאמת אישית על חברת המימון המתאימה לכם ביותר — לפי ניסיון, תקציב, סגנון מסחר והעדפות."
      />
      <PageHero
        eyebrow="חידון התאמה חכם"
        title="מצא את חברת המימון"
        highlight="המושלמת עבורך"
        subtitle="8 שאלות קצרות שינתחו את סגנון המסחר, התקציב וההעדפות שלך — ויתאימו לך את החברות הטובות ביותר"
      />

      <section className="container relative pb-16">
        <div className="mx-auto max-w-2xl">
          {/* progress */}
          {!done && !analyzing && (
            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-bold text-secondary">שאלה {step + 1} מתוך {questions.length}</span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div className="h-full rounded-full bg-gradient-gold" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 text-center">
                <div className="relative mx-auto mb-8 h-20 w-20">
                  <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-secondary" />
                  <span className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-primary" style={{ animationDuration: "1.4s" }} />
                  <Sparkles className="absolute inset-0 m-auto h-7 w-7 text-secondary" />
                </div>
                {loadingSteps.map((t, i) => (
                  <motion.p key={t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.55 }} className="text-lg font-bold text-foreground/90">
                    {t}
                  </motion.p>
                ))}
              </motion.div>
            ) : done ? (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="text-center">
                  <Trophy className="mx-auto mb-3 h-10 w-10 text-secondary" />
                  <h2 className="text-3xl font-black text-gradient-gold">הניתוח הושלם!</h2>
                  <p className="mt-2 text-muted-foreground">בהתבסס על התשובות שלך, אלו החברות שהכי מתאימות לך</p>
                </div>
                <div className="space-y-5">
                  {results.map(({ company: c }, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.25 }}>
                      <GlassCard glow={i === 0} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-black">{medalLabels[i]}</span>
                        </div>
                        <div className="flex flex-1 items-center gap-4">
                          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] p-2">
                            <img src={c.logo} alt={c.name} className={`max-h-full max-w-full object-contain ${c.invertLogo ? "invert" : ""}`} />
                          </span>
                          <div className="min-w-0">
                            <div className="truncate text-lg font-extrabold">{c.name}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground" dir="ltr">
                              <span className="inline-flex items-center gap-0.5"><Star className="h-3 w-3 fill-secondary text-secondary" />{c.rating}</span>
                              · {c.maxAllocation}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <GoldButton href={c.signupLink} className="!px-4 !py-2.5 text-sm">הרשמה <ExternalLink className="h-3.5 w-3.5" /></GoldButton>
                          <Link to={`/company/${c.id}`} className="flex items-center rounded-xl glass-bright px-4 py-2.5 text-sm font-bold transition-all hover:text-primary">סקירה</Link>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-3">
                  <GhostButton onClick={reset}><RotateCcw className="h-4 w-4" /> התחל שאלון מחדש</GhostButton>
                  <GhostButton to="/companies">לכל החברות</GhostButton>
                </div>
              </motion.div>
            ) : (
              <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <GlassCard className="p-7 md:p-9">
                  <h2 className="text-2xl font-extrabold">{q.prompt}</h2>
                  {q.help && <p className="mt-2 text-sm text-muted-foreground">{q.help}</p>}
                  <div className="mt-6 grid gap-3">
                    {q.options.map((opt) => {
                      const selected = (answers[q.id] || []).includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => pick(opt)}
                          className={`flex items-center justify-between rounded-xl border px-5 py-4 text-right font-bold transition-all ${
                            selected ? "border-secondary/60 bg-secondary/10 text-secondary" : "border-white/10 bg-white/[0.02] text-foreground hover:border-primary/40 hover:bg-white/[0.04]"
                          }`}
                        >
                          {opt.label}
                          {selected && <span className="text-secondary">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    {step > 0 ? (
                      <button onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
                        <ChevronLeft className="h-4 w-4 rotate-180" /> חזרה
                      </button>
                    ) : <span />}
                    {q.multi && (
                      <GoldButton onClick={advance} className="!px-6 !py-2.5 text-sm">
                        {step === questions.length - 1 ? "קבל המלצה" : "המשך"}
                      </GoldButton>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
