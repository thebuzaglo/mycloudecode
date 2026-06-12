/*
  Tools hub + tool detail data — ported verbatim from the original PAYLESS
  site (Tools / ToolDetail / TradeZellaPage chunks). Descriptions, prices,
  coupon codes and affiliate links must not be altered.
*/
import tradingviewLogo from "@/assets/logos/tradingview-logo-hero.png";
import tradezellaLogo from "@/assets/logos/tradezella-logo.png";
import tradesyncerLogo from "@/assets/logos/tradesyncer-logo-3d.webp";
import replikantoLogo from "@/assets/logos/replikanto-logo-nobg.png";

/* ------------------------------------------------------------------ */
/* Tools hub list                                                      */
/* ------------------------------------------------------------------ */
export interface ToolListItem {
  id: string;
  name: string;
  category: string;
  description: string;
  logo?: string;
  price: string;
  isPaid: boolean;
  features: string[];
  to: string;
}

export const toolsList: ToolListItem[] = [
  {
    id: "tradezella",
    name: "TRADEZELLA",
    category: "יומן מסחר",
    description: "יומן מסחר מתקדם לניתוח ביצועים, Playbooks, Backtesting ו-Trade Replay",
    logo: tradezellaLogo,
    price: "בתשלום",
    isPaid: true,
    features: ["ניתוח ביצועים מתקדם", "Playbooks מותאמים אישית", "Backtesting על נתונים היסטוריים", "Trade Replay (Premium)"],
    to: "/tools/tradezella",
  },
  {
    id: "certificate-generator",
    name: "הפקת תעודת אתר",
    category: "כלי הפקה",
    description: "הפק תעודת Payless מותאמת אישית מהתעודה שקיבלת מחברת המימון",
    price: "חינמי",
    isPaid: false,
    features: ["זיהוי אוטומטי של פרטי התעודה", "תמיכה בכל חברות המימון", "הפקה מיידית בעברית", "גלריית תעודות הקהילה"],
    to: "/tools/certificate-generator",
  },
  {
    id: "tradingview",
    name: "TRADINGVIEW",
    category: "פלטפורמת ניתוח",
    description: "פלטפורמת ניתוח טכני מתקדמת עם כלי ציור, אינדיקטורים ותרשימים",
    logo: tradingviewLogo,
    price: "חינמי",
    isPaid: false,
    features: ["תרשימים מתקדמים", "אינדיקטורים ללא הגבלה", "התראות בזמן אמת", "15$ מתנה למצטרפים חדשים"],
    to: "/tools/tradingview",
  },
  {
    id: "tradesyncer",
    name: "TRADESYNCER",
    category: "קופי טריידר",
    description: "העתקת עסקאות אוטומטית בין חשבונות מסחר",
    logo: tradesyncerLogo,
    price: "בתשלום",
    isPaid: true,
    features: ["העתקה אוטומטית", "ניהול מרובה חשבונות", "סנכרון בזמן אמת", "התאמה אישית"],
    to: "/tools/tradesyncer",
  },
  {
    id: "consistency-calculator",
    name: "מחשבון עקביות",
    category: "מחשבון עקביות",
    description: "מחשבון עקביות אוניברסלי לכל חברות המימון - חישוב מדויק ומותאם אישית",
    price: "חינמי",
    isPaid: false,
    features: ["תמיכה בכל חברות המימון", "חישוב עקביות אוטומטי", "המלצות מותאמות אישית", "זיהוי עמידה בתנאים"],
    to: "/tools/consistency-calculator",
  },
  {
    id: "risk-calculator",
    name: "מחשבון ניהול סיכונים",
    category: "מחשבון סיכונים",
    description: "חישוב כמות חוזים מומלצת (מיני ומיקרו) לפי גודל חשבון, אחוז סיכון וסטופ לוס",
    price: "חינמי",
    isPaid: false,
    features: ["תמיכה ב-ES, NQ, YM, RTY, GC, CL", "המלצה נפרדת למיני ומיקרו", "טוגל בין טיקים לנקודות", "חישוב לפי אחוז או סכום"],
    to: "/tools/risk-calculator",
  },
  {
    id: "news-tracker",
    name: "מעקב חדשות",
    category: "יומן כלכלי",
    description: "מעקב אחר אירועי חדשות בעלי פוטנציאל וולטיליות גבוה (T1)",
    price: "חינמי",
    isPaid: false,
    features: ["אירועי T1 בזמן אמת", "סנכרון אוטומטי", "תצוגה נוחה", "תכנון מסחר"],
    to: "/tools/news-tracker",
  },
  {
    id: "glossary",
    name: "ספריית מושגים",
    category: "לימוד ומידע",
    description: "מילון מקיף למונחי מסחר, ניהול סיכונים ותנאי חברות",
    price: "חינמי",
    isPaid: false,
    features: ["מאגר מושגים מקיף מא-ת", "סרטוני הסבר להבנה עמוקה", "חיפוש מתקדם במושגים", "קישורים ישירים מדפי החברות"],
    to: "/glossary",
  },
  {
    id: "trader-quiz",
    name: "שאלון התאמת חברה",
    category: "כלי AI",
    description: "שאלון AI חכם שמנתח את סגנון המסחר שלך וממליץ על חברת המימון המתאימה ביותר",
    price: "חינמי",
    isPaid: false,
    features: ["8 שאלות קצרות וממוקדות", "ניתוח AI מותאם אישית", "השוואת כל חברות המימון", "המלצה מנומקת עם יתרונות וחסרונות"],
    to: "/tools/match",
  },
  {
    id: "replikanto",
    name: "REPLIKANTO",
    category: "קופי טריידר",
    description: "תוסף העתקת עסקאות הראשון והאמין ביותר ל-NinjaTrader 8",
    logo: replikantoLogo,
    price: "בתשלום",
    isPaid: true,
    features: ["העתקת עסקאות בין חשבונות מקומיים ומרוחקים", "תמיכה ב-Tradovate, Rithmic ו-TradingView", "מספר שיטות העתקה", "תכונת ATM Copy בלעדית"],
    to: "/tools/replikanto",
  },
];

