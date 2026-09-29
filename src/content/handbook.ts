/**
 * The Prompting Handbook's text, one dictionary per locale — see
 * `handbook.en.ts` / `handbook.de.ts`. Values are HTML fragments (bold, italics,
 * inline code, line breaks) taken from the published handbook and rendered as-is;
 * they are static content in this repo, never user input.
 */

import { handbookDe } from './handbook.de';
import { handbookEn } from './handbook.en';

export type HandbookContent = Record<string, string>;

/** English fallback for any locale without its own text. */
export function getHandbookContent(locale: string): HandbookContent {
  return locale === 'de' ? handbookDe : handbookEn;
}
