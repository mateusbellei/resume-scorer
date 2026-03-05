import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ text?: string }>;

export async function extractTextFromPdf(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
  const data = await pdfParse(buffer);
  return (data?.text ?? "") as string;
}

export function isPdf(filePath: string): boolean {
  return path.extname(filePath).toLowerCase() === ".pdf";
}
