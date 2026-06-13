import { useMemo, useState } from "react";
import { Calculator, ShieldAlert, TrendingUp, Layers } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { GlassCard, Reveal, GhostButton } from "@/components/ui/primitives";

/* Instrument specs — ported verbatim from the original risk calculator. */
const instruments = [
  { symbol: "ES", name: "S&P 500 (ES)", tickSize: 0.25, miniPointValue: 50, microPointValue: 5, miniSymbol: "ES", microSymbol: "MES" },
  { symbol: "NQ", name: "Nasdaq 100 (NQ)", tickSize: 0.25, miniPointValue: 20, microPointValue: 2, miniSymbol: "NQ", microSymbol: "MNQ" },
  { symbol: "YM", name: "Dow Jones (YM)", tickSize: 1, miniPointValue: 5, microPointValue: 0.5, miniSymbol: "YM", microSymbol: "MYM" },
  { symbol: "RTY", name: "Russell 2000 (RTY)", tickSize: 0.1, miniPointValue: 50, microPointValue: 5, miniSymbol: "RTY", microSymbol: "M2K" },
  { symbol: "GC", name: "זהב (GC)", tickSize: 0.1, miniPointValue: 100, microPointValue: 10, miniSymbol: "GC", microSymbol: "MGC" },
  { symbol: "CL", name: "נפט (CL)", tickSize: 0.01, miniPointValue: 1000, microPointValue: 100, miniSymbol: "CL", microSymbol: "MCL" },
];

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });

const inputCls =
  "w-full rounded-xl border border-white/10 bg-navy-950/60 px-4 py-3 font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-secondary/60";

