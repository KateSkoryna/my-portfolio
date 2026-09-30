import { getLocale, getTranslations } from 'next-intl/server';

import { HeaderLink, PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';
import { PagedBook } from '@/components/PagedBook/PagedBook';
import { getEntries, getEntry } from '@/lib/journal';

import { JournalEntry } from './JournalEntry';
import { PostMenu } from './PostMenu';
import styles from './Journal.module.css';

/**
 * DESIGN.md §4.3b — `/journal` (the newest post) and `/journal/[slug]`. The
 * notebook holds one post, flowing across its pages like the CV; every post is
 * reached from the "All posts" menu in the header, so the number of posts never
 * changes the layout.
 */
export async function JournalView({ slug }: { slug?: string }) {
  const t = await getTranslations('journal');
  const tChrome = await getTranslations('chrome');
  const tCommon = await getTranslations('common');
  const locale = await getLocale();
  const entries = await getEntries(locale);
  const found = await getEntry(locale, slug ?? entries[0]?.slug ?? '');

  return (
    <>
      <PageHeader
        backLabel={tCommon('backToStack')}
        center={<PostMenu posts={entries} current={found?.entry.slug} />}
        action={
          <HeaderLink href="/shelf" arrow="forward" shortLabel={tChrome('shelfShort')}>
            {tCommon('goToShelf')}
          </HeaderLink>
        }
      />
      <main id="main">
        <PagedBook binding="spiral" prevLabel={t('prev')} nextLabel={t('next')} lang={locale}>
          {found ? (
            <JournalEntry entry={found.entry}>
              <found.Body />
            </JournalEntry>
          ) : (
            <p className={styles.empty}>{t('empty')}</p>
          )}
        </PagedBook>
      </main>
      <PageFooter />
    </>
  );
}
