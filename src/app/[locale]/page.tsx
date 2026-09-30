import { getLocale, getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';
import { Landing } from '@/components/Landing/Landing';
import { personJsonLd } from '@/lib/seo';

/**
 * The stack — DESIGN.md §4.1. One item floats, four sit in the pile below.
 * `/` has no "back" and no route label, so the header's second row is
 * skipped here (`PageHeader`'s `showBackRow`).
 *
 * No `setRequestLocale` — `next/root-params` (via `i18n/request.ts`) is
 * what makes this render statically per locale now; next-intl's own
 * request-locale cache is deprecated as of 4.14.
 */
export default async function Home() {
  const t = await getTranslations('profile');
  const locale = await getLocale();
  const jsonLd = personJsonLd({ locale, role: t('role'), city: t('city') });
  return (
    <>
      <script
        type="application/ld+json"
        // `<` is escaped so no string in the data can close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <PageHeader showBackRow={false} />
      <Landing />
      <PageFooter />
    </>
  );
}
