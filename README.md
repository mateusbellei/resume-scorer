# Resume Scorer — Nuxt / Vue / TypeScript / Tailwind

Automation to read resumes (PDF or DOCX), extract LinkedIn and GitHub links, optionally fetch GitHub profile via API, and score candidates against a configurable interview stack. Default stack: **Nuxt, Vue.js, TypeScript, TailwindCSS, Nuxt modules/layers**.

## Features

- **Menu on startup**: Choose the interview stack (default stack or exit) before running.
- **Default stack**: Nuxt, Vue.js, TypeScript, TailwindCSS, Nuxt ecosystem (modules, layers).
- **Environment**: Resume directory and optional GitHub token via `.env` (see below).
- **Report in English**: Output and report file are in English; below highlights, the GitHub bonus is explained (e.g. why score +8).

## Setup

### 1. Install dependencies

```bash
cd resume-scorer
npm install
```

### 2. Environment variables

Copy the example env and edit as needed:

```bash
cp .env.example .env
```

Edit `.env`:

- **`RESUMES_DIR`** — Directory that contains resume files (PDF/DOCX). Use a path relative to the project root or an absolute path. Example: `../` to use the parent folder.
- **`GITHUB_TOKEN`** (optional) — GitHub personal access token for higher API rate limit (60 requests/hour without token).

## Usage

Run the scorer (with menu):

```bash
npm run dev
```

Or build and run:

```bash
npm run score
```

1. When prompted, select the interview stack (e.g. **1** for default stack, **2** to exit).
2. The tool reads all PDF/DOCX files in `RESUMES_DIR`, extracts text and links, fetches GitHub when a link is present, and computes scores.
3. Report is printed in the console and saved as `score-report.txt` in the resume directory.

### Using another resume directory

Set `RESUMES_DIR` in `.env`, or run:

**Windows (PowerShell):**

```powershell
$env:RESUMES_DIR = "C:\path\to\resumes"; npm run dev
```

**Linux/macOS:**

```bash
RESUMES_DIR=/path/to/resumes npm run dev
```

## Output

- **Console**: Full report, sorted by total score (highest first).
- **File**: `score-report.txt` in the resume directory.

Each candidate entry includes:

- Name (from filename or first line of content)
- File name
- **Total score** (0–100) and **breakdown** (Nuxt, Vue, TS, Tailwind, Modules/Layers, Ecosystem, GitHub bonus)
- LinkedIn and GitHub URLs when found
- **Highlights** (matched criteria)
- **GitHub bonus explanation** (below highlights): e.g. *"GitHub bonus (+8): profile verified, 5+ public repos, 15+ public repos (42 public repos)."*

## Scoring (default stack)

| Criteria              | Max points |
|-----------------------|------------|
| Nuxt (3, Nuxt.js)     | 25         |
| Vue.js (Vue 3, etc.)  | 20         |
| TypeScript            | 20         |
| TailwindCSS           | 15         |
| Nuxt modules/layers   | 15         |
| Ecosystem (Vite, SSR, etc.) | 5   |
| GitHub bonus          | up to 10   |

**Total** is capped at 100 (CV score + GitHub bonus).

## Project structure

- `src/readers/` — PDF (pdf-parse) and DOCX (mammoth) readers
- `src/extractors/` — URL (LinkedIn, GitHub) and candidate name extraction
- `src/scoring/` — Stack scoring rules
- `src/github.ts` — GitHub API fetch and bonus + explanation
- `src/index.ts` — Menu, orchestration, and report generation

## License

MIT.
