import { defineRouting } from 'next-intl/routing';

/**
 * The one place locales are listed. `docs/PLAN.md` Settled settings: EN + DE now,
 * extensible to more without touching components — adding a locale here plus
 * one new file under `messages/` is the whole change.
 */
export const routing = defineRouting({
  locales: ['en', 'de'],
  defaultLocale: 'en',
});

export type Locale = (typeof routing.locales)[number];
