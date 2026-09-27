/**
 * Writes src/styles/tokens.css from the design tokens.
 *
 * Run with `npm run tokens:css` after any change to tokens.ts. Node strips
 * the types natively, so this needs no build step and no dependency.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { renderTokensCss } from '../src/lib/design/tokens-css.ts';

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, '../src/styles/tokens.css');

writeFileSync(target, renderTokensCss(), 'utf8');
console.log(`Wrote ${target}`);
