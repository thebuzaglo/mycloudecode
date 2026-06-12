import { Briefcase, FileBarChart, HeartHandshake, Calculator, UserCheck, FileText, MessageCircle, Mail, ExternalLink, ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { SectionHeading, GlassCard, Reveal, GoldButton, GhostButton, Badge, VideoCard } from "@/components/ui/primitives";
import aslanLogo from "@/assets/logos/aslan-cpa-logo-hero.png";

const WHATSAPP_LINK = `https://wa.me/972539993905?text=${encodeURIComponent("שלום עידן, הגעתי מאתר PAYLESS והייתי רוצה לשמוע עוד על השירותים שלך 🎯")}`;

const services = [
  {
    Icon: Briefcase,
    title: "פתיחת עסק וליווי מול רשויות המס",
    text: "עזרה בהקמת עסק חלומותיכם, תוך ליווי צמוד מהשלב הראשון של פתיחת התיק ועד לניהול השוטף מול רשויות המס, הנהלת חשבונות וחשבות שכר. אשקף לכם את דרישות הרגולציה, כדי שתוכלו להתמקד בהצלחת העסק ובהובלתו לשגשוג.",
  },
  {
    Icon: FileBarChart,
    title: "הצהרת הון",
    text: "הגשת דוחות לרשויות המס בדבר הנכסים וההתחייבויות והשוואת הון בין שתי הצהרות הון במידה וזאת לא הצהרת הון ראשונה.",
  },
  {
    Icon: HeartHandshake,
    title: "ליווי כלכלי למשפחות",
    text: "אם אתם שואפים לשפר את איכות החיים שלכם, אנחנו כאן כדי ללוות אתכם. יחד נבנה תוכנית כלכלית מותאמת אישית שתאפשר לכם לנצל את המשאבים שלכם בתבונה, להשקיע בחכמה ולהגיע ליציבות כלכלית שתעניק לכם ביטחון ורווחה לטווח הארוך.",
  },
  {
    Icon: Calculator,
    title: "תכנון מס חכם ומיטבי (pre ruling), החזרי מס",
    text: "לפני כל עסקה או החלטה פיננסית, נבצע יחד ניתוח מעמיק של ההשלכות הכלכליות, במטרה להבטיח תועלת מרבית. נדאג שתהיו מודעים לכל האפשרויות לחיסכון והטבות כדי למצות את הפוטנציאל הכלכלי שלכם. בדיקת נתוני זכאות להחזרי מס ומילוי כל הטפסים להגשת דוח.",
  },
  {
    Icon: UserCheck,
    title: "ניהול עובדים זרים",
    text: "שירותי ניהול מקצועיים ומקיפים למשקי בית שבחרו להעסיק עובדים זרים, תוך דגש על עמידה בדרישות החוק והרגולציה. השירות כולל טיפול מלא בכל ההיבטים הפיננסיים והמשפטיים, תלוש שכר והעסקה ישירה של העובד הזר. ידע ומקצועיות בתחום העסקה ישירה מוביל למצב בו לכם יישאר נתח גדול יותר מהקצבה המתקבלת מביטוח לאומי.",
  },
  {
    Icon: FileText,
    title: 'דוחות מס לארה"ב',
    text: 'מיועד לתושבי ישראל החייבים בדיווח בארה"ב על הכנסותיהם וכן את אזרחי ארה"ב החיים בישראל וחייבים בהגשת דוחות מס. השירותים כוללים תכנון מס ישראל-ארה"ב, ייצוג בפני הרשויות והכנת דוחות על הכנסות ורווחי הון.',
  },
];

export default function AslanCpa() {
  return (
    <>
      <Seo
        title="עידן אסלן - רואה חשבון וייעוץ עסקי | PAYLESS"
        description="רואה חשבון מוסמך המתמחה בסוחרי נוסטרו, תכנון מס, החזרי מס והדרכה כלכלית למשקי בית. ניסיון ב-KPMG ובשוק ההון."
      />
      <PageHero
        eyebrow="רואה חשבון מוסמך | התמחות בסוחרי נוסטרו | ניסיון ב-KPMG"
        title="עידן אסלן —"
        highlight="רו״ח וייעוץ עסקי"
        subtitle="רואה חשבון מוסמך המתמחה בסוחרי נוסטרו, תכנון מס, החזרי מס והדרכה כלכלית למשקי בית"
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <GoldButton href={WHATSAPP_LINK} size="lg">
            <MessageCircle className="h-5 w-5" />
            שלח הודעה בוואטסאפ
          </GoldButton>
          <GhostButton href="mailto:Idan@aslan-cpa.com">
            <Mail className="h-5 w-5" />
            שלח אימייל
          </GhostButton>
          <img src={aslanLogo} alt="עידן אסלן - רואה חשבון" className="h-14 w-auto" />
        </div>
        <p className="mt-5 text-sm font-bold text-secondary">
          חשוב: כשפונים, הקפידו לציין שהגעתם מהקהילה של PAYLESS!
        </p>
      </PageHero>

      {/* who */}
      <section className="container relative pb-8">
        <Reveal>
          <GlassCard className="mx-auto max-w-4xl p-8 md:p-10">
            <h2 className="mb-5 text-2xl font-extrabold text-gradient-gold">מי אנחנו</h2>
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                <strong className="text-foreground">עידן אסלן</strong>, רואה חשבון מוסמך בעל
                תואר ראשון בכלכלה עם התמחות בחשבונאות ותואר שני במשפטים. חבר בלשכת רואי
                החשבון בישראל.
              </p>
              <p>
                את דרכו המקצועית התחיל בפירמת ראיית החשבון הבינלאומית,{" "}
                <strong className="text-foreground">KPMG</strong>, שם צבר ניסיון מעמיק בביצוע
                ביקורות פיננסיות עבור חברות פרטיות וציבוריות, כולל כאלו הנסחרות בנאסד"ק.
              </p>
              <p>
                במסגרת עבודתו רכש ידע מעשי רב בניתוח דוחות כספיים ובהבנה כיצד דוחות עסקיים
                צריכים להיראות כדי לעמוד בדרישות החוק והתקנות הפיננסיות.
              </p>
              <p>
                באמצעות <strong className="text-foreground">השקפת עולם מודרנית</strong>, עידן
                מחזיק באמונה שרואה חשבון מלווה צריך להיות בקיא בכל המסלולים הפיננסיים בכדי
                לספק חווית שירות מקסימלית.
              </p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-secondary/[0.07] border border-secondary/20 p-5">
                <div className="mb-1.5 font-extrabold text-secondary">🎯 יתרון ייחודי</div>
                <p className="text-sm leading-relaxed text-foreground/85">
                  הניסיון שעידן צבר בתחום שוק ההון והמסחר מעניק לך יתרון משמעותי אם העסק שלך
                  עוסק במסחר נוסטרו.
                </p>
              </div>
              <div className="rounded-xl bg-primary/[0.07] border border-primary/20 p-5">
                <div className="mb-1.5 font-extrabold text-primary">💎 הערכים שמובילים אותנו</div>
                <p className="text-sm leading-relaxed text-foreground/85">
                  יחס אישי, מקצוענות ותוצאות עסקיות!
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="text-sm font-bold text-muted-foreground">התמחויות עיקריות:</span>
              <Badge tone="gold">עוסקים מתחום מסחר הנוסטרו</Badge>
              <Badge tone="cyan">החזרי מס והדרכה למשקי בית</Badge>
            </div>
          </GlassCard>
        </Reveal>
      </section>

      {/* video guide */}
      <section className="container relative py-14">
        <SectionHeading
          eyebrow="מדריך מצולם"
          title="צפו במדריך המלא"
          highlight="על השירותים והתהליכים"
        />
        <Reveal className="mx-auto max-w-3xl">
          <VideoCard videoId="nEwEJwIEu0g" title="מדריך מצולם - עידן אסלן רואה חשבון" />
        </Reveal>
      </section>

      {/* services */}
      <section className="container relative py-14">
        <SectionHeading title="שירותי" highlight="המשרד" subtitle="מגוון רחב של שירותים חשבונאיים מקצועיים" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06} className="h-full">
              <GlassCard className="flex h-full flex-col p-6">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                  <s.Icon className="h-6 w-6 text-secondary" />
                </span>
                <h3 className="mb-2 font-extrabold leading-snug">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container relative py-16">
        <Reveal>
          <GlassCard glow className="mx-auto max-w-3xl p-10 text-center">
            <h2 className="text-2xl font-black md:text-3xl">
              <span className="text-gradient-ice">מוכנים</span>{" "}
              <span className="text-gradient-gold">להתחיל?</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              צרו קשר עוד היום וקבלו ייעוץ מקצועי ממומחה המכיר לעומק את תחום המסחר בנוסטרו
            </p>
            <p className="mt-2 text-sm font-bold text-secondary">
              חשוב: כשפונים אליו, הקפידו לציין שהגעתם מהקהילה שלנו!
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <GoldButton href={WHATSAPP_LINK} size="lg">
                <MessageCircle className="h-5 w-5" />
                שלח הודעה בוואטסאפ
              </GoldButton>
              <GhostButton href="https://aslan-cpa.com/">
                <ExternalLink className="h-4 w-4" />
                בקר באתר
              </GhostButton>
              <GhostButton to="/services">
                <ArrowRight className="h-4 w-4" />
                חזרה לשירותים נוספים
              </GhostButton>
            </div>
          </GlassCard>
        </Reveal>
      </section>
    </>
  );
}
