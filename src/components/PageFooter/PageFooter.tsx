import type { ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import styles from './PageFooter.module.css';

/**
 * DESIGN.md §4.4 — on every route. Sequential prev/next links, where a page
 * has them, sit in the row above via `sequential`; the footer text never
 * repeats the header's back-arrow escape hatch.
 */
export function PageFooter({ sequential }: { sequential?: ReactNode }) {
  const t = useTranslations('chrome');

  return (
    <footer className={styles.footer}>
      {sequential && <div className={styles.sequential}>{sequential}</div>}
      <div className={styles.row}>
        <p className={styles.copyright}>{t('footer')}</p>
        <div className={styles.links}>
          <Link href="/privacy" className={styles.link}>
            {t('privacy')}
          </Link>
          <Link href="/impressum" className={styles.link}>
            {t('impressum')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
