/*
  Universal consistency-rule data — ported verbatim from the original PAYLESS
  site (consistencyData chunk). Percentages, targets, leniency buffers and
  notes must not be altered.
*/
import rawCompanies from "./consistency.json";

export interface ConsistencyStage {
  name: string; // "eval" | "simFunded"
  nameHe: string;
  consistencyRule: number | null;
  consistencyLeniency?: number | null;
  consistencyBase?: string; // "target" → rule measured against profit target
  minTradingDays: number | null;
  profitTarget: number | null;
  minProfitPerDay: number | null;
  note?: string;
}

export interface ConsistencyAccountSize {
  size: string;
  sizeValue: number;
  profitTarget: number;
  stages: ConsistencyStage[];
}

export interface ConsistencyPlan {
  name: string;
  accountSizes: ConsistencyAccountSize[];
}

export interface ConsistencyCompany {
  id: string;
  name: string;
  shortName?: string;
  couponCode?: string;
  companyPageUrl?: string;
  plans: ConsistencyPlan[];
}

export const consistencyCompanies = rawCompanies as ConsistencyCompany[];

export const getConsistencyCompany = (id: string) =>
  consistencyCompanies.find((c) => c.id === id);

/* ------------------------------------------------------------------ */
/* The exact pass/fail algorithm ported from the original calculator.   */
/* ------------------------------------------------------------------ */
export interface ConsistencyResult {
  totalDays: number;
  profitDaysCount: number;
  lossDaysCount: number;
  zeroDaysCount: number;
  totalProfit: number;
  totalProfitPositive: number;
  totalLoss: number;
  highestDay: number;
  highestDayIndex: number;
  consistencyPercent: number;
  hasConsistencyRule: boolean;
  passesConsistency: boolean;
  hasProfitTarget: boolean;
  profitTargetPercent: number;
  passesTarget: boolean;
  hasMinDays: boolean;
  passesMinDays: boolean;
  hasMinProfitPerDay: boolean;
  daysAboveMin: number;
  recommendedMax: number | null;
  hasLeniency: boolean;
  passesLeniency: boolean;
  maxDayDifference: number;
  passesAll: boolean;
  effectiveTarget: number;
  targetIncreased: boolean;
  useTargetBase: boolean;
  hasImpliedTarget: boolean;
  impliedTargetMet: boolean;
  consistencyDerivedTarget: number;
  impliedConsistencyPercent: number;
}

export function computeConsistency(
  dailyPnl: number[],
  stage: ConsistencyStage
): ConsistencyResult {
  const totalDays = dailyPnl.length;
  const profitDays = dailyPnl.filter((v) => v > 0);
  const lossDays = dailyPnl.filter((v) => v < 0);
  const zeroDays = dailyPnl.filter((v) => v === 0);
  const totalProfit = dailyPnl.reduce((a, b) => a + b, 0);
  const totalProfitPositive = profitDays.reduce((a, b) => a + b, 0);
  const totalLoss = lossDays.reduce((a, b) => a + b, 0);
  const highestDay = profitDays.length > 0 ? Math.max(...profitDays) : 0;
  const highestDayIndex = dailyPnl.indexOf(highestDay);

  const hasProfitTarget = stage.profitTarget !== null && stage.profitTarget > 0;
  const useTargetBase = stage.consistencyBase === "target" && hasProfitTarget;
  const base = useTargetBase ? (stage.profitTarget as number) : totalProfit;
  const consistencyPercent = base > 0 ? (highestDay / base) * 100 : 0;
  const hasConsistencyRule = stage.consistencyRule !== null;
  const hasLeniency =
    stage.consistencyLeniency != null && stage.consistencyLeniency > 0;

  let passesLeniency = true;
  let maxDayDifference = 0;
  if (hasLeniency && profitDays.length === 2) {
    const sorted = [...profitDays].sort((a, b) => b - a);
    maxDayDifference = sorted[0] - sorted[1];
    passesLeniency = maxDayDifference <= (stage.consistencyLeniency as number);
  }

  const targetReached =
    !!hasProfitTarget && totalProfit >= (stage.profitTarget as number);
  const leniencyOverride =
    hasLeniency && profitDays.length === 2 && targetReached && passesLeniency;
  const passesConsistency =
    !hasConsistencyRule ||
    consistencyPercent <= (stage.consistencyRule as number) ||
    leniencyOverride;

  const ruleForTarget = useTargetBase ? 50 : (stage.consistencyRule as number);
  const consistencyDerivedTarget =
    hasConsistencyRule && highestDay > 0
      ? Math.ceil(highestDay / (ruleForTarget / 100))
      : 0;
  const effectiveTarget = hasProfitTarget
    ? Math.max(stage.profitTarget as number, consistencyDerivedTarget)
    : consistencyDerivedTarget;
  const targetIncreased =
    !(!hasProfitTarget || !hasConsistencyRule) &&
    effectiveTarget > (stage.profitTarget as number);
  const profitTargetPercent = hasProfitTarget
    ? Math.min((totalProfit / effectiveTarget) * 100, 100)
    : 0;
  const passesTarget = !hasProfitTarget || totalProfit >= effectiveTarget;

  const hasMinDays = stage.minTradingDays !== null && stage.minTradingDays > 0;
  const passesMinDays =
    !hasMinDays || totalDays >= (stage.minTradingDays as number);
  const hasMinProfitPerDay = stage.minProfitPerDay !== null;
  const daysAboveMin = hasMinProfitPerDay
    ? profitDays.filter((v) => v >= (stage.minProfitPerDay as number)).length
    : profitDays.length;

  let recommendedMax: number | null = null;
  if (hasConsistencyRule && stage.profitTarget && totalProfitPositive > 0) {
    recommendedMax =
      (stage.profitTarget * (stage.consistencyRule as number)) / 100;
  }

  const hasImpliedTarget =
    !hasProfitTarget && hasConsistencyRule && consistencyDerivedTarget > 0;
  const impliedConsistencyPercent =
    hasImpliedTarget && totalProfit > 0
      ? (highestDay / totalProfit) * 100
      : hasImpliedTarget
        ? 100
        : 0;
  const impliedTargetMet =
    !hasImpliedTarget || totalProfit >= consistencyDerivedTarget;

  const passesAll =
    passesConsistency &&
    passesTarget &&
    passesMinDays &&
    passesLeniency &&
    impliedTargetMet;

  return {
    totalDays,
    profitDaysCount: profitDays.length,
    lossDaysCount: lossDays.length,
    zeroDaysCount: zeroDays.length,
    totalProfit,
    totalProfitPositive,
    totalLoss,
    highestDay,
    highestDayIndex,
    consistencyPercent,
    hasConsistencyRule,
    passesConsistency,
    hasProfitTarget,
    profitTargetPercent,
    passesTarget,
    hasMinDays,
    passesMinDays,
    hasMinProfitPerDay,
    daysAboveMin,
    recommendedMax,
    hasLeniency,
    passesLeniency,
    maxDayDifference,
    passesAll,
    effectiveTarget,
    targetIncreased,
    useTargetBase,
    hasImpliedTarget,
    impliedTargetMet,
    consistencyDerivedTarget,
    impliedConsistencyPercent,
  };
}
