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
  /** Optional second action beside the CTA, e.g. the resume's "Download CV". */
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
  /** False = designed but not yet built. All five are built; nothing reads this yet. */
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
    published: true,
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
export interface ProjectScreenshot {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface FeaturedRepo {
  /** Repo name under github.com/KateSkoryna */
  repo: string;
  /**
   * What the project is called on the site. Deliberately not the repo name:
   * it says what the project is, for someone who has never opened the repo.
   */
  title: string;
  /** One sentence: what it is and who it is for. The technologies are in `stack`. */
  summary: string;
  /** Two short sentences: the hard problem, then what she decided. */
  challenge?: string;
  /** Optional live deployment. */
  demoUrl?: string;
  /**
   * The technologies that matter, as she'd list them. Shown in place of the
   * GitHub language split, which only sees a repo's largest languages (a
   * MongoDB/NestJS/AI project reads as just "TypeScript").
   */
  stack?: readonly string[];
  /**
   * Three short lines on what is special about the project. Shown in place of
   * the GitHub language split, which repeats what `stack` already says.
   */
  highlights?: readonly string[];
  /**
   * Images under `public/`, shown as a small carousel on the card; the first
   * is the one a visitor sees before clicking. `null` is a slide still waiting
   * for its image and shows a `[SCREENSHOT]` placeholder — to fill one, put
   * the file in `public/` and replace the `null` with its `src`, pixel
   * `width` and `height`, and an `alt` describing what the screen shows.
   */
  screenshots?: readonly (ProjectScreenshot | null)[];
}

export const featuredRepos: readonly FeaturedRepo[] = [
  {
    repo: 'task-manager',
    title: 'AI Task Manager',
    demoUrl: 'https://todo-list-frontend-six-drab.vercel.app/',
    screenshots: [
      {
        src: '/tasks/t-1.webp',
        width: 3386,
        height: 1898,
        alt: 'The dashboard: today’s completion, an add-task box that parses plain sentences, top-priority tasks, a weekly task-status view and today’s task list.',
      },
      {
        src: '/tasks/t-2.webp',
        width: 3380,
        height: 1878,
        alt: 'The My Tasks page: tasks grouped into lists such as Education and Health, and a detail panel for the selected task with its status, due date and priority.',
      },
      {
        src: '/tasks/t-3.webp',
        width: 3380,
        height: 1878,
        alt: 'The Statistics page: completion rate, planning load, a planned-versus-completed chart, workload distribution and unfinished-task aging.',
      },
      {
        src: '/tasks/t-4.webp',
        width: 3380,
        height: 1878,
        alt: 'The Reports page: a monthly report for August 2026 with key figures, charts and a Print / Save as PDF button.',
      },
    ],
    stack: ['React', 'TypeScript', 'NestJS', 'MongoDB', 'Firebase', 'Tailwind CSS', 'Gemini AI'],
    highlights: [
      'Six assistant tools, validated on the server',
      '22-case evaluation suite for the assistant',
      'Reports in English, German and Ukrainian',
    ],
    summary:
      'A task app with an AI assistant that creates, updates and deletes tasks from plain language.',
    challenge:
      'The assistant could confirm its own delete request. Confirmation now happens on the server and only counts when the user clicks Confirm.',
  },
  {
    repo: 'quizdom-react-app',
    title: 'QuizDOM — AI Learning App',
    demoUrl: 'https://kateskoryna.github.io/quizdom-react-app/',
    screenshots: [
      {
        src: '/quizdom/q-1.webp',
        width: 2948,
        height: 1900,
        alt: 'The Quizdom home page: a dark hero reading “Dive into the depths of coding wisdom” with Explore quizzes and Find a topic buttons, and a search box for describing the quiz you want.',
      },
      {
        src: '/quizdom/q-2.webp',
        width: 2948,
        height: 1900,
        alt: 'The quiz grid: an Add quiz card and quiz cards with topic, difficulty, rating, question count and a Completed badge.',
      },
      {
        src: '/quizdom/q-3.webp',
        width: 2948,
        height: 1900,
        alt: 'A quiz in progress in a dialog: question 1 of 12 with a Show hint button, two answer options, and Previous and Next buttons.',
      },
      {
        src: '/quizdom/q-4.webp',
        width: 2948,
        height: 1900,
        alt: 'The profile page on the My results tab: quizzes passed, average score and Quizdom rating on the left, and a list of completed quizzes with scores and ratings.',
      },
    ],
    stack: ['React', 'TypeScript', 'Firebase', 'Genkit', 'Gemini AI', 'Sass'],
    highlights: [
      'Typed output schema with automatic retries',
      'Admin lab with LLM-as-judge scoring',
      'Search by meaning, not only by title',
    ],
    summary: 'A learning app where an LLM generates quizzes by topic, level and language.',
    challenge:
      'Generated quizzes repeated questions and drifted off topic. I built an evaluation lab where a second model scores them, and tuned the prompt against the scores.',
  },
  {
    repo: 'solar-calculator',
    title: 'Fleet Solar Calculator',
    demoUrl: 'https://solar-calculator-azure.vercel.app',
    screenshots: [
      {
        src: '/solar/sol-1.webp',
        width: 2798,
        height: 1808,
        alt: 'The Solar Calculator landing page, in German: a headline asking whether solar modules pay off for vans and trucks, a “start estimate” button and an example result card showing a payback of 1.5 years.',
      },
      {
        src: '/solar/sol-2.webp',
        width: 2798,
        height: 1808,
        alt: 'Step 3 of the calculator, in German: a city field and overnight parking options on the left, and a live summary of the answers so far with an estimate accuracy bar on the right.',
      },
      {
        src: '/solar/sol-3.webp',
        width: 2798,
        height: 1808,
        alt: 'Step 4 of the calculator, in German: four cards for where to mount the modules (roof, roof and rear, sides, rear), with the answers summary on the right.',
      },
      {
        src: '/solar/sol-4.webp',
        width: 2798,
        height: 1808,
        alt: 'The result page, in German: payback in about 3 years 11 months, followed by cards for yearly savings, one-time cost after subsidy, avoided CO₂ and ten-year profit.',
      },
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma', 'NextAuth', 'Tailwind CSS'],
    highlights: [
      'Role checks on every request, per fleet',
      'Audit log in the same transaction as each change',
      'OAuth sign-in (Google) and passwordless email links',
    ],
    summary:
      'A multi-tenant app that helps fleet operators evaluate solar panels for buses, trucks, vans and trailers.',
    challenge:
      'A visitor’s answers must survive sign-up. They wait in the browser and are saved to the new fleet exactly once, guarded by a hash and a unique database constraint.',
  },
  {
    repo: 'my-portfolio',
    title: 'This Portfolio',
    summary:
      'A portfolio built as a stack of physical objects - book, magazine, notebook, newspaper, field guide - each one a route.',
    challenge:
      'Two languages without rendering on every request: the language is part of the URL, so every page is built once per language.',
    demoUrl: 'https://katerynaskoryna.com',
    screenshots: [
      {
        src: '/my-portfolio.webp',
        width: 2860,
        height: 1898,
        alt: 'The portfolio landing page: a floating Resume book with a pile of four more books beneath it, an identity block on the left and a description panel on the right.',
      },
      {
        src: '/my-portfolio-resume.jpg',
        width: 2860,
        height: 1740,
        alt: 'The resume page: an open book with the CV set across two pages, arrows to turn them and a Download CV button above.',
      },
      {
        src: '/my-portfolio-journal.jpg',
        width: 2860,
        height: 1740,
        alt: 'The blog page: a spiral notebook open on a post, with ruled pages and gold coils down the middle.',
      },
      {
        src: '/my-portfolio-about.jpg',
        width: 2860,
        height: 1740,
        alt: 'The about page: a newspaper called Off the Clock, with numbered facts and photos in four columns.',
      },
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'SSG + ISR', 'next-intl', 'CSS Modules'],
    highlights: [
      'Live GitHub data, refreshed hourly',
      'All motion in plain CSS, no animation library',
      'Accessibility checked on every pull request',
    ],
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
  /** Published in the legal notice (`/impressum`). The country is copy: `legal.country`. */
  address: { street: 'Wiltbergstr. 50, Haus 14e', postalCode: '13125', city: 'Berlin' },
  github: 'https://github.com/KateSkoryna',
  linkedin: 'https://www.linkedin.com/in/kateskoryna/',
  photo: '/photo2.webp',
  /** The section hiring managers actually read. Cannot be drafted for her. */
  lookingFor:
    '[TWO SENTENCES. The kind of team, the kind of problem, and whether you want onsite, hybrid or remote.]',
} as const;

/**
 * Overlays the translated project texts from `messages/<locale>.json`
 * (`projects.items.<repo>`) onto a featured repo. English has none — its
 * copy is the one above — so it comes back unchanged; so does any field a
 * locale leaves out. `alts` is one description per screenshot, in order.
 * `t` is a translator scoped to the `projects` namespace.
 */
export function localizeFeaturedRepo<T extends FeaturedRepo>(repo: T, t: ItemsTranslator): T {
  const key = `items.${repo.repo}`;
  if (!t.has(`${key}.summary`)) return repo;
  const alts = t.has(`${key}.alts`) ? (t.raw(`${key}.alts`) as readonly string[]) : [];
  return {
    ...repo,
    title: t.has(`${key}.title`) ? t(`${key}.title`) : repo.title,
    summary: t(`${key}.summary`),
    challenge: t.has(`${key}.challenge`) ? t(`${key}.challenge`) : repo.challenge,
    highlights: t.has(`${key}.highlights`)
      ? (t.raw(`${key}.highlights`) as readonly string[])
      : repo.highlights,
    screenshots: repo.screenshots?.map((shot, i) =>
      shot ? { ...shot, alt: alts[i] ?? shot.alt } : shot,
    ),
  };
}
