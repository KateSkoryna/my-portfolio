import type { Metadata } from 'next';

import { profile } from '@/content/items';
import { routing } from '@/i18n/routing';

/** The production origin. Every canonical, hreflang and sitemap URL hangs off it. */
export const SITE_URL = 'https://katerynaskoryna.com';

export const SITE_NAME = 'Kateryna Skoryna';

/** Every route that is a real page, as a path without the locale prefix. */
export const STATIC_PATHS = [
  '',
  '/projects',
  '/resume',
  '/shelf',
  '/handbook',
  '/journal',
] as const;

/** `/en/resume`-style path for one locale; `path` is `''` for the landing page. */
export function localePath(locale: string, path: string): string {
  return `/${locale}${path}`;
}

/** hreflang map for one page: one entry per locale, plus `x-default` for English. */
export function languageAlternates(path: string): Record<string, string> {
  const entries = routing.locales.map((l) => [l, localePath(l, path)] as const);
  return {
    ...Object.fromEntries(entries),
    'x-default': localePath(routing.defaultLocale, path),
  };
}

/**
 * The per-page part of the metadata: title, description, canonical URL and
 * the language alternates. `metadataBase` in the root layout makes the
 * relative URLs absolute.
 */
export function pageMetadata(args: {
  locale: string;
  path: string;
  title?: string;
  description?: string;
}): Metadata {
  const { locale, path, title, description } = args;
  const url = localePath(locale, path);
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      url,
      siteName: SITE_NAME,
      locale,
      type: 'website',
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    },
  };
}

/** schema.org `Person` for the landing page. `role` and `city` are the translated profile copy. */
export function personJsonLd(args: { locale: string; role: string; city: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: args.role,
    url: `${SITE_URL}${localePath(args.locale, '')}`,
    image: `${SITE_URL}${profile.photo}`,
    homeLocation: { '@type': 'Place', name: args.city },
    sameAs: [profile.github, profile.linkedin],
  };
}
