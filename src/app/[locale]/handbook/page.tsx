import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';

import { HandbookBook } from '@/components/Handbook/HandbookBook';
import { handbookLeaves } from '@/components/Handbook/HandbookFaces';
import { HeaderLink, PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'items.handbook' });
  return pageMetadata({ locale, path: '/handbook', title: t('title'), description: t('blurb') });
}

/**
 * The Prompting Handbook, ported from the published page-flip (`index.html`).
 * Static; the pages are server-rendered and `HandbookBook` only handles the turn.
 */
export default async function HandbookPage() {
  const t = await getTranslations('handbook');
  const tChrome = await getTranslations('chrome');
  const tCommon = await getTranslations('common');
  const locale = await getLocale();

  return (
    <>
      <PageHeader
        backLabel={tCommon('backToStack')}
        action={
          <HeaderLink href="/shelf" arrow="forward" shortLabel={tChrome('shelfShort')}>
            {tCommon('goToShelf')}
          </HeaderLink>
        }
      />
      <main id="main">
        <HandbookBook
          leaves={handbookLeaves()}
          prevLabel={t('prev')}
          nextLabel={t('next')}
          lang={locale}
        />
      </main>
      <PageFooter />
    </>
  );
}
