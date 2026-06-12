import { useState } from "react";
import { Mail, MessageCircle, Clock, Loader2, CheckCircle2, Send } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { GlassCard, Reveal } from "@/components/ui/primitives";
import { socials } from "@/data/site";
import { sendContactMessage } from "@/lib/contact";

const subjects = ["שאלה כללית", "בקשה לייעוץ", "בעיה טכנית", "הצעה לשיתוף פעולה", "אחר"];

const miniFaq = [
  { q: "איך תוכלו לעזור לי לבחור חברת מימון?", a: "אנחנו מספקים השוואה מקיפה ויעוץ אישי בהתאם לפרופיל הסיכון שלכם" },
  { q: "האם השירות בחינם?", a: "כן! כל שירותי ההשוואה והייעוץ שלנו ללא תשלום" },
  { q: "כמה זמן לוקח לקבל מענה?", a: "אנחנו חוזרים תוך 24 שעות בממוצע" },
];

const inputCls =
  "w-full rounded-xl border border-white/10 bg-navy-950/60 px-4 py-3 font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-secondary/60";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [terms, setTerms] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return "שם הוא שדה חובה";
    if (form.name.length > 100) return "שם חייב להיות קצר מ-100 תווים";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "כתובת מייל לא תקינה";
    if (form.email.length > 255) return "מייל חייב להיות קצר מ-255 תווים";
    if (form.phone.length > 20) return "מספר טלפון חייב להיות קצר מ-20 תווים";
    if (!form.subject) return "נושא הוא שדה חובה";
    if (!form.message.trim()) return "הודעה היא שדה חובה";
    if (form.message.length > 1000) return "הודעה חייבת להיות קצרה מ-1000 תווים";
    if (!terms) return "יש לאשר את תנאי השימוש ומדיניות הפרטיות";
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      await sendContactMessage({ ...form, agreedToTerms: terms });
      setStatus("done");
    } catch {
      setStatus("error");
      setError(
        "אירעה שגיאה בשליחת ההודעה. אנא נסה שוב או צור קשר ישירות באימייל support@propfirmpayless.com"
      );
    }
  };

  return (
    <>
      <Seo
        title="צור קשר - PAYLESS | שאלות, ייעוץ ותמיכה"
        description="יש לכם שאלות על חברות מימון? צריכים ייעוץ אישי? צרו קשר עם הצוות של PAYLESS - זמינים בווטסאפ, מייל וטלפון. זמני פעילות: א'-ה' 9:00-18:00"
      />
      <PageHero
        eyebrow="דברו איתנו"
        title="צור"
        highlight="קשר"
        subtitle="יש לכם שאלות? רוצים ייעוץ אישי? אנחנו כאן בשבילכם!"
      />

      <section className="container relative pb-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* form */}
          <Reveal>
            <GlassCard className="p-7 md:p-9">
              <h2 className="mb-6 text-2xl font-extrabold">שלחו לנו הודעה</h2>
              {status === "done" ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-emerald-500/10 px-6 py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                  <div className="text-xl font-extrabold text-emerald-400">ההודעה נשלחה בהצלחה!</div>
                  <p className="text-muted-foreground">ניצור איתך קשר בהקדם האפשרי</p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-bold">
                        שם מלא <span className="text-secondary">*</span>
                      </label>
                      <input className={inputCls} placeholder="הכנס את שמך המלא" value={form.name} onChange={set("name")} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-bold">
                        כתובת מייל <span className="text-secondary">*</span>
                      </label>
                      <input className={inputCls} dir="ltr" type="email" placeholder="your@email.com" value={form.email} onChange={set("email")} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-bold">טלפון</label>
                      <input className={inputCls} dir="ltr" type="tel" value={form.phone} onChange={set("phone")} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-bold">
                        נושא הפנייה <span className="text-secondary">*</span>
                      </label>
                      <select className={inputCls} value={form.subject} onChange={set("subject")}>
                        <option value="" disabled>בחרו נושא פנייה</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-bold">
                      הודעה <span className="text-secondary">*</span>
                    </label>
                    <textarea
                      className={`${inputCls} min-h-32 resize-y`}
                      placeholder="פרטו כאן את שאלתכם או בקשתכם..."
                      value={form.message}
                      onChange={set("message")}
                      maxLength={1000}
                    />
                  </div>
                  <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-[hsl(43,65%,58%)]"
                    />
                    <span>
                      אני מאשר/ת את{" "}
                      <a href="/terms" className="font-bold text-primary hover:text-secondary">תנאי השימוש</a>
                      {" "}ואת{" "}
                      <a href="/privacy" className="font-bold text-primary hover:text-secondary">מדיניות הפרטיות</a>
                    </span>
                  </label>
                  {status === "error" && (
                    <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold px-7 py-3.5 font-bold text-navy-950 transition-all hover:shadow-glow-gold disabled:opacity-60 sm:w-auto"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> שולח...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" /> שלח הודעה
                      </>
                    )}
                  </button>
                </form>
              )}
            </GlassCard>
          </Reveal>

          {/* sidebar */}
          <div className="space-y-6">
            <Reveal delay={0.08}>
              <GlassCard className="p-7">
                <h3 className="mb-5 text-lg font-extrabold">פרטי התקשרות</h3>
                <div className="space-y-4">
                  <a href={socials.email} className="group flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </span>
                    <div>
                      <div className="text-sm font-bold">אימייל</div>
                      <div className="text-sm text-muted-foreground transition-colors group-hover:text-secondary" dir="ltr">
                        support@propfirmpayless.com
                      </div>
                    </div>
                  </a>
                  <a href={socials.whatsapp} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                      <MessageCircle className="h-5 w-5 text-emerald-400" />
                    </span>
                    <div>
                      <div className="text-sm font-bold">וואטסאפ</div>
                      <div className="text-sm text-muted-foreground transition-colors group-hover:text-secondary" dir="ltr">
                        +972 55-729-5593
                      </div>
                    </div>
                  </a>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10">
                      <Clock className="h-5 w-5 text-secondary" />
                    </span>
                    <div>
                      <div className="text-sm font-bold">שעות פעילות</div>
                      <div className="text-sm text-muted-foreground">א'-ה' 9:00-18:00</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.14}>
              <GlassCard className="p-7">
                <h3 className="mb-5 text-lg font-extrabold">שאלות נפוצות</h3>
                <div className="space-y-4">
                  {miniFaq.map((f) => (
                    <div key={f.q}>
                      <div className="text-sm font-bold text-foreground">{f.q}</div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
