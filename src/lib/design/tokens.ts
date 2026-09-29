/**
 * Design tokens for the portfolio.
 *
 * Single source of truth — see DESIGN.md §1. Never hardcode a colour, size,
 * radius, shadow or duration in a component. If a value is missing here, add
 * it here first.
 *
 * Contrast ratios in comments are measured against the stated background and
 * must be preserved. Any new text colour is measured before use.
 */

export const color = {
  emerald: '#1F6F5F',
  emeraldDeep: '#155246',
  coral: '#FF6F61',
  mustard: '#E9B44C',
  sage: '#DCE9E2',
  cream: '#FFF7ED',
  paper: '#F3EFE4',
  charcoal: '#232323',
  ink: '#2B2B2B',

  /** Long-form paragraph text on cream. */
  bodyText: '#485349',
  /** Secondary text. 4.86:1 on `paper`. */
  muted: '#5C6B64',
  /** Tertiary text, URLs, captions. 4.93:1 on `paper`. */
  quiet: '#6F6656',
  /** `[BRACKETED]` placeholder labels. 5.22:1 on `paper`. */
  placeholder: '#6F6244',
  /** Titles printed on closed-book page blocks. 7.6:1 on white. */
  labelInk: '#46524C',
} as const;

/**
 * Inherited from the published handbook and BANNED — both fail WCAG AA on
 * `paper`. Exported only so a lint rule or review can catch reintroduction.
 */
export const bannedColors = {
  /** 2.68:1 on `paper`. Replaced by `color.quiet`. */
  legacyHint: '#9A9284',
  /** 3.91:1 on `paper`. Replaced by `color.muted`. */
  legacyMuted: '#6D7A72',
} as const;

/**
 * Page background. DESIGN.md §1.2 — a single flat fill, every route, desktop
 * and mobile. An earlier two-radial-wash version met in the middle on large
 * pages and read as a broken screen; it was removed. Do not reintroduce a
 * multi-stop background.
 */
export const pageBackground = color.paper;

export const font = {
  /** Headings, cover titles, page numbers, counters. */
  display: 'var(--font-bricolage)',
  /** Every paragraph, label, chip, button. */
  body: 'var(--font-manrope)',
  /** Margin notes and asides ONLY — never for text a reader must read. */
  hand: 'var(--font-caveat)',
} as const;

/** Recurring type patterns. DESIGN.md §1.3 */
export const type = {
  eyebrow: {
    fontFamily: font.body,
    fontWeight: 800,
    fontSize: '10px',
    letterSpacing: '.24em',
    textTransform: 'uppercase',
  },
  sectionLabel: {
    fontFamily: font.body,
    fontWeight: 800,
    fontSize: '9.5px',
    letterSpacing: '.2em',
    textTransform: 'uppercase',
  },
  h1: {
    fontFamily: font.display,
    fontWeight: 800,
    fontSize: '38px',
    lineHeight: 1,
    letterSpacing: '-.025em',
  },
  h2: {
    fontFamily: font.display,
    fontWeight: 800,
    fontSize: '34px',
    lineHeight: 1.02,
    letterSpacing: '-.02em',
  },
  cardTitle: { fontFamily: font.display, fontWeight: 800, fontSize: '16px' },
  body: { fontFamily: font.body, fontWeight: 400, fontSize: '13px', lineHeight: 1.6 },
  caption: { fontFamily: font.body, fontWeight: 700, fontSize: '11.5px' },
  route: {
    fontFamily: font.body,
    fontWeight: 700,
    fontSize: '11.5px',
    letterSpacing: '.04em',
  },
  marginNote: { fontFamily: font.hand, fontWeight: 600, fontSize: '19px' },
} as const;

export const radius = {
  pill: '24px',
  card: '12px',
  /** Face-on cover: sharp at the spine, rounded at the fore-edge. */
  book: '2px 9px 9px 2px',
  /** Edge-on closed book. */
  closed: '4px 2px 2px 4px',
  /** Small chip-scale swatches — the magazine cover's `.thumbGrid` tiles. */
  thumb: '4px',
} as const;

export const shadow = {
  /**
   * Drop shadow for a face-on cover (`BookCover`'s `shelf` size, and the
   * landing pile's spine). The previous `-22px` spread shrank the shadow
   * tight against the card before the blur ever ran, so it read flat —
   * widened the spread and raised the opacity so the card actually reads
   * as lifted off the page, not just faintly outlined (Kateryna's call,
   * matched against her reference).
   */
  rest: '0 20px 28px -12px rgba(20,40,30,.55)',
  /** Same fix, for the floating hero cover — stays the deeper of the two. */
  raised: '0 32px 40px -12px rgba(20,40,30,.65)',
  /**
   * `rest`/`raised`, for the two dark-gradient covers (`book`, `fieldguide`
   * — both fade to a near-black `coverDark`). The same shadow read
   * noticeably flatter under these two: a dark shadow loses contrast right
   * where it meets an already-dark card edge, even though the geometry is
   * identical to the light covers. Wider spread and higher opacity keep the
   * halo legible against the page regardless of what it's falling from.
   */
  restDark: '0 22px 32px -8px rgba(10,20,15,.62)',
  raisedDark: '0 34px 42px -8px rgba(10,20,15,.72)',
  closed: '0 10px 18px -14px rgba(20,40,30,.6)',
  button: '0 10px 20px -10px rgba(31,111,95,.7)',
  /**
   * Small chrome — the language toggle track and similar chip-scale pills.
   * `shadow.rest`'s wide, soft spread reads as flat at this size; this stays
   * tight and close so a 30px control still looks lifted off the page.
   */
  chip: '0 4px 10px -4px rgba(20,40,30,.28)',
  /** Selected state on a chip-scale circular control (language toggle). */
  chipSelected: '0 3px 7px -2px rgba(20,40,30,.5)',
  /**
   * Mustard selection ring for a face-on cover (`/shelf`) — same 2px ring
   * weight as `closedBook.selectedShadow`'s, so the cover and its closed
   * book below read as one selection, not two different treatments.
   */
  selectedRing: `0 0 0 2px ${color.mustard}`,
  /**
   * Inset spine shadows for an opened book (DESIGN.md §4.3): two pages side
   * by side, each darkening toward the spine so the pair reads as one
   * bound object. Left page shadows its right edge, right page its left.
   */
  spineLeft: 'inset -16px 0 26px -18px rgba(0,0,0,.4)',
  spineRight: 'inset 16px 0 26px -18px rgba(0,0,0,.4)',
  /** Soft edge on the old project as it is wiped away on `/projects` (used as a `drop-shadow`). */
  sweepEdge: '0 0 14px rgba(20,40,30,.35)',
  /** Cast by the floating item onto the pile — what sells "suspended". */
  suspension: 'radial-gradient(closest-side, rgba(28,52,42,.3), transparent)',
} as const;

