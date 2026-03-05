/**
 * Resume scorer: reads PDF/DOCX, extracts LinkedIn/GitHub links,
 * fetches GitHub API and scores candidates for Nuxt/Vue/TypeScript/Tailwind stack.
 */

import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { config } from "dotenv";

import { extractTextFromPdf, isPdf } from "./readers/pdf.js";
import { extractTextFromDocx, isDocx } from "./readers/docx.js";
import { extractLinkedInUrl, extractGitHubUrl } from "./extractors/urls.js";
import {
  extractCandidateNameFromFileName,
  extractCandidateNameFromText,
} from "./extractors/name.js";
import { scoreResume, applyGitHubBonus } from "./scoring/stack.js";
import { fetchGitHubProfile, githubBonusFromProfile } from "./github.js";
import type { ParsedResume, ScoredCandidate } from "./types.js";

// Load .env from project root (resume-scorer folder)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "..", ".env") });

const RESUMES_DIR = process.env.RESUMES_DIR
  ? path.resolve(process.cwd(), process.env.RESUMES_DIR)
  : path.resolve(__dirname, "..", "..");

const DEFAULT_STACK_LABEL =
  "Nuxt, Vue.js, TypeScript, TailwindCSS, Nuxt modules/layers";

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function showMenu(): Promise<boolean> {
  console.log("\n--- Interview stack ---\n");
  console.log("  1) Default stack: " + DEFAULT_STACK_LABEL);
  console.log("  2) Exit\n");
  const choice = await ask("Select option (1 or 2): ");
  if (choice === "2" || choice.toLowerCase() === "exit") {
    console.log("Bye.");
    return false;
  }
  if (choice !== "1") {
    console.log("Using default stack (1).\n");
  }
  return true;
}

async function extractText(filePath: string): Promise<string> {
  if (isPdf(filePath)) return extractTextFromPdf(filePath);
  if (isDocx(filePath)) return extractTextFromDocx(filePath);
  return "";
}

async function parseResume(filePath: string): Promise<ParsedResume | null> {
  const rawText = await extractText(filePath);
  if (!rawText.trim()) return null;

  const fileName = path.basename(filePath);
  const linkedIn = extractLinkedInUrl(rawText);
  const github = extractGitHubUrl(rawText);

  const candidateName =
    extractCandidateNameFromFileName(filePath) ??
    extractCandidateNameFromText(rawText);

  return {
    fileName,
    candidateName,
    rawText,
    linkedInUrl: linkedIn?.url ?? null,
    githubUrl: github?.url ?? null,
    linkedInUsername: linkedIn?.username ?? null,
    githubUsername: github?.username ?? null,
  };
}

async function scoreCandidate(parsed: ParsedResume): Promise<ScoredCandidate> {
  const { score, highlights } = scoreResume(parsed);

  let finalScore = { ...score };
  let githubBonusExplanation: string | undefined;

  if (parsed.githubUsername) {
    const profile = await fetchGitHubProfile(parsed.githubUsername);
    const { bonus, explanation } = githubBonusFromProfile(profile);
    finalScore = applyGitHubBonus(finalScore, bonus);
    githubBonusExplanation = explanation;
    if (bonus > 0) highlights.push(`GitHub: +${bonus} (profile verified)`);
  }

  return {
    resume: parsed,
    score: finalScore,
    highlights,
    githubBonusExplanation,
  };
}

function formatReport(results: ScoredCandidate[]): string {
  const sorted = [...results].sort((a, b) => b.score.total - a.score.total);
  const lines: string[] = [
    "=".repeat(80),
    "RESUME SCORE REPORT | Stack: " + DEFAULT_STACK_LABEL,
    "=".repeat(80),
    "",
  ];

  for (let i = 0; i < sorted.length; i++) {
    const { resume, score, highlights, githubBonusExplanation } = sorted[i];
    const name = resume.candidateName ?? resume.fileName;
    lines.push(`${i + 1}. ${name}`);
    lines.push(`   File: ${resume.fileName}`);
    lines.push(`   TOTAL SCORE: ${score.total}/100`);
    lines.push(
      `   Breakdown: Nuxt ${score.nuxt} | Vue ${score.vue} | TS ${score.typescript} | Tailwind ${score.tailwind} | Modules/Layers ${score.nuxtModulesLayers} | Ecosystem ${score.ecosystem} | GitHub bonus ${score.githubBonus}`
    );
    if (resume.linkedInUrl) lines.push(`   LinkedIn: ${resume.linkedInUrl}`);
    if (resume.githubUrl) lines.push(`   GitHub:   ${resume.githubUrl}`);
    if (highlights.length)
      lines.push(`   Highlights: ${highlights.join("; ")}`);
    if (githubBonusExplanation)
      lines.push(`   ${githubBonusExplanation}`);
    lines.push("");
  }

  lines.push("=".repeat(80));
  return lines.join("\n");
}

async function run() {
  const ok = await showMenu();
  if (!ok) return;

  console.log("Reading resumes from:", RESUMES_DIR);
  const entries = await readdir(RESUMES_DIR, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && (isPdf(e.name) || isDocx(e.name)))
    .map((e) => path.join(RESUMES_DIR, e.name));

  console.log(`Found ${files.length} file(s) (PDF/DOCX).\n`);

  const parsed: ParsedResume[] = [];
  for (const file of files) {
    try {
      const r = await parseResume(file);
      if (r) parsed.push(r);
    } catch (err) {
      console.error("Error processing", path.basename(file), err);
    }
  }

  const results: ScoredCandidate[] = [];
  for (const p of parsed) {
    try {
      const scored = await scoreCandidate(p);
      results.push(scored);
    } catch (err) {
      console.error("Error scoring", p.fileName, err);
    }
  }

  const report = formatReport(results);
  console.log(report);

  const outPath = path.join(RESUMES_DIR, "score-report.txt");
  await writeFile(outPath, report, "utf-8");
  console.log("\nReport saved to:", outPath);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
