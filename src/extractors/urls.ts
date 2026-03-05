/**
 * Extrai URLs do LinkedIn e GitHub do texto do currículo.
 */

const LINKEDIN_REGEX =
  /https?:\/\/(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/gi;
const GITHUB_REGEX =
  /https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/gi;

export function extractLinkedInUrl(text: string): { url: string; username: string } | null {
  const m = text.match(LINKEDIN_REGEX);
  if (!m?.[0]) return null;
  const url = m[0];
  const usernameMatch = url.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  return {
    url,
    username: usernameMatch?.[1] ?? "",
  };
}

export function extractGitHubUrl(text: string): { url: string; username: string } | null {
  const m = text.match(GITHUB_REGEX);
  if (!m?.[0]) return null;
  const url = m[0];
  const usernameMatch = url.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  return {
    url,
    username: usernameMatch?.[1] ?? "",
  };
}
