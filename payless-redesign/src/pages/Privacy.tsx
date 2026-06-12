import { Database, Settings2, Share2, Lock, Cookie, BarChart3, ShieldCheck, MessageCircle, Award, UserCog, ExternalLink, Mail } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { GlassCard, Reveal, GhostButton } from "@/components/ui/primitives";

interface Section {
  Icon: any;
  title: string;
  body?: string[];
  list?: string[];
  links?: { label: string; href: string }[];
}

const sections: Section[] = [
  {
    Icon: Database,
    title: "איסוף מידע",
    body: ['אנו אוספים מידע שאתם מספקים לנו ישירות, כגון שם, כתובת דוא"ל ומספר טלפון כאשר אתם יוצרים קשר איתנו או נרשמים לשירותינו.'],
  },
  {
    Icon: Settings2,
    title: "שימוש במידע",
    list: [
      "מתן שירותי ההשוואה והמידע",
      "יצירת קשר איתכם בנוגע לשירותינו",
      "שיפור חוויית המשתמש באתר",
      "שליחת עדכונים ומבצעים רלוונטיים",
    ],
  },
  {
    Icon: Share2,
    title: "שיתוף מידע",
    body: ["אנו לא מוכרים, משכירים או משתפים את המידע האישי שלכם עם צדדים שלישיים, למעט במקרים הנדרשים על פי חוק או לצורך מתן השירות."],
  },
  {
    Icon: Lock,
    title: "אבטחת מידע",
    body: ["אנו נוקטים באמצעי אבטחה מתקדמים להגנה על המידע האישי שלכם, כולל הצפנה ובקרות גישה מחמירות."],
  },
  {
    Icon: Cookie,
    title: "עוגיות (Cookies)",
    body: ["האתר שלנו משתמש בעוגיות (Cookies) ובטכנולוגיות מעקב דומות כדי לשפר את חוויית הגלישה, לזכור את ההעדפות שלכם, ולאסוף נתונים סטטיסטיים על אופן השימוש באתר. חלק מהעוגיות מופעלות על ידי שירותי צד שלישי (כמו Google). ניתן לנטרל את השימוש בעוגיות בכל עת דרך הגדרות הדפדפן שלכם."],
  },
  {
    Icon: BarChart3,
    title: "כלי ניתוח ומעקב סטטיסטי",
    body: ["אנו משתמשים בכלים כגון Google Analytics 4, Vercel Web Analytics ו-Microsoft Clarity כדי לנתח את תנועת הגולשים ולהבין כיצד משתמשים מנווטים באתר. אנו משתפים פעולה עם Microsoft Clarity ו-Microsoft Advertising כדי ללכוד את אופן השימוש והאינטראקציה שלכם עם האתר באמצעות מדדים התנהגותיים, מפות חום (heatmaps) והקלטות סשנים (session replay) לצורך שיפור ושיווק המוצרים/שירותים שלנו. נתוני השימוש באתר נאספים באמצעות עוגיות צד ראשון ושלישי וטכנולוגיות מעקב נוספות לקביעת פופולריות של מוצרים/שירותים ופעילות מקוונת. בנוסף, אנו משתמשים במידע זה לצורכי אופטימיזציית האתר, אבטחה/מניעת הונאה ופרסום. למידע נוסף על האופן שבו Microsoft אוספת ומשתמשת בנתונים שלכם, בקרו בהצהרת הפרטיות של Microsoft."],
    links: [
      { label: "מדיניות הפרטיות של Google", href: "https://policies.google.com/privacy" },
      { label: "הצהרת הפרטיות של Microsoft", href: "https://privacy.microsoft.com/privacystatement" },
    ],
  },
  {
    Icon: ShieldCheck,
    title: "שירותי אבטחה - Google reCAPTCHA",
    body: ["אתר זה מוגן על ידי reCAPTCHA ומדיניות הפרטיות ותנאי השירות של Google חלים. אנו משתמשים ב-Google reCAPTCHA v3 כדי להגן על הטפסים באתר מפני ספאם ושימוש לרעה על ידי בוטים."],
    links: [
      { label: "מדיניות הפרטיות של Google", href: "https://policies.google.com/privacy" },
      { label: "תנאי השירות של Google", href: "https://policies.google.com/terms" },
    ],
  },
  {
    Icon: MessageCircle,
    title: "שימוש ב-WhatsApp ליצירת קשר",
    body: ["האתר כולל כפתור צף ליצירת קשר ב-WhatsApp, כפתורי שיתוף תוכן ב-WhatsApp, וכן צ'אט בוט באתר שעשוי להפנות את המשתמש להמשך שיחה במוקד התמיכה ב-WhatsApp. בעת לחיצה על אחד מהרכיבים הללו, הגולש מועבר ביוזמתו לאפליקציית WhatsApp (המופעלת על ידי WhatsApp LLC, חברה בקבוצת Meta Platforms Inc.), אשר עשויה לאסוף מידע טכני (כגון כתובת IP, סוג מכשיר, ופרטי השיחה) לצורך מתן השירות, אבטחה ומניעת שימוש לרעה, ולשתף מידע זה עם חברות אחרות בקבוצת Meta בהתאם למדיניות הפרטיות שלה. האתר אינו מתקין פיקסל פרסומי של Meta/Facebook ואינו מעביר ל-Meta מידע באופן יזום מעבר לעצם המעבר הוולונטרי של המשתמש לאפליקציה. השימוש ברכיב זה הוא לבחירת המשתמש בלבד - ניתן ליצור קשר גם בערוצים חלופיים כגון טופס יצירת הקשר באתר או בכתובת support@propfirmpayless.com."],
    links: [
      { label: "מדיניות הפרטיות של WhatsApp", href: "https://www.whatsapp.com/legal/privacy-policy" },
      { label: "מדיניות הפרטיות של Meta", href: "https://www.facebook.com/privacy/policy" },
    ],
  },
  {
    Icon: Award,
    title: "שימוש בתעודות סוחרים",
    list: [
      "התעודות המקוריות והמופקות עשויות להיות מוצגות בגלריה הציבורית באתר",
      "שמכם עשוי להופיע כפי שמופיע בתעודה המקורית",
      "אתם רשאים לבקש הסרת התעודות בכל עת",
      "לא נשתף את התעודות מחוץ לאתר ללא הסכמתכם",
    ],
  },
  {
    Icon: UserCog,
    title: "זכויותיכם",
    list: [
      "צפייה במידע האישי המוחזק עליכם",
      "תיקון או עדכון המידע",
      "מחיקת המידע האישי",
      "הפסקת קבלת הודעות שיווקיות",
    ],
  },
];

