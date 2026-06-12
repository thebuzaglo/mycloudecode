import { useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Box, Wand2, Send, Copy, Check, ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { SectionHeading, GlassCard, TiltCard, Reveal, GoldButton, GhostButton, Badge } from "@/components/ui/primitives";

import awardImg from "@/assets/products/award.png";
import miniAwardImg from "@/assets/products/mini-award.png";
import bundleImg from "@/assets/products/bundle.png";
import giftCardsImg from "@/assets/products/gift-cards.png";

const AFFILIATE_LINK = "https://fundedaward.com/propfirmpayless";
const COUPON = "PAYLESS";

const features = [
  { Icon: Trophy, title: "הוכחה פיזית להצלחה", desc: "התזכורת הפיזית לכך שכבר עשית את זה בעבר, ואתה יכול לעשות זאת שוב." },
  { Icon: Box, title: "גימור אקרילי בתלת-מימד", desc: "תעודת פרימיום כבדה ויוקרתית שמשדרגת כל עמדת מסחר." },
  { Icon: Wand2, title: "מותאם אישית לכל הישג", desc: "מעבר שלבי מבחן, קבלת חשבון Live, או משיכת כספים (Payout)." },
  { Icon: Send, title: "משלוח בינלאומי מהיר", desc: "ייצור מדויק ושילוח מהיר תוך 48 שעות." },
];

const products = [
  { image: awardImg, title: "תעודת Funded AWARD", subtitle: 'גדלים: 15x20 ס"מ // 20x20 ס"מ', price: "94.45", showDiscount: true },
  { image: miniAwardImg, title: "תעודת Mini AWARD", subtitle: 'גדלים: 13x18 ס"מ // 15x15 ס"מ', price: "79.95" },
  { image: bundleImg, title: "חבילת Bundle", subtitle: "יותר תעודות, יותר חיסכון", price: "94.45" },
  { image: giftCardsImg, title: "כרטיסי מתנה", subtitle: "המתנה המושלמת לסוחר", price: "70.00" },
];

const faq = [
  { q: "מה זה Funded Award?", a: "הופכים את תעודת המימון הדיגיטלית שלכם מחברת המימון לתעודת אקריליק חתוכת לייזר באיכות פרימיום - נקייה, מוכנה לשולחן, ומוטיבציה שאפשר ממש לגעת בה." },
  { q: "למי זה מתאים?", a: "לסוחרים ממומנים שזה עתה עברו אתגר או קיבלו Payout ראשון, וגם לכל מי שמחפש מתנה משמעותית לסוחר." },
  { q: "איך מזמינים?", a: "1. בוחרים גודל לוחית. 2. מעלים את התעודה (או מעלים מאוחר יותר). 3. משלימים תשלום בקופה." },
  { q: "האם אפשר למסגר תעודה של כל חברה?", a: "בהחלט. FTMO, AlphaCapital, TopStep, Apex, FundedNext ועוד - ממסגרים תעודות מכל חברת מימון, כל עוד התעודה רשמית." },
  { q: "אילו גדלים קיימים?", a: 'ארבעה גדלים בהתאם ליחס התעודה: 13x18 ס"מ, 15x15 ס"מ, 15x20 ס"מ ו-20x20 ס"מ.' },
  { q: "כמה זמן לוקחת ההפקה?", a: "הפקה ואריזה תוך 2 עד 4 ימי עסקים. זמני המשלוח מוצגים בקופה." },
  { q: "התוצאה באמת נראית טוב? שווה את זה?", a: "כן. כל תעודה חתוכה בדיוק באקריליק עם הדפסת UV (צבעים חיים, עמידים לדהייה) לגימור פרימיום שנראה מצוין על השולחן ובמצלמה. מעבר לזה, זו תזכורת יומית להישג שהשגתם, ששומרת על המיינדסט חד וההתקדמות גלויה לעין." },
  { q: "האם שולחים לישראל?", a: "כן, שולחים לישראל במשלוח Priority בתשלום. העלות והזמן המדויק מוצגים בקופה לאחר הזנת כתובת המשלוח." },
];

function CouponChip() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(COUPON);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-dashed border-secondary/50 bg-secondary/10 px-4 py-2.5 font-black text-secondary transition-all hover:bg-secondary/15"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "הקוד הועתק!" : `קוד קופון 10% הנחה: ${COUPON}`}
    </button>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard className="overflow-hidden !rounded-xl">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right" aria-expanded={open}>
        <span className="font-bold">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-secondary transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="border-t border-white/5 px-5 py-4 leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

export default function FundedAward() {
  return (
    <>
      <Seo
        title="Funded Award - תעודות אקריליות לסוחרים ממומנים | PAYLESS"
        description="Funded Award מפיקה תעודות אקריליות יוקרתיות לסוחרים שעברו אתגר מימון. הנחת 10% עם קוד PAYLESS, משלוח עולמי ומיתוג אישי."
      />
      <PageHero
        eyebrow="ההצלחה שלך, מוחשית"
        title="Funded Award —"
        highlight="ההצלחה שלך, עכשיו בגרסה מוחשית"
        subtitle="עברת את מבחן המימון? משכת רווחים? הפוך את ההישג הדיגיטלי לתעודת זכוכית אקרילית יוקרתית. השתמש בקישור שלנו ובקוד הקופון לקבלת 10% הנחה על כל האתר."
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <GoldButton href={AFFILIATE_LINK} size="lg">
            קבל 10% הנחה עכשיו
          </GoldButton>
          <CouponChip />
        </div>
      </PageHero>

      {/* why */}
      <section className="container relative pb-8">
        <SectionHeading title="למה" highlight="Funded Award?" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.07} className="h-full">
              <GlassCard className="flex h-full flex-col items-center p-7 text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold shadow-glow-gold">
                  <f.Icon className="h-7 w-7 text-navy-950" />
                </span>
                <h3 className="mb-2 text-lg font-extrabold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* collection */}
      <section className="container relative py-16">
        <SectionHeading eyebrow="הקולקציה" title="בחרו את המוצר המושלם" highlight="להישג שלכם" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06} className="h-full">
              <TiltCard className="h-full">
                <GlassCard glow={p.showDiscount} className="flex h-full flex-col overflow-hidden !p-0">
                  <div className="relative aspect-square overflow-hidden bg-white/[0.03]">
                    <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                    {p.showDiscount && (
                      <span className="absolute top-3 right-3">
                        <Badge tone="hot">10% הנחה PAYLESS</Badge>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-extrabold">{p.title}</h3>
                    <p className="mt-1 flex-1 text-sm text-muted-foreground">{p.subtitle}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-muted-foreground">לפני 10% הנחה</div>
                        <div className="text-xl font-black text-gradient-gold" dir="ltr">${p.price}</div>
                      </div>
                      <a
                        href={AFFILIATE_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-gradient-gold px-4 py-2 text-sm font-black text-navy-950 transition-all hover:shadow-glow-gold"
                      >
                        לרכישה
                      </a>
                    </div>
                  </div>
                </GlassCard>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <a href={AFFILIATE_LINK} target="_blank" rel="noopener noreferrer" className="font-bold text-primary transition-colors hover:text-secondary">
            לרכישה ומימוש ההטבה לחץ כאן ←
          </a>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="container relative py-12">
        <SectionHeading title="שאלות" highlight="נפוצות" />
        <div className="mx-auto max-w-3xl space-y-3">
          {faq.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container relative py-16">
        <Reveal>
          <GlassCard glow className="mx-auto max-w-3xl p-10 text-center">
            <h2 className="text-2xl font-black md:text-3xl">
              <span className="text-gradient-ice">מוכנים לעמוד</span>{" "}
              <span className="text-gradient-gold">עם ההישג שלכם?</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              השתמשו בקוד <span className="font-black text-secondary">{COUPON}</span> לקבלת 10% הנחה
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <GoldButton href={AFFILIATE_LINK} size="lg">הזמן את התעודה שלך</GoldButton>
              <GhostButton to="/services">
                <ArrowRight className="h-4 w-4" />
                חזור לשירותים נוספים
              </GhostButton>
            </div>
          </GlassCard>
        </Reveal>
      </section>
    </>
  );
}
