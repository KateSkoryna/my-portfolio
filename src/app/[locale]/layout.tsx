import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { Bricolage_Grotesque, Caveat, Manrope } from 'next/font/google';

import { getResumeContent } from '@/content/resume';
import { routing } from '@/i18n/routing';
import { SITE_NAME, SITE_URL, pageMetadata } from '@/lib/seo';

import '@/styles/tokens.css';
import '@/styles/reset.css';

/*
 * DESIGN.md §1.3. Self-hosted by next/font with `display: swap`, so there is
 * no layout shift from font loading — part of the CLS budget, not a detail.
 * The CSS variable names here are the ones tokens.ts already points at.
 *
 * All three families are variable, so each loads as ONE file covering its
 * whole weight range. Naming explicit weights pulls a separate static file
 * each: measured at eleven files against three, for the same total bytes
 * (~140 KB). Same payload, a third of the requests, and the full 400–800
 * Manrope range DESIGN.md §1.3 asks for stays available.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

export function generateStaticParams(): Array<{ locale: string }> {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { headline, headlineStack } = getResumeContent(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
    ...pageMetadata({ locale, path: '', description: `${headline}. ${headlineStack}.` }),
    twitter: { card: 'summary' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Only used to 404 an unknown segment before rendering. The locale value
  // itself comes from `getLocale()` below — `next/root-params` (via
  // `i18n/request.ts`) is what makes this layout render statically per
  // locale now, replacing next-intl's deprecated `setRequestLocale` cache.
  const { locale: segment } = await params;
  if (!hasLocale(routing.locales, segment)) notFound();

  const locale = await getLocale();
  const t = await getTranslations('chrome');

  return (
    <html lang={locale} className={`${bricolage.variable} ${manrope.variable} ${caveat.variable}`}>
      <body>
        <NextIntlClientProvider>
          <a className="skipLink" href="#main">
            {t('skipToContent')}
          </a>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