export default function Privacy() {
  return (
    <>
      <Seo
        title="מדיניות פרטיות - PAYLESS | הגנה על המידע האישי שלכם"
        description="מדיניות הפרטיות של PAYLESS - כל המידע על איסוף, שימוש והגנה על הנתונים האישיים שלכם. אנו מחויבים לשמירה על הפרטיות והאבטחה"
      />
      <PageHero
        eyebrow="הגנה על המידע שלכם"
        title="מדיניות"
        highlight="פרטיות"
        subtitle="אנו מחויבים לשמירה על הפרטיות והאבטחה של המידע האישי שלכם"
        compact
      />

      <section className="container relative pb-16">
        <div className="mx-auto max-w-3xl space-y-5">
          {sections.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.03}>
              <GlassCard className="p-7">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <s.Icon className="h-5 w-5 text-primary" />
                  </span>
                  <h2 className="text-lg font-extrabold md:text-xl">
                    {i + 1}. {s.title}
                  </h2>
                </div>
                {s.body?.map((p) => (
                  <p key={p.slice(0, 24)} className="leading-relaxed text-muted-foreground">{p}</p>
                ))}
                {s.list && (
                  <ul className="space-y-2">
                    {s.list.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 leading-relaxed text-muted-foreground">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {s.links && (
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {s.links.map((l) => (
                      <a
                        key={l.href + l.label}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg glass-bright px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:text-secondary"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </GlassCard>
            </Reveal>
          ))}

          <Reveal>
            <GlassCard className="p-7 text-center">
              <h2 className="text-lg font-extrabold">ניהול העדפות עוגיות</h2>
              <p className="mt-2 text-muted-foreground">ניתן לשנות את ההסכמה לעוגיות אנליטיקה ושיווק בכל עת.</p>
              <h2 className="mt-6 text-lg font-extrabold">צור קשר</h2>
              <p className="mt-2 text-muted-foreground">לשאלות בנוגע למדיניות הפרטיות, ניתן לפנות אלינו בכתובת:</p>
              <div className="mt-5">
                <GhostButton href="mailto:support@propfirmpayless.com">
                  <Mail className="h-4 w-4" />
                  support@propfirmpayless.com
                </GhostButton>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </>
  );
}
