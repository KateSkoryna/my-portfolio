import type { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';
import { getSlugs } from '@/lib/journal';
import { SITE_URL, STATIC_PATHS, languageAlternates, localePath } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...STATIC_PATHS, ...getSlugs().map((slug) => `/journal/${slug}`)];
  return paths.flatMap((path) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([lang, href]) => [lang, `${SITE_URL}${href}`]),
    );
    return routing.locales.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      alternates: { languages },
    }));
  });
}
