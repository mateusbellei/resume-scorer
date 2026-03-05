/**
 * Tipos para o avaliador de currículos - vaga Nuxt/Vue/TypeScript/Tailwind
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

export interface StackScoreBreakdown {
  nuxt: number;
  vue: number;
  typescript: number;
  tailwind: number;
  nuxtModulesLayers: number;
  ecosystem: number;
  /** Pontos extras por dados do GitHub (repos, linguagens) */
  githubBonus: number;
  /** Total 0-100 */
  total: number;
}

export interface ScoredCandidate {
  resume: ParsedResume;
  score: StackScoreBreakdown;
  /** Justificativas para o score (trechos ou critérios) */
  highlights: string[];
  /** Explanation of GitHub bonus (e.g. why +8) */
  githubBonusExplanation?: string;
}

export interface GitHubProfile {
  login: string;
  public_repos: number;
  /** Linguagens mais usadas (ex: Vue, TypeScript) */
  languages?: string[];
}
