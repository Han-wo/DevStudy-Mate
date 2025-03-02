import { v4 as uuidv4 } from "uuid";

import { CodeOptimizations } from "@/lib/openai";

/**
 * 배열의 각 항목에 대해 고유 ID를 생성합니다.
 * @param items 고유 ID가 필요한 항목 배열
 * @returns 각 항목에 대해 생성된 고유 ID 배열
 */
export function generateIdsForItems<T>(items?: T[]): string[] {
  if (!items || items.length === 0) return [];
  return items.map(() => uuidv4());
}

export interface OptimizationIds {
  perf: string[];
  read: string[];
  maint: string[];
  best: string[];
  bug: string[];
}

/**
 * 코드 최적화 객체의 각 카테고리에 대해 고유 ID를 생성합니다.
 * @param codeOptimizations 코드 최적화 객체
 * @returns 각 카테고리별 고유 ID 모음 객체
 */
export function generateOptimizationIds(
  codeOptimizations?: CodeOptimizations,
): OptimizationIds {
  if (!codeOptimizations) {
    return {
      perf: [],
      read: [],
      maint: [],
      best: [],
      bug: [],
    };
  }

  return {
    perf: generateIdsForItems(codeOptimizations.performanceImprovements),
    read: generateIdsForItems(codeOptimizations.readabilityImprovements),
    maint: generateIdsForItems(codeOptimizations.maintainabilityImprovements),
    best: generateIdsForItems(codeOptimizations.bestPractices),
    bug: generateIdsForItems(codeOptimizations.potentialBugs),
  };
}
