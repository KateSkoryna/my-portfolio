import { useTranslations } from 'next-intl';

import { localizeItems } from '@/content/items';
import { BookCover } from '@/components/BookCover/BookCover';
import { ClosedBook } from '@/components/ClosedBook/ClosedBook';
import { SectionLabel } from '@/components/SectionLabel/SectionLabel';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';

import styles from './page.module.css';

/**
 * The scratch route body, pulled out of `page.tsx` so `ScratchContent.a11y.test.tsx`
 * can render exactly this markup in isolation and scan it with axe-core —
 * `page.tsx` stays an async Server Component (route params, `setRequestLocale`),
 * which vitest/jsdom cannot render directly.
 */
export function ScratchContent() {
  const t = useTranslations('scratch');
  const tItems = useTranslations('items');
  const items = localizeItems(tItems);

  return (
    <>
      <PageHeader routeLabel={t('route')} />
      <main id="main" className={styles.main}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.intro}>{t('intro')}</p>

        <section>
          <SectionLabel>{t('coversHeading')}</SectionLabel>
          <h2 className={styles.subheading}>{t('shelfSize')}</h2>
          <ul role="list" className={styles.coverRow}>
            {items.map((item) => (
              <li key={item.id}>
                <BookCover item={item} size="shelf" />
              </li>
            ))}
          </ul>

          <h2 className={styles.subheading}>{t('heroSize')}</h2>
          <ul role="list" className={styles.coverRow}>
            {items.map((item) => (
              <li key={item.id}>
                <BookCover item={item} size="hero" />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionLabel>{t('closedHeading')}</SectionLabel>
          <ul role="list" className={styles.closedColumn}>
            {items.map((item, i) => (
              <li key={item.id}>
                <ClosedBook item={item} width={220} selected={i === 0} />
              </li>
            ))}
          </ul>
        </section>
      </main>
      <PageFooter />
    </>
  );
}
