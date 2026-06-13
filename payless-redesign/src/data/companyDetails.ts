/*
  Per-company deep-dive data.
  - mffu / tpt / fundednext / alpha-futures: full plan pricing tables, feature &
    restriction lists, and FAQ (with explainer video ids) — extracted verbatim
    from the original CompanyPage bundle.
  - funded-futures-family: official plan comparison table (4 tiers) from its page.
  - lucidtrading / top-one-futures: rich verbatim overview (from the companies
    dataset) + their active offers; no fabricated pricing.
  All copy is ported 1:1 from the live site. Do not edit values.
*/
import raw from "./companyDetails.json";

export interface PlanRecord {
  [key: string]: string;
}
export interface FaqEntry {
  question: string;
  answer: string;
  videoId?: string;
}
export interface ComparisonRow {
  label: string;
  values: string[];
}
export interface CompanyDetail {
  description?: string;
  metaDescription?: string;
  plans?: PlanRecord[];
  features?: string[];
  restrictions?: string[];
  faqs?: FaqEntry[];
  comparisonTable?: ComparisonRow[];
  comparisonHeaders?: string[];
  /* extra editorial overview paragraphs for pages without a plan table */
  overview?: string[];
}

export const planLabels: Record<string, string> = raw.planLabels;

const data = raw.companies as Record<string, CompanyDetail>;

/*
  Overview paragraphs for the two dedicated-page companies, split verbatim from
  the company descriptions on the live site (companies dataset).
*/
const extraOverview: Record<string, string[]> = {
  lucidtrading: [
    "חברת מימון חדשנית עם 3 מסלולים עיקריים: LucidFlex (גמיש עם מערכת סקיילינג), LucidPro (מקצועי, עקביות 40%, תשלומים כל 3 ימים), LucidDirect (ישיר ללא מבחן, עקביות 20%).",
    "תוכנית LucidLive למימון חי + LucidMaxx לתשלום יומי ללא תקרה. חלוקת רווחים 90%, ללא דמי הפעלה, לוח מחוונים בזמן אמת, עד 5 חשבונות למשק בית ומימון עד $750K.",
  ],
  "top-one-futures": [
    "חברת מימון עם 4 מסלולים: Instant (ישיר ללא מבחן), Ignite (5% יעד רווח), Elite ACCESS (משיכות on-demand, $39 לכל הגדלים), Elite Daily (מסלול חודשי, EOD drawdown, משיכות יומיות מיום 1, חלוקה 90/10, ללא דמי הפעלה, 25K/50K/100K).",
    "מימון עד $750K, תשלום תוך 24 שעות, דירוג 4.8 ב-Trustpilot.",
  ],
};

for (const [id, overview] of Object.entries(extraOverview)) {
  data[id] = { ...(data[id] || {}), overview };
}

export const getCompanyDetail = (id: string): CompanyDetail | undefined => data[id];
