/**
 * Types for the resume scorer and configurable interview stacks.
 */

export interface ParsedResume {
  fileName: string;
  candidateName: string | null;
  rawText: string;
  linkedInUrl: string | null;
  githubUrl: string | null;
  linkedInUsername: string | null;
  githubUsername: string | null;
}

/** One scoring category (e.g. "Nuxt", "Vue") with patterns and max score. */
export interface StackCategoryConfig {
  id: string;
  label: string;
  maxScore: number;
  patterns: { pattern: RegExp; weight: number }[];
  highlightLabel: string;
}

/** A full stack profile for one type of interview (e.g. Nuxt/Vue or React/Next). */
export interface StackProfile {
  id: string;
  label: string;
  categories: StackCategoryConfig[];
}

/** Score result: breakdown by category id, total, and GitHub bonus. */
export interface StackScoreBreakdown {
  breakdown: Record<string, number>;
  total: number;
  githubBonus: number;
}

export interface ScoredCandidate {
  resume: ParsedResume;
  score: StackScoreBreakdown;
  /** Stack profile used for this score (for report breakdown labels) */
  stackProfile: StackProfile;
  highlights: string[];
  githubBonusExplanation?: string;
}

export interface GitHubProfile {
  login: string;
  public_repos: number;
  /** Linguagens mais usadas (ex: Vue, TypeScript) */
  languages?: string[];
}
