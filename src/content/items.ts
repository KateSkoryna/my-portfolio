/**
 * The portfolio items.
 *
 * This is the content model the whole site reads from. Adding an item here
 * makes it appear in the stack on `/`, on `/shelf`, and at its own route —
 * no component changes. Keystatic (Phase 5) writes to this same shape.
 *
 * Anything in [SQUARE BRACKETS] is a placeholder awaiting Kateryna's content.
 * Do not replace a bracket with invented copy.
 */

export type ItemKind = 'book' | 'magazine' | 'notebook' | 'newspaper' | 'fieldguide';

export interface PortfolioItem {
  /** Stable slug. Also the Keystatic entry name. */
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
  /** Two metadata chips. */
  chips: readonly string[];
  /** Call-to-action label. "Open the book", "Open the magazine"… */
  cta: string;
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

export const items: readonly PortfolioItem[] = [
  {
    id: 'resume',
    n: '01',
    kind: 'book',
    kindLabel: 'Book',
    title: 'Resume',
    route: '/resume',
    coverKicker: 'Curriculum Vitae',
    coverTitle: 'Resume',
    coverFoot: 'Kateryna Skoryna · 2026',
    blurb:
      'The CV as a typeset object — experience, stack and education set like a printed page rather than an exported PDF. Every line still reads as plain text for a recruiter parser.',
    shortBlurb: 'Experience, stack and education, typeset like a printed page.',
    chips: ['Print stylesheet', 'PDF download'],
    cta: 'Open the book',
    cover: '#1F6F5F',
    coverDark: '#103C33',
    thickness: 28,
    published: false,
  },
  {
    id: 'projects',
    n: '02',
    kind: 'magazine',
    kindLabel: 'Magazine',
    title: 'My Projects',
    route: '/projects',
    coverKicker: 'Issue 01 · Projects',
    coverTitle: 'My Projects',
    coverFoot: 'Updated hourly from GitHub',
    blurb:
      'An issue-per-project magazine. Stars, language split and last-commit dates arrive live from the GitHub API on the server and refresh every hour, so it never goes stale.',
    shortBlurb: 'One issue per project. Repo stats pulled live from GitHub.',
    chips: ['Live GitHub data', 'ISR · 1h'],
    cta: 'Open the magazine',
    cover: '#FF6F61',
    coverDark: '#B8453A',
    thickness: 36,
    published: false,
  },
  {
    id: 'journal',
    n: '03',
    kind: 'notebook',
    kindLabel: 'Notebook',
    // [RENAME? "Dev Journal" is a placeholder title.]
    title: 'Dev Journal',
    route: '/journal',
    coverKicker: 'No. 03 · Working notes',
    coverTitle: 'Dev Journal',
    coverFoot: 'things I got wrong, and what fixed them',
    blurb:
      'Working notes — what broke, what I changed my mind about, what I am learning this month. Written in the margins, not polished for an audience.',
    shortBlurb: 'Working notes. What broke, and what I changed my mind about.',
    chips: ['MDX entries', 'Tagged'],
    cta: 'Open the notebook',
    cover: '#DCE9E2',
    coverDark: '#8FAE9F',
    thickness: 20,
    published: false,
  },
  {
    id: 'about',
    n: '04',
    kind: 'newspaper',
    kindLabel: 'Newspaper',
    // [RENAME? "Off the Clock" is a placeholder title.]
    title: 'Off the Clock',
    route: '/about',
    coverKicker: 'Weekend edition · [YOUR CITY]',
    coverTitle: 'Off the Clock',
    coverFoot: 'Photographs · Trivia · Recommendations',
    blurb:
      'The human column — where I am from, what I do away from a keyboard, and the facts that have no business being on a CV but are the reason people remember you.',
    shortBlurb: 'The human column — everything that has no business on a CV.',
    chips: ['[YOUR FACTS]', 'Photo essay'],
    cta: 'Open the paper',
    cover: '#E9B44C',
    coverDark: '#A97C22',
    thickness: 16,
    published: false,
  },
  {
    id: 'handbook',
    n: '05',
    kind: 'fieldguide',
    kindLabel: 'Field guide',
    title: 'Prompting Handbook',
    route: '/handbook',
    coverKicker: 'Field Notes',
    coverTitle: "The Developer's Prompting Handbook",
    coverFoot: 'Eight spreads · EN / DE',
    blurb:
      'The page-flip field guide already published: how I make LLM output predictable enough to put in production. Eight spreads, English and German.',
    shortBlurb: 'The page-flip field guide, already published. English and German.',
    chips: ['Published', 'EN / DE'],
    cta: 'Open the handbook',
    cover: '#155246',
    coverDark: '#08241E',
    thickness: 24,
    published: true,
  },
] as const;

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

export const profile = {
  name: 'Kateryna Skoryna',
  role: 'Frontend Developer',
  stackLine: 'React · TypeScript · Next.js',
  city: '[YOUR CITY]',
  email: 'k.skoryna@gmail.com',
  github: 'https://github.com/KateSkoryna',
  linkedin: 'https://www.linkedin.com/in/kateskoryna/',
  /** Two sentences: what you build, what you care about, what you want next. */
  bio: '[ONE-LINE BIO — two sentences. What you build, what you care about getting right, and what you are looking for next.]',
  /** The section hiring managers actually read. Cannot be drafted for her. */
  lookingFor:
    '[TWO SENTENCES. The kind of team, the kind of problem, and whether you want onsite, hybrid or remote.]',
  photo: '[YOUR PHOTO]',
} as const;
