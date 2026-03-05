/**
 * Generic scoring from a stack profile (categories + patterns).
 */

import type { ParsedResume, StackScoreBreakdown, StackProfile } from "../types.js";

function countWeighted(
  text: string,
  patterns: { pattern: RegExp; weight: number }[],
  max: number
): number {
  let score = 0;
  for (const { pattern, weight } of patterns) {
    const matches = text.match(pattern);
    if (matches) score += Math.min(matches.length * weight, max);
  }
  return Math.min(score, max);
}

export function scoreResume(
  resume: ParsedResume,
  profile: StackProfile
): { score: StackScoreBreakdown; highlights: string[] } {
  const text = resume.rawText.toLowerCase();
  const highlights: string[] = [];
  const breakdown: Record<string, number> = {};
  let total = 0;

  for (const category of profile.categories) {
    const value = countWeighted(text, category.patterns, category.maxScore);
    breakdown[category.id] = value;
    total += value;
    if (value > 0) highlights.push(category.highlightLabel);
  }

  const maxCv = profile.categories.reduce((s, c) => s + c.maxScore, 0);
  total = Math.min(total, maxCv);

  return {
    score: {
      breakdown,
      total,
      githubBonus: 0,
    },
    highlights,
  };
}

export function applyGitHubBonus(
  score: StackScoreBreakdown,
  bonus: number
): StackScoreBreakdown {
  const maxWithBonus = 100;
  return {
    ...score,
    githubBonus: bonus,
    total: Math.min(score.total + bonus, maxWithBonus),
  };
}
