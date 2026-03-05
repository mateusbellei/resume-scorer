/**
 * Busca dados públicos do perfil GitHub para bônus no score.
 * Rate limit: 60 req/h sem token. Use GITHUB_TOKEN para mais.
 */

import type { GitHubProfile } from "./types.js";

const GITHUB_API = "https://api.github.com";

export async function fetchGitHubProfile(username: string): Promise<GitHubProfile | null> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "ResumeScorer/1.0",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${GITHUB_API}/users/${encodeURIComponent(username)}`, {
      headers,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { login?: string; public_repos?: number };
    return {
      login: data.login ?? username,
      public_repos: data.public_repos ?? 0,
    };
  } catch {
    return null;
  }
}

/**
 * Returns bonus points (0–10) and an English explanation based on public repos and profile existence.
 */
export function githubBonusFromProfile(profile: GitHubProfile | null): {
  bonus: number;
  explanation: string;
} {
  if (!profile) return { bonus: 0, explanation: "" };
  let bonus = 2;
  const reasons: string[] = ["profile verified"];
  if (profile.public_repos >= 5) {
    bonus += 2;
    reasons.push("5+ public repos");
  }
  if (profile.public_repos >= 15) {
    bonus += 2;
    reasons.push("15+ public repos");
  }
  if (profile.public_repos >= 30) {
    bonus += 2;
    reasons.push("30+ public repos");
  }
  bonus = Math.min(bonus, 10);
  const explanation =
    bonus > 0
      ? `GitHub bonus (+${bonus}): ${reasons.join(", ")} (${profile.public_repos} public repos).`
      : "";
  return { bonus, explanation };
}