/* ------------------------------------------------------------------ */
/* Tool detail data (/tools/:id)                                       */
/* ------------------------------------------------------------------ */
export interface ToolPricingPlan {
  name: string;
  price: string;
  originalPrice?: string;
  yearlyPrice?: string;
  duration?: string;
  billedNote?: string;
  saveBadge?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface ToolFaq {
  question: string;
  answer: string;
  videoEmbed?: string;
}

export interface ToolDetailData {
  id: string;
  name: string;
  category: string;
  price: string;
  isPaid: boolean;
  logo?: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  pricingPlans?: ToolPricingPlan[];
  videoId?: string;
  videoPending?: boolean;
  officialUrl: string;
  offer?: string;
  couponCode?: string;
  offerBullets?: string[];
  offerTitle?: string;
  offerCta?: string;
  faqs: ToolFaq[];
}

export const toolDetails: Record<string, ToolDetailData> = {
  tradingview: {
    id: "tradingview",
    name: "TRADINGVIEW",
    category: "פלטפורמת ניתוח",
    price: "בתשלום",
    isPaid: true,
    logo: tradingviewLogo,
    shortDescription: "פלטפורמת ניתוח טכני מתקדמת עם כלי ציור, אינדיקטורים ותרשימים",
    fullDescription:
      "TradingView היא הפלטפורמה המובילה בעולם לניתוח טכני ותרשימי מסחר. המערכת מציעה כלי ציור מתקדמים, מגוון רחב של אינדיקטורים, התראות בזמן אמת ותמיכה בכל שווקי המסחר.",
    features: [
      "תרשימים מתקדמים עם מגוון רחב של סוגי תרשימים",
      "מאות אינדיקטורים טכניים מובנים",
      "כלי ציור מקצועיים לניתוח טכני",
      "התראות בזמן אמת על תנאי שוק",
      "גישה ממכשירים מרובים (Web, Desktop, Mobile)",
      "שיתוף רעיונות מסחר עם קהילה עולמית",
      "סנכרון בענן לכל הלייאוטים",
      "נתונים היסטוריים מקיפים",
    ],
    pricingPlans: [
      {
        name: "Essential",
        price: "$16.95/חודש",
        originalPrice: "$19.95/חודש",
        yearlyPrice: "$13.99/חודש (חיוב שנתי)",
        description: "מושלם למתחילים",
        features: [
          "2 תרשימים לכל לשונית",
          "10 אינדיקטורים לכל תרשים",
          "8 לייאוטים נשמרים",
          '2 דו"חות מכירות',
          "חיפוש מתקדם בניירות ערך",
          "נתוני EOD עבור יותר מדי מוצרים",
          "פרסומות מוגבלות",
          "שילוב Volume Profile בלבד",
          "התראות אוטומטיות טכניות",
          "התראות נפח",
          "פרסום רעיונות ציבורי",
          "משימות בייסיק",
        ],
      },
      {
        name: "Plus",
        price: "$33.95/חודש",
        originalPrice: "$39.95/חודש",
        yearlyPrice: "$28.29/חודש (חיוב שנתי)",
        description: "לסוחרים פעילים",
        features: [
          "כל מה שיש ב-Essential",
          "4 תרשימים לכל לשונית",
          "25 אינדיקטורים לכל תרשים",
          "10 התראות ללא פקיעה",
          "20 לייאוטים נשמרים",
          '5 דו"חות מכירות',
          "נתוני אינטרה-דיי",
          "ללא פרסומות",
          "Volume Profile + Footprint",
          "רעיונות פרטיים",
          "משימות",
          "Replay Bars",
          "Custom formulas (Techs, Vol)",
          "התראות פוסטים חברתיות",
        ],
        highlighted: true,
      },
      {
        name: "Premium",
        price: "$67.95/חודש",
        originalPrice: "$79.95/חודש",
        yearlyPrice: "$56.49/חודש (חיוב שנתי)",
        description: "לסוחרים מקצועיים",
        features: [
          "כל מה שיש ב-Plus",
          "8 תרשימים לכל לשונית",
          "50 אינדיקטורים לכל תרשים",
          "40 התראות ללא פקיעה",
          "50 לייאוטים נשמרים",
          '20 דו"חות מכירות',
          "רזולוציות בשניות",
          "סקרינרים מותאמים אישית",
          "התראות על תנאים מותאמים",
          "נתוני עומק ושוק מורחבים",
          "Dashboard בייסיק",
        ],
      },
      {
        name: "Ultimate",
        price: "$239.95/חודש",
        originalPrice: "$299.95/חודש",
        yearlyPrice: "$199.95/חודש (חיוב שנתי)",
        description: "לצוותים ומשקיעים מתקדמים",
        features: [
          "כל מה שיש ב-Premium",
          "ללא הגבלה על מספר תרשימים ללשונית",
          "ללא הגבלה על אינדיקטורים לתרשים",
          "400 התראות ללא פקיעה",
          "ללא הגבלה על לייאוטים נשמרים",
          '50 דו"חות מכירות',
          "זמן נתוני עומק נוספים",
          "Dashboard מלא",
          "טיק לפי טיק",
          "רזולוציות מילישניות",
          "ניתן להשתמש ב-20 אינדיקטורים בו זמנית",
        ],
      },
    ],
    officialUrl: "https://il.tradingview.com/?aff_id=144619&source=MyWebsite",
    offer: "15$ מתנה למצטרפים חדשים בלבד",
    offerTitle: "הצטרפו עכשיו וקבלו מתנה!",
    offerBullets: ["15$ מתנה לרכישת מנוי מועדף", "למצטרפים חדשים בלבד"],
    offerCta: "הצטרף עכשיו",
    faqs: [
      {
        question: "מה המבצע הזמין למצטרפים חדשים?",
        answer: "מצטרפים חדשים מקבלים 15$ מתנה לרכישת מנוי מועדף. המתנה זמינה דרך הקישור שלנו.",
      },
      {
        question: "האם יש הנחה על תשלום שנתי?",
        answer: "כן, בכל המנויים מקבלים הנחה משמעותית בעת בחירת תשלום שנתי. למשל, Essential עולה 13.99$ לחודש בשנתי לעומת 16.95$ בחודשי.",
      },
      {
        question: "מה ההבדל בין המנויים השונים?",
        answer: "ההבדלים העיקריים הם במספר התרשימים בו-זמנית, כמות האינדיקטורים לתרשים, מספר ההתראות, והתכונות המתקדמות כמו Volume Profile ונתוני intraday.",
      },
      {
        question: "האם אפשר לשדרג מנוי לאחר ההרשמה?",
        answer: "כן, ניתן לשדרג או להוריד מנוי בכל עת. בשדרוג, ההפרש יחושב באופן יחסי לתקופה שנותרה.",
      },
      {
        question: "האם הנתונים בזמן אמת?",
        answer: "במנויים Plus ומעלה יש גישה לנתוני intraday. Essential כולל נתוני EOD (סוף יום). למסחר מתקדם מומלץ Premium או Ultimate עם נתוני שניות.",
      },
    ],
  },
  tradesyncer: {
    id: "tradesyncer",
    name: "TRADESYNCER",
    category: "קופי טריידר",
    price: "בתשלום",
    isPaid: true,
    logo: tradesyncerLogo,
    shortDescription: "העתקת עסקאות אוטומטית בין חשבונות מסחר",
    fullDescription:
      "TRADESYNCER היא פלטפורמה מתקדמת להעתקת עסקאות אוטומטית. הכלי מאפשר להעתיק עסקאות מחשבון מקור לחשבונות יעד מרובים בזמן אמת, עם שליטה מלאה על גודלי פוזיציות וניהול סיכונים.",
    features: [
      "העתקה אוטומטית בזמן אמת",
      "ניהול מרובה חשבונות בו-זמנית",
      "התאמת גודלי פוזיציות באחוזים או ביחס קבוע",
      "סינון עסקאות לפי מכשירים או תנאים",
      "סנכרון דו-כיווני בין חשבונות",
      "מעקב ודיווח מפורט על כל העתקה",
    ],
    pricingPlans: [
      {
        name: "Basic",
        price: "$49/חודש",
        description: "מושלם לסוחרים סולו או מתחילים",
        features: ["2 חיבורים", "10 חשבונות לכל חיבור", "סנכרון עסקאות בזמן אמת", "גישה ממספר מכשירים", "יומן ואנליטיקס מתקדמים", "גישה ללוח השנה הכלכלי"],
      },
      {
        name: "Pro",
        price: "$99/חודש",
        description: "לסוחרים עם מספר חיבורי ברוקרים",
        features: ["כל התכונות של Basic", "4 חיבורים", "20 חשבונות לכל חיבור", "התראות והתרעות להתאמה אישית"],
        highlighted: true,
      },
      {
        name: "Flex",
        price: "$149/חודש",
        description: "למקצוענים הזקוקים לחיבורים מרובים ותכונות מלאות",
        features: ["כל התכונות של Pro", "חיבורים ללא הגבלה", "120 חשבונות", "חשבונות נוספים זמינים"],
      },
    ],
    videoId: "MOSRx6O2ONk",
    officialUrl: "https://app.tradesyncer.com/?ref=TS6BAB4CF4",
    couponCode: "PAYLESS",
    offerTitle: "הצטרפו עכשיו עם קוד קופון בלעדי!",
    offerBullets: ["7 ימי ניסיון בחינם בפלטפורמה", "10% הנחה על המנוי החודשי של החודש הראשון"],
    offerCta: "הרשם עכשיו עם הקופון",
    faqs: [
      {
        question: "מהי Tradesyncer?",
        answer:
          "טריידסינקר (Tradesyncer) היא תוכנה המאפשרת לסנכרן את כל העסקאות בין אם סוחרים במספר חברות מימון או בחברת מימון אחת עם מספר תיקים. התוכנה מאפשרת להתחיל להעתיק מסחר מחיבורים שונים בפלטפורמה.",
      },
      {
        question: "כמה חיבורים ותיקים ניתן לשלב בתוכנית הבסיסית (Basic)?",
        answer:
          'מסלול הבייסיק עולה 49 דולר לחודש וכולל שני חיבורים. "חיבור" מתייחס לחברה או ברוקר (לדוגמה, חיבור אחד ל-Tradeovate של MFFU וחיבור נוסף ל-Rithmic של APEX). ניתן לשלב במסלול זה עד 10 תיקים לכל חיבור.',
      },
      {
        question: "מה היתרון של מנוי שנתי?",
        answer: "מנוי שנתי יקנה לכם 10% הנחה נוספים, אך התשלום יתבצע מראש באופן שנתי.",
      },
      {
        question: "מה הדרך המומלצת להירשם כדי לקבל הטבות?",
        answer:
          "ניתן להשתמש בקוד קופון PAYLESS בעת התשלום. קוד זה מקנה, בנוסף לשבעה ימי ניסיון בחינם, 10% הנחה נוספים על החודש הראשון.",
      },
      {
        question: "איך מחברים Project X ל-Tradesyncer?",
        answer: "למדריך מפורט על חיבור Project X, צפו בסרטון המלא:",
        videoEmbed: "lL8D8DwmyBg",
      },
      {
        question: "איפה מקשרים את החשבון הספציפי (כגון TopstepX) ללוח הבקרה של Project X?",
        answer:
          "הקישור של החשבונות אינו מתבצע באתר Project X. יש לגשת לפלטפורמה עצמה (במקרה זה, TopstepX), לנווט להגדרות (Settings) ואז למצוא את ה-API.",
      },
      {
        question: "כיצד יוצרים את מפתח ה-API בפלטפורמה?",
        answer:
          'בחלק ה-API בפלטפורמה (כגון TopstepX), יש לראות מפתחות API וקישור לפרויקט X. לפני יצירת המפתחות, יש לקשר קודם את פרויקט X. המערכת תזהה את הסשן של דף לוח הבקרה הפתוח של Project X ותבקש אישור לקישור. לאחר האישור, הפלטפורמה תהיה זמינה בין החשבונות המקושרים, וניתן ללחוץ על "הוספת מפתח" כדי ליצור את מפתח ה-API.',
      },
      {
        question: "אילו פרטים נדרשים ב-Tradesyncer עבור חיבור Project X?",
        answer:
          "יש לגשת ללוח הבקרה של Tradesyncer, לניהול החיבורים, ולבחור את הפלטפורמה (לדוגמה, TopstepX Project X). במקרה זה, תצטרכו למלא את שם המשתמש ומפתח ה-API.",
      },
      {
        question: "מהו שם המשתמש שיש להזין?",
        answer:
          "שם המשתמש יהיה שם המשתמש שיש לכם לחברת המימון. חלק מחברות המימון משתמשות בכתובת אימייל ואחרות משתמשות בשם משתמש. אם אינכם יודעים את שם המשתמש, תצטרכו לשאול את חברת המימון שלכם.",
      },
      {
        question: "מהי הדרך הנכונה להעתיק את מפתח ה-API ל-Tradesyncer?",
        answer:
          "זהו שלב קריטי: יש לבחור ולהדגיש את מפתח ה-API במקום להשתמש בפונקציית ההעתקה (copy). רוב הפעמים, אם תשתמשו בפונקציית ההעתקה זה לא יעבוד. לאחר שבחרתם והדגשתם את המפתח, יש לחזור לסביבת Tradesyncer ולהדביק אותו.",
      },
      {
        question: "לאחר חיבור מוצלח, היכן אני רואה את החיבור החדש?",
        answer:
          "לאחר החיבור, תוכלו לראות אותו זמין תחת ניהול החיבורים ותוכלו להפעיל אותו. כמו כן, תוכלו ללכת ל-Copytrading ולראות שזה זמין תחת הטייס האוטומטי.",
      },
      {
        question: "האם פונקציית Deep PNL זמינה עבור חיבורי Project X?",
        answer:
          "לא, דבר אחד שניתן להבחין בו הוא ש-Deep PNL (רווח/הפסד עמוק) אינו זמין לחיבור Topstep ולכל חיבורי Project X אחרים, וזאת מגבלה הקיימת בפלטפורמה.",
      },
      {
        question: "כיצד אני מגדיר איזה חשבון הוא המוביל (Leader)?",
        answer: "יש לבחור את החשבון המוביל על ידי לחיצה על האייקון עם הכתר.",
      },
      {
        question: "איך אני מוודא שחשבון אחר יעתיק את העסקאות?",
        answer:
          'יש לסמן את החשבון שצריך להיות "עוקב" (Follow). חשבון זה יסומן בכחול, ומשמעות הדבר היא שהוא יעתיק את העסקאות אוטומטית מהחשבון המוביל.',
      },
      {
        question: "מהו פיצ'ר Ratio (יחס)?",
        answer:
          "Ratio מאפשר לקבוע יחס העתקה בין התיקים. לדוגמה, אם יש תיק מוביל של 50,000 ותיק עוקב של 150,000, ניתן להגדיר שאם בתיק המוביל נכנסים בחוזה אחד של מיני, בתיק העוקב הוא ייכנס ביחס של פי 3 (כלומר, שלושה חוזי מיני).",
      },
      {
        question: "מהו פיצ'ר Cross Order (העתקה צולבת)?",
        answer:
          "זהו פיצ'ר המאפשר להגדיר שהתיק העוקב ייכנס בנכס המקביל (הקרוס) במקום בנכס המקורי, תוך שמירה על יחס. לדוגמה, אם נכנסים במיני בתיק המוביל, ניתן להגדיר שהתיק העוקב ייכנס במספר חוזים של מיקרו.",
      },
      {
        question: "כיצד ניתן לצאת מכל העסקאות בצורה מהירה?",
        answer:
          'ניתן להשתמש בפונקציה "Flatten All". פקודה זו מוציאה מכל העסקאות כמה שיותר דחוף (במרקט), כדי לשטח אותן. ניתן גם לבצע "Flatten" ספציפי לתיק אחד.',
      },
      {
        question: "האם המערכת חייבת להיות פתוחה כדי שתתבצע העתקת עסקאות?",
        answer:
          "לא. ברגע שהגדרתם את הכל, אינכם חייבים אפילו להיות פתוחים עם המסך, בשונה מתוכנות העתקה אחרות.",
      },
      {
        question: "מה חשוב לעשות לאחר חיבור התיקים?",
        answer:
          "חשוב מאוד לבצע בדיקות (טסטים) לאחר חיבור התיקים. מומלץ להתחיל עם מיקרו אחד בודד כדי לוודא שכל המערכות עובדות חלק ורק לאחר מכן לעבוד לפי הכמויות הרצויות.",
      },
    ],
  },
  replikanto: {
    id: "replikanto",
    name: "REPLIKANTO",
    category: "קופי טריידר",
    price: "בתשלום",
    isPaid: true,
    logo: replikantoLogo,
    shortDescription: "תוסף העתקת עסקאות הראשון והאמין ביותר ל-NinjaTrader 8",
    fullDescription:
      "Replikanto הוא תוסף מתקדם ל-NinjaTrader 8 המאפשר להעתיק עסקאות מחשבון מוביל למספר חשבונות עוקבים, הן במחשב מקומי והן בין מחשבים שונים. התוסף מציע תאימות מלאה עם Tradovate, Rithmic ו-TradingView כולל תמיכה ב-OCO exit orders. ישנן מספר שיטות העתקה כולל Exact Quantity, Equal Quantity, Ratio, Net Liquidation, Available Money, Percentage Change ו-Pre Allocation.",
    features: [
      "ATM Copy - שימוש באסטרטגיית ATM של המוביל בחשבונות העוקבים",
      "Market Only - העתקת הוראות מרקט בלבד מהמוביל",
      "Follower Guard - הגנה על חשבונות עוקבים במצבי סיכון",
      "Cross Order - מסחר במיקרו והעתקה למיני או להיפך (ES ↔ MES, NQ ↔ MNQ)",
      "Network/Remote Mode - העתקה בין מחשבים שונים ברשת מקומית או אינטרנט",
      "Export/Import - ייצוא וייבוא רשימות עוקבים",
      "Stealth Mode - מניעת זיהוי השימוש ב-Replikanto",
      "ScalperTicket Integration - מסחר במחירי Bid/Ask עם תמיכה ב-Flatten All",
    ],
    pricingPlans: [
      {
        name: "ניסיון",
        price: "חינם",
        duration: "7 ימים",
        description: "תקופת ניסיון להתנסות",
        features: ["7 ימי לוח שנה לבדיקה", "בדיקה בחשבונות סימולציה מומלצת", "+ 20 קרדיטים Submit למצב Remote"],
      },
      {
        name: "מחשב אחד (שנה)",
        price: "$149",
        description: "רישיון שנתי למחשב אחד",
        features: ["+ 20 קרדיטים Submit למצב Remote", "שנה אחת של תמיכה ועדכונים חינם", "לא ניתן להמיר ללכל החיים", "נסו את תקופת הניסיון של 7 ימים לפני הרכישה"],
      },
      {
        name: "2 מחשבים (שנה)",
        price: "$199",
        description: "הטוב ביותר לשימוש במצב Network/Remote",
        features: ["+ 20 קרדיטים Submit למצב Remote", "שנה אחת של תמיכה ועדכונים חינם", "לא ניתן להמיר ללכל החיים", "נסו את תקופת הניסיון של 7 ימים לפני הרכישה"],
      },
      {
        name: "מחשב אחד (לכל החיים)",
        price: "$299",
        description: "רישיון לכל החיים למחשב אחד",
        features: ["+ 20 קרדיטים Submit למצב Remote", "שנה אחת של תמיכה ועדכונים חינם", "נסו את תקופת הניסיון של 7 ימים לפני הרכישה"],
        highlighted: true,
      },
      {
        name: "2 מחשבים (לכל החיים)",
        price: "$399",
        description: "הטוב ביותר לשימוש במצב Network/Remote",
        features: ["+ 20 קרדיטים Submit למצב Remote", "שנה אחת של תמיכה ועדכונים חינם", "נסו את תקופת הניסיון של 7 ימים לפני הרכישה"],
      },
    ],
    videoPending: true,
    officialUrl: "https://flowbots.ninja/product/replikanto/?v=4605f628f91d&wpam_id=316",
    offer: "20% הנחה עם קוד PAYLESS",
    couponCode: "PAYLESS",
    offerTitle: "קבלו 20% הנחה עם קוד קופון בלעדי!",
    offerBullets: ["20% הנחה על כל חבילות הרכישה", "תכונת ATM Copy בלעדית", "תמיכה ב-Tradovate, Rithmic ו-TradingView"],
    offerCta: "רכישה עם הקופון",
    faqs: [
      {
        question: "מה זה Replikanto?",
        answer:
          "Replikanto הוא תוסף ל-NinjaTrader 8 המאפשר להעתיק עסקאות מחשבון מוביל למספר חשבונות עוקבים לפי שיטת ההעתקה שנבחרה. במצב network/remote, ניתן להעתיק עסקאות בין Replikantos הרצים על מספר מחשבים.",
      },
      {
        question: "מה זה ATM Copy?",
        answer:
          "זוהי תכונה בלעדית שתשתמש באסטרטגיית ATM של Ninjatrader של המוביל בחשבונות העוקבים (מקומיים ומרוחקים) לניהול הוראות יציאה במקום להעתיק אותן מחשבון המוביל. דרך חדשה להעתיק עסקאות ב-Ninjatrader שהיא מהירה הרבה יותר ותפתח אפשרויות חדשות לשימוש בשיטות ההעתקה Ratio ו-Pre Allocation.",
      },
      {
        question: "מה זה Market Only?",
        answer:
          "תכונה שתיתן אפשרות להעתיק רק את הוראות המרקט (ביצועים) של המוביל לעוקבים. ניתן להשתמש בזה עם עוקבים מקומיים או מרוחקים כדי להבטיח שרק ביצועים מועתקים, תוך השמטת סוגי הוראות אחרות כמו limit או stop.",
      },
      {
        question: "מהו Follower Guard?",
        answer:
          "תכונה שמטרתה להגן על חשבונות עוקבים במצבים מסוימים על ידי סגירת הפוזיציה והוצאתה מהזיהוי כך שהיא לא תקבל יותר העתקות מהמוביל. נשלח אימייל כשזה קורה כדי שתוכלו לנקוט בפעולה הנדרשת.",
      },
      {
        question: "האם צריך להיות מקוון כדי שהעתקת העסקאות תעבוד?",
        answer:
          "NinjaTrader 8 עם Replikanto צריך לרוץ על כל המחשבים (מוביל ועוקבים). דרוש רישיון ייחודי של Replikanto לכל המחשבים.",
      },
      {
        question: "האם יש הנחה זמינה?",
        answer: "כן! השתמשו בקוד PAYLESS לקבלת 20% הנחה על כל חבילות הרכישה.",
      },
      {
        question: "מה זה Cross Order?",
        answer:
          "תכונה המאפשרת לסחור במיקרו ולהעתיק למיני או להיפך (ES ↔ MES, NQ ↔ MNQ, וכו'). רשימה מלאה זמינה בתיאור המוצר.",
      },
      {
        question: "מה נדרש להפעלת Replikanto?",
        answer: "נדרש NinjaTrader Desktop בגרסה 8.1.6.0 או גבוהה יותר.",
      },
    ],
  },
  tradezella: {
    id: "tradezella",
    name: "TRADEZELLA",
    category: "יומן מסחר",
    price: "בתשלום",
    isPaid: true,
    logo: tradezellaLogo,
    shortDescription: "יומן מסחר מתקדם לניתוח ביצועים, Playbooks, Backtesting ו-Trade Replay",
    fullDescription:
      "יומן המסחר המתקדם ביותר - נתח ביצועים, בנה Playbooks, בצע Backtesting וזהה דפוסים שישנו את המסחר שלך לנצח.",
    features: [
      "ניתוח ביצועים מתקדם - דשבורד מקיף עם סטטיסטיקות מפורטות על כל העסקאות שלך",
      "Playbooks מותאמים אישית - בנה ותעד אסטרטגיות מסחר עם כללים ברורים ומדידים",
      "Mentor Invites - שתף את היומן שלך עם מנטור או קבוצת מסחר",
      "Backtesting - בחן אסטרטגיות על נתונים היסטוריים ושפר את הביצועים",
      "אחסון מאובטח - כל הנתונים שלך מאוחסנים בצורה מאובטחת בענן",
      "Trade Replay - צפה מחדש בעסקאות שלך וזהה דפוסים לשיפור (Premium)",
    ],
    pricingPlans: [
      {
        name: "BASIC",
        price: "$29",
        billedNote: "/חודש",
        description: "לסוחרים מתחילים",
        features: ["חשבון אחד", "1GB אחסון מאובטח", "עד 3 Playbooks", "5 הזמנות מנטור", "Backtesting ללא הגבלה"],
      },
      {
        name: "PREMIUM",
        price: "$49",
        billedNote: "/חודש",
        description: "לסוחרים מתקדמים",
        features: ["חשבונות ללא הגבלה", "5GB אחסון מאובטח", "Playbooks ללא הגבלה", "הזמנות מנטור ללא הגבלה", "Backtesting ללא הגבלה", "Sessions Trade Replay"],
        highlighted: true,
      },
      {
        name: "ESSENTIAL",
        price: "$24",
        billedNote: "/חודש · חיוב שנתי $288",
        description: "לכל הסוחרים",
        features: ["חשבון אחד", "1GB אחסון מאובטח", "עד 3 Playbooks", "5 הזמנות מנטור", "Backtesting ללא הגבלה"],
      },
      {
        name: "PRO",
        price: "$33",
        billedNote: "/חודש · חיוב שנתי $399",
        saveBadge: "חסוך $189",
        description: "לסוחרים פעילים",
        features: ["חשבונות ללא הגבלה", "5GB אחסון מאובטח", "Playbooks ללא הגבלה", "הזמנות מנטור ללא הגבלה", "Backtesting ללא הגבלה", "Sessions Trade Replay"],
        highlighted: true,
      },
    ],
    officialUrl: "https://refer.tradezella.com/payless",
    offerCta: "התחל עכשיו",
    faqs: [
      {
        question: "מה זה TradeZella?",
        answer:
          "TradeZella הוא יומן מסחר דיגיטלי מתקדם שמאפשר לסוחרים לתעד, לנתח ולשפר את ביצועי המסחר שלהם. הפלטפורמה מציעה דשבורד אנליטי, Playbooks לאסטרטגיות, Backtesting ועוד.",
      },
      {
        question: "האם TradeZella מתאים למסחר בחוזים עתידיים (Futures)?",
        answer: "כן! TradeZella תומך בחוזים עתידיים, מניות, אופציות ו-Forex. ניתן לחבר חשבונות ממגוון ברוקרים ופלטפורמות.",
      },
      {
        question: "מה ההבדל בין Basic ל-Premium?",
        answer:
          "במסלול Basic ניתן לחבר חשבון אחד, 1GB אחסון ו-3 Playbooks. במסלול Premium תקבלו חשבונות ו-Playbooks ללא הגבלה, 5GB אחסון, הזמנות מנטור ללא הגבלה ותכונת Sessions Trade Replay.",
      },
      {
        question: "האם יש הנחה על תשלום שנתי?",
        answer:
          "כן, במנוי שנתי ניתן לחסוך עד $189 בשנה. מסלול Essential עולה $24/חודש (במקום $29) ומסלול Pro עולה $33/חודש (במקום $49).",
      },
      {
        question: "האם ניתן לשתף את היומן עם מנטור?",
        answer:
          "כן, TradeZella מאפשר לשלוח הזמנות מנטור כדי שהמנטור שלכם יוכל לצפות ולנתח את העסקאות שלכם. במסלול Basic יש 5 הזמנות, ובמסלול Premium ללא הגבלה.",
      },
      {
        question: "מהו Trade Replay?",
        answer:
          "Trade Replay מאפשר לכם לצפות מחדש בעסקאות שביצעתם, לזהות דפוסים, טעויות ונקודות לשיפור. תכונה זו זמינה במסלול Premium בלבד.",
      },
      {
        question: "למה חשוב לנהל יומן מסחר?",
        answer:
          "יומן מסחר הוא הכלי הקריטי ביותר לשיפור ביצועים. הוא מאפשר לזהות חוזקות וחולשות, לעקוב אחרי ביצועי אסטרטגיות שונות, ולבנות משמעת מסחרית. סוחרים מצליחים תמיד מנהלים יומן.",
      },
    ],
  },
  "news-tracker": {
    id: "news-tracker",
    name: "מעקב חדשות",
    category: "יומן כלכלי",
    price: "חינמי",
    isPaid: false,
    shortDescription: "מעקב אחר אירועי חדשות בעלי פוטנציאל וולטיליות גבוה (T1)",
    fullDescription:
      "כלי מעקב החדשות מציג יומן כלכלי עם דגש על אירועי Tier 1 - אירועים בעלי פוטנציאל לוולטיליות גבוהה בשוק. מספק תצוגת לוח שנה חודשית ורשימת אירועים מפורטת למעקב נוח, כולל מדריך מפורט לחוקי מסחר בחדשות של חברות המימון המובילות.",
    features: [
      "תצוגת אירועי T1 (Tier 1) בזמן אמת",
      "לוח שנה חודשי אינטראקטיבי",
      "רשימת אירועים מפורטת",
      "מדריך חוקי מסחר בחדשות לכל חברה",
      "אידיאלי לתכנון אסטרטגיות מסחר",
      "חינמי לחלוטין",
      "ללא צורך ברישום",
    ],
    officialUrl: "",
    faqs: [
      {
        question: "מה זה אירועי T1?",
        answer:
          "אירועי T1 (Tier 1) הם אירועים כלכליים חשובים ביותר שיש להם פוטנציאל גבוה לגרום לתנודתיות חזקה בשוק. אלה כוללים החלטות ריבית (FOMC), דוחות תעסוקה (NFP), מדד המחירים לצרכן (CPI), ישיבות בנקים מרכזיים ועוד.",
      },
      {
        question: "מה ההבדל בין חוקי מסחר בחדשות במבחן לעומת חשבון ממומן?",
        answer:
          "רוב חברות המימון מאפשרות מסחר בזמן חדשות בשלב המבחן (Evaluation), אך אוסרות או מגבילות מסחר בזמן חדשות בחשבון הממומן (Funded). לדוגמה: MFFU מאפשרת מסחר בחדשות גם בממומן, בעוד Alpha Futures ו-TPT אוסרות מסחר ±1-2 דקות מהודעה בחשבון הממומן.",
      },
      {
        question: "מהם סוגי ההגבלות הנפוצים?",
        answer:
          "ישנם שלושה סוגים עיקריים: 1) אסור לפתוח פוזיציות חדשות - ניתן להחזיק פוזיציות קיימות אך לא לפתוח חדשות. 2) אסור להחזיק פוזיציות פתוחות - יש לצאת מכל הפוזיציות לפני החדשות. 3) אסור לבצע פקודות - אסור להחזיק פוזיציות או פקודות פתוחות כלל.",
      },
      {
        question: "אילו אירועים נחשבים ל'חדשות אסורות' בדרך כלל?",
        answer:
          'האירועים הנפוצים ביותר הם: FOMC Statements (הודעות הפד), Non-Farm Payroll (NFP), ו-CPI. בנוסף, חלק מהחברות אוסרות אירועים ספציפיים למוצרים מסוימים - למשל Crude Oil Inventories עבור נפט, ו-Bond Auctions עבור אג"ח.',
      },
      {
        question: "איפה ניתן לראות את לוח האירועים האסורים?",
        answer:
          "ניתן להשתמש באתר Forex Factory ולסנן לפי 'תיקיות אדומות' (Red Folders) עבור אירועים בעלי השפעה גבוהה. בנוסף, חברות כמו TPT מספקות לוח שנה רשמי משלהן. כלי המעקב שלנו מציג את כל אירועי ה-T1 במקום אחד.",
      },
      {
        question: "מה קורה אם סוחרים בזמן חדשות בניגוד לחוקים?",
        answer:
          "הפרת חוקי מסחר בחדשות עלולה לגרום לפסילת החשבון הממומן או לעיכוב בתהליך ה-Payout. חשוב מאוד להכיר את החוקים הספציפיים של חברת המימון שלכם לפני כל יום מסחר.",
      },
      {
        question: "מתי מתעדכן היומן?",
        answer:
          "היומן מתעדכן אוטומטית בכל פעם שאתם טוענים את הדף. הנתונים נשמרים בזיכרון מהיר למשך 24 שעות למהירות מקסימלית.",
      },
      {
        question: "האם יש הבדל בין חברות המימון?",
        answer:
          "כן, לכל חברה חוקים שונים. למשל: MFFU מאפשרת מסחר בחדשות בכל המסלולים, Alpha Futures אוסרת ±2 דקות מהודעה על תיקיות אדומות בלבד, Lucid Trading אוסרת רק על אירועי FOMC ו-NFP, ו-TPT אוסרת על מספר אירועים כולל CPI ו-Bond Auctions.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* News-tracker: economic indicators guide                             */
/* ------------------------------------------------------------------ */
export interface EconIndicator {
  id: string;
  name: string;
  nameEn: string;
  acronym: string;
  description: string;
  impact: string;
  frequency: string;
  source: string;
  bullishSignal: string;
  bearishSignal: string;
  tradingTip?: string;
}

export const econIndicators: EconIndicator[] = [
  {
    id: "nfp",
    name: "שכירים מחוץ לחקלאות",
    nameEn: "Non-Farm Payrolls",
    acronym: "NFP",
    description:
      "מדד מרכזי הסוקר את מספר המועסקים החדשים במשק האמריקאי, למעט מגזר החקלאות, עובדי ממשלה וארגונים ללא מטרות רווח. מהווה אינדיקטור מוביל לבריאות הכלכלה.",
    impact: "השפעה גבוהה מאוד - מניע תנודתיות חריגה בשווקים",
    frequency: "יום שישי הראשון בכל חודש בשעה 15:30 (שעון ישראל)",
    source: "לשכת הסטטיסטיקה לעבודה (BLS)",
    bullishSignal: "תוספת משרות מעל הצפי ← דולר חזק, מניות עולות",
    bearishSignal: "פחות משרות מהצפי ← דולר נחלש, שוק במגננה",
    tradingTip: "רגע לפני הפרסום השוק עצבני - מומלץ לצמצם חשיפה או לעבוד עם סטופ הדוק",
  },
  {
    id: "cpi",
    name: "מדד המחירים לצרכן",
    nameEn: "Consumer Price Index",
    acronym: "CPI",
    description:
      "מדד האינפלציה הנפוץ ביותר, המודד שינויים במחירי סל מוצרים ושירותים טיפוסי. נתון קריטי להחלטות הריבית של הפד.",
    impact: "השפעה גבוהה - משפיע ישירות על מדיניות הריבית",
    frequency: "אמצע כל חודש, בערך ב-13-15 לחודש",
    source: "לשכת הסטטיסטיקה לעבודה (BLS)",
    bullishSignal: "אינפלציה יורדת ← ציפיות להורדת ריבית, שוק אופטימי",
    bearishSignal: "אינפלציה עולה ← חשש מהעלאת ריבית, לחץ על מניות",
    tradingTip: "עקוב גם אחרי מדד הליבה (Core CPI) שמסנן מזון ואנרגיה - יותר יציב ומשמעותי",
  },
  {
    id: "fomc",
    name: "החלטת ריבית הפד",
    nameEn: "FOMC Interest Rate Decision",
    acronym: "FOMC",
    description:
      "הכרזת הוועדה הפדרלית לשוק הפתוח על שינויים בריבית הבסיסית. ההחלטה משפיעה על עלות האשראי בכל המשק האמריקאי והעולמי.",
    impact: "השפעה קריטית - האירוע החשוב ביותר בשווקים",
    frequency: "8 פעמים בשנה, כל 6-7 שבועות",
    source: "הבנק המרכזי האמריקאי (Federal Reserve)",
    bullishSignal: "הורדת ריבית / הקלה ← שוק שורי, דולר נחלש",
    bearishSignal: "העלאת ריבית / הקשחה ← לחץ על מניות, דולר מתחזק",
    tradingTip: 'הטון של נאום היו"ר חשוב לא פחות מההחלטה עצמה - עקוב אחרי מסיבת העיתונאים',
  },
  {
    id: "fomc-minutes",
    name: "פרוטוקול הפד",
    nameEn: "FOMC Minutes",
    acronym: "FOMC Minutes",
    description:
      "תמליל מפורט של הדיונים בישיבת הפד האחרונה. חושף את הלך הרוח של חברי הוועדה ורמזים לגבי החלטות עתידיות.",
    impact: "השפעה בינונית-גבוהה - תובנות לגבי הכיוון העתידי",
    frequency: "3 שבועות לאחר כל ישיבת FOMC",
    source: "הבנק המרכזי האמריקאי (Federal Reserve)",
    bullishSignal: "טון מרגיע וזהיר ← ציפיות להמשך תמיכה",
    bearishSignal: "דאגות מאינפלציה ← ציפיות להקשחה נוספת",
    tradingTip: "קרא בין השורות - הפרוטוקול לרוב מאשר את מה שכבר ידוע, אבל ניואנסים יכולים להזיז שווקים",
  },
  {
    id: "unemployment",
    name: "שיעור האבטלה",
    nameEn: "Unemployment Rate",
    acronym: "UR",
    description: "אחוז המובטלים מכוח העבודה הפעיל. מדד בריאות שוק העבודה ויכולת ההוצאה של הצרכנים.",
    impact: "השפעה גבוהה - אינדיקטור מרכזי לבריאות הכלכלה",
    frequency: "יום שישי הראשון בכל חודש, יחד עם ה-NFP",
    source: "לשכת הסטטיסטיקה לעבודה (BLS)",
    bullishSignal: "אבטלה נמוכה ← כלכלה חזקה, צריכה גוברת",
    bearishSignal: "אבטלה עולה ← חשש ממיתון, הוצאות יורדות",
    tradingTip: "שים לב גם לשיעור ההשתתפות בכוח העבודה - אבטלה נמוכה עם השתתפות נמוכה פחות אופטימית",
  },
  {
    id: "eia",
    name: "מלאי נפט גולמי",
    nameEn: "EIA Crude Oil Inventories",
    acronym: "EIA",
    description: 'דוח שבועי על שינויים במלאי הנפט הגולמי בארה"ב. משקף את האיזון בין היצע לביקוש באנרגיה.',
    impact: "השפעה ממוקדת - משפיע בעיקר על מחירי הנפט והאנרגיה",
    frequency: "כל יום רביעי בשעה 17:30 (שעון ישראל)",
    source: "מינהל מידע האנרגיה האמריקאי (EIA)",
    bullishSignal: "ירידה במלאי ← מחסור ← מחיר הנפט עולה",
    bearishSignal: "עלייה במלאי ← עודף ← מחיר הנפט יורד",
    tradingTip: "שילוב עם נתוני API (שמתפרסמים יום לפני) יכול לתת רמז לכיוון",
  },
  {
    id: "usda",
    name: "דוח חקלאי",
    nameEn: "USDA Agricultural Report",
    acronym: "USDA",
    description: "דוחות משרד החקלאות על יבולים, מלאים ותחזיות. משפיע על מחירי סחורות חקלאיות כמו תירס, סויה וחיטה.",
    impact: "השפעה ממוקדת - רלוונטי בעיקר לסוחרי סחורות",
    frequency: "מספר דוחות בחודש, בתאריכים משתנים",
    source: "משרד החקלאות האמריקאי (USDA)",
    bullishSignal: "יבול נמוך מהצפי ← מחסור ← מחירים עולים",
    bearishSignal: "יבול גבוה מהצפי ← עודף ← מחירים יורדים",
    tradingTip: "דוח ה-WASDE החודשי הוא הכי משמעותי - מתפרסם סביב ה-12 לחודש",
  },
  {
    id: "ppi",
    name: "מדד מחירי יצרן",
    nameEn: "Producer Price Index",
    acronym: "PPI",
    description: "מודד שינויים במחירים שמקבלים יצרנים מקומיים עבור מוצריהם. אינדיקטור מקדים לאינפלציה צרכנית.",
    impact: "השפעה בינונית - מנבא את כיוון ה-CPI",
    frequency: "אמצע כל חודש, לרוב יום לפני ה-CPI",
    source: "לשכת הסטטיסטיקה לעבודה (BLS)",
    bullishSignal: "PPI יורד ← לחץ אינפלציוני פוחת",
    bearishSignal: "PPI עולה ← אינפלציה בדרך לצרכן",
    tradingTip: "PPI גבוה יחד עם CPI נמוך? יצרנים סופגים עלויות - לא בר קיימא לטווח ארוך",
  },
  {
    id: "retail",
    name: "מכירות קמעונאיות",
    nameEn: "Retail Sales",
    acronym: "Retail",
    description: "סקר הערכת המכירות הכוללות בחנויות קמעונאיות. משקף את כוח הקנייה והביטחון של הצרכן האמריקאי.",
    impact: 'השפעה בינונית-גבוהה - צריכה פרטית = 70% מהתמ"ג',
    frequency: "אמצע כל חודש",
    source: "לשכת המפקד האמריקאית (Census Bureau)",
    bullishSignal: "מכירות עולות ← צרכנים מבוטחים, כלכלה צומחת",
    bearishSignal: "מכירות יורדות ← חששות כלכליים, הידוק חגורה",
    tradingTip: "בדוק גם מכירות ללא רכבים (Core Retail) - רכבים יוצרים תנודתיות מלאכותית",
  },
  {
    id: "ism",
    name: "מדד מנהלי הרכש התעשייתי",
    nameEn: "ISM Manufacturing PMI",
    acronym: "ISM",
    description:
      "סקר בקרב מנהלי רכש במפעלים. מעל 50 = התרחבות, מתחת ל-50 = התכווצות. אינדיקטור מוביל למצב המגזר התעשייתי.",
    impact: "השפעה בינונית-גבוהה - תמונת מצב מהשטח",
    frequency: "יום העסקים הראשון בכל חודש",
    source: "מכון ניהול האספקה (ISM)",
    bullishSignal: "מעל 50 ועולה ← ייצור מתרחב, כלכלה בריאה",
    bearishSignal: "מתחת ל-50 ויורד ← התכווצות, סימני מיתון",
    tradingTip: "רכיב ההזמנות החדשות הכי חשוב - מנבא את העתיד הקרוב",
  },
];

/* ------------------------------------------------------------------ */
/* News-tracker: news trading rules per funding company                */
/* ------------------------------------------------------------------ */
export interface NewsRulePlan {
  name: string;
  evaluation: { allowed: "yes" | "no" | "partial"; details: string; timeRestriction?: string };
  funded: { allowed: "yes" | "no" | "partial"; details: string; timeRestriction?: string };
}

export interface NewsRuleCompany {
  id: string;
  name: string;
  plans: NewsRulePlan[];
  relevantNews?: { label: string; events: string[]; link?: string }[];
}

export const newsRules: NewsRuleCompany[] = [
  {
    id: "mffu",
    name: "My Funded Futures",
    plans: [
      { name: "Flex", evaluation: { allowed: "yes", details: "מותר לסחור בחדשות" }, funded: { allowed: "yes", details: "מותר לסחור בחדשות" } },
      {
        name: "Pro (עם/בלי One-Day)",
        evaluation: { allowed: "yes", details: "מותר לסחור בחדשות" },
        funded: { allowed: "no", details: "אסור לפתוח/לסגור פוזיציות", timeRestriction: "±2 דקות מהודעה" },
      },
      {
        name: "Rapid",
        evaluation: { allowed: "yes", details: "מותר לסחור בחדשות" },
        funded: { allowed: "no", details: "אסור לפתוח/לסגור פוזיציות", timeRestriction: "±2 דקות מהודעה" },
      },
      { name: "Builder", evaluation: { allowed: "yes", details: "מותר לסחור בחדשות" }, funded: { allowed: "yes", details: "מותר לסחור בחדשות" } },
    ],
    relevantNews: [
      { label: "🌍 לכל הסוחרים", events: ["FOMC Meetings", "FOMC Minutes", "Employment Report", "CPI"] },
      { label: "⛽ סוחרי אנרגיה", events: ["EIA"] },
      { label: "🌾 סוחרי חקלאות", events: ["Agricultural Reports"] },
    ],
  },
  {
    id: "tpt",
    name: "Take Profit Trader",
    plans: [
      {
        name: "כל המסלולים (PRO/PRO+)",
        evaluation: { allowed: "yes", details: "מותר לסחור בחדשות" },
        funded: { allowed: "no", details: "אסור להחזיק פוזיציות פתוחות או פקודות פתוחות", timeRestriction: "±1 דקה מהודעה" },
      },
    ],
    relevantNews: [
      { label: "🌍 לכל המוצרים", events: ["FOMC Statements", "Non-Farm Payroll", "CPI"] },
      { label: "⛽ Crude Oil", events: ["Crude Oil Inventories"] },
      { label: "📈 10Y Note / 30Y Bond", events: ["Bond Auctions"] },
      { label: "תיקיות אדומות USD", events: ["Forex Factory"], link: "https://www.forexfactory.com/" },
      { label: "לוח שנה רשמי", events: ["TPT Calendar"], link: "https://takeprofittrader.com/user-info/calendar" },
    ],
  },
  {
    id: "fundednext",
    name: "FundedNext",
    plans: [
      { name: "Legacy / Rapid / Bolt", evaluation: { allowed: "yes", details: "מותר לסחור בחדשות" }, funded: { allowed: "yes", details: "מותר לסחור בחדשות" } },
      {
        name: "Flex",
        evaluation: { allowed: "yes", details: "מותר לסחור בחדשות במבחן" },
        funded: { allowed: "yes", details: "מותר לסחור בחדשות בחשבון הממומן" },
      },
    ],
  },
  {
    id: "alpha-futures",
    name: "Alpha Futures",
    plans: [
      { name: "Premium", evaluation: { allowed: "yes", details: "מותר לסחור בחדשות" }, funded: { allowed: "yes", details: "מותר לסחור בחדשות ללא הגבלות" } },
      { name: "Advanced", evaluation: { allowed: "yes", details: "מותר לסחור בחדשות" }, funded: { allowed: "yes", details: "מותר לסחור בחדשות" } },
      {
        name: "Zero",
        evaluation: { allowed: "yes", details: "מותר לסחור בחדשות" },
        funded: { allowed: "no", details: "אסור לבצע פקודות", timeRestriction: "±2 דקות מהודעה" },
      },
    ],
    relevantNews: [{ label: "תיקיות אדומות בלבד", events: ["Forex Factory"], link: "https://www.forexfactory.com/" }],
  },
  {
    id: "lucid-trading",
    name: "Lucid Trading",
    plans: [
      { name: "כל המסלולים", evaluation: { allowed: "yes", details: "מותר לסחור בחדשות" }, funded: { allowed: "yes", details: "מותר לסחור בחדשות" } },
    ],
  },
  {
    id: "top-one-futures",
    name: "Top One Futures",
    plans: [
      { name: "Instant Sim Funded", evaluation: { allowed: "yes", details: "מותר לסחור בחדשות" }, funded: { allowed: "yes", details: "מותר לסחור בחדשות" } },
      { name: "Ignite AF", evaluation: { allowed: "yes", details: "מותר לסחור בחדשות" }, funded: { allowed: "yes", details: "מותר לסחור בחדשות" } },
      {
        name: "Elite ACCESS Funded",
        evaluation: { allowed: "yes", details: "מותר לסחור בחדשות" },
        funded: { allowed: "no", details: "אסור לבצע פעולות מסחר", timeRestriction: "±2 דקות מהודעה" },
      },
      {
        name: "Elite Daily",
        evaluation: { allowed: "yes", details: "מותר ללא הגבלה במבחן" },
        funded: { allowed: "no", details: "חלון מוגבל סביב חדשות בהשפעה גבוהה", timeRestriction: "±2 דקות מהודעה" },
      },
    ],
  },
  {
    id: "funded-futures-family",
    name: "Funded Futures Family",
    plans: [
      {
        name: "כל המסלולים (PRIME / PREMIER PLUS / S2F / VELOCITY)",
        evaluation: { allowed: "yes", details: "מותר לסחור בחדשות בכל אירועי Tier 1" },
        funded: { allowed: "yes", details: "מותר לסחור בחדשות — ללא חובת סגירת פוזיציות" },
      },
    ],
  },
];
