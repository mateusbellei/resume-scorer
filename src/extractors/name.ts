/**
 * Tenta inferir o nome do candidato a partir do nome do arquivo ou das primeiras linhas.
 * Ex: "Lucas_Bicudo_CV_eng - Lucas Bicudo.pdf" -> "Lucas Bicudo"
 */

import path from "node:path";

export function extractCandidateNameFromFileName(filePath: string): string | null {
  const base = path.basename(filePath, path.extname(filePath));
  // Padrão "algo - Nome Sobrenome" ou "Nome_Sobrenome_CV..."
  const dashMatch = base.match(/\s*-\s*(.+?)(?:\s*\.(?:pdf|docx|doc))?$/i);
  if (dashMatch) return dashMatch[1].trim();
  const under = base.split(/[_\-\s]+/).filter(Boolean);
  if (under.length >= 2) {
    // Primeiras duas partes como nome (evitar CV, Resume, EN, etc.)
    const skip = /^(cv|resume|curriculo|curriculum|en|pt|br)$/i;
    const parts = under.filter((p) => !skip.test(p)).slice(0, 2);
    if (parts.length >= 2) return parts.join(" ");
  }
  return null;
}

export function extractCandidateNameFromText(text: string): string | null {
  const firstLines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .slice(0, 5);
  // Primeira linha costuma ser o nome (geralmente curta, sem números)
  const first = firstLines[0];
  if (!first) return null;
  if (first.length > 60) return null;
  if (/\d{3}/.test(first)) return null; // telefone
  if (/@/.test(first) && !first.includes(" ")) return null; // email puro
  return first;
}
