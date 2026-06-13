import { useEffect, useRef, useState } from "react";
import { Award, Download, Sparkles } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { GlassCard, Reveal, GhostButton } from "@/components/ui/primitives";

const accountSizes = ["$25,000", "$50,000", "$75,000", "$100,000", "$150,000"];
const certTypes = [
  { id: "challenge", label: "מעבר אתגר" },
  { id: "funded", label: "חשבון ממומן" },
  { id: "payout", label: "משיכת רווחים" },
];
const companyNames = ["My Funded Futures", "Take Profit Trader", "FundedNext", "Alpha Futures", "Lucid Trading", "Top One Futures", "Funded Futures Family"];

const inputCls =
  "w-full rounded-xl border border-white/10 bg-navy-950/60 px-4 py-3 font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-secondary/60";

export default function CertificateGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState("");
  const [company, setCompany] = useState(companyNames[0]);
  const [size, setSize] = useState(accountSizes[1]);
  const [type, setType] = useState("challenge");
  const [date, setDate] = useState(() => new Date().toLocaleDateString("he-IL"));

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, company, size, type, date]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 1200, H = 850;
    canvas.width = W;
    canvas.height = H;

    // background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0d1a24");
    bg.addColorStop(1, "#0a131b");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // gold double frame
    ctx.strokeStyle = "rgba(212,175,106,0.9)";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.strokeStyle = "rgba(212,175,106,0.35)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(56, 56, W - 112, H - 112);

    // corner flourishes
    ctx.fillStyle = "rgba(212,175,106,0.9)";
    [[40, 40], [W - 40, 40], [40, H - 40], [W - 40, H - 40]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.textAlign = "center";

    // brand
    ctx.fillStyle = "#d4af6a";
    ctx.font = "700 34px Heebo, sans-serif";
    ctx.fillText("PAYLESS", W / 2, 130);
    ctx.fillStyle = "rgba(230,225,210,0.6)";
    ctx.font = "400 17px Heebo, sans-serif";
    ctx.fillText("Prop Firm Payless · propfirmpayless.com", W / 2, 158);

    // title
    const titles: Record<string, string> = {
      challenge: "תעודת מעבר אתגר",
      funded: "תעודת חשבון ממומן",
      payout: "תעודת משיכת רווחים",
    };
    ctx.fillStyle = "#f3efe4";
    ctx.font = "800 56px Heebo, sans-serif";
    ctx.fillText(titles[type], W / 2, 290);

    // divider
    const grad = ctx.createLinearGradient(W / 2 - 180, 0, W / 2 + 180, 0);
    grad.addColorStop(0, "rgba(212,175,106,0)");
    grad.addColorStop(0.5, "rgba(212,175,106,1)");
    grad.addColorStop(1, "rgba(212,175,106,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(W / 2 - 180, 320, 360, 3);

    // recipient
    ctx.fillStyle = "rgba(230,225,210,0.7)";
    ctx.font = "400 22px Heebo, sans-serif";
    ctx.fillText("מוענקת בזאת לסוחר", W / 2, 390);

    ctx.fillStyle = "#d4af6a";
    ctx.font = "800 64px Heebo, sans-serif";
    ctx.fillText(name || "שם הסוחר", W / 2, 460);

    // body
    ctx.fillStyle = "rgba(230,225,210,0.85)";
    ctx.font = "400 26px Heebo, sans-serif";
    const bodyMap: Record<string, string> = {
      challenge: `על מעבר מוצלח של אתגר המימון בחברת ${company}`,
      funded: `על קבלת חשבון ממומן בגובה ${size} בחברת ${company}`,
      payout: `על משיכת רווחים מוצלחת מחשבון ${company}`,
    };
    ctx.fillText(bodyMap[type], W / 2, 540);
    ctx.font = "700 30px Heebo, sans-serif";
    ctx.fillStyle = "#3fa9c9";
    ctx.fillText(`הון חשבון: ${size}`, W / 2, 600);

    // footer
    ctx.fillStyle = "rgba(230,225,210,0.6)";
    ctx.font = "400 20px Heebo, sans-serif";
    ctx.fillText(`תאריך: ${date}`, W / 2, 720);
    ctx.fillStyle = "rgba(212,175,106,0.8)";
    ctx.font = "600 18px Heebo, sans-serif";
    ctx.fillText("הישג המעיד על משמעת עצמית, ניהול סיכונים ויכולת הצטיינות בתנאי השוק", W / 2, 755);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `payless-certificate-${type}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <>
      <Seo
        title="מחולל תעודות סוחר בעברית | PAYLESS"
        description="עצבו תעודת סוחר מעוצבת בעברית להישגי המסחר שלכם — מעבר אתגר, חשבון ממומן או משיכת רווחים. הורדה חינמית כקובץ תמונה."
      />
      <PageHero
        eyebrow="כלי חינמי"
        title="מחולל"
        highlight="תעודות סוחר"
        subtitle="הנציחו את הישגי המסחר שלכם בתעודה מעוצבת בעברית — מעבר אתגר, חשבון ממומן או משיכה. עיצוב חי והורדה מיידית."
      />

      <section className="container relative pb-16">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* form */}
          <Reveal>
            <GlassCard className="p-7">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-extrabold">
                <Sparkles className="h-5 w-5 text-primary" /> עריכת פרטים
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-bold">שם הסוחר</label>
                  <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="הזן את שמך" maxLength={28} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold">סוג תעודה</label>
                  <div className="grid grid-cols-3 gap-2">
                    {certTypes.map((t) => (
                      <button key={t.id} onClick={() => setType(t.id)} className={`rounded-xl px-2 py-2.5 text-xs font-bold transition-all ${type === t.id ? "bg-gradient-gold text-navy-950 shadow-glow-gold" : "glass-bright text-muted-foreground hover:text-foreground"}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold">חברה</label>
                  <select className={inputCls} value={company} onChange={(e) => setCompany(e.target.value)}>
                    {companyNames.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold">גודל חשבון</label>
                  <select className={inputCls} value={size} onChange={(e) => setSize(e.target.value)}>
                    {accountSizes.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold">תאריך</label>
                  <input className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <button onClick={download} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold px-7 py-3.5 font-bold text-navy-950 transition-all hover:shadow-glow-gold">
                  <Download className="h-5 w-5" /> הורד תעודה (PNG)
                </button>
              </div>
            </GlassCard>
          </Reveal>

          {/* live preview */}
          <Reveal delay={0.1}>
            <GlassCard className="flex items-center justify-center overflow-hidden p-4 md:p-6">
              <canvas ref={canvasRef} className="h-auto w-full max-w-full rounded-xl" style={{ aspectRatio: "1200 / 850" }} />
            </GlassCard>
          </Reveal>
        </div>

        <Reveal className="mt-8 flex items-center justify-center gap-3">
          <GhostButton to="/services/funded-award">
            <Award className="h-4 w-4" /> רוצים תעודת אקריליק פיזית? Funded Award
          </GhostButton>
          <GhostButton to="/tools">לכל הכלים</GhostButton>
        </Reveal>
      </section>
    </>
  );
}
