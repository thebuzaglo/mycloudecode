/*
  Site-wide data — navigation, footer, socials, testimonials.
  All copy ported verbatim from the original PAYLESS site.
*/
import avatar1 from "@/assets/brand/avatar-1.webp";
import avatar2 from "@/assets/brand/avatar-2.webp";
import avatar3 from "@/assets/brand/avatar-3.webp";
import avatar4 from "@/assets/brand/avatar-4.webp";

export const socials = {
  whatsapp: "https://wa.me/972557295593",
  facebook: "https://www.facebook.com/groups/propfirmpayless",
  instagram: "https://www.instagram.com/thebuzaglotrades/",
  tiktok: "https://www.tiktok.com/@thebuzaglotrades",
  youtube: "https://www.youtube.com/@thebuzaglotrades",
  email: "mailto:support@propfirmpayless.com",
};

export interface NavChild {
  href: string;
  label: string;
  description?: string;
}

export interface NavItem {
  href: string;
  label: string;
  panel?: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    groups: { title: string; items: NavChild[] }[];
  };
}

export const navItems: NavItem[] = [
  { href: "/", label: "עמוד הבית" },
  {
    href: "/companies",
    label: "חברות מימון",
    panel: {
      eyebrow: "Prop Firms",
      title: "חברות מימון מובילות",
      description:
        "השוואה מקיפה בין חברות המימון הטובות בעולם — תוכניות, חוקים, מבצעים והנחות בלעדיות.",
      cta: "צפייה בכל החברות",
      groups: [
        {
          title: "החברות המובילות",
          items: [
            { href: "/company/mffu", label: "MFFU", description: "חברת מימון פיוצ׳רס מובילה עם תנאים גמישים" },
            { href: "/company/lucidtrading", label: "Lucid Trading", description: "פלטפורמת מסחר מתקדמת עם פיצול רווחים גבוה" },
            { href: "/company/alpha-futures", label: "Alpha Futures", description: "חברת מימון איכותית עם תנאי מסחר נוחים" },
            { href: "/company/fundednext", label: "FundedNext", description: "חברת מימון גלובלית עם מגוון תוכניות" },
          ],
        },
        {
          title: "חברות נבחרות נוספות",
          items: [
            { href: "/company/top-one-futures", label: "Top One Futures", description: "חברת מימון עם מסלולים מגוונים ומשיכות מהירות" },
            { href: "/company/tpt", label: "Take Profit Trader", description: "מימון פיוצ׳רס פופולרי עם תנאים נוחים לסוחרים" },
            { href: "/company/funded-futures-family", label: "Funded Futures Family", description: "חברה צומחת עם מגוון מסלולי מימון" },
            { href: "/companies", label: "כל החברות", description: "צפייה במאגר המלא והשוואה" },
          ],
        },
      ],
    },
  },
  {
    href: "/tools",
    label: "כלי עזר",
    panel: {
      eyebrow: "Trader Tools",
      title: "כלי עזר למסחר חכם",
      description:
        "מחשבונים, סימולטורים ופלטפורמות מקצועיות שיעזרו לכם לנהל סיכון, להישאר עקביים ולעבור הערכות.",
      cta: "כל הכלים",
      groups: [
        {
          title: "מחשבונים וניהול סיכון",
          items: [
            { href: "/tools/consistency-calculator", label: "מחשבון עקביות", description: "בדיקת רווחים יומיים מול יעד" },
            { href: "/tools/risk-calculator", label: "מחשבון סיכון", description: "חישוב גודל פוזיציה אופטימלי" },
            { href: "/tools/match", label: "חידון התאמה", description: "מצא את חברת המימון שלך ב-8 שלבים" },
            { href: "/tools/certificate-generator", label: "מחולל תעודות", description: "עיצוב תעודות מותאמות אישית" },
          ],
        },
        {
          title: "פלטפורמות וכלים מקצועיים",
          items: [
            { href: "/tools/news-tracker", label: "מעקב חדשות כלכליות", description: "יומן אירועים והשפעה על השוק" },
            { href: "/tools/tradingview", label: "TradingView", description: "פלטפורמת הצ׳ארטים המובילה" },
            { href: "/tools/tradezella", label: "TradeZella", description: "יומן מסחר וניתוח ביצועים" },
            { href: "/tools/tradesyncer", label: "TradeSyncer", description: "סנכרון אוטומטי בין פלטפורמות" },
            { href: "/tools/replikanto", label: "Replikanto", description: "שכפול עסקאות בין חשבונות" },
          ],
        },
      ],
    },
  },
  {
    href: "/services",
    label: "שירותים נוספים",
    panel: {
      eyebrow: "Premium Services",
      title: "שירותים נוספים נבחרים",
      description:
        "שירותים מקצועיים משלימים שתומכים בדרך שלכם — מנדל״ן ועד ברוקרים בינלאומיים וייעוץ מס.",
      cta: "כל השירותים",
      groups: [
        {
          title: "השירותים שלנו",
          items: [
            { href: "/services/ac-holding", label: "AC Holding", description: "השקעות נדל״ן יוקרה באיחוד האמירויות" },
            { href: "/services/funded-award", label: "Funded Award", description: "הדפסת תעודות הוקרה מתהליך המסחר" },
            { href: "/services/interactive-brokers", label: "Interactive Brokers", description: "ברוקר בינלאומי מוביל לישראלים" },
            { href: "/services/aslan-cpa", label: "Aslan CPA", description: "ייעוץ מס לסוחרים ויחידים" },
          ],
        },
      ],
    },
  },
  { href: "/offers", label: "מבצעים" },
  { href: "/blog", label: "בלוג" },
  { href: "/glossary", label: "מילון מושגים" },
];

