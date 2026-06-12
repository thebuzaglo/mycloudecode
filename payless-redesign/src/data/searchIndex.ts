/*
  Global search index — static page entries ported from the original bundle;
  companies/offers/blog/glossary entries are appended dynamically at runtime.
*/

export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  keywords?: string[];
}

export const staticSearchEntries: SearchEntry[] = [
  { id: "blog", title: "בלוג", description: "מאמרים, מדריכים וטיפים מקצועיים על חברות מימון, קודי קופון והנחות, והצלחה במסחר", url: "/blog", type: "page", keywords: ["בלוג", "blog", "מאמרים", "articles", "מדריכים", "guides", "prop firms"] },
  { id: "home", title: "דף הבית", description: "PAYLESS - פלטפורמת השוואה מובילה לחברות מימון למסחר בישראל", url: "/", type: "page", keywords: ["בית", "home", "ראשי", "payless"] },
  { id: "companies", title: "חברות מימון", description: "השוואת חברות מימון למסחר - מחירים, תנאים ומסלולים", url: "/companies", type: "page", keywords: ["חברות", "companies", "השוואה", "comparison", "מימון"] },
  { id: "offers", title: "מבצעים והנחות", description: "המבצעים וההנחות הטובים ביותר מחברות המימון המובילות", url: "/offers", type: "page", keywords: ["מבצעים", "offers", "הנחות", "discounts", "קופונים", "coupons"] },
  { id: "about", title: "אודות", description: "על PAYLESS - מי אנחנו ומה המטרה שלנו", url: "/about", type: "page", keywords: ["אודות", "about", "מי אנחנו", "who we are"] },
  { id: "faq", title: "שאלות נפוצות", description: "תשובות לשאלות הנפוצות ביותר על חברות מימון ומסחר", url: "/faq", type: "page", keywords: ["faq", "שאלות", "questions", "עזרה", "help"] },
  { id: "contact", title: "צור קשר", description: "יצירת קשר עם צוות PAYLESS לשאלות ותמיכה", url: "/contact", type: "page", keywords: ["contact", "צור קשר", "תמיכה", "support"] },
  { id: "how-it-works", title: "איך זה עובד", description: "מדריך מפורט כיצד לבחור חברת מימון ולהתחיל למסוד", url: "/how-it-works", type: "page", keywords: ["how it works", "איך זה עובד", "מדריך", "guide"] },
  { id: "privacy", title: "מדיניות פרטיות", description: "מדיניות הפרטיות של PAYLESS", url: "/privacy", type: "page", keywords: ["privacy", "פרטיות", "מדיניות"] },
  { id: "terms", title: "תנאי שימוש", description: "תנאי השימוש באתר PAYLESS", url: "/terms", type: "page", keywords: ["terms", "תנאים", "שימוש"] },
  { id: "accessibility", title: "הצהרת נגישות", description: "מידע על נגישות האתר לאנשים עם מוגבלויות", url: "/accessibility", type: "page", keywords: ["accessibility", "נגישות", "מוגבלויות"] },
  { id: "sitemap", title: "מפת האתר", description: "מפת האתר המלאה של PAYLESS - קישורים לכל הדפים והחברות", url: "/sitemap", type: "page", keywords: ["sitemap", "מפת אתר", "ניווט", "קישורים", "דפים"] },
  { id: "alpha-futures-page", title: "Alpha Futures - דף ייעודי", description: "מידע מפורט על Alpha Futures - 3 מסלולים, חלוקת רווחים 90%, תשלומים שבועיים וכל התנאים", url: "/company/alpha-futures", type: "company", keywords: ["alpha futures", "אלפא פיוצ", ", ", ", ", ", ", ", ", ", ", ", ", ", ", ", ", ", ", ", ", ", "] },
  { id: "lucidtrading-page", title: "Lucid Trading - דף ייעודי", description: "מידע מפורט על Lucid Trading - 3 מסלולים: LucidFlex (גמיש), LucidPro (מקצועי), LucidDirect (ישיר). תוכנית LucidLive + LucidMaxx לתשלום יומי. חלוקת רווחים 90%, ללא דמי הפעלה, לוח מחוונים בזמן אמת", url: "/company/lucidtrading", type: "company", keywords: ["lucid", "lucid trading", "לוסיד", "lucidflex", "פלקס", "flex", "גמיש", "lucidpro", "פרו", "pro", "מקצועי", "eval", "איבל", "מבחן"] },
  { id: "top-one-futures-page", title: "TOF (Top One Futures) - דף ייעודי", description: "מידע מפורט על TOF - 4 מסלולים: Instant, Ignite, Elite ACCESS, Elite Daily (חדש: 25K/50K/100K, EOD, משיכות יומיות, חלוקה 90/10, $89/$119/$219). מימון עד $750K, תשלום תוך 24 שעות, דירוג 4.8 ב-Trustpilot", url: "/company/top-one-futures", type: "company", keywords: ["tof", "top one futures", "טופ וואן", "instant", "מיידי", "ignite", "הצתה", "elite access", "אליט אקסס", "access", "אקסס", "elite daily", "אליט דיילי", "יומי"] },
  { id: "services", title: "שירותים נוספים", description: "שירותים נלווים לסוחר הישראלי: Funded Award (תעודת הסמכה Qualified), AC HOLDING (השקעות נדל\"ן יוקרה), Interactive Brokers (פתיחת תיק מסחר פרטי + קופון $50)", url: "/services", type: "page", keywords: ["שירותים", "services", "שירותים נוספים", "תעודה", "הסמכה", "qualified", "נדל", ", ", ", ", ", ", ", ", ", ", ", ", ", "] },
  { id: "services-funded-award", title: "Funded Award - תעודת הסמכה לסוחר ממומן", description: "תעודת Qualified / מוסמך לסוחר ממומן בתחום הפרופ פירמס - הוכחת מקצועיות ומימון דמה. קוד PAYLESS להנחה של 10%", url: "/services/funded-award", type: "page", keywords: ["funded award", "פאנדד אוורד", "תעודה", "תעודת הסמכה", "הסמכה", "qualified", "מוסמך", "מימון דמה", "סוחר ממומן", "PAYLESS", "10%", "הנחה", "הוכחת מקצועיות", "certificate"] },
  { id: "services-ac-holding", title: "AC HOLDING - השקעות נדל\"ן יוקרה", description: "AC HOLDING - חברת השקעות נדל\"ן יוקרתית עבור סוחרים שמעוניינים להשקיע את הרווחים בנדל\"ן. ייעוץ פרטי ושיחת יעוץ ללא עלות", url: "/services/ac-holding", type: "page", keywords: ["ac holding", "אי סי הולדינג", "הולדינג", "נדל", ", ", ", ", ", ", ", ", ", ", ", ", ", ", ", ", ", ", ", "] },
  { id: "services-interactive-brokers", title: "Interactive Brokers - פתיחת תיק מסחר פרטי + קופון $50", description: "פתיחת חשבון Interactive Brokers (IB) - הברוקר המוביל בעולם לתיק מסחר פרטי במניות, אופציות, פיוצ'רס ומט\\\"ח. קופון $50 בפתיחת חשבון", url: "/services/interactive-brokers", type: "page", keywords: ["interactive brokers", "ib", "אינטראקטיב ברוקרס", "ברוקר", "broker", "פתיחת חשבון", "פתיחת תיק", "תיק מסחר", "חשבון מסחר", "מסחר פרטי", "מניות", "stocks", "אופציות", "options"] },
  { id: "services-aslan-cpa", title: "עידן אסלן - רואה חשבון וייעוץ עסקי", description: "רואה חשבון מוסמך המתמחה בסוחרי נוסטרו, תכנון מס, החזרי מס והדרכה כלכלית למשקי בית", url: "/services/aslan-cpa", type: "page", keywords: ["עידן", "eidan", "אסלן", "aslan", "רואה חשבון", "accountant", "cpa", "מס", "tax", "ייעוץ עסקי", "business consulting", "נוסטרו", "nostro", "החזר מס"] },
];
