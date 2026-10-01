import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Legal } from '@/components/Legal/Legal';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });
  return pageMetadata({ locale, path: '/impressum', title: t('title') });
}

/** The legal notice (Impressum). Static, linked from every page's footer. */
export default async function ImpressumPage() {
  const tCommon = await getTranslations('common');
  return (
    <>
      <PageHeader backLabel={tCommon('backToStack')} />
      <main id="main">
        <Legal />
      </main>
      <PageFooter />
    </>
  );
}
