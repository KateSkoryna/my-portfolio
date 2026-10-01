import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { About } from '@/components/About/About';
import { HeaderLink, PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'items.about' });
  return pageMetadata({ locale, path: '/about', title: t('title'), description: t('blurb') });
}

/** DESIGN.md §3 `/about` — the newspaper. Static; scrolls (§4.5). */
export default async function AboutPage() {
  const tChrome = await getTranslations('chrome');
  const tCommon = await getTranslations('common');

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
        <About />
      </main>
      <PageFooter />
    </>
  );
}
