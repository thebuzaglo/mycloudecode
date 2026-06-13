import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Info,
  Lightbulb,
  Minus,
  Plus,
  RotateCcw,
  Trash2,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { Badge, GlassCard, GoldButton, Reveal, SectionHeading } from "@/components/ui/primitives";
import CopyCode from "@/components/tools/CopyCode";
import FaqList from "@/components/tools/FaqList";
import ToolsCrossLinks from "@/components/tools/ToolsCrossLinks";
import {
  computeConsistency,
  consistencyCompanies,
} from "@/data/consistency";
import { getCompany } from "@/data/companies";
import { offersForCompany } from "@/data/offers";

const fmt = (n: number, digits = 2) =>
  n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
const fmt0 = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });

/* consistency company id → companies.ts id (for logos + offer slugs) */
const showcaseId: Record<string, string> = {
  mffu: "mffu",
  tpt: "tpt",
  fundednext: "fundednext",
  "alpha-futures": "alpha-futures",
  lucidtrading: "lucidtrading",
  "top-one-futures": "top-one-futures",
  fff: "funded-futures-family",
};

const faqs = [
  {
    question: "מהו כלל העקביות (Consistency Rule)?",
    answer:
      "כלל העקביות מגביל את האחוז מהרווח הכולל שיכול להגיע מיום מסחר בודד. לדוגמה, אם המגבלה היא 50%, אף יום בודד לא יכול להוות יותר ממחצית מסך הרווחים שלך.",
  },
  {
    question: "למה חברות מימון משתמשות בכלל הזה?",
    answer:
      "חברות מימון מממנות סוחרים בהון אמיתי ורוצות הוכחה שהיתרון שלך עובד לאורך זמן, לא רק ביום אחד חזק. הכלל מזהה סוחרים עם מיומנות חוזרת וניהול סיכונים נכון.",
  },
  {
    question: "האם כלל העקביות זהה בכל החברות?",
    answer:
      "לא. המגבלה משתנה מחברה לחברה — בדרך כלל בטווח של 25% עד 52%. לדוגמה, MFFU ו-TPT דורשות 50%, בעוד Lucid Trading משתמשת ב-52% (50% בסיס + 4% סטיית תקן). חלק מהחברות דורשות גם מינימום ימי מסחר.",
  },
  {
    question: "מה קורה אם לא עומדים בכלל?",
    answer:
      "ברוב המקרים אפשר להמשיך לסחור — פשוט צריך להוסיף עוד ימים עקביים עד שהתפלגות הרווחים עומדת בדרישות החברה. לא צריך להתחיל מחדש.",
  },
  {
    question: "מה זה סטיית תקן (Leniency)?",
    answer:
      "חלק מהחברות, כמו MFFU, מאפשרות מרווח קטן כדי להתחשב בשונות טבעית בין ימי מסחר. לדוגמה, בחשבון $50K יש סטיית תקן של $100 — אם הרווחת $1,450 ביום אחד ו-$1,550 ביום השני, עדיין תיחשב עקבי.",
  },
  {
    question: "אילו חברות נתמכות במחשבון?",
    answer:
      "המחשבון תומך ב-MyFundedFutures (MFFU), The PropTrading (TPT), FundedNext, Alpha Futures, Lucid Trading, Top One Futures ו-Funded Futures Family (FFF) — כולל כל התוכניות, הגדלים והשלבים של כל חברה.",
  },
  {
    question: "האם המחשבון בחינם?",
    answer: "כן, לחלוטין. המחשבון חינמי לגמרי, ללא עלויות נסתרות, ללא הרשמה וללא מגבלות שימוש.",
  },
  {
    question: "מה ההבדל בין שלב ה-Evaluation לשלב ה-Sim-Funded?",
    answer:
      "בשלב ה-Evaluation (הערכה) חלים כללי עקביות מחמירים. בשלב ה-Sim-Funded חלק מהחברות מקלות או מבטלות את כלל העקביות לחלוטין — המחשבון מציג את הכללים הרלוונטיים בהתאם לשלב שנבחר.",
  },
];

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-white/10 bg-navy-950/70 px-4 py-3 text-sm font-bold text-foreground outline-none transition-colors focus:border-secondary/50"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProgressBar({ value, tone = "gold" }: { value: number; tone?: "gold" | "cyan" }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
        transition={{ duration: 0.6, ease: [0.21, 0.65, 0.36, 1] }}
        className={`h-full rounded-full ${tone === "gold" ? "bg-gradient-gold" : "bg-gradient-cyber"}`}
      />
    </div>
  );
}

