/**
 * Resume scorer: reads PDF/DOCX, extracts LinkedIn/GitHub links,
 * fetches GitHub API and scores candidates against a selected stack profile.
 */

import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { config } from "dotenv";

import { STACK_SECTIONS } from "./config/stacks.js";
import { extractTextFromPdf, isPdf } from "./readers/pdf.js";
import { extractTextFromDocx, isDocx } from "./readers/docx.js";
import { extractLinkedInUrl, extractGitHubUrl } from "./extractors/urls.js";
import {
  extractCandidateNameFromFileName,
  extractCandidateNameFromText,
} from "./extractors/name.js";
import { scoreResume, applyGitHubBonus } from "./scoring/stack.js";
import { fetchGitHubProfile, githubBonusFromProfile } from "./github.js";
import type { ParsedResume, ScoredCandidate, StackProfile } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "..", ".env") });

const RESUMES_DIR = process.env.RESUMES_DIR
  ? path.resolve(process.cwd(), process.env.RESUMES_DIR)
  : path.resolve(__dirname, "..", "..");

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function showMenu(): Promise<StackProfile | null> {
  console.log("\n--- Interview stack ---\n");
  // Level 1: choose section (Default, Front-end, Back-end, Exit)
  STACK_SECTIONS.forEach((s, i) => {
    console.log(`  ${i + 1}) ${s.label}`);
  });
  console.log(`  ${STACK_SECTIONS.length + 1}) Exit\n`);
  const sectionChoice = await ask(
    `Select section (1-${STACK_SECTIONS.length + 1}): `
  );
  const sectionNum = parseInt(sectionChoice, 10);
  if (
    sectionNum === STACK_SECTIONS.length + 1 ||
    sectionChoice.toLowerCase() === "exit"
  ) {
    console.log("Bye.");
    return null;
  }
  if (sectionNum < 1 || sectionNum > STACK_SECTIONS.length) {
    console.log("Using Default (1).\n");
    return STACK_SECTIONS[0].stacks[0];
  }
  const section = STACK_SECTIONS[sectionNum - 1];
  // Default has a single stack; use it directly
  if (section.stacks.length === 1) {
    return section.stacks[0];
  }
  // Level 2: choose stack within section (Front-end or Back-end)
  console.log(`\n--- ${section.label} ---\n`);
  section.stacks.forEach((p, i) => {
    console.log(`  ${i + 1}) ${p.label}`);
  });
  console.log(`  ${section.stacks.length + 1}) Back\n`);
  const stackChoice = await ask(
    `Select stack (1-${section.stacks.length + 1}): `
  );
  const stackNum = parseInt(stackChoice, 10);
  if (stackNum === section.stacks.length + 1) {
    return showMenu(); // Back to section selection
  }
  if (stackNum < 1 || stackNum > section.stacks.length) {
    console.log("Using first option.\n");
    return section.stacks[0];
  }
  return section.stacks[stackNum - 1];
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

async function scoreCandidate(
  parsed: ParsedResume,
  profile: StackProfile
): Promise<ScoredCandidate> {
  const { score, highlights } = scoreResume(parsed, profile);

  let finalScore = { ...score };
  let githubBonusExplanation: string | undefined;

  if (parsed.githubUsername) {
    const githubProfile = await fetchGitHubProfile(parsed.githubUsername);
    const { bonus, explanation } = githubBonusFromProfile(githubProfile);
    finalScore = applyGitHubBonus(finalScore, bonus);
    githubBonusExplanation = explanation;
    if (bonus > 0) highlights.push(`GitHub: +${bonus} (profile verified)`);
  }

  return {
    resume: parsed,
    score: finalScore,
    stackProfile: profile,
    highlights,
    githubBonusExplanation,
  };
}

function formatReport(results: ScoredCandidate[]): string {
  if (results.length === 0) {
    return "No candidates to report.";
  }
  const sorted = [...results].sort((a, b) => b.score.total - a.score.total);
  const profile = sorted[0].stackProfile;
  const stackLabel = profile.label;

  const lines: string[] = [
    "=".repeat(80),
    "RESUME SCORE REPORT | Stack: " + stackLabel,
    "=".repeat(80),
    "",
  ];

  for (let i = 0; i < sorted.length; i++) {
    const { resume, score, stackProfile, highlights, githubBonusExplanation } =
      sorted[i];
    const name = resume.candidateName ?? resume.fileName;
    const parts = stackProfile.categories.map(
      (c) => `${c.label} ${score.breakdown[c.id] ?? 0}`
    );
    lines.push(`${i + 1}. ${name}`);
    lines.push(`   File: ${resume.fileName}`);
    lines.push(`   TOTAL SCORE: ${score.total}/100`);
    lines.push(
      `   Breakdown: ${parts.join(" | ")} | GitHub bonus ${score.githubBonus}`
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
  const profile = await showMenu();
  if (!profile) return;

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
      const scored = await scoreCandidate(p, profile);
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
