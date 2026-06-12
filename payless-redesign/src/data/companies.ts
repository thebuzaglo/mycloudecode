/*
  Company showcase data — ported verbatim from the original PAYLESS site.
  Ratings, features, promo codes and affiliate links must not be altered.
*/
import mffuLogo from "@/assets/logos/mffu-logo-optimized.webp";
import mffuHero from "@/assets/logos/mffu-logo-hero.png";
import lucidLogo from "@/assets/logos/lucid-trading-logo-new.png";
import lucidHero from "@/assets/logos/lucid-trading-logo-hero.png";
import alphaLogo from "@/assets/logos/alpha-futures-logo.webp";
import alphaHero from "@/assets/logos/alpha-futures-logo-hero.png";
import fffLogo from "@/assets/logos/funded-futures-family-logo.png";
import fffHero from "@/assets/logos/fff-hero-logo.png";
import fundednextLogo from "@/assets/logos/fundednext-logo-optimized.webp";
import fundednextHero from "@/assets/logos/fundednext-logo-hero.png";
import tptLogo from "@/assets/logos/tpt-logo-new.jpg";
import tptHero from "@/assets/logos/tpt-logo-hero.png";
import tofLogo from "@/assets/logos/top-one-futures-logo.png";
import tofHero from "@/assets/logos/tof-logo-hero.png";

import tradovateLogo from "@/assets/logos/tradovate-logo.png";
import ninjatraderLogo from "@/assets/logos/ninjatrader-logo.png";
import tradingviewLogo from "@/assets/logos/tradingview-logo-hero.png";
import quantowerLogo from "@/assets/logos/quantower-logo-new.png";
import volumetricaLogo from "@/assets/logos/volumetrica-logo.png";
import dxfeedLogo from "@/assets/logos/dxfeed-logo.png";
import rithmicLogo from "@/assets/logos/rithmic-logo.png";
import tradeseaLogo from "@/assets/logos/tradesea-logo.png";
import deepchartLogo from "@/assets/logos/deepchart-logo.png";
import wealthchartsLogo from "@/assets/logos/wealthcharts-logo.png";
import alphaTraderLogo from "@/assets/logos/alpha-trader-logo.png";

export const platformLogos: Record<string, string> = {
  Tradovate: tradovateLogo,
  NinjaTrader: ninjatraderLogo,
  TradingView: tradingviewLogo,
  Quantower: quantowerLogo,
  Volumetrica: volumetricaLogo,
  DxFeed: dxfeedLogo,
  Rithmic: rithmicLogo,
  TradeSea: tradeseaLogo,
  DeepChart: deepchartLogo,
  WealthCharts: wealthchartsLogo,
  "Alpha Trader": alphaTraderLogo,
};

export interface Company {
  id: string;
  name: string;
  logo: string;
  heroLogo: string;
  invertLogo?: boolean;
  rating: number;
  trustpilotUrl: string;
  features: string[];
  platforms: string[];
  maxAllocation: string;
  promo: string;
  promoPercent: number;
  signupLink: string;
  featured: boolean;
  communityFavorite?: boolean;
  shortDescription: string;
  tag: string;
}

