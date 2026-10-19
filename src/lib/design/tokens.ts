/**
 * Every colour, size, radius, shadow and duration on the site. Components never
 * hardcode one; the reasoning behind the values is in DESIGN.md.
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

  bodyText: '#485349',
  muted: '#5C6B64', // 4.86:1 on paper
  quiet: '#6F6656', // 4.93:1 on paper
  placeholder: '#6F6244', // 5.22:1 on paper
  labelInk: '#46524C', // 7.6:1 on white
} as const;

export const bannedColors = {
  legacyHint: '#9A9284', // 2.68:1 on paper
  legacyMuted: '#6D7A72', // 3.91:1 on paper
} as const;

export const pageBackground = color.paper;

export const font = {
  display: 'var(--font-bricolage)',
  body: 'var(--font-manrope)',
  hand: 'var(--font-caveat)',
} as const;

export const emailFont = {
  display: "'Trebuchet MS', 'Helvetica Neue', Arial, sans-serif",
  body: "'Helvetica Neue', Arial, sans-serif",
} as const;

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
  book: '2px 9px 9px 2px',
  closed: '4px 2px 2px 4px',
  thumb: '4px',
} as const;

export const shadow = {
  rest: '0 20px 28px -12px rgba(20,40,30,.55)',
  raised: '0 32px 40px -12px rgba(20,40,30,.65)',
  restDark: '0 22px 32px -8px rgba(10,20,15,.62)',
  raisedDark: '0 34px 42px -8px rgba(10,20,15,.72)',
  closed: '0 10px 18px -14px rgba(20,40,30,.6)',
  button: '0 10px 20px -10px rgba(31,111,95,.7)',
  chip: '0 4px 10px -4px rgba(20,40,30,.28)',
  chipSelected: '0 3px 7px -2px rgba(20,40,30,.5)',
  selectedRing: `0 0 0 2px ${color.mustard}`,
  spineLeft: 'inset -16px 0 26px -18px rgba(0,0,0,.4)',
  spineRight: 'inset 16px 0 26px -18px rgba(0,0,0,.4)',
  sweepEdge: '0 0 14px rgba(20,40,30,.35)',
  suspension: 'radial-gradient(closest-side, rgba(28,52,42,.3), transparent)',
} as const;

export const motion = {
  ease: 'cubic-bezier(.2,.72,.18,1)',
  turn: 420,
  pageTurn: 900,
  easePageTurn: 'cubic-bezier(.45,.05,.25,1)',
  sweepTurn: 1100,
  select: 320,
  hover: 300,
  hoverScale: 1.08,
  swap: 600,
  typeChar: 55,
  typeCharFast: 3,
  introRise: 400,
  introDrop: 480,
  introLift: 500,
  introDraw: 350,
  introStagger: 60,
  introPileAt: 130,
  introFloatAt: 670,
  introTextAt: 870,
} as const;

export const closedBook = {
  spineWidth: (thickness: number): number => (thickness < 18 ? 17 : 23),
  labelSize: (thickness: number): string => (thickness < 18 ? '7px' : '8px'),
  labelInset: 13,
  ink: (cover: string): string => {
    if (cover === color.emerald || cover === color.emeraldDeep) return color.cream;
    if (cover === color.sage) return color.emeraldDeep;
    return color.charcoal;
  },
  band: (cover: string): string =>
    cover === color.emerald || cover === color.emeraldDeep
      ? 'rgba(255,247,237,.32)'
      : 'rgba(35,35,35,.2)',
  containerShadow: (coverDark: string): string =>
    [
      `inset 0 0 0 1px ${coverDark}`,
      'inset 0 3px 5px -3px rgba(255,255,255,.35)',
      'inset 0 -4px 6px -3px rgba(0,0,0,.32)',
      '0 2px 3px -1px rgba(20,40,30,.35)',
      '0 16px 24px -12px rgba(20,40,30,.55)',
    ].join(', '),
  selectedShadow: (coverDark: string): string =>
    [
      `inset 0 0 0 1px ${coverDark}`,
      'inset 0 3px 5px -3px rgba(255,255,255,.35)',
      'inset 0 -4px 6px -3px rgba(0,0,0,.32)',
      `0 0 0 2px ${color.mustard}`,
      '0 15px 22px -12px rgba(20,40,30,.6)',
    ].join(', '),
} as const;

export const a11y = {
  minTargetPx: 44,
  minTargetCompactPx: 24,
  minContrastBody: 4.5,
  minContrastLarge: 3,
  focusRing: `0 0 0 3px ${color.mustard}`,
  focusRingOffset: '2px',
} as const;
