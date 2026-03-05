/**
 * Interview stack config: Default + Front-end + Back-end sections.
 * Each section has one or more stack profiles; the report is focused on the selected stack.
 */

import type { StackProfile } from "../types.js";

/** Section of stacks (Default, Front-end, Back-end). */
export interface StackSection {
  id: string;
  label: string;
  stacks: StackProfile[];
}

/** Default stack: Nuxt, Vue.js, TypeScript, Tailwind, Nuxt modules/layers (as originally specified). */
const DEFAULT_STACK: StackProfile = {
  id: "default-nuxt-vue",
  label: "Nuxt, Vue.js, TypeScript, TailwindCSS, Nuxt modules/layers",
  categories: [
    {
      id: "nuxt",
      label: "Nuxt",
      maxScore: 25,
      highlightLabel: "Nuxt experience",
      patterns: [
        { pattern: /\bnuxt\s*3\b/g, weight: 4 },
        { pattern: /\bnuxt\.?js\b/g, weight: 3 },
        { pattern: /\bnuxt\b/g, weight: 2 },
      ],
    },
    {
      id: "vue",
      label: "Vue",
      maxScore: 20,
      highlightLabel: "Vue.js experience",
      patterns: [
        { pattern: /\bvue\s*3\b/g, weight: 3 },
        { pattern: /\bcomposition\s*api\b/g, weight: 2 },
        { pattern: /\bvue\.?js\b/g, weight: 2 },
        { pattern: /\bvue\b/g, weight: 1 },
      ],
    },
    {
      id: "typescript",
      label: "TS",
      maxScore: 20,
      highlightLabel: "TypeScript",
      patterns: [
        { pattern: /\btypescript\b/g, weight: 3 },
        { pattern: /\bts\b/g, weight: 1 },
      ],
    },
    {
      id: "tailwind",
      label: "Tailwind",
      maxScore: 15,
      highlightLabel: "TailwindCSS",
      patterns: [
        { pattern: /\btailwind\s*css\b/g, weight: 4 },
        { pattern: /\btailwind\b/g, weight: 3 },
      ],
    },
    {
      id: "nuxtModulesLayers",
      label: "Modules/Layers",
      maxScore: 15,
      highlightLabel: "Nuxt ecosystem (modules/layers)",
      patterns: [
        { pattern: /\bnuxt\s*modules?\b/g, weight: 4 },
        { pattern: /\bnuxt\s*layers?\b/g, weight: 4 },
        { pattern: /\b@nuxt\//g, weight: 2 },
        { pattern: /\bnuxt\s*content\b/g, weight: 2 },
        { pattern: /\bnuxt\s*ui\b/g, weight: 2 },
        { pattern: /\bmodules?\b.*nuxt/g, weight: 2 },
        { pattern: /\blayers?\b.*nuxt/g, weight: 2 },
      ],
    },
    {
      id: "ecosystem",
      label: "Ecosystem",
      maxScore: 5,
      highlightLabel: "Modern front-end stack (Vite, SSR, etc.)",
      patterns: [
        { pattern: /\bvite\b/g, weight: 1 },
        { pattern: /\bssr\b/g, weight: 1 },
        { pattern: /\bseo\b/g, weight: 1 },
        { pattern: /\bheadless\s*cms\b/g, weight: 1 },
        { pattern: /\bpinia\b/g, weight: 1 },
      ],
    },
  ],
};

/** Front-end stacks: JS/TS + ecosystem, Vue/Nuxt, React/Next, Angular. */
const FRONT_STACKS: StackProfile[] = [
  {
    id: "front-js-ts",
    label: "JavaScript/TypeScript + ecosystem",
    categories: [
      {
        id: "javascript",
        label: "JavaScript",
        maxScore: 25,
        highlightLabel: "JavaScript (ES6+, modern)",
        patterns: [
          { pattern: /\bes6\b|\bes2015\b|\bjavascript\s*es\d+/gi, weight: 3 },
          { pattern: /\bjavascript\b|\bjs\b/g, weight: 2 },
          { pattern: /\bdom\b|\bapi\s*design\b/g, weight: 1 },
        ],
      },
      {
        id: "typescript",
        label: "TypeScript",
        maxScore: 25,
        highlightLabel: "TypeScript",
        patterns: [
          { pattern: /\btypescript\b/g, weight: 4 },
          { pattern: /\bts\b/g, weight: 1 },
        ],
      },
      {
        id: "tooling",
        label: "Tooling",
        maxScore: 20,
        highlightLabel: "Build/tooling (Vite, Webpack, etc.)",
        patterns: [
          { pattern: /\bvite\b/g, weight: 3 },
          { pattern: /\bwebpack\b/g, weight: 2 },
          { pattern: /\brollup\b|\bparcel\b/g, weight: 2 },
          { pattern: /\bnpm\b|\byarn\b|\bpnpm\b/g, weight: 1 },
        ],
      },
      {
        id: "testing",
        label: "Testing",
        maxScore: 15,
        highlightLabel: "Front-end testing",
        patterns: [
          { pattern: /\bjest\b|\bvitest\b/g, weight: 2 },
          { pattern: /\bcypress\b|\bplaywright\b|\btesting\s*library\b/g, weight: 2 },
          { pattern: /\bunit\s*test\b|\be2e\b/g, weight: 1 },
        ],
      },
      {
        id: "ecosystem",
        label: "Ecosystem",
        maxScore: 15,
        highlightLabel: "Modern JS ecosystem",
        patterns: [
          { pattern: /\bssr\b|\bseo\b/g, weight: 2 },
          { pattern: /\bspa\b|\bpwa\b/g, weight: 1 },
          { pattern: /\baccessibility\b|\ba11y\b/g, weight: 1 },
        ],
      },
    ],
  },
  {
    id: "front-vue-nuxt",
    label: "Vue/Nuxt + Vue ecosystem",
    categories: [
      {
        id: "vue",
        label: "Vue",
        maxScore: 25,
        highlightLabel: "Vue.js experience",
        patterns: [
          { pattern: /\bvue\s*3\b/g, weight: 4 },
          { pattern: /\bcomposition\s*api\b/g, weight: 3 },
          { pattern: /\bvue\.?js\b/g, weight: 2 },
          { pattern: /\bvuex\b|\bpinia\b/g, weight: 2 },
          { pattern: /\bvue\b/g, weight: 1 },
        ],
      },
      {
        id: "nuxt",
        label: "Nuxt",
        maxScore: 25,
        highlightLabel: "Nuxt experience",
        patterns: [
          { pattern: /\bnuxt\s*3\b/g, weight: 4 },
          { pattern: /\bnuxt\.?js\b/g, weight: 3 },
          { pattern: /\bnuxt\s*content\b|\bnuxt\s*ui\b/g, weight: 2 },
          { pattern: /\bnuxt\b/g, weight: 2 },
        ],
      },
      {
        id: "typescript",
        label: "TS",
        maxScore: 15,
        highlightLabel: "TypeScript",
        patterns: [
          { pattern: /\btypescript\b/g, weight: 3 },
          { pattern: /\bts\b/g, weight: 1 },
        ],
      },
      {
        id: "ecosystem",
        label: "Ecosystem",
        maxScore: 15,
        highlightLabel: "Vue ecosystem",
        patterns: [
          { pattern: /\bvite\b/g, weight: 2 },
          { pattern: /\bssr\b|\bseo\b/g, weight: 2 },
          { pattern: /\bheadless\s*cms\b|\bpinia\b/g, weight: 1 },
        ],
      },
    ],
  },
  {
    id: "front-react-next",
    label: "React/Next + ecosystem",
    categories: [
      {
        id: "react",
        label: "React",
        maxScore: 25,
        highlightLabel: "React experience",
        patterns: [
          { pattern: /\breact\s*18\b|\breact\s*19\b/g, weight: 4 },
          { pattern: /\breact\.?js\b/g, weight: 3 },
          { pattern: /\bhooks\b|\buseState\b|\buseEffect\b/g, weight: 2 },
          { pattern: /\breact\b/g, weight: 1 },
        ],
      },
      {
        id: "nextjs",
        label: "Next.js",
        maxScore: 25,
        highlightLabel: "Next.js experience",
        patterns: [
          { pattern: /\bnext\.?js\b/g, weight: 4 },
          { pattern: /\bnext\s*13\b|\bnext\s*14\b|\bapp\s*router\b/g, weight: 3 },
          { pattern: /\bnext\b/g, weight: 2 },
        ],
      },
      {
        id: "typescript",
        label: "TS",
        maxScore: 15,
        highlightLabel: "TypeScript",
        patterns: [
          { pattern: /\btypescript\b/g, weight: 3 },
          { pattern: /\bts\b/g, weight: 1 },
        ],
      },
      {
        id: "ecosystem",
        label: "Ecosystem",
        maxScore: 15,
        highlightLabel: "React ecosystem",
        patterns: [
          { pattern: /\bvercel\b/g, weight: 1 },
          { pattern: /\bssr\b|\bssg\b/g, weight: 2 },
          { pattern: /\bredux\b|\bgraphql\b/g, weight: 1 },
          { pattern: /\btailwind\b/g, weight: 2 },
        ],
      },
    ],
  },
  {
    id: "front-angular",
    label: "Angular + ecosystem",
    categories: [
      {
        id: "angular",
        label: "Angular",
        maxScore: 30,
        highlightLabel: "Angular experience",
        patterns: [
          { pattern: /\bangular\s*1[7-9]\b|\bangular\s*2\d\b/g, weight: 4 },
          { pattern: /\bangular\.?js\b|\bangular\b/g, weight: 3 },
          { pattern: /\bstandalone\s*components\b/g, weight: 2 },
          { pattern: /\bangular\s*cli\b/g, weight: 1 },
        ],
      },
      {
        id: "typescript",
        label: "TS",
        maxScore: 20,
        highlightLabel: "TypeScript",
        patterns: [
          { pattern: /\btypescript\b/g, weight: 3 },
          { pattern: /\bts\b/g, weight: 1 },
        ],
      },
      {
        id: "rxjs",
        label: "RxJS",
        maxScore: 15,
        highlightLabel: "RxJS / reactive",
        patterns: [
          { pattern: /\brxjs\b/g, weight: 3 },
          { pattern: /\bobservable\b|\bsubject\b/g, weight: 1 },
        ],
      },
      {
        id: "ecosystem",
        label: "Ecosystem",
        maxScore: 15,
        highlightLabel: "Angular ecosystem",
        patterns: [
          { pattern: /\bangular\s*material\b/g, weight: 2 },
          { pattern: /\bngrx\b|\bstate\s*management\b/g, weight: 1 },
          { pattern: /\bssr\b|\buniversal\b/g, weight: 1 },
        ],
      },
    ],
  },
];

/** Back-end stacks: PHP/Laravel, Node, Python, Java. */
const BACK_STACKS: StackProfile[] = [
  {
    id: "back-php-laravel",
    label: "PHP/Laravel + concepts & ecosystem",
    categories: [
      {
        id: "laravel",
        label: "Laravel",
        maxScore: 30,
        highlightLabel: "Laravel experience",
        patterns: [
          { pattern: /\blaravel\s*1[0-1]\b|\blaravel\s*9\b|\blaravel\s*8\b/g, weight: 4 },
          { pattern: /\blaravel\b/g, weight: 3 },
          { pattern: /\beloquent\b/g, weight: 2 },
          { pattern: /\bblade\b|\bartisan\b/g, weight: 1 },
        ],
      },
      {
        id: "php",
        label: "PHP",
        maxScore: 25,
        highlightLabel: "PHP experience",
        patterns: [
          { pattern: /\bphp\s*8\b/g, weight: 3 },
          { pattern: /\bphp\b/g, weight: 2 },
          { pattern: /\bcomposer\b/g, weight: 1 },
        ],
      },
      {
        id: "concepts",
        label: "Concepts",
        maxScore: 20,
        highlightLabel: "Back-end concepts (Laravel)",
        patterns: [
          { pattern: /\bmigrations\b|\bmysql\b|\bpostgresql\b/g, weight: 2 },
          { pattern: /\bapi\s*rest\b|\brestful\b/g, weight: 2 },
          { pattern: /\bqueue\b|\bjobs\b|\bcache\b/g, weight: 1 },
          { pattern: /\bauthentication\b|\bmiddleware\b/g, weight: 1 },
        ],
      },
      {
        id: "ecosystem",
        label: "Ecosystem",
        maxScore: 15,
        highlightLabel: "PHP/Laravel ecosystem",
        patterns: [
          { pattern: /\blivewire\b|\binertia\b/g, weight: 2 },
          { pattern: /\btelescope\b|\bhorizon\b/g, weight: 1 },
          { pattern: /\bsanctum\b|\bpassport\b/g, weight: 1 },
        ],
      },
    ],
  },
  {
    id: "back-node",
    label: "Node.js + concepts & ecosystem",
    categories: [
      {
        id: "node",
        label: "Node",
        maxScore: 25,
        highlightLabel: "Node.js experience",
        patterns: [
          { pattern: /\bnode\.?js\b|\bnodejs\b/g, weight: 4 },
          { pattern: /\bnode\b/g, weight: 2 },
        ],
      },
      {
        id: "frameworks",
        label: "Frameworks",
        maxScore: 25,
        highlightLabel: "Node frameworks",
        patterns: [
          { pattern: /\bexpress\b/g, weight: 3 },
          { pattern: /\bnest\s*js\b|\bnestjs\b/g, weight: 3 },
          { pattern: /\bfastify\b|\bkoa\b/g, weight: 2 },
        ],
      },
      {
        id: "typescript",
        label: "TS",
        maxScore: 15,
        highlightLabel: "TypeScript (backend)",
        patterns: [
          { pattern: /\btypescript\b/g, weight: 3 },
          { pattern: /\bts\b/g, weight: 1 },
        ],
      },
      {
        id: "concepts",
        label: "Concepts",
        maxScore: 20,
        highlightLabel: "Back-end concepts (Node)",
        patterns: [
          { pattern: /\brest\b|\bgraphql\b/g, weight: 2 },
          { pattern: /\bapi\b.*\bdesign\b|\bmicroservices\b/g, weight: 1 },
          { pattern: /\bpostgresql\b|\bmongodb\b|\bredis\b/g, weight: 1 },
          { pattern: /\bauthentication\b|\bjwt\b|\boauth\b/g, weight: 1 },
        ],
      },
    ],
  },
  {
    id: "back-python",
    label: "Python + concepts & ecosystem",
    categories: [
      {
        id: "python",
        label: "Python",
        maxScore: 25,
        highlightLabel: "Python experience",
        patterns: [
          { pattern: /\bpython\s*3\.\d+\b/g, weight: 3 },
          { pattern: /\bpython\b/g, weight: 2 },
        ],
      },
      {
        id: "frameworks",
        label: "Frameworks",
        maxScore: 30,
        highlightLabel: "Python web frameworks",
        patterns: [
          { pattern: /\bdjango\b/g, weight: 4 },
          { pattern: /\bflask\b/g, weight: 3 },
          { pattern: /\bfastapi\b/g, weight: 3 },
        ],
      },
      {
        id: "concepts",
        label: "Concepts",
        maxScore: 20,
        highlightLabel: "Back-end concepts (Python)",
        patterns: [
          { pattern: /\borm\b|\bsqlalchemy\b|\bmigrations\b/g, weight: 2 },
          { pattern: /\brest\b|\bapi\b/g, weight: 1 },
          { pattern: /\bpostgresql\b|\bmysql\b|\bcelery\b/g, weight: 1 },
          { pattern: /\bpytest\b|\btesting\b/g, weight: 1 },
        ],
      },
      {
        id: "ecosystem",
        label: "Ecosystem",
        maxScore: 15,
        highlightLabel: "Python ecosystem",
        patterns: [
          { pattern: /\bpip\b|\bvirtualenv\b|\bpoetry\b/g, weight: 1 },
          { pattern: /\basync\b|\basyncio\b/g, weight: 1 },
        ],
      },
    ],
  },
  {
    id: "back-java",
    label: "Java + concepts & ecosystem",
    categories: [
      {
        id: "java",
        label: "Java",
        maxScore: 25,
        highlightLabel: "Java experience",
        patterns: [
          { pattern: /\bjava\s*1[7-9]\b|\bjava\s*2[0-1]\b/g, weight: 4 },
          { pattern: /\bjava\b/g, weight: 2 },
        ],
      },
      {
        id: "spring",
        label: "Spring",
        maxScore: 30,
        highlightLabel: "Spring ecosystem",
        patterns: [
          { pattern: /\bspring\s*boot\b/g, weight: 4 },
          { pattern: /\bspring\s*framework\b|\bspring\b/g, weight: 3 },
          { pattern: /\bspring\s*security\b|\bspring\s*data\b/g, weight: 2 },
        ],
      },
      {
        id: "concepts",
        label: "Concepts",
        maxScore: 20,
        highlightLabel: "Back-end concepts (Java)",
        patterns: [
          { pattern: /\bhibernate\b|\bjpa\b/g, weight: 2 },
          { pattern: /\brest\b|\bapi\b|\bmicroservices\b/g, weight: 1 },
          { pattern: /\bmaven\b|\bgradle\b/g, weight: 1 },
          { pattern: /\bpostgresql\b|\bmysql\b/g, weight: 1 },
        ],
      },
      {
        id: "ecosystem",
        label: "Ecosystem",
        maxScore: 15,
        highlightLabel: "Java ecosystem",
        patterns: [
          { pattern: /\bkotlin\b/g, weight: 2 },
          { pattern: /\bdocker\b|\bkubernetes\b/g, weight: 1 },
        ],
      },
    ],
  },
];

/** Config: Default (single stack) + Front-end + Back-end sections. */
export const STACK_SECTIONS: StackSection[] = [
  { id: "default", label: "Default", stacks: [DEFAULT_STACK] },
  { id: "front", label: "Front-end", stacks: FRONT_STACKS },
  { id: "back", label: "Back-end", stacks: BACK_STACKS },
];

/** Flat list of all stack profiles (for backward compatibility / listing). */
export const STACK_PROFILES: StackProfile[] = STACK_SECTIONS.flatMap(
  (s) => s.stacks
);