export const companies: Company[] = [
  {
    id: "mffu",
    name: "My Funded Futures",
    logo: mffuLogo,
    heroLogo: mffuHero,
    rating: 4.9,
    trustpilotUrl: "https://www.trustpilot.com/review/myfundedfutures.com",
    features: ["ללא מגבלת הפסד יומית", "משיכה כל 5 ימים"],
    platforms: ["Tradovate", "NinjaTrader", "TradingView", "Quantower", "Volumetrica", "DxFeed"],
    maxAllocation: "$450K",
    promo: "PAYLESS",
    promoPercent: 20,
    signupLink: "https://myfundedfutures.com/challenge?ref=4109&code=payless",
    featured: true,
    communityFavorite: true,
    shortDescription: "חברת מימון פיוצ׳רס מובילה עם תנאים גמישים",
    tag: "פופולרי",
  },
  {
    id: "lucidtrading",
    name: "Lucid Trading",
    logo: lucidLogo,
    heroLogo: lucidHero,
    rating: 4.8,
    trustpilotUrl: "https://www.trustpilot.com/review/lucidtrading.com",
    features: ["תנאי מסחר גמישים", "משיכות מהירות"],
    platforms: ["NinjaTrader", "Tradovate", "TradingView", "Quantower", "Rithmic", "TradeSea"],
    maxAllocation: "$750K",
    promo: "PAYLESS",
    promoPercent: 35,
    signupLink: "https://lucidtrading.com/ref/PAYLESS/",
    featured: false,
    communityFavorite: true,
    shortDescription: "פלטפורמת מסחר מתקדמת עם פיצול רווחים גבוה",
    tag: "פיצול 90%",
  },
  {
    id: "alpha-futures",
    name: "Alpha Futures",
    logo: alphaLogo,
    heroLogo: alphaHero,
    invertLogo: true,
    rating: 4.9,
    trustpilotUrl: "https://www.trustpilot.com/review/alpha-futures.com",
    features: ["חלוקת רווחים 90% מההתחלה", "ללא הפסד יומי (DLG)"],
    platforms: ["NinjaTrader", "Tradovate", "TradingView", "DeepChart", "Quantower", "WealthCharts", "Alpha Trader"],
    maxAllocation: "$750K",
    promo: "PAYLESS",
    promoPercent: 10,
    signupLink: "https://app.alpha-futures.com/signup/PAYLESS/",
    featured: false,
    shortDescription: "חברת מימון איכותית עם תנאי מסחר נוחים",
    tag: "משיכה מהירה",
  },
  {
    id: "funded-futures-family",
    name: "Funded Futures Family",
    logo: fffLogo,
    heroLogo: fffHero,
    rating: 4.7,
    trustpilotUrl: "https://www.trustpilot.com/review/fundedfuturesfamily.com",
    features: ["מסחר בחדשות בכל המסלולים", "Direct Funding ללא מבחן"],
    platforms: ["WealthCharts", "Tradovate", "TradingView", "NinjaTrader"],
    maxAllocation: "$750K",
    promo: "PAYLESS",
    promoPercent: 0,
    signupLink: "https://app.fundedfuturesfamily.com/affiliation/?ref_code=05f30ffb-cec1-45be-b6f5-54fbffb022d2",
    featured: false,
    shortDescription: "חברה צומחת עם מגוון מסלולי מימון",
    tag: "צומחת",
  },
  {
    id: "fundednext",
    name: "FundedNext",
    logo: fundednextLogo,
    heroLogo: fundednextHero,
    invertLogo: true,
    rating: 4.5,
    trustpilotUrl: "https://www.trustpilot.com/review/fundednext.com",
    features: ["ללא עקביות לאחר האתגר", "משיכה מינימום 5 ימים"],
    platforms: ["Tradovate", "NinjaTrader", "TradingView"],
    maxAllocation: "$500K",
    promo: "",
    promoPercent: 0,
    signupLink: "https://fundednext.com/?fpr=shalom95",
    featured: false,
    shortDescription: "חברת מימון גלובלית עם מגוון תוכניות",
    tag: "גלובלי",
  },
  {
    id: "tpt",
    name: "Take Profit Trader",
    logo: tptLogo,
    heroLogo: tptHero,
    rating: 4.5,
    trustpilotUrl: "https://www.trustpilot.com/review/takeprofittrader.com",
    features: ["ללא סטופ יומי", "עקביות 50% רק במבחן"],
    platforms: ["Tradovate", "NinjaTrader", "TradingView", "Rithmic", "Quantower"],
    maxAllocation: "$750K",
    promo: "NOFEE30",
    promoPercent: 30,
    signupLink: "https://takeprofittrader.com/",
    featured: true,
    shortDescription: "מימון פיוצ׳רס פופולרי עם תנאים נוחים לסוחרים",
    tag: "ללא סטופ יומי",
  },
  {
    id: "top-one-futures",
    name: "Top One Futures",
    logo: tofLogo,
    heroLogo: tofHero,
    rating: 4.8,
    trustpilotUrl: "https://www.trustpilot.com/review/toponefutures.com",
    features: ["4 מסלולים שונים למסחר", "משיכות יומיות (Elite Daily / ACCESS)"],
    platforms: ["TradingView", "NinjaTrader", "Tradovate"],
    maxAllocation: "$750K",
    promo: "PAYLESS",
    promoPercent: 0,
    signupLink: "https://toponefutures.com/?linkId=lp_707970&sourceId=payless&tenantId=toponefutures",
    featured: false,
    shortDescription: "חברת מימון עם מסלולים מגוונים ומשיכות מהירות",
    tag: "Elite ACCESS",
  },
];

export const getCompany = (id: string) => companies.find((c) => c.id === id);