export const motion = {
  ease: 'cubic-bezier(.2,.72,.18,1)',
  /** Carousel advance and page turn. */
  turn: 420,
  /**
   * The `/resume` page-turn leaf. Slower than `turn`: a whole leaf swinging
   * across the spread reads as rushed at 420ms. *(Kateryna's call.)*
   */
  pageTurn: 900,
  /** Ease-in-out for the leaf — it accelerates off the page and settles softly. */
  easePageTurn: 'cubic-bezier(.45,.05,.25,1)',
  /**
   * `/projects` change of project (ms). The old project is wiped away by an
   * edge that swings 180° about the card's bottom centre, uncovering the new
   * one.
   */
  sweepTurn: 1100,
  /** Selection change. */
  select: 320,
  /** Hover scale. */
  hover: 300,
  /**
   * Hover scale factor on /shelf covers. DESIGN.md §4.2 specs 1.2, but at
   * that size a hovered cover's caption text overlapped its neighbour's —
   * only exposed once captions existed under each cover (not in the
   * original spec). Turned down to stay noticeable without the overlap.
   * *(Kateryna's call.)*
   */
  hoverScale: 1.08,
} as const;

/**
 * Closed-book geometry. DESIGN.md §2.2 — spine-out: the book faces the
 * viewer spine-first, bar height is `thickness`. The fill is flat cover
 * colour; volume comes entirely from shadow, never a gradient or page-block
 * texture — an earlier top-edge construction with a cream page-block and a
 * left-hand hinge strip was discarded. Do not reintroduce either.
 *
 * Derive from thickness — never hardcode per item, or the five objects drift
 * apart as values are tweaked.
 */
export const closedBook = {
  spineWidth: (thickness: number): number => (thickness < 18 ? 17 : 23),
  labelSize: (thickness: number): string => (thickness < 18 ? '7px' : '8px'),
  /** Gap between the spine and the printed title. */
  labelInset: 13,
  /**
   * Title ink, chosen for contrast, never brand (DESIGN.md §2.2 note 2):
   * cream on the dark covers, deep emerald on sage, charcoal on coral and
   * mustard. Do not reflexively put cream on coral — it fails contrast on a
   * thin spine.
   */
  ink: (cover: string): string => {
    if (cover === color.emerald || cover === color.emeraldDeep) return color.cream;
    if (cover === color.sage) return color.emeraldDeep;
    return color.charcoal;
  },
  /** The two raised spine bands — light on dark covers, dark on light ones. */
  band: (cover: string): string =>
    cover === color.emerald || cover === color.emeraldDeep
      ? 'rgba(255,247,237,.32)'
      : 'rgba(35,35,35,.2)',
  /** Flat-fill container volume: bound board edge + lit top/shadowed bottom curve + contact shadow + drop. */
  containerShadow: (coverDark: string): string =>
    [
      `inset 0 0 0 1px ${coverDark}`,
      'inset 0 3px 5px -3px rgba(255,255,255,.35)',
      'inset 0 -4px 6px -3px rgba(0,0,0,.32)',
      '0 2px 3px -1px rgba(20,40,30,.35)',
      '0 16px 24px -12px rgba(20,40,30,.55)',
    ].join(', '),
  /** Same volume, plus the mustard selection ring, replacing the drop shadow. */
  selectedShadow: (coverDark: string): string =>
    [
      `inset 0 0 0 1px ${coverDark}`,
      'inset 0 3px 5px -3px rgba(255,255,255,.35)',
      'inset 0 -4px 6px -3px rgba(0,0,0,.32)',
      `0 0 0 2px ${color.mustard}`,
      '0 15px 22px -12px rgba(20,40,30,.6)',
    ].join(', '),
} as const;

/** Accessibility constants. Enforced, not aspirational. DESIGN.md §5 */
export const a11y = {
  /** Minimum touch/click target. The prototype's 32px dots are non-compliant. */
  minTargetPx: 44,
  minContrastBody: 4.5,
  minContrastLarge: 3,
  focusRing: `0 0 0 3px ${color.mustard}`,
  focusRingOffset: '2px',
} as const;