export const footerGroups = [
  {
    title: "חברות מימון",
    links: [
      { href: "/companies", label: "כל החברות" },
      { href: "/company/mffu", label: "My Funded Futures" },
      { href: "/company/tpt", label: "Take Profit Trader" },
      { href: "/company/alpha-futures", label: "Alpha Futures" },
      { href: "/company/lucidtrading", label: "Lucid Trading" },
    ],
  },
  {
    title: "מבצעים",
    links: [{ href: "/offers", label: "מבצעים בלעדיים" }],
  },
  {
    title: "החברה",
    links: [
      { href: "/about", label: "אודותינו" },
      { href: "/contact", label: "צור קשר" },
      { href: "/terms", label: "תנאי שימוש" },
      { href: "/privacy", label: "מדיניות פרטיות" },
      { href: "/accessibility", label: "הצהרת נגישות" },
      { href: "/sitemap", label: "מפת האתר" },
    ],
  },
  {
    title: "משאבים",
    links: [
      { href: "/tools", label: "כלי עזר למסחר" },
      { href: "/services", label: "שירותים נוספים" },
      { href: "/glossary", label: "ספריית מושגים" },
      { href: "/blog", label: "בלוג" },
    ],
  },
  {
    title: "עזרה",
    links: [
      { href: "/contact", label: "צור קשר" },
      { href: "/how-it-works", label: "איך זה עובד" },
      { href: "/faq", label: "שאלות נפוצות" },
    ],
  },
];

export const footerDisclaimer =
  "המידע באתר נועד למטרות מידע כללי בלבד ואינו מהווה ייעוץ פיננסי או המלצה להשקעה. מסחר בחוזים עתידיים כולל סיכונים משמעותיים. חלק מהתוכן באתר נבנה בעזרת בינה מלאכותית, ולכן במקרה של ספק או סתירה, המידע הרשמי המופיע באתרי חברות המימון הוא הקובע והמחייב. כל שימוש במידע באחריות המשתמש בלבד ואנו לא נושאים באחריות לכל נזק, הפסד או טעות במידע.";

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  image?: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "סער פיצ'רסקי",
    role: "סוחר מקצועי, מנטור ומנהל קהילת סוחרים",
    text: "מנהל האתר הכי תותח בתחום, עוזר בכל שעה, עוד בפעם הראשונה כדי למשוך רווח מחברת MFFU. מביא מלא כלים פרקטים ורצון לעזור! ממליץ ממש.",
    image: avatar1,
  },
  {
    name: "אמיתי ניסים",
    role: "סוחר מקצועי",
    text: "אתר מעולה יש בו את כל המידע שצריך הסוחר בשביל להתחיל לסחור בתיקי נוסטרו בביטחון!",
    image: avatar2,
  },
  {
    name: "רותם שמואלי",
    role: "סוחר מתחיל",
    text: "כיף שיש מקום שהכול מסודר ומרוכז בו, היה צריך את זה כבר",
    image: avatar3,
  },
  {
    name: "דוד מגרילוב",
    role: "",
    text: "אי אפשר להסביר את הנתינה, האנושיות והעזרה לי ולחברי הקהילה שלי. מענה מהיר בכל פנייה ותשובות מקצה לקצה גם אם זה גוזל זמן יקר.",
    image: avatar4,
  },
  {
    name: "יוגב מזון",
    role: "סוחר מקצועי",
    text: "נעשתה פה עבודה מטורפת באמת! תודה רבה לכם על כל הכלים שאתם נותנים ומשתפים אותנו, מזל שיש אתכם!",
  },
];
