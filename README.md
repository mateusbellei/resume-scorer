# Resume Scorer – Vaga Nuxt/Vue/TypeScript/Tailwind

Automatização para ler currículos (PDF ou DOCX), extrair links (LinkedIn/GitHub), acessar o perfil GitHub via API e atribuir um **score** com base na stack desejada.

## Stack avaliada

- **Nuxt** (prioridade: Nuxt 3, Nuxt.js)
- **Vue.js** (Vue 3, Composition API)
- **TypeScript**
- **TailwindCSS**
- **Ecossistema Nuxt**: modules, layers, Nuxt Content, Nuxt UI
- **Bônus**: perfil GitHub verificado (repos públicos)

## Uso

### Instalação

```bash
cd resume-scorer
npm install
```

### Rodar na pasta dos currículos (padrão: pasta pai)

Por padrão o script lê PDFs e DOCXs da pasta **pai** (`Nova pasta`), onde está o projeto.

```bash
npm run dev
# ou
npm run score
```

### Usar outra pasta de currículos

```bash
RESUMES_DIR="C:\caminho\para\curriculos" npm run dev
```

### Bônus GitHub (opcional)

Sem token: 60 requisições/hora na API do GitHub.  
Com token: mais requisições.

```bash
set GITHUB_TOKEN=ghp_xxxx
npm run dev
```

## Saída

- **Console**: relatório ordenado por score (maior primeiro).
- **Arquivo**: `score-report.txt` na pasta dos currículos, com:
  - Nome (inferido do arquivo ou do texto)
  - Score total (0–100) e breakdown (Nuxt, Vue, TS, Tailwind, modules/layers, bônus GitHub)
  - Links LinkedIn e GitHub
  - Destaques (trechos/critérios que justificam o score)

## Estrutura

- `src/readers/` – leitura de PDF (pdf-parse) e DOCX (mammoth)
- `src/extractors/` – extração de URLs (LinkedIn, GitHub) e nome do candidato
- `src/scoring/` – regras de pontuação pela stack
- `src/github.ts` – chamada à API do GitHub para bônus
- `src/index.ts` – orquestração e geração do relatório
