import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';

import { HeaderDownload, HeaderLink, PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';
import { resumePdfPath } from '@/content/resume';
import { ResumeClosing, ResumeContent } from '@/components/Resume/ResumePages';
import { PagedBook } from '@/components/PagedBook/PagedBook';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'items.resume' });
  return pageMetadata({ locale, path: '/resume', title: t('title'), description: t('blurb') });
}

/**
 * DESIGN.md §4.3 — the opened book: two spreads on desktop, one page at a
 * time on mobile, arrows that stop at the ends. Static; the CV text is
 * server-rendered and `PagedBook` flows it across the pages.
 */
export default async function ResumePage() {
  const t = await getTranslations('resume');
  const tChrome = await getTranslations('chrome');
  const tCommon = await getTranslations('common');
  const locale = await getLocale();

  return (
    <>
      <PageHeader
        backLabel={tCommon('backToStack')}
        center={
          <HeaderDownload href={resumePdfPath} shortLabel={tChrome('pdfShort')}>
            {t('downloadPdf')}
          </HeaderDownload>
        }
        action={
          <HeaderLink href="/shelf" arrow="forward" shortLabel={tChrome('shelfShort')}>
            {tCommon('goToShelf')}
          </HeaderLink>
        }
      />
      <main id="main">
        <PagedBook
          prevLabel={t('prev')}
          nextLabel={t('next')}
          lang={locale}
          closing={<ResumeClosing />}
        >
          <ResumeContent />
        </PagedBook>
      </main>
      <PageFooter />
    </>
  );
}
