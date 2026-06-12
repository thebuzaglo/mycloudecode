/*
  Offers data — ported verbatim from the original PAYLESS site (54 offers).
  Codes, prices and affiliate links must not be altered.
*/
import rawOffers from "./offers.json";

export interface Offer {
  id: number;
  title: string;
  description: string;
  company: string;
  discount: string;
  code?: string;
  validUntil?: string;
  countdown?: string;
  isHot?: boolean;
  isExclusive?: boolean;
  features?: string[];
  affiliateLink: string;
  usageLimit?: string;
  originalPrice?: string;
  salePrice?: string;
  savings?: string;
  hidden?: boolean;
}

export const offers = rawOffers as Offer[];

export const companyCategory: Record<string, "prop-firm" | "trading-tool" | "service"> = {
  MFFU: "prop-firm",
  TPT: "prop-firm",
  FundedNext: "prop-firm",
  AlphaFutures: "prop-firm",
  LucidTrading: "prop-firm",
  ApexTraderFunding: "prop-firm",
  TopOneFutures: "prop-firm",
  FundedFuturesFamily: "prop-firm",
  TradeSyncer: "trading-tool",
  TradingView: "trading-tool",
  Replikanto: "trading-tool",
  TradeZella: "trading-tool",
  FundedAward: "service",
  InteractiveBrokers: "service",
  AcHolding: "service",
};

export const categoryLabels: Record<string, string> = {
  "prop-firm": "חברות מימון",
  "trading-tool": "כלי עזר למסחר",
  service: "שירותים נוספים",
};

export const companySlugs: Record<string, string> = {
  MFFU: "mffu",
  TPT: "tpt",
  FundedNext: "fundednext",
  AlphaFutures: "alpha-futures",
  LucidTrading: "lucidtrading",
  TradeSyncer: "tradesyncer",
  TradingView: "tradingview",
  Replikanto: "replikanto",
  ApexTraderFunding: "apex-trader-funding",
  FundedAward: "funded-award",
  TopOneFutures: "top-one-futures",
  FundedFuturesFamily: "funded-futures-family",
  TradeZella: "tradezella",
  InteractiveBrokers: "interactive-brokers",
  AcHolding: "ac-holding",
};

const notExpired = (o: Offer) =>
  !o.countdown || new Date(o.countdown).getTime() > Date.now();

export const activeOffers = offers.filter((o) => !o.hidden && notExpired(o));

export const activeOffersCount = activeOffers.length;

export const offersForCompany = (slug: string) =>
  activeOffers.filter((o) => companySlugs[o.company] === slug.toLowerCase());

export const extractPercent = (discount: string) => {
  const m = discount.match(/(\d+)%/);
  return m ? parseInt(m[1]) : 0;
};
