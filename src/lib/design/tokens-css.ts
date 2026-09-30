/**
 * Renders `src/styles/tokens.css` from `tokens.ts`.
 *
 * The CSS file is GENERATED, not hand-written, so the two cannot drift —
 * `BUILD.md` Phase 0 asked for a drift guard and generation is the stronger
 * form of one: divergence is impossible rather than merely detected.
 * `tokens-css.test.ts` fails if the committed file is stale.
 *
 * Only scalar groups cross into CSS. `type.*` is multi-property and
 * `closedBook.*` is functions of per-item values — both stay TypeScript and
 * reach components as props, never as custom properties.
 */

import { a11y, color, font, motion, pageBackground, radius, shadow } from './tokens.ts';

const kebab = (key: string): string => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

type Entry = readonly [name: string, value: string];

const group = (prefix: string, values: Record<string, string>): Entry[] =>
  Object.entries(values).map(([key, value]) => [`--${prefix}-${kebab(key)}`, value]);

const section = (title: string, entries: readonly Entry[]): string => {
  const width = Math.max(...entries.map(([name]) => name.length));
  const lines = entries.map(
    ([name, value]) => `  ${name}:${' '.repeat(width - name.length)} ${value};`,
  );
  return `  /* ${title} */\n${lines.join('\n')}`;
};

export function renderTokensCss(): string {
  const sections = [
    section('Colour — DESIGN.md §1.1', group('color', color)),
    section('Page background — a single flat fill, DESIGN.md §1.2', [
      ['--page-background', pageBackground],
    ]),
    section('Type families — DESIGN.md §1.3', group('font', font)),
    section('Radius — DESIGN.md §1.4', group('radius', radius)),
    section('Shadow — DESIGN.md §1.4', group('shadow', shadow)),
    section('Motion — DESIGN.md §1.4', [
      ['--motion-ease', motion.ease],
      ['--motion-turn', `${motion.turn}ms`],
      ['--motion-page-turn', `${motion.pageTurn}ms`],
      ['--motion-ease-page-turn', motion.easePageTurn],
      ['--motion-sweep-turn', `${motion.sweepTurn}ms`],
      ['--motion-select', `${motion.select}ms`],
      ['--motion-hover', `${motion.hover}ms`],
      ['--motion-hover-scale', `${motion.hoverScale}`],
      ['--motion-swap', `${motion.swap}ms`],
      ['--motion-type-char', `${motion.typeChar}ms`],
      ['--motion-type-char-fast', `${motion.typeCharFast}ms`],
      ['--motion-intro-rise', `${motion.introRise}ms`],
      ['--motion-intro-drop', `${motion.introDrop}ms`],
      ['--motion-intro-lift', `${motion.introLift}ms`],
      ['--motion-intro-draw', `${motion.introDraw}ms`],
      ['--motion-intro-stagger', `${motion.introStagger}ms`],
      ['--motion-intro-pile-at', `${motion.introPileAt}ms`],
      ['--motion-intro-float-at', `${motion.introFloatAt}ms`],
      ['--motion-intro-text-at', `${motion.introTextAt}ms`],
    ]),
    section('Accessibility — DESIGN.md §5', [
      ['--a11y-min-target', `${a11y.minTargetPx}px`],
      ['--a11y-focus-ring', a11y.focusRing],
      ['--a11y-focus-ring-offset', a11y.focusRingOffset],
    ]),
  ];

  return [
    '/*',
    ' * GENERATED FILE — do not edit.',
    ' *',
    ' * Source: src/lib/design/tokens.ts',
    ' * Regenerate: npm run tokens:css',
    ' *',
    ' * Edit the TypeScript tokens instead. `npm test` fails if this file is',
    ' * stale, so a token change that skips regeneration cannot reach main.',
    ' */',
    '',
    ':root {',
    sections.join('\n\n'),
    '}',
    '',
  ].join('\n');
}
