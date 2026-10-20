import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

import { LOCALE_COOKIE, routing } from './src/i18n/routing';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
// Journal entries are `.mdx` modules under `src/content/journal`, imported by
// `src/lib/journal.ts` — not pages, so `pageExtensions` is left alone.
const withMDX = createMDX();

const locales = routing.locales.join('|');

/**
 * Sends an address without a language (`/`, `/resume`) to the right one:
 * the language the visitor last switched to (the cookie `LanguageToggle`
 * sets), else a German browser to German, else the default. Done as
 * redirects rather than a proxy so Vercel answers them at the edge and no
 * function has to wake up before a page is served. Paths with a dot are
 * files in `public/` and are left alone.
 */
function localeRedirects(source: string, destination: (locale: string) => string) {
  return [
    ...routing.locales.map((locale) => ({
      source,
      has: [{ type: 'cookie' as const, key: LOCALE_COOKIE, value: locale }],
      destination: destination(locale),
      permanent: false,
    })),
    {
      source,
      has: [{ type: 'header' as const, key: 'accept-language', value: 'de.*' }],
      destination: destination('de'),
      permanent: false,
    },
    { source, destination: destination(routing.defaultLocale), permanent: false },
  ];
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...localeRedirects('/', (locale) => `/${locale}`),
      ...localeRedirects(
        `/:path((?!(?:${locales}|api|_next|_vercel)(?:/|$))[^.]+)`,
        (locale) => `/${locale}/:path`,
      ),
    ];
  },
};

export default withNextIntl(withMDX(nextConfig));
