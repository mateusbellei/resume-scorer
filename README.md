# Resume Scorer

Automation to read resumes (PDF or DOCX), extract LinkedIn and GitHub links, optionally fetch GitHub profile via API, and score candidates against a configurable interview stack. Default stack: **Nuxt, Vue.js, TypeScript, TailwindCSS, Nuxt modules/layers**.

## Features

- **Two-level menu**: First choose a section (Default, Front-end, Back-end, or Exit). Then, for Front-end or Back-end, choose the specific stack. The report is focused on the selected stack.
- **Default**: Single stack — Nuxt, Vue.js, TypeScript, TailwindCSS, Nuxt modules/layers (as originally specified).
- **Front-end**: JavaScript/TypeScript + ecosystem, Vue/Nuxt + Vue ecosystem, React/Next + ecosystem, Angular + ecosystem.
- **Back-end**: PHP/Laravel, Node.js, Python, Java (each with concepts and ecosystem patterns).
- **Environment**: Resume directory and optional GitHub token via `.env`.
- **Report in English**: Output and report file in English; below highlights, the GitHub bonus is explained (e.g. why +8).

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

1. **Section**: Choose 1 = Default, 2 = Front-end, 3 = Back-end, or 4 = Exit. Default runs immediately with the default stack.
2. **Stack** (if Front-end or Back-end): Choose which stack (e.g. Vue/Nuxt, React/Next, PHP/Laravel, Node, Python, Java). Option "Back" returns to section selection.
3. The tool reads all PDF/DOCX files in `RESUMES_DIR`, extracts text and links, fetches GitHub when a link is present, and scores against the **selected stack**. The report is focused on that stack’s categories.
4. Report is printed in the console and saved as `score-report.txt` in the resume directory.

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

## Stack configuration (Default / Front / Back)

Stacks are organized in **sections** in **`src/config/stacks.ts`**:

- **`STACK_SECTIONS`** — Array of `{ id, label, stacks: StackProfile[] }`:
  - **Default** — One stack: Nuxt, Vue.js, TypeScript, Tailwind, Nuxt modules/layers.
  - **Front-end** — JS/TS + ecosystem, Vue/Nuxt, React/Next, Angular (each with its own categories and patterns).
  - **Back-end** — PHP/Laravel, Node, Python, Java (each with concepts and ecosystem).

Each **stack profile** has:

- **`id`** — Unique key (e.g. `"front-vue-nuxt"`, `"back-node"`).
- **`label`** — Text shown in the menu and report header.
- **`categories`** — Scoring categories. Each category has:
  - **`id`**, **`label`** — For the breakdown line in the report.
  - **`maxScore`** — Max points for that category.
  - **`highlightLabel`** — Shown in “Highlights” when the candidate matches.
  - **`patterns`** — `[{ pattern: RegExp, weight: number }]`; resume text (lowercased) is matched; each match adds `weight` up to `maxScore`.

**Adding a new stack** (e.g. to Front-end): add a new object to the corresponding array (`FRONT_STACKS` or `BACK_STACKS`) with `id`, `label`, and `categories`. It will appear in the submenu for that section.

**Adding a new section** (e.g. “Mobile”): add a new `StackSection` to `STACK_SECTIONS` with `id`, `label`, and `stacks: StackProfile[]`. Update the menu in `src/index.ts` if you need different behaviour (e.g. section-specific flow).

The report breakdown and total score are computed from the **selected stack’s** categories. GitHub bonus (up to +10) is applied on top for all stacks.

## Project structure

- `src/config/stacks.ts` — **Sections** (Default, Front-end, Back-end) and **stack profiles** (add or edit stacks here)
- `src/readers/` — PDF (pdf-parse) and DOCX (mammoth) readers
- `src/extractors/` — URL (LinkedIn, GitHub) and candidate name extraction
- `src/scoring/` — Generic scoring from a stack profile
- `src/github.ts` — GitHub API fetch and bonus + explanation
- `src/index.ts` — Menu, orchestration, and report generation

## License

MIT.
