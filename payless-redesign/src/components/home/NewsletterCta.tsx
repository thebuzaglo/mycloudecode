import { useState } from "react";
import { Mail, Loader2, CheckCircle2, PartyPopper } from "lucide-react";
import { Reveal } from "@/components/ui/primitives";
import { subscribeNewsletter } from "@/lib/supabase";

type Status = "idle" | "loading" | "done" | "dup" | "error";

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 255;

export default function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      setMsg("אנא הזן כתובת אימייל תקינה");
      return;
    }
    setStatus("loading");
    try {
      const res = await subscribeNewsletter(email);
      if (res.duplicate) {
        setStatus("dup");
        setMsg("כתובת האימייל כבר רשומה לניוזלטר");
      } else {
        setStatus("done");
        setMsg("תודה על ההרשמה! נשלח לך עדכונים חשובים");
      }
    } catch {
      setStatus("error");
      setMsg("אירעה שגיאה בהרשמה, אנא נסה שוב");
    }
  };

  return (
    <section className="container relative py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl glass gold-shimmer-border px-6 py-14 text-center md:px-16">
          <div className="grid-overlay absolute inset-0 opacity-60" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-secondary/10 blur-[100px]" />

          <div className="relative">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold shadow-glow-gold">
              <Mail className="h-7 w-7 text-navy-950" />
            </span>
            <h2 className="text-3xl font-black md:text-4xl">
              <span className="text-gradient-ice">עדכונים</span>{" "}
              <span className="text-gradient-gold">ומבצעים</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              הצטרפו לרשימת הדיוור — מבצעים חמים, חדשות מעולם המסחר וטיפים מקצועיים. בלי ספאם.
            </p>

            {status === "done" || status === "dup" ? (
              <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 px-6 py-4 font-bold text-emerald-400">
                {status === "done" ? <PartyPopper className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                {msg}
              </div>
            ) : (
              <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="h-13 flex-1 rounded-xl border border-white/10 bg-navy-950/60 px-5 py-3.5 text-left font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-secondary/60"
                  aria-label="כתובת אימייל"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-7 py-3.5 font-bold text-navy-950 transition-all hover:shadow-glow-gold disabled:opacity-60"
                >
                  {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "הרשמה לניוזלטר"}
                </button>
              </form>
            )}
            {status === "error" && <p className="mt-3 text-sm font-semibold text-red-400">{msg}</p>}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
