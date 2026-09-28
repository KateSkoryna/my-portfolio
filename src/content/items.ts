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

// `journal.title` ("Dev Journal") and `about.title` ("Off the Clock") in the
// message files are still provisional placeholders awaiting a rename call.
export const itemsBase: readonly ItemStructural[] = [
  {
    id: 'resume',
    n: '01',
    kind: 'book',
    route: '/resume',
    cover: '#1F6F5F',
    coverDark: '#103C33',
    thickness: 28,
    published: false,
  },
  {
    id: 'projects',
    n: '02',
    kind: 'magazine',
    route: '/projects',
    cover: '#FF6F61',
    coverDark: '#B8453A',
    thickness: 36,
    published: false,
  },
  {
    id: 'journal',
    n: '03',
    kind: 'notebook',
    route: '/journal',
    cover: '#DCE9E2',
    coverDark: '#8FAE9F',
    thickness: 20,
    published: false,
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
  /** [ONE LINE ON WHAT IT DOES AND THE HARD PART.] */
  summary: string;
  /** Optional live deployment. */
  demoUrl?: string;
}

export const featuredRepos: readonly FeaturedRepo[] = [
  { repo: 'travel-portal-app', summary: '[ONE LINE ON WHAT IT DOES AND THE HARD PART.]' },
  { repo: 'quizdom-react-app', summary: '[ONE LINE ON WHAT IT DOES AND THE HARD PART.]' },
  { repo: 'task-manager', summary: '[ONE LINE ON WHAT IT DOES AND THE HARD PART.]' },
  { repo: 'my-portfolio', summary: '[ONE LINE ON WHAT IT DOES AND THE HARD PART.]' },
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
