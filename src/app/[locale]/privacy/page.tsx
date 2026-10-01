import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Privacy } from '@/components/Legal/Privacy';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return pageMetadata({ locale, path: '/privacy', title: t('title') });
}

/** The privacy notice (Datenschutzerklärung). Static, linked from every page's footer. */
export default async function PrivacyPage() {
  const tCommon = await getTranslations('common');
  return (
    <>
      <PageHeader backLabel={tCommon('backToStack')} />
      <main id="main">
        <Privacy />
      </main>
      <PageFooter />
    </>
  );
}
