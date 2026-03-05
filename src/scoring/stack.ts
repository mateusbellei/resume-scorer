/**
 * Score baseado na vaga: Nuxt (mais atual), Vue.js, TypeScript,
 * ecossistema Nuxt (modules, layers), TailwindCSS.
 */

import type { ParsedResume, StackScoreBreakdown } from "../types.js";

const TEXT_LOWER = (r: ParsedResume) => r.rawText.toLowerCase();

// Pesos (max pontos por categoria; total ~100)
const WEIGHTS = {
  nuxt: 25,           // Nuxt 3, Nuxt.js
  vue: 20,            // Vue.js, Vue 3, Composition API
  typescript: 20,     // TypeScript, TS
  tailwind: 15,       // Tailwind, TailwindCSS
  nuxtModulesLayers: 15, // modules, layers, Nuxt ecosystem
  ecosystem: 5,       // Vite, SSR, SEO, etc.
} as const;

const MAX_CV_SCORE =
  WEIGHTS.nuxt +
  WEIGHTS.vue +
  WEIGHTS.typescript +
  WEIGHTS.tailwind +
  WEIGHTS.nuxtModulesLayers +
  WEIGHTS.ecosystem;

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

export function scoreResume(resume: ParsedResume): {
  score: StackScoreBreakdown;
  highlights: string[];
} {
  const text = TEXT_LOWER(resume);
  const highlights: string[] = [];

  // Nuxt (prioridade alta - stack principal)
  const nuxtScore = countWeighted(
    text,
    [
      { pattern: /\bnuxt\s*3\b/g, weight: 4 },
      { pattern: /\bnuxt\.?js\b/g, weight: 3 },
      { pattern: /\bnuxt\b/g, weight: 2 },
    ],
    WEIGHTS.nuxt
  );
  if (nuxtScore > 0) highlights.push("Nuxt experience");

  // Vue
  const vueScore = countWeighted(
    text,
    [
      { pattern: /\bvue\s*3\b/g, weight: 3 },
      { pattern: /\bcomposition\s*api\b/g, weight: 2 },
      { pattern: /\bvue\.?js\b/g, weight: 2 },
      { pattern: /\bvue\b/g, weight: 1 },
    ],
    WEIGHTS.vue
  );
  if (vueScore > 0) highlights.push("Vue.js experience");

  // TypeScript
  const tsScore = countWeighted(
    text,
    [
      { pattern: /\btypescript\b/g, weight: 3 },
      { pattern: /\bts\b/g, weight: 1 },
    ],
    WEIGHTS.typescript
  );
  if (tsScore > 0) highlights.push("TypeScript");

  // Tailwind
  const tailwindScore = countWeighted(
    text,
    [
      { pattern: /\btailwind\s*css\b/g, weight: 4 },
      { pattern: /\btailwind\b/g, weight: 3 },
    ],
    WEIGHTS.tailwind
  );
  if (tailwindScore > 0) highlights.push("TailwindCSS");

  // Nuxt modules & layers (ecossistema)
  const modulesLayersScore = countWeighted(
    text,
    [
      { pattern: /\bnuxt\s*modules?\b/g, weight: 4 },
      { pattern: /\bnuxt\s*layers?\b/g, weight: 4 },
      { pattern: /\b@nuxt\//g, weight: 2 },
      { pattern: /\bnuxt\s*content\b/g, weight: 2 },
      { pattern: /\bnuxt\s*ui\b/g, weight: 2 },
      { pattern: /\bmodules?\b.*nuxt/g, weight: 2 },
      { pattern: /\blayers?\b.*nuxt/g, weight: 2 },
    ],
    WEIGHTS.nuxtModulesLayers
  );
  if (modulesLayersScore > 0) highlights.push("Nuxt ecosystem (modules/layers)");

  // Ecossistema geral (Vite, SSR, SEO)
  const ecosystemScore = countWeighted(
    text,
    [
      { pattern: /\bvite\b/g, weight: 1 },
      { pattern: /\bssr\b/g, weight: 1 },
      { pattern: /\bseo\b/g, weight: 1 },
      { pattern: /\bheadless\s*cms\b/g, weight: 1 },
      { pattern: /\bpinia\b/g, weight: 1 },
    ],
    WEIGHTS.ecosystem
  );
  if (ecosystemScore > 0) highlights.push("Modern front-end stack (Vite, SSR, etc.)");

  const cvTotal = Math.min(
    nuxtScore +
      vueScore +
      tsScore +
      tailwindScore +
      modulesLayersScore +
      ecosystemScore,
    MAX_CV_SCORE
  );

  const score: StackScoreBreakdown = {
    nuxt: nuxtScore,
    vue: vueScore,
    typescript: tsScore,
    tailwind: tailwindScore,
    nuxtModulesLayers: modulesLayersScore,
    ecosystem: ecosystemScore,
    githubBonus: 0,
    total: cvTotal,
  };

  return { score, highlights };
}

export function applyGitHubBonus(
  breakdown: StackScoreBreakdown,
  bonus: number
): StackScoreBreakdown {
  const maxWithBonus = 100;
  const newTotal = Math.min(breakdown.total + bonus, maxWithBonus);
  return { ...breakdown, githubBonus: bonus, total: newTotal };
}