export default function ConsistencyCalculator() {
  const [step, setStep] = useState<"setup" | "entry">("setup");
  const [companyId, setCompanyId] = useState(consistencyCompanies[0].id);
  const [planName, setPlanName] = useState(consistencyCompanies[0].plans[0].name);
  const [sizeKey, setSizeKey] = useState(String(consistencyCompanies[0].plans[0].accountSizes[0].sizeValue));
  const [stageName, setStageName] = useState("eval");
  const [calcType, setCalcType] = useState<"first" | "second">("first");
  const [days, setDays] = useState<string[]>([""]);
  const [currentBalance, setCurrentBalance] = useState("");
  const [withdrawalTarget, setWithdrawalTarget] = useState("");

  const company = useMemo(
    () => consistencyCompanies.find((c) => c.id === companyId) ?? consistencyCompanies[0],
    [companyId]
  );
  const plans = company.plans;
  const plan = useMemo(() => plans.find((p) => p.name === planName) ?? plans[0], [plans, planName]);
  const sizes = plan?.accountSizes ?? [];
  const size = useMemo(
    () => sizes.find((s) => String(s.sizeValue) === sizeKey) ?? sizes[0],
    [sizes, sizeKey]
  );
  const stages = size?.stages ?? [];
  const stage = useMemo(
    () => stages.find((s) => s.name === stageName) ?? stages[0],
    [stages, stageName]
  );

  /* keep selection valid when switching company/plan/size */
  useEffect(() => {
    if (plans.length && !plans.find((p) => p.name === planName)) setPlanName(plans[0].name);
  }, [companyId, plans, planName]);
  useEffect(() => {
    if (sizes.length && !sizes.find((s) => String(s.sizeValue) === sizeKey))
      setSizeKey(String(sizes[0].sizeValue));
  }, [planName, sizes, sizeKey]);
  useEffect(() => {
    if (stages.length && !stages.find((s) => s.name === stageName)) setStageName(stages[0].name);
  }, [sizeKey, stages, stageName]);

  const dailyPnl = useMemo(
    () => days.map((d) => parseFloat(d)).filter((v) => !Number.isNaN(v)),
    [days]
  );
  const result = useMemo(
    () => (stage ? computeConsistency(dailyPnl, stage) : null),
    [dailyPnl, stage]
  );

  const showcase = getCompany(showcaseId[company.id]);
  const companyOffers = offersForCompany(showcaseId[company.id]);

  /* withdrawal defaults */
  const defaultWithdrawTarget =
    stage?.minProfitPerDay && stage?.minTradingDays
      ? stage.minProfitPerDay * stage.minTradingDays
      : 500;
  const withdrawTargetNum = parseFloat(withdrawalTarget) || 0;
  const effectiveWithdrawTarget = withdrawTargetNum > 0 ? withdrawTargetNum : defaultWithdrawTarget;
  const balanceNum = parseFloat(currentBalance) || 0;

  const setDay = (i: number, v: string) => setDays((prev) => prev.map((d, j) => (j === i ? v : d)));
  const flipSign = (i: number) =>
    setDays((prev) =>
      prev.map((d, j) => {
        if (j !== i || d === "") return d;
        return d.startsWith("-") ? d.slice(1) : `-${d}`;
      })
    );
  const removeDay = (i: number) => setDays((prev) => prev.filter((_, j) => j !== i));
  const reset = () => {
    setDays([""]);
    setCurrentBalance("");
    setWithdrawalTarget("");
    setStep("setup");
  };

  const isSimFunded = stage?.name === "simFunded";

  return (
    <>
      <Seo
        title="מחשבון עקביות אוניברסלי - PAYLESS | כלי חישוב לכל חברות המימון"
        description="מחשבון עקביות אוניברסלי לכל חברות המימון - MFFU, TPT, FundedNext, Alpha Futures, Lucid Trading. חשבו עקביות, יעדי רווח והמלצות מותאמות"
      />
      <PageHero
        eyebrow="כלי חישוב חינמי"
        title="מחשבון עקביות"
        highlight="אוניברסלי"
        subtitle="בחרו חברה ומסלול, הזינו את הימים שלכם - וקבלו תמונה מדויקת של הסטטוס שלכם"
        compact
      />

      <section className="container relative pb-16">
        <div className="pointer-events-none absolute top-20 left-1/4 h-96 w-96 rounded-full bg-primary/[0.06] blur-[120px]" />

        <div className="mx-auto max-w-3xl">
          {/* step indicator */}
          <Reveal>
            <div className="mb-8 flex items-center justify-center gap-3 text-xs font-bold">
              <span className={step === "setup" ? "text-secondary" : "text-muted-foreground"}>בחירת חברה ומסלול</span>
              <span className="h-px w-10 bg-gradient-to-l from-secondary/60 to-primary/40" />
              <span className={step === "entry" ? "text-secondary" : "text-muted-foreground"}>הזנה ותוצאות</span>
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            {step === "setup" ? (
              <motion.div
                key="setup"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.35 }}
              >
                <GlassCard className="p-6 md:p-8">
                  {/* company chips */}
                  <p className="mb-3 text-xs font-bold text-muted-foreground">בחרו חברת מימון</p>
                  <div className="flex flex-wrap gap-2.5">
                    {consistencyCompanies.map((c) => {
                      const sc = getCompany(showcaseId[c.id]);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCompanyId(c.id)}
                          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all ${
                            companyId === c.id
                              ? "bg-secondary/15 text-secondary border border-secondary/50 shadow-glow-gold"
                              : "glass-bright text-foreground/80 hover:border-secondary/40"
                          }`}
                        >
                          {sc && <img src={sc.logo} alt={c.name} className="h-6 w-6 rounded object-contain" loading="lazy" />}
                          {c.shortName || c.name}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <SelectField
                      label="בחרו מסלול"
                      value={plan?.name ?? ""}
                      onChange={setPlanName}
                      options={plans.map((p) => ({ value: p.name, label: p.name }))}
                    />
                    <SelectField
                      label="בחרו גודל תיק"
                      value={String(size?.sizeValue ?? "")}
                      onChange={setSizeKey}
                      options={sizes.map((s) => ({ value: String(s.sizeValue), label: s.size }))}
                    />
                    <SelectField
                      label="בחרו שלב"
                      value={stage?.name ?? ""}
                      onChange={setStageName}
                      options={stages.map((s) => ({ value: s.name, label: s.nameHe }))}
                    />
                  </div>

                  {/* rules summary */}
                  {stage && (
                    <div className="mt-6 rounded-2xl border border-secondary/20 bg-secondary/[0.05] p-5">
                      <h3 className="text-sm font-extrabold text-secondary">
                        חוקי העקביות — {company.shortName || company.name} · {plan?.name} · {size?.size} · {stage.nameHe}
                      </h3>
                      <div className="mt-3 space-y-2 text-sm">
                        {stage.consistencyRule !== null ? (
                          <p className="text-foreground/90">
                            דרישת עקביות: <strong dir="ltr">{stage.consistencyRule}%</strong> — אף יום בודד לא יעלה על{" "}
                            <span dir="ltr">{stage.consistencyRule}%</span> מסך הרווח
                          </p>
                        ) : (
                          <p className="text-foreground/90">ללא דרישת עקביות בשלב זה</p>
                        )}
                        {stage.consistencyLeniency != null && stage.consistencyLeniency > 0 && (
                          <p className="text-foreground/80">
                            סטיית תקן מותרת: <strong dir="ltr">${stage.consistencyLeniency}</strong> הפרש מקסימלי בין ימים רווחיים
                          </p>
                        )}
                        {stage.note && <p className="text-xs text-muted-foreground">{stage.note}</p>}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {stage.profitTarget !== null && stage.profitTarget > 0 && (
                          <Badge tone="gold">יעד רווח <span dir="ltr">${fmt0(stage.profitTarget)}</span></Badge>
                        )}
                        {stage.minTradingDays !== null && stage.minTradingDays > 0 && (
                          <Badge tone="cyan">ימי מסחר מינימום <span dir="ltr">{stage.minTradingDays}</span></Badge>
                        )}
                        {stage.minProfitPerDay !== null && (
                          <Badge tone="muted">מינימום רווח ליום <span dir="ltr">${stage.minProfitPerDay}</span></Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-7">
                    <GoldButton onClick={() => setStep("entry")} className="w-full">
                      המשך להזנת ימים
                      <ArrowRight className="h-4 w-4 rotate-180" />
                    </GoldButton>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                key="entry"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                {/* back / restart */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep("setup")}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-secondary"
                  >
                    <ArrowRight className="h-4 w-4" />
                    חזרה
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    התחל מחדש
                  </button>
                </div>

                {/* calc type for sim-funded */}
                {isSimFunded && (
                  <GlassCard className="p-5">
                    <p className="mb-3 text-xs font-bold text-muted-foreground">סוג חישוב</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { v: "first" as const, label: "משיכה ראשונה" },
                        { v: "second" as const, label: "משיכה נוספת" },
                      ].map((t) => (
                        <button
                          key={t.v}
                          type="button"
                          onClick={() => setCalcType(t.v)}
                          className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                            calcType === t.v
                              ? "bg-gradient-gold text-navy-950 shadow-glow-gold"
                              : "glass-bright text-foreground/80"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    {calcType === "second" && (
                      <div className="mt-5 space-y-4">
                        <div className="flex items-start gap-2 rounded-xl bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-foreground/80">
                          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>
                            <strong className="text-foreground">העקביות מתאפסת לחלוטין</strong> אחרי המשיכה הראשונה.
                            הזינו את היתרה הנוכחית בחשבון ואת יעד הרווח למשיכה הבאה — והזינו ימי מסחר חדשים בלבד למטה.
                          </span>
                        </div>
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs font-bold text-muted-foreground">
                            יתרה נוכחית בחשבון (אחרי המשיכה הראשונה)
                          </span>
                          <input
                            type="number"
                            inputMode="decimal"
                            dir="ltr"
                            value={currentBalance}
                            onChange={(e) => setCurrentBalance(e.target.value)}
                            placeholder={`למשל: ${size ? size.sizeValue.toLocaleString() : ""}`}
                            className="rounded-xl border border-white/10 bg-navy-950/70 px-4 py-3 text-sm font-bold text-foreground outline-none transition-colors placeholder:text-right focus:border-secondary/50"
                          />
                        </label>
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs font-bold text-muted-foreground">יעד רווח למשיכה הבאה ($)</span>
                          <input
                            type="number"
                            inputMode="decimal"
                            dir="ltr"
                            value={withdrawalTarget}
                            onChange={(e) => setWithdrawalTarget(e.target.value)}
                            placeholder={`ברירת מחדל: ${defaultWithdrawTarget.toLocaleString()}`}
                            className="rounded-xl border border-white/10 bg-navy-950/70 px-4 py-3 text-sm font-bold text-foreground outline-none transition-colors placeholder:text-right focus:border-secondary/50"
                          />
                          {stage?.minProfitPerDay && stage?.minTradingDays ? (
                            <span className="text-[11px] text-muted-foreground">
                              מומלץ לפחות {defaultWithdrawTarget.toLocaleString()}$ ({stage.minTradingDays} ימים × $
                              {stage.minProfitPerDay} מינימום ליום)
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">
                              הזינו את הסכום הדולרי שתרצו לצבור עד המשיכה הבאה
                            </span>
                          )}
                        </label>
                      </div>
                    )}
                  </GlassCard>
                )}

                {/* day entry */}
                <GlassCard className="p-6">
                  <h2 className="text-lg font-extrabold">הזנת ימי מסחר</h2>
                  <div className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
                    <p>
                      <strong className="text-foreground">ימי הפסד לא משפיעים על חישוב העקביות.</strong> העקביות
                      מחושבת רק מתוך ימים רווחיים (חיוביים).
                    </p>
                    <p>
                      <strong className="text-foreground">כל שורה = ביצוע יומי מצטבר</strong> (לא עסקה בודדת). הזינו
                      את סך הרווח/הפסד של כל יום מסחר. ליום שלילי הקלידו <strong className="text-foreground">מינוס (-)</strong>{" "}
                      לפני הסכום. <strong className="text-foreground">אל תעגלו</strong> – הזינו את הסכום המדויק.
                    </p>
                  </div>

                  <div className="mt-5 space-y-2.5">
                    {days.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-12 shrink-0 text-xs font-bold text-muted-foreground">
                          יום <span dir="ltr">{i + 1}</span>
                        </span>
                        <input
                          type="number"
                          step="any"
                          inputMode="decimal"
                          dir="ltr"
                          value={d}
                          onChange={(e) => setDay(i, e.target.value)}
                          placeholder="הכנס רווח/הפסד"
                          className={`min-w-0 flex-1 rounded-xl border bg-navy-950/70 px-4 py-2.5 text-sm font-bold outline-none transition-colors placeholder:text-right focus:border-secondary/50 ${
                            d !== "" && parseFloat(d) < 0
                              ? "border-red-500/40 text-red-400"
                              : d !== "" && parseFloat(d) > 0
                                ? "border-emerald-500/30 text-emerald-400"
                                : "border-white/10 text-foreground"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => flipSign(i)}
                          title="הפוך למינוס"
                          aria-label="הפוך למינוס"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg glass-bright text-muted-foreground transition-colors hover:text-secondary"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        {days.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDay(i)}
                            title={`מחק יום ${i + 1}`}
                            aria-label={`מחק יום ${i + 1}`}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg glass-bright text-muted-foreground transition-colors hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setDays((prev) => [...prev, ""])}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-primary/40 px-4 py-2.5 text-sm font-bold text-primary transition-all hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4" />
                    הוסף יום
                  </button>

                  {/* live mini summary */}
                  {result && (
                    <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/5 pt-4 text-sm sm:grid-cols-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-muted-foreground">סה״כ ימים:</span>
                        <span className="font-black" dir="ltr">{result.totalDays}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] text-muted-foreground">ימים רווחיים:</span>
                        <span className="font-black text-emerald-400" dir="ltr">{result.profitDaysCount}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] text-muted-foreground">סה״כ רווח/הפסד:</span>
                        <span
                          className={`font-black ${result.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}
                          dir="ltr"
                        >
                          ${fmt(result.totalProfit)}
                        </span>
                      </div>
                      {stage?.profitTarget != null && stage.profitTarget > 0 && calcType !== "second" && (
                        <div className="flex flex-col">
                          <span className="text-[11px] text-muted-foreground">נותר ליעד:</span>
                          <span className="font-black text-secondary" dir="ltr">
                            {result.totalProfit >= stage.profitTarget
                              ? "הגעת ליעד! ✓"
                              : `$${fmt(stage.profitTarget - result.totalProfit)}`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </GlassCard>

                {/* results */}
                {result && stage && dailyPnl.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="space-y-5"
                  >
                    {/* status banner */}
                    <GlassCard
                      glow={result.passesAll}
                      className={`p-6 text-center ${
                        result.passesAll ? "border-emerald-500/30 !bg-emerald-500/[0.04]" : "border-red-500/30 !bg-red-500/[0.04]"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {result.passesAll ? (
                          <>
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
                              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                            </span>
                            <h2 className="text-xl font-black text-emerald-400">עומד בתנאים! ✓</h2>
                            <p className="text-xs text-muted-foreground">כל הקריטריונים מתקיימים</p>
                          </>
                        ) : (
                          <>
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15">
                              <XCircle className="h-8 w-8 text-red-400" />
                            </span>
                            <h2 className="text-xl font-black text-red-400">לא עומד בתנאים</h2>
                            <p className="text-xs text-muted-foreground">ישנם קריטריונים שטרם התמלאו</p>
                          </>
                        )}
                      </div>
                    </GlassCard>

                    {/* withdrawal status */}
                    {isSimFunded && calcType === "second" && (
                      <GlassCard className="space-y-4 border-secondary/30 p-5">
                        <h3 className="flex items-center gap-2 text-sm font-extrabold text-secondary">
                          <Wallet className="h-4 w-4" />
                          סטטוס משיכה נוספת
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div className="rounded-xl bg-white/[0.03] p-3">
                            <div className="text-lg font-black" dir="ltr">${fmt0(balanceNum)}</div>
                            <div className="mt-0.5 text-[11px] text-muted-foreground">יתרה אחרי משיכה ראשונה</div>
                          </div>
                          <div className="rounded-xl bg-white/[0.03] p-3">
                            <div
                              className={`text-lg font-black ${balanceNum + result.totalProfit >= balanceNum ? "text-emerald-400" : "text-red-400"}`}
                              dir="ltr"
                            >
                              ${fmt0(balanceNum + result.totalProfit)}
                            </div>
                            <div className="mt-0.5 text-[11px] text-muted-foreground">יתרה צפויה כעת</div>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">יעד רווח למשיכה הבאה:</span>
                            <span className="font-bold" dir="ltr">${effectiveWithdrawTarget.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">רווח שנצבר במחזור:</span>
                            <span
                              className={`font-bold ${result.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}
                              dir="ltr"
                            >
                              ${fmt(result.totalProfit)}
                            </span>
                          </div>
                          <ProgressBar
                            value={effectiveWithdrawTarget > 0 ? (result.totalProfit / effectiveWithdrawTarget) * 100 : 0}
                          />
                          <p
                            className={`text-xs font-semibold ${
                              result.totalProfit >= effectiveWithdrawTarget ? "text-emerald-400" : "text-secondary"
                            }`}
                          >
                            {result.totalProfit >= effectiveWithdrawTarget
                              ? "🎯 הגעת ליעד! ניתן לבצע משיכה נוספת (בכפוף לעקביות)"
                              : `נדרש לנפח עוד $${fmt(Math.max(0, effectiveWithdrawTarget - result.totalProfit))} עד למשיכה הבאה`}
                          </p>
                        </div>
                        {(stage.minProfitPerDay !== null || stage.minTradingDays !== null) && (
                          <div className="space-y-2 border-t border-secondary/15 pt-3 text-sm">
                            <div className="flex items-start gap-2 rounded-lg bg-white/[0.03] px-3 py-2.5 text-xs leading-relaxed text-foreground/70">
                              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                              <span>
                                <strong className="text-foreground">המחזור התאפס לחלוטין.</strong> כל יום ירוק חדש
                                שעומד בכלל המינימום נחשב מחדש לספירת ימי המסחר.
                              </span>
                            </div>
                            {stage.minProfitPerDay !== null && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  ימים תקינים (מעל $<span dir="ltr">{stage.minProfitPerDay}</span>):
                                </span>
                                <Badge tone="muted"><span dir="ltr">{result.daysAboveMin}</span> ימים</Badge>
                              </div>
                            )}
                            {stage.minTradingDays !== null && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">ימי מסחר במחזור הנוכחי:</span>
                                <Badge tone="muted"><span dir="ltr">{result.totalDays}</span> ימים</Badge>
                              </div>
                            )}
                          </div>
                        )}
                      </GlassCard>
                    )}

                    {/* consistency card */}
                    {result.hasConsistencyRule ? (
                      <GlassCard className="space-y-3 p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-extrabold">עקביות</h3>
                          <Badge tone={result.passesConsistency && result.passesLeniency ? "cyan" : "hot"}>
                            {result.passesConsistency && result.passesLeniency ? "עובר" : "לא עובר"}
                          </Badge>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">יום הגבוה ביותר:</span>
                            <span className="font-bold" dir="ltr">
                              ${fmt(result.highestDay)} (יום {result.highestDayIndex + 1})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">רווח נטו:</span>
                            <span className="font-bold" dir="ltr">${fmt(result.totalProfit)}</span>
                          </div>
                          {result.recommendedMax !== null && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                מקסימום ליום (<span dir="ltr">{stage.consistencyRule}%</span> מהיעד):
                              </span>
                              <span className="font-bold text-secondary" dir="ltr">${fmt0(result.recommendedMax)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">אחוז היום הגבוה:</span>
                            <span
                              className={`font-bold ${result.passesConsistency ? "text-emerald-400" : "text-red-400"}`}
                              dir="ltr"
                            >
                              {fmt(result.consistencyPercent, 1)}%
                            </span>
                          </div>
                        </div>

                        {!result.passesConsistency && (
                          <div className="space-y-1.5">
                            <p className="flex items-center gap-1 text-xs text-red-400">
                              <XCircle className="h-3 w-3" />
                              היום הגבוה ביותר חורג ממגבלת ה-<span dir="ltr">{stage.consistencyRule}%</span>
                            </p>
                            <div className="space-y-2 rounded-lg border border-red-500/15 bg-red-500/[0.05] p-3">
                              {result.useTargetBase ? (
                                <>
                                  <p className="text-xs leading-relaxed text-foreground/80">
                                    <strong className="text-red-400">⚠️ מה זה אומר?</strong> היום הגבוה שלך ($
                                    <span dir="ltr">{fmt0(result.highestDay)}</span>) חורג מהמקסימום המותר ליום בודד (
                                    <strong dir="ltr">${result.recommendedMax?.toLocaleString()}</strong> ={" "}
                                    <span dir="ltr">{stage.consistencyRule}%</span> מיעד הרווח $
                                    <span dir="ltr">{stage.profitTarget?.toLocaleString()}</span>$). בפועל, היעד
                                    האפקטיבי שלך עולה ל-
                                    <strong className="text-foreground" dir="ltr">${result.effectiveTarget.toLocaleString()}</strong>{" "}
                                    (היום החזק × 2).
                                  </p>
                                  <p className="border-t border-red-500/10 pt-2 text-xs leading-relaxed text-foreground/60">
                                    <strong>💡 חשוב להבין:</strong> בחברה זו, המגבלה מחושבת מיעד הרווח — כלומר
                                    המקסימום ליום נשאר קבוע ($
                                    <span dir="ltr">{result.recommendedMax?.toLocaleString()}</span>). אם חרגת, עליך
                                    להגיע ליעד האפקטיבי ($<span dir="ltr">{result.effectiveTarget.toLocaleString()}</span>$)
                                    כדי לעבור.
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="text-xs leading-relaxed text-foreground/80">
                                    <strong className="text-red-400">⚠️ מה זה אומר?</strong> היום הגבוה שלך ($
                                    <span dir="ltr">{fmt0(result.highestDay)}</span>) חורג ממגבלת ה-
                                    <span dir="ltr">{stage.consistencyRule}%</span>. בפועל, היעד שלך עולה אוטומטית ל-
                                    <strong className="text-foreground" dir="ltr">${result.effectiveTarget.toLocaleString()}</strong>{" "}
                                    כדי שאותו יום ייחשב תקין.
                                  </p>
                                  <p className="border-t border-red-500/10 pt-2 text-xs leading-relaxed text-foreground/60">
                                    <strong>💡 חשוב להבין:</strong> ימי הפסד לא משפיעים כלל על חישוב העקביות —
                                    העקביות מחושבת רק מתוך ימים רווחיים. לכן, אין טעם "לרדוף" אחרי החזרת הפסד ביום
                                    אחד גדול — זה רק מגדיל את היעד האפקטיבי שלך. עדיף לפזר את הרווחים על פני ימים
                                    רבים ולשמור על עקביות.
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* leniency */}
                        {result.hasLeniency && result.profitDaysCount === 2 && (
                          <div className="space-y-1.5 border-t border-white/5 pt-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">הפרש בין ימים רווחיים:</span>
                              <span
                                className={`font-bold ${result.passesLeniency ? "text-emerald-400" : "text-red-400"}`}
                                dir="ltr"
                              >
                                ${fmt(result.maxDayDifference)} / ${stage.consistencyLeniency}
                              </span>
                            </div>
                            {!result.passesLeniency ? (
                              <p className="text-xs text-red-400">
                                ההפרש בין הימים חורג מסטיית התקן המותרת ($<span dir="ltr">{stage.consistencyLeniency}</span>)
                              </p>
                            ) : (
                              <p className="text-xs text-emerald-400">ההפרש בין הימים בגבול סטיית התקן המותרת</p>
                            )}
                          </div>
                        )}
                      </GlassCard>
                    ) : (
                      <GlassCard className="p-5 text-center text-sm text-muted-foreground">
                        אין דרישת עקביות בשלב זה
                      </GlassCard>
                    )}

                    {/* profit target */}
                    {result.hasProfitTarget && calcType !== "second" ? (
                      <GlassCard className="space-y-3 p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-extrabold">יעד רווח</h3>
                          <Badge tone={result.passesTarget ? "cyan" : "muted"}>
                            {result.passesTarget ? "הושג" : "טרם הושג"}
                          </Badge>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">יעד:</span>
                            <span className="font-bold" dir="ltr">${stage.profitTarget?.toLocaleString()}</span>
                          </div>
                          {result.targetIncreased && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">יעד אפקטיבי (בגלל חריגת עקביות):</span>
                              <span className="font-bold text-secondary" dir="ltr">
                                ${result.effectiveTarget.toLocaleString()}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">רווח נוכחי (נטו):</span>
                            <span
                              className={`font-bold ${result.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}
                              dir="ltr"
                            >
                              ${fmt(result.totalProfit)}
                            </span>
                          </div>
                        </div>
                        <ProgressBar value={result.profitTargetPercent} />
                        <p
                          className={`text-xs font-semibold ${result.passesTarget ? "text-emerald-400" : "text-secondary"}`}
                        >
                          {result.passesTarget
                            ? "הגעת ליעד הרווח! 🎯"
                            : result.targetIncreased
                              ? `נותרו $${fmt(result.effectiveTarget - result.totalProfit)} ליעד האפקטיבי`
                              : `נותרו $${fmt((stage.profitTarget as number) - result.totalProfit)} ליעד`}
                        </p>
                      </GlassCard>
                    ) : result.hasImpliedTarget ? (
                      <GlassCard className="space-y-3 p-5">
                        <h3 className="text-sm font-extrabold">יעד רווח</h3>
                        <p className="text-xs leading-relaxed text-foreground/80">
                          📌 ללא יעד רווח מוגדר — היום הגבוה ביותר קובע את הרווח <strong>הנטו</strong> הנדרש לעמידה
                          בעקביות.
                        </p>
                        <p className="text-[11px] text-muted-foreground" dir="rtl">
                          נוסחה: יום גבוה ($<span dir="ltr">{fmt(result.highestDay)}</span>) ÷{" "}
                          <span dir="ltr">{result.useTargetBase ? 50 : stage.consistencyRule}%</span> = יעד נדרש
                        </p>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">יעד נדרש (מעקביות):</span>
                            <span className="font-bold text-secondary" dir="ltr">
                              ${fmt(result.consistencyDerivedTarget)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">רווח נטו נוכחי:</span>
                            <span
                              className={`font-bold ${result.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}
                              dir="ltr"
                            >
                              ${fmt(result.totalProfit)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">אחוז יום גבוה מנטו:</span>
                            <span className="font-bold" dir="ltr">{fmt(result.impliedConsistencyPercent, 1)}%</span>
                          </div>
                        </div>
                        <ProgressBar
                          value={
                            result.totalProfit > 0
                              ? Math.min((result.totalProfit / result.consistencyDerivedTarget) * 100, 100)
                              : 0
                          }
                        />
                        <p
                          className={`text-xs font-semibold ${
                            result.impliedTargetMet ? "text-emerald-400" : result.totalProfit > 0 ? "text-secondary" : "text-red-400"
                          }`}
                        >
                          {result.impliedTargetMet
                            ? "הרווח הנטו עומד בדרישת העקביות! 🎯"
                            : result.totalProfit > 0
                              ? `נותרו $${fmt(result.consistencyDerivedTarget - result.totalProfit)} ברווח נטו`
                              : "הרווח הנטו שלילי — יש להגיע לרווח חיובי תחילה"}
                        </p>
                      </GlassCard>
                    ) : calcType !== "second" ? (
                      <GlassCard className="p-5 text-center text-sm text-muted-foreground">
                        אין יעד רווח מוגדר בשלב זה
                      </GlassCard>
                    ) : null}

                    {/* statistics */}
                    <GlassCard className="p-5">
                      <h3 className="mb-4 text-sm font-extrabold">סיכום סטטיסטי</h3>
                      <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
                        <div className="rounded-xl bg-white/[0.03] p-3">
                          <div className="text-xl font-black" dir="ltr">{result.totalDays}</div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground">ימים סה״כ</div>
                        </div>
                        <div className="rounded-xl bg-white/[0.03] p-3">
                          <div className="text-xl font-black text-emerald-400" dir="ltr">{result.profitDaysCount}</div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground">ימים רווחיים</div>
                        </div>
                        <div className="rounded-xl bg-white/[0.03] p-3">
                          <div className="text-xl font-black text-red-400" dir="ltr">{result.lossDaysCount}</div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground">ימי הפסד</div>
                        </div>
                        <div className="rounded-xl bg-white/[0.03] p-3">
                          <div
                            className={`text-xl font-black ${result.totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}
                            dir="ltr"
                          >
                            ${fmt0(result.totalProfit)}
                          </div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground">רווח נטו</div>
                        </div>
                      </div>
                      {(result.hasMinDays || result.hasMinProfitPerDay) && (
                        <div className="mt-4 space-y-2 border-t border-white/5 pt-3 text-sm">
                          {result.hasMinDays && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                ימי מסחר מינימום: <span dir="ltr">{stage.minTradingDays}</span>
                              </span>
                              <Badge tone={result.passesMinDays ? "cyan" : "hot"}>
                                {result.passesMinDays ? "עובר" : "לא עובר"}
                              </Badge>
                            </div>
                          )}
                          {result.hasMinProfitPerDay && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                ימים מעל $<span dir="ltr">{stage.minProfitPerDay}</span> מינימום:
                              </span>
                              <Badge tone="muted"><span dir="ltr">{result.daysAboveMin}</span> ימים</Badge>
                            </div>
                          )}
                        </div>
                      )}
                    </GlassCard>

                    {/* smart tip */}
                    {result.hasConsistencyRule && result.recommendedMax !== null && (
                      <GlassCard className="flex items-start gap-3 border-secondary/25 p-5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                          <Lightbulb className="h-5 w-5 text-secondary" />
                        </span>
                        <div>
                          <h3 className="text-sm font-extrabold text-secondary">טיפ חכם</h3>
                          <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                            כדי לעבור עקביות של <span dir="ltr">{stage.consistencyRule}%</span>, כוון למקסימום{" "}
                            <strong className="text-foreground" dir="ltr">${fmt0(result.recommendedMax)}</strong>{" "}
                            ביום הגבוה ביותר.
                            {stage.profitTarget && stage.consistencyRule ? (
                              <>
                                {" "}
                                לדוגמה: <span dir="ltr">{Math.ceil(100 / stage.consistencyRule)}</span> ימים שווים של{" "}
                                <strong className="text-foreground" dir="ltr">
                                  ${fmt0(stage.profitTarget / Math.ceil(100 / stage.consistencyRule))}
                                </strong>{" "}
                                כל אחד.
                              </>
                            ) : null}
                          </p>
                        </div>
                      </GlassCard>
                    )}

                    {/* daily breakdown */}
                    <GlassCard className="p-5">
                      <h3 className="mb-3 text-sm font-extrabold">פירוט יומי</h3>
                      <div className="space-y-1.5">
                        {dailyPnl.map((v, i) => (
                          <div
                            key={i}
                            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                              i === result.highestDayIndex && v > 0
                                ? "bg-secondary/10 border border-secondary/30"
                                : "bg-white/[0.03]"
                            }`}
                          >
                            <span className="text-muted-foreground">
                              יום <span dir="ltr">{i + 1}</span>
                              {i === result.highestDayIndex && v > 0 && (
                                <span className="mr-2 text-[10px] font-bold text-secondary">הגבוה ביותר</span>
                              )}
                            </span>
                            <span className={`font-bold ${v > 0 ? "text-emerald-400" : v < 0 ? "text-red-400" : ""}`} dir="ltr">
                              ${fmt(v)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={reset}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl glass-bright px-4 py-2.5 text-sm font-bold transition-all hover:border-primary/50 hover:text-primary"
                      >
                        <RotateCcw className="h-4 w-4" />
                        חישוב חדש
                      </button>
                    </GlassCard>

                    {/* offers for company */}
                    {companyOffers.length > 0 && (
                      <GlassCard glow className="p-5">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-gradient-gold">
                          <TrendingUp className="h-4 w-4 text-secondary" />
                          מבצעים זמינים ב-{company.shortName || company.name}
                        </h3>
                        <div className="space-y-3">
                          {companyOffers.slice(0, 2).map((o) => (
                            <div key={o.id} className="rounded-xl bg-white/[0.03] p-4">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-bold">{o.title}</span>
                                <span className="shrink-0 text-sm font-black text-gradient-gold" dir="ltr">
                                  {o.discount}
                                </span>
                              </div>
                              {o.code && <div className="mt-2.5"><CopyCode code={o.code} /></div>}
                              <a
                                href={o.affiliateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-gold px-4 py-2 text-sm font-bold text-navy-950 transition-all hover:shadow-glow-gold"
                              >
                                מימוש המבצע
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          ))}
                        </div>
                        {showcase && (
                          <a
                            href={`/company/${showcase.id}`}
                            className="mt-4 block text-center text-xs font-bold text-primary hover:text-secondary"
                          >
                            לדף {company.shortName || company.name}
                          </a>
                        )}
                      </GlassCard>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* overview content */}
      <section className="container relative py-14">
        <SectionHeading eyebrow="סקירה כללית" title="מחשבון כלל העקביות" highlight="של PayLess" />
        <div className="mx-auto max-w-3xl space-y-6">
          <Reveal>
            <GlassCard className="space-y-4 p-7 text-sm leading-relaxed text-foreground/85">
              <p>
                <strong className="text-foreground">מחשבון כלל העקביות של PayLess</strong> הוא כלי חינמי לחלוטין (ללא
                עלויות נסתרות) שעוזר לך לחשב כמה רווח יומי נדרש כדי לעבור בהצלחה את שלב ההערכה של חברת המימון שבחרת.
              </p>
              <p>
                בניגוד למחשבונים אחרים, הכלי שלנו הוא <strong className="text-foreground">אוניברסלי</strong> — תומך
                ב-MFFU, TPT, FundedNext, Alpha Futures ו-Lucid Trading, כולל כל התוכניות, גדלי החשבון והשלבים.
              </p>
              <p>
                פשוט הכניסו את ה-PnL היומי בשדות, הוסיפו שורה לכל יום מסחר, והמחשבון יציג בזמן אמת האם אתם עומדים
                במגבלת האחוז היומי ובהתקדמות ליעד הרווח.
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.06}>
            <GlassCard className="p-7">
              <h3 className="mb-4 text-lg font-extrabold text-gradient-gold">איך להשתמש במחשבון</h3>
              <ol className="space-y-3 text-sm leading-relaxed text-foreground/85">
                {[
                  "בחרו את חברת המימון מבין החברות הנתמכות.",
                  "בחרו תוכנית (Plan), גודל חשבון ושלב (Evaluation / Sim-Funded).",
                  "הזינו את הרווח או ההפסד היומי בשדה המתאים.",
                ].map((s, i) => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-xs font-black text-secondary" dir="ltr">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-xs font-black text-secondary" dir="ltr">
                    4
                  </span>
                  <span>
                    לחצו <strong className="text-foreground">+ הוסף יום</strong> לכל יום מסחר נוסף.
                  </span>
                </li>
              </ol>
              <p className="mt-4 border-t border-white/5 pt-4 text-xs leading-relaxed text-muted-foreground">
                כל שורה מייצגת את <strong className="text-foreground">הסיכום היומי הכולל</strong> — לא עסקה בודדת.
                הזינו את המספר המדויק כולל שברים עשרוניים.
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.12}>
            <GlassCard className="space-y-4 p-7 text-sm leading-relaxed text-foreground/85">
              <h3 className="text-lg font-extrabold text-gradient-gold">מהו כלל העקביות?</h3>
              <p>כלל העקביות הוא הדרך של חברות המימון להפריד בין סוחרים ממושמעים לבין כאלה שפשוט היה להם מזל פעם אחת.</p>
              <p>
                רוב חברות המימון דורשות שהרווחים שלך יתפלגו באופן שווה על פני מספר ימי מסחר — בדרך כלל, אף יום בודד לא
                יכול להוות יותר מ-<span dir="ltr">50%</span> מסך הרווחים.
              </p>
              <p>
                הכלל הזה מוכיח שאתם יודעים לנהל סיכון, לסחור בתנאי שוק שונים ולהפיק ביצועים עקביים. זה לא מלכודת — זה
                מדד למקצועיות אמיתית.
              </p>
              <div className="rounded-xl border border-secondary/20 bg-secondary/[0.05] p-4 text-xs leading-relaxed">
                <strong className="text-secondary">דוגמה:</strong> אם יעד הרווח הוא $5,000 וכלל העקביות הוא 50%, אף
                יום בודד לא צריך לתרום יותר מ-$2,500. אם יום אחד חזק תורם חלק גדול מדי, תצטרכו להמשיך לסחור ולפזר את
                הרווחים.
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="container relative pb-10">
        <SectionHeading title="שאלות נפוצות" highlight="(FAQ)" />
        <div className="mx-auto max-w-3xl">
          <FaqList items={faqs} />
        </div>
      </section>

      {/* all offers CTA */}
      <section className="container relative pb-6">
        <Reveal>
          <GlassCard glow className="relative overflow-hidden p-8 text-center md:p-10">
            <div className="grid-overlay absolute inset-0 opacity-50" />
            <div className="relative">
              <h2 className="text-2xl font-black">
                <span className="text-gradient-ice">כל המבצעים</span>{" "}
                <span className="text-gradient-gold">וההנחות</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                צפו בכל המבצעים הפעילים מחברות המימון המובילות במקום אחד
              </p>
              <div className="mt-6">
                <GoldButton to="/offers">לכל המבצעים</GoldButton>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </section>

      <ToolsCrossLinks exclude="/tools/consistency-calculator" />
    </>
  );
}
