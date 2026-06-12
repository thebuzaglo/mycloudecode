import { Keyboard, Contrast, MousePointerClick, ScreenShare, Phone, Mail, MessageCircle } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { SectionHeading, GlassCard, Reveal, GhostButton } from "@/components/ui/primitives";

const features = [
  { Icon: Keyboard, title: "ניווט במקלדת", text: "כל הפונקציות זמינות באמצעות ניווט במקלדת בלבד" },
  { Icon: Contrast, title: "ניגודיות גבוהה", text: "עיצוב בניגודיות גבוהה לקריאות מיטבית" },
  { Icon: MousePointerClick, title: "אזורי קליקים גדולים", text: "כפתורים וקישורים בגודל מינימלי של 44x44 פיקסלים" },
  { Icon: ScreenShare, title: "תמיכה בקוראי מסך", text: "תיוג נכון ותמיכה מלאה בטכנולוגיות מסייעות" },
];

const faq = [
  { q: "איך להשתמש בניווט מקלדת?", a: "השתמש במקש Tab לניווט קדימה, Shift+Tab לניווט אחורה, Enter או רווח להפעלת כפתורים וקישורים, ומקשי החיצים לניווט בתפריטים ורשימות." },
  { q: "איך לשנות גודל טקסט?", a: "השתמש בקיצורי המקלדת Ctrl++ להגדלה, Ctrl+- להקטנה, או Ctrl+0 לאיפוס. אלטרנטיבית, ניתן להשתמש בהגדרות הדפדפן או במערכת ההפעלה." },
  { q: "איך לדווח על בעיית נגישות?", a: "ניתן לפנות אלינו באימייל support@propfirmpayless.com, טלפון 055-729-5593, או דרך טופס יצירת הקשר באתר." },
];

export default function Accessibility() {
  return (
    <>
      <Seo
        title="הצהרת נגישות - PAYLESS"
        description="הצהרת נגישות של PAYLESS. אנו מחויבים להנגשת השירות לכלל המשתמשים בהתאם לתקן AA של WCAG 2.1"
      />
      <PageHero
        eyebrow="נגישות לכולם"
        title="הצהרת"
        highlight="נגישות"
        subtitle="אנו ב-PAYLESS מחויבים להנגשת השירות לכלל המשתמשים, כולל אנשים עם מוגבלויות"
        compact
      />

      <section className="container relative pb-12">
        <Reveal className="mx-auto max-w-3xl">
          <GlassCard className="p-7 text-center">
            <h2 className="text-xl font-extrabold">מחויבות לנגישות</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              האתר תוכנן ופותח תוך התחשבות בעקרונות הנגישות כדי לאפשר לכל המשתמשים ליהנות
              מהשירותים באופן עצמאי ושוויונית.
            </p>
          </GlassCard>
        </Reveal>
      </section>

      <section className="container relative py-10">
        <SectionHeading title="תכונות נגישות" highlight="באתר" />
        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06} className="h-full">
              <GlassCard className="flex h-full flex-col items-center p-6 text-center">
                <span className="mb-4 flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/10 p-3">
                  <f.Icon className="h-7 w-7 text-primary" />
                </span>
                <h3 className="mb-1.5 font-extrabold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container relative py-10">
        <SectionHeading title="שאלות נפוצות" highlight="על נגישות" />
        <div className="mx-auto max-w-3xl space-y-4">
          {faq.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <GlassCard className="p-6">
                <h3 className="mb-2 font-extrabold">{f.q}</h3>
                <p className="leading-relaxed text-muted-foreground">{f.a}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container relative py-12">
        <Reveal>
          <GlassCard glow className="mx-auto max-w-3xl p-8 text-center">
            <h2 className="text-xl font-extrabold">איש קשר לנושא נגישות</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              אם נתקלתם בבעיה בנגישות האתר או שיש לכם הצעות לשיפור, אנא פנו אל רכז הנגישות שלנו:
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <GhostButton href="mailto:support@propfirmpayless.com">
                <Mail className="h-4 w-4" /> support@propfirmpayless.com
              </GhostButton>
              <GhostButton href="tel:0557295593">
                <Phone className="h-4 w-4" /> <span dir="ltr">055-729-5593</span>
              </GhostButton>
              <GhostButton href="https://wa.me/972557295593">
                <MessageCircle className="h-4 w-4" /> וואטסאפ
              </GhostButton>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              נתחייב לטפל בפניותיכם בהקדם האפשרי ולספק פתרון מתאים.
            </p>
            <p className="mt-2 text-xs text-muted-foreground/70">
              הצהרה זו עודכנה לאחרונה: נובמבר 2025
            </p>
          </GlassCard>
        </Reveal>
      </section>
    </>
  );
}
