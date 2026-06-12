import { FileCheck, MonitorSmartphone, UserCheck, ShieldAlert, Handshake, LineChart, RefreshCcw, MessageCircle } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import { GlassCard, Reveal, GhostButton } from "@/components/ui/primitives";

const sections = [
  {
    Icon: FileCheck,
    title: "הסכמה לתנאים",
    body: ["באמצעות השימוש באתר PAYLESS, אתם מסכימים לתנאי השימוש המפורטים להלן. אם אינכם מסכימים לתנאים אלה, אנא הימנעו משימוש באתר."],
  },
  {
    Icon: MonitorSmartphone,
    title: "שירותי האתר",
    body: ["אתר PAYLESS מספק פלטפורמה להשוואת חברות מימון למסחר בחוזים עתידיים. האתר מציע סקירות, מידע מרוכז, קודי הטבה ומדריכים טכניים. התוכן נועד למטרות חינוך ומידע בלבד ואינו מהווה ייעוץ השקעות, המלצה לפעולה פיננסית או תחליף לייעוץ מקצועי המותאם לצרכי המשתמש."],
  },
  {
    Icon: UserCheck,
    title: "אחריות המשתמש",
    list: [
      "להשתמש באתר באופן חוקי ותקין",
      "לא לפגוע במערכות האתר או בפעילותו",
      "לא להעביר מידע כוזב או מטעה",
      "לשמור על סודיות פרטי הגישה שלכם",
    ],
  },
  {
    Icon: ShieldAlert,
    title: "מגבלות אחריות",
    body: ["המידע באתר, לרבות חוקי מסחר, מחירים, תנאי מעבר והטבות, עשוי להשתנות מעת לעת על ידי חברות המימון עצמן. אנו עושים מאמץ להציג מידע מעודכן, אך איננו מתחייבים לדיוקו המוחלט. התנאים המחייבים הם תמיד אלו המופיעים באתרים הרשמיים של חברות המימון. PAYLESS אינה אחראית להפסדים כספיים, עוגמת נפש או נזקים כתוצאה מהסתמכות על התוכן, משימוש בפלטפורמות המסחר, או מתקלות בשירותי צד שלישי המקושרים מהאתר."],
  },
  {
    Icon: Handshake,
    title: "גילוי נאות ושיווק שותפים",
    body: ["אתר PAYLESS פועל בחלקו במודל של שיווק שותפים (Affiliate). האתר מכיל קישורים ייעודיים וקודי קופון לחברות מימון שונות. לחיצה על קישורים אלו או רכישה דרכם עשויה לזכות אותנו בעמלה, ללא כל עלות נוספת או פגיעה בתנאים מצידכם. ההמלצות והסקירות מבוססות על מחקר וניסיון, אך ההחלטה הסופית והאחריות המלאה על הרכישה וניהול הסיכונים חלות על המשתמש בלבד."],
  },
  {
    Icon: LineChart,
    title: "שימוש בכלי ניתוח ומעקב",
    body: ["אנו משפרים את המוצרים והפרסום שלנו באמצעות Microsoft Clarity כדי לראות כיצד אתם משתמשים באתר. בשימוש באתר שלנו, אתם מסכימים לכך שאנחנו ו-Microsoft יכולים לאסוף ולהשתמש בנתונים אלו. מדיניות הפרטיות שלנו מכילה פרטים נוספים."],
  },
  {
    Icon: RefreshCcw,
    title: "שינויים בתנאים",
    body: ["PAYLESS שומרת לעצמה את הזכות לעדכן את תנאי השימוש מעת לעת. שינויים יכנסו לתוקף עם פרסומם באתר."],
  },
];

export default function Terms() {
  return (
    <>
      <Seo
        title="תנאי שימוש - PAYLESS | תנאים והגבלות"
        description="תנאי שימוש של פלטפורמת PAYLESS - כל המידע על זכויות וחובות המשתמשים, שירותי האתר, אחריות ושינויים בתנאים"
      />
      <PageHero
        eyebrow="מסמכים משפטיים"
        title="תנאי"
        highlight="שימוש"
        subtitle="כל מה שצריך לדעת על זכויות וחובות המשתמשים באתר PAYLESS"
        compact
      />

      <section className="container relative pb-16">
        <div className="mx-auto max-w-3xl space-y-5">
          {sections.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.04}>
              <GlassCard className="p-7">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                    <s.Icon className="h-5 w-5 text-secondary" />
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
              </GlassCard>
            </Reveal>
          ))}

          <Reveal>
            <GlassCard className="p-7 text-center">
              <h2 className="text-lg font-extrabold">צור קשר</h2>
              <p className="mt-2 text-muted-foreground">לשאלות בנוגע לתנאי השימוש, ניתן לפנות אלינו:</p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <GhostButton href="https://wa.me/972557295593">
                  <MessageCircle className="h-4 w-4" /> וואטסאפ
                </GhostButton>
                <GhostButton to="/contact">לעמוד צור קשר</GhostButton>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </>
  );
}
