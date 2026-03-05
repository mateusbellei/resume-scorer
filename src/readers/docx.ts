import { readFile } from "node:fs/promises";
import path from "node:path";
import mammoth from "mammoth";

export async function extractTextFromDocx(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value ?? "";
}

export function isDocx(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ext === ".docx" || ext === ".doc";
}
