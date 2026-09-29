import { getLocale, getTranslations } from 'next-intl/server';

import { HandbookBook } from '@/components/Handbook/HandbookBook';
import { handbookLeaves } from '@/components/Handbook/HandbookFaces';
import { HeaderLink, PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';

/**
 * The Prompting Handbook, ported from the published page-flip (`index.html`).
 * Static; the pages are server-rendered and `HandbookBook` only handles the turn.
 */
export default async function HandbookPage() {
  const t = await getTranslations('handbook');
  const locale = await getLocale();

  return (
    <>
      <PageHeader
        backLabel={t('backToStack')}
        action={
          <HeaderLink href="/shelf" arrow="forward">
            {t('goToShelf')}
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
