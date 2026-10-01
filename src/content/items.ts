/**
 * The portfolio items.
 *
 * This is the content model the whole site reads from. Adding an item here
 * makes it appear in the stack on `/`, on `/shelf`, and at its own route —
 * no component changes. Keystatic (Phase 5) writes to this same shape.
 *
 * Locale-independent fields (id, kind, route, colours, thickness, publish
 * state) live here. Every piece of copy — title, blurb, chips, CTA labels —
 * lives in `messages/<locale>.json` under `items.<id>`, English included, so
 * there is exactly one place item text is read from in either locale.
 * `localizeItems` merges the two into the full `PortfolioItem` shape the
 * rest of the app renders.
 *
 * Anything in [SQUARE BRACKETS] (in the message files) is a placeholder
 * awaiting Kateryna's content. Do not replace a bracket with invented copy.
 */

export type ItemKind = 'book' | 'magazine' | 'notebook' | 'newspaper' | 'fieldguide';

export interface PortfolioItem {
  /** Stable slug. Also the Keystatic entry name and the `items.<id>` message key. */
  id: string;
  /** Display number, "01"–"05". Drives the counter on `/`. */
  n: string;
  /** Which physical object this is drawn as. Selects the cover treatment. */
  kind: ItemKind;
  /** Human label for the object type, shown beside the item number. */
  kindLabel: string;
  /** Item title, in the UI and as the printed title on the closed book. */
  title: string;
  /** Route. Must match a directory under `src/app`. */
  route: string;
  /** Small caps line at the top of the cover. */
  coverKicker: string;
  /** Large title on the cover. May differ from `title` where the cover art needs it. */
  coverTitle: string;
  /** Bottom line on the cover. */
  coverFoot: string;
  /** Description in the right-hand panel on `/` and under the cover on `/shelf`. */
  blurb: string;
  /** Short form for narrow layouts (mobile, shelf captions). */
  shortBlurb: string;
  /** Metadata chips. */
  chips: readonly string[];
  /** Call-to-action label. "Open the book", "Open the magazine"… */
  cta: string;
  /** Optional second action beside the CTA, e.g. the resume's "Download PDF". */
  secondaryCta?: string;
  /** Front cover colour. Also the flat spine fill — see DESIGN.md §2.2. */
  cover: string;
  /** Back cover colour. Both cover lips use this — see DESIGN.md §2.2. */
  coverDark: string;
  /**
   * Edge-on thickness in px. Editorial weight, NOT page count — the projects
   * magazine is thickest because it is what most visitors come for.
   */
  thickness: number;
  /** False = designed but not yet built. Drives a "coming soon" state. */
  published: boolean;
}

/** Everything about an item that doesn't change with locale. */
export type ItemStructural = Omit<
  PortfolioItem,
  | 'kindLabel'
  | 'title'
  | 'coverKicker'
  | 'coverTitle'
  | 'coverFoot'
  | 'blurb'
  | 'shortBlurb'
  | 'chips'
  | 'cta'
  | 'secondaryCta'
>;

// `about.title` ("Off the Clock") in the message files is still a provisional
// placeholder awaiting a rename call. `journal.title` is "Blog".
export const itemsBase: readonly ItemStructural[] = [
  {
    id: 'resume',
    n: '01',
    kind: 'book',
    route: '/resume',
    cover: '#1F6F5F',
    coverDark: '#103C33',
    thickness: 28,
    published: true,
  },
  {
    id: 'projects',
    n: '02',
    kind: 'magazine',
    route: '/projects',
    cover: '#FF6F61',
    coverDark: '#B8453A',
    thickness: 36,
    published: true,
  },
  {
    id: 'journal',
    n: '03',
    kind: 'notebook',
    route: '/journal',
    cover: '#DCE9E2',
    coverDark: '#8FAE9F',
    thickness: 20,
    published: true,
  },
  {
    id: 'about',
    n: '04',
    kind: 'newspaper',
    route: '/about',
    cover: '#E9B44C',
    coverDark: '#A97C22',
    thickness: 26,
    published: false,
  },
  {
    id: 'handbook',
    n: '05',
    kind: 'fieldguide',
    route: '/handbook',
    cover: '#155246',
    coverDark: '#08241E',
    thickness: 24,
    published: true,
  },
] as const;

/**
 * Structural shape of a next-intl translator scoped to the `items`
 * namespace — matches both `next-intl/server`'s `getTranslations` and
 * `next-intl`'s `useTranslations` return types, so this stays importable
 * from client components (`ScratchContent`) and Server Components
 * (`Landing`) alike without pulling in a server-only type.
 */
export interface ItemsTranslator {
  (key: string, values?: Record<string, string | number | Date>): string;
  raw(key: string): unknown;
  has(key: string): boolean;
}

/** Overlays `items.<id>` copy from `messages/<locale>.json` onto `itemsBase`. */
export function localizeItems(t: ItemsTranslator): readonly PortfolioItem[] {
  return itemsBase.map((base) => ({
    ...base,
    kindLabel: t(`${base.id}.kindLabel`),
    title: t(`${base.id}.title`),
    coverKicker: t(`${base.id}.coverKicker`),
    coverTitle: t(`${base.id}.coverTitle`),
    coverFoot: t(`${base.id}.coverFoot`),
    blurb: t(`${base.id}.blurb`),
    shortBlurb: t(`${base.id}.shortBlurb`),
    chips: t.raw(`${base.id}.chips`) as readonly string[],
    cta: t(`${base.id}.cta`),
    secondaryCta: t.has(`${base.id}.secondaryCta`) ? t(`${base.id}.secondaryCta`) : undefined,
  }));
}

