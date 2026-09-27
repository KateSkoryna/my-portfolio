import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { renderTokensCss } from './tokens-css.ts';
import { color, motion, radius } from './tokens.ts';

const here = dirname(fileURLToPath(import.meta.url));
const tokensCssPath = resolve(here, '../../styles/tokens.css');
const committed = readFileSync(tokensCssPath, 'utf8');

describe('tokens.css', () => {
  it('matches what tokens.ts generates', () => {
    // If this fails, tokens.ts changed without regenerating the CSS.
    // Fix by running `npm run tokens:css` — never by editing tokens.css.
    expect(committed).toBe(renderTokensCss());
  });

  it('exposes every colour token to CSS', () => {
    for (const value of Object.values(color)) {
      expect(committed).toContain(value);
    }
  });

  it('gives durations a time unit', () => {
    expect(committed).toContain(`--motion-turn:`);
    expect(committed).toMatch(new RegExp(`--motion-turn:\\s+${motion.turn}ms;`));
  });

  it('keeps multi-value radii intact', () => {
    expect(committed).toContain(radius.book);
  });

  it('does not leak type or closedBook tokens into CSS', () => {
    // These are multi-property objects and functions — they belong in TS,
    // consumed as props. See tokens-css.ts.
    expect(committed).not.toContain('--type-');
    expect(committed).not.toContain('--closed-book-');
  });
});