export default function RiskCalculator() {
  const [accountSize, setAccountSize] = useState("50000");
  const [riskMode, setRiskMode] = useState<"percent" | "amount">("percent");
  const [riskPercent, setRiskPercent] = useState("1");
  const [riskAmountInput, setRiskAmountInput] = useState("500");
  const [symbol, setSymbol] = useState("ES");
  const [stopUnit, setStopUnit] = useState<"ticks" | "points">("points");
  const [stopValue, setStopValue] = useState("10");

  const inst = instruments.find((i) => i.symbol === symbol)!;

  const r = useMemo(() => {
    const acct = parseFloat(accountSize) || 0;
    const riskAmount = riskMode === "percent" ? (acct * (parseFloat(riskPercent) || 0)) / 100 : parseFloat(riskAmountInput) || 0;
    const stopPoints = stopUnit === "ticks" ? (parseFloat(stopValue) || 0) * inst.tickSize : parseFloat(stopValue) || 0;
    const miniRisk = stopPoints * inst.miniPointValue;
    const microRisk = stopPoints * inst.microPointValue;
    const miniContracts = miniRisk > 0 ? Math.floor(riskAmount / miniRisk) : 0;
    const microContracts = microRisk > 0 ? Math.floor(riskAmount / microRisk) : 0;
    return {
      riskAmount,
      stopPoints,
      miniRisk,
      microRisk,
      miniContracts,
      microContracts,
      actualMini: miniContracts * miniRisk,
      actualMicro: microContracts * microRisk,
      tooTight: riskAmount > 0 && miniRisk > 0 && microRisk > 0 && miniContracts === 0 && microContracts === 0,
    };
  }, [accountSize, riskMode, riskPercent, riskAmountInput, inst, stopUnit, stopValue]);

  return (
    <>
      <Seo
        title="מחשבון ניהול סיכונים לסוחרי חוזים עתידיים | PAYLESS"
        description="חישוב כמות חוזים מומלצת (מיני ומיקרו) לפי גודל חשבון, אחוז סיכון וסטופ לוס - תמיכה ב-ES, NQ, YM, RTY, GC, CL. כלי חינמי."
      />
      <PageHero
        eyebrow="כלי חינמי"
        title="מחשבון"
        highlight="ניהול סיכונים"
        subtitle="חשבו את כמות החוזים האופטימלית (מיני ומיקרו) לפי גודל החשבון, אחוז הסיכון והסטופ לוס שלכם"
      />

      <section className="container relative pb-16">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_1fr]">
          {/* inputs */}
          <Reveal>
            <GlassCard className="p-7">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-extrabold">
                <Calculator className="h-5 w-5 text-primary" /> נתוני החישוב
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-bold">גודל החשבון ($)</label>
                  <input className={inputCls} dir="ltr" inputMode="numeric" value={accountSize} onChange={(e) => setAccountSize(e.target.value)} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">סיכון לעסקה</label>
                  <div className="mb-3 inline-flex rounded-xl glass-bright p-1">
                    <button onClick={() => setRiskMode("percent")} className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-all ${riskMode === "percent" ? "bg-gradient-gold text-navy-950" : "text-muted-foreground"}`}>אחוז</button>
                    <button onClick={() => setRiskMode("amount")} className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-all ${riskMode === "amount" ? "bg-gradient-gold text-navy-950" : "text-muted-foreground"}`}>סכום קבוע</button>
                  </div>
                  {riskMode === "percent" ? (
                    <div className="flex items-center gap-2">
                      <input className={inputCls} dir="ltr" inputMode="decimal" value={riskPercent} onChange={(e) => setRiskPercent(e.target.value)} />
                      <span className="text-lg font-bold text-muted-foreground">%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-muted-foreground">$</span>
                      <input className={inputCls} dir="ltr" inputMode="numeric" value={riskAmountInput} onChange={(e) => setRiskAmountInput(e.target.value)} />
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">מכשיר מסחר</label>
                  <div className="grid grid-cols-3 gap-2">
                    {instruments.map((i) => (
                      <button
                        key={i.symbol}
                        onClick={() => setSymbol(i.symbol)}
                        className={`rounded-xl px-3 py-2.5 text-center transition-all ${symbol === i.symbol ? "bg-gradient-gold text-navy-950 shadow-glow-gold" : "glass-bright text-muted-foreground hover:text-foreground"}`}
                      >
                        <span className="block text-sm font-black" dir="ltr">{i.symbol}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{inst.name} · ערך נקודה (מיני): ${inst.miniPointValue} · גודל טיק: {inst.tickSize}</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">סטופ לוס</label>
                  <div className="mb-3 inline-flex rounded-xl glass-bright p-1">
                    <button onClick={() => setStopUnit("points")} className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-all ${stopUnit === "points" ? "bg-gradient-gold text-navy-950" : "text-muted-foreground"}`}>נקודות</button>
                    <button onClick={() => setStopUnit("ticks")} className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-all ${stopUnit === "ticks" ? "bg-gradient-gold text-navy-950" : "text-muted-foreground"}`}>טיקים</button>
                  </div>
                  <input className={inputCls} dir="ltr" inputMode="decimal" value={stopValue} onChange={(e) => setStopValue(e.target.value)} />
                </div>
              </div>
            </GlassCard>
          </Reveal>

          {/* results */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-5">
              <GlassCard className="flex items-center justify-between p-6">
                <div>
                  <div className="text-sm text-muted-foreground">סכום הסיכון לעסקה</div>
                  <div className="text-3xl font-black text-gradient-gold" dir="ltr">${fmt(r.riskAmount)}</div>
                </div>
                <ShieldAlert className="h-9 w-9 text-secondary" />
              </GlassCard>

              <div className="grid gap-5 sm:grid-cols-2">
                <GlassCard glow className="flex flex-col items-center p-6 text-center">
                  <Layers className="mb-2 h-6 w-6 text-primary" />
                  <div className="text-xs text-muted-foreground">חוזי מיני ({inst.miniSymbol})</div>
                  <div className="my-1 text-4xl font-black text-gradient-cyan" dir="ltr">{r.miniContracts}</div>
                  <div className="text-xs text-muted-foreground" dir="ltr">סיכון בפועל: ${fmt(r.actualMini)}</div>
                </GlassCard>
                <GlassCard className="flex flex-col items-center p-6 text-center">
                  <Layers className="mb-2 h-6 w-6 text-secondary" />
                  <div className="text-xs text-muted-foreground">חוזי מיקרו ({inst.microSymbol})</div>
                  <div className="my-1 text-4xl font-black text-gradient-gold" dir="ltr">{r.microContracts}</div>
                  <div className="text-xs text-muted-foreground" dir="ltr">סיכון בפועל: ${fmt(r.actualMicro)}</div>
                </GlassCard>
              </div>

              <GlassCard className="p-6">
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">סטופ בנקודות</span>
                    <span className="font-bold" dir="ltr">{fmt(r.stopPoints)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">סיכון לחוזה מיני</span>
                    <span className="font-bold" dir="ltr">${fmt(r.miniRisk)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">סיכון לחוזה מיקרו</span>
                    <span className="font-bold" dir="ltr">${fmt(r.microRisk)}</span>
                  </div>
                </div>
                {r.tooTight && (
                  <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-red-400">
                    הסיכון לעסקה קטן מדי עבור חוזה בודד — הגדילו את הסיכון או צמצמו את הסטופ.
                  </p>
                )}
              </GlassCard>

              <GlassCard className="flex items-start gap-3 p-5">
                <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  המחשבון מספק הערכה לצורכי מידע בלבד ואינו מהווה ייעוץ. נהלו סיכון באחריות — אף עסקה אינה מבטיחה רווח.
                </p>
              </GlassCard>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-10 text-center">
          <GhostButton to="/tools">לכל הכלים</GhostButton>
        </Reveal>
      </section>
    </>
  );
}