/**
 * Repos surfaced on `/projects`, in order. A curated list, not "all public
 * repos" — the bootcamp coursework would bury the real work.
 *
 * Descriptions are intentionally empty: they are written by Kateryna, not
 * inferred from repo names.
 */
export interface FeaturedRepo {
  /** Repo name under github.com/KateSkoryna */
  repo: string;
  /**
   * What the project is called on the site. Deliberately not the repo name:
   * it says what the project is, for someone who has never opened the repo.
   */
  title: string;
  /**
   * Two sentences, same shape for every project: what it is and who it is
   * for; then "Built with <technologies>, it features <features>."
   */
  summary: string;
  /** Optional live deployment. */
  demoUrl?: string;
  /**
   * The technologies that matter, as she'd list them. Shown in place of the
   * GitHub language split, which only sees a repo's largest languages (a
   * MongoDB/NestJS/AI project reads as just "TypeScript").
   */
  stack?: readonly string[];
  /** Image under `public/`. Without one the feature card shows a `[SCREENSHOT]` placeholder. */
  screenshot?: { src: string; width: number; height: number; alt: string };
}

export const featuredRepos: readonly FeaturedRepo[] = [
  {
    repo: 'task-manager',
    title: 'AI Task Manager',
    demoUrl: 'https://todo-list-frontend-six-drab.vercel.app/',
    screenshot: {
      src: '/task-manager.webp',
      width: 3386,
      height: 1898,
      alt: 'The task-manager dashboard: today’s completion, top-priority tasks, a weekly task-status view and today’s task list.',
    },
    stack: ['React', 'TypeScript', 'NestJS', 'MongoDB', 'Firebase', 'Tailwind CSS', 'Gemini AI'],
    summary:
      'A modern full-stack productivity app with a conversational AI assistant for managing tasks through natural language. Built with React, NestJS, MongoDB, Firebase, and Gemini, it features analytics, AI-powered reports, secure user-scoped access, and multilingual support.',
  },
  {
    repo: 'quizdom-react-app',
    title: 'QuizDOM — AI Learning App',
    demoUrl: 'https://kateskoryna.github.io/quizdom-react-app/',
    screenshot: {
      src: '/quizdom.webp',
      width: 2908,
      height: 1898,
      alt: 'The Quizdom home page: a search box for describing the quiz you want, and a grid of quiz cards showing difficulty, rating and completion.',
    },
    stack: ['React', 'TypeScript', 'Firebase', 'Genkit', 'Gemini AI', 'Sass'],
    summary:
      'An educational app where an LLM assists users with learning, generating quizzes by topic, level and language with hints and scoring. Built with React 19, TypeScript, Firebase, Genkit, and Gemini, it features semantic quiz search and an admin lab where Gemini scores generated quizzes.',
  },
  {
    repo: 'solar-calculator',
    title: 'Fleet Solar Calculator',
    demoUrl: 'https://solar-calculator-azure.vercel.app',
    screenshot: {
      src: '/solar-calculator.webp',
      width: 3030,
      height: 1898,
      alt: 'The Solar Calculator landing page, in German: a heading for a solar calculator for commercial vehicles over an aerial forest photo, four feature panels and a “Get started” button.',
    },
    stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma', 'NextAuth', 'Tailwind CSS'],
    summary:
      'A multi-tenant web app that helps commercial fleet operators evaluate solar panel investments for buses, trucks, vans and trailers. Built with Next.js 16, React 19, TypeScript, PostgreSQL, and Prisma, it features fleet-scoped role-based access, a vehicle and calculation data model, and EN/DE/ES i18n.',
  },
  {
    repo: 'my-portfolio',
    title: 'This Portfolio',
    summary:
      'A personal portfolio designed as a stack of physical objects - book, magazine, notebook, newspaper, field guide - each one a route. Built with Next.js 16, React 19, and TypeScript, it features live GitHub data via ISR, EN/DE i18n, and zero animation libraries.',
    demoUrl: 'https://prompting-handbook-olive.vercel.app/de',
    screenshot: {
      src: '/my-portfolio.webp',
      width: 2860,
      height: 1898,
      alt: 'The portfolio landing page: a floating Resume book with a pile of four more books beneath it, an identity block on the left and a description panel on the right.',
    },
    stack: ['Next.js', 'React', 'TypeScript', 'next-intl', 'CSS Modules'],
  },
] as const;

/**
 * Non-copy profile facts — proper nouns, URLs, tech-stack names. `role`,
 * `bio` and `city` are copy, not facts, so they live in `messages.profile`
 * alongside the item text, translated the same way.
 */
export const profile = {
  name: 'Kateryna Skoryna',
  stackLine: 'React · TypeScript · Next.js · Node.js · PostgreSQL',
  email: 'k.skoryna@gmail.com',
  github: 'https://github.com/KateSkoryna',
  linkedin: 'https://www.linkedin.com/in/kateskoryna/',
  photo: '/photo2.webp',
  /** The section hiring managers actually read. Cannot be drafted for her. */
  lookingFor:
    '[TWO SENTENCES. The kind of team, the kind of problem, and whether you want onsite, hybrid or remote.]',
} as const;
