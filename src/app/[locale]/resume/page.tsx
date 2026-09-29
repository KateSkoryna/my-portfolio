import { getLocale, getTranslations } from 'next-intl/server';

import { HeaderDownload, HeaderLink, PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';
import { resumePdfPath } from '@/content/resume';
import { ResumeClosing, ResumeContent } from '@/components/Resume/ResumePages';
import { ResumeBook } from '@/components/Resume/ResumeBook';

/**
 * DESIGN.md §4.3 — the opened book: two spreads on desktop, one page at a
 * time on mobile, arrows that stop at the ends. Static; the CV text is
 * server-rendered and `ResumeBook` flows it across the pages.
 */
export default async function ResumePage() {
  const t = await getTranslations('resume');
  const locale = await getLocale();

  return (
    <>
      <PageHeader
        backLabel={t('backToStack')}
        center={<HeaderDownload href={resumePdfPath}>{t('downloadPdf')}</HeaderDownload>}
        action={
          <HeaderLink href="/shelf" arrow="forward">
            {t('goToShelf')}
          </HeaderLink>
        }
      />
      <main id="main">
        <ResumeBook
          prevLabel={t('prev')}
          nextLabel={t('next')}
          lang={locale}
          closing={<ResumeClosing />}
        >
          <ResumeContent />
        </ResumeBook>
      </main>
      <PageFooter />
    </>
  );
}
