import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import * as rootParams from 'next/root-params';

import { routing } from './routing';

type Messages = { [key: string]: string | Messages };

/** Recursive so a DE file missing one nested key still falls back per-key. */
function deepMerge(base: Messages, override: Messages): Messages {
  const merged: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = base[key];
    merged[key] =
      typeof value === 'object' && typeof baseValue === 'object'
        ? deepMerge(baseValue, value)
        : value;
  }
  return merged;
}

/**
 * English fallback for missing keys (`docs/PLAN.md`): load `en.json` as the base
 * and deep-merge the requested locale over it, so a DE file missing a key
 * renders the English string instead of the raw key path.
 *
 * Reads the `[locale]` segment via `next/root-params` (Next 16.3+) rather
 * than next-intl's own `requestLocale` caching — the latter is deprecated in
 * next-intl 4.14 in favour of this, since Next now supports reading a root
 * dynamic segment natively. `layout.tsx` still 404s on an invalid locale;
 * this fallback is a defensive second line, not the primary guard.
 */
export default getRequestConfig(async () => {
  const requested = await rootParams.locale();
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const base: Messages = (await import(`../../messages/${routing.defaultLocale}.json`)).default;
  const messages =
    locale === routing.defaultLocale
      ? base
      : deepMerge(base, (await import(`../../messages/${locale}.json`)).default);

  return { locale, messages };
});
