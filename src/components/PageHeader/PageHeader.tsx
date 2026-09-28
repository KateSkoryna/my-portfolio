import type { ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { LanguageToggle } from '@/components/LanguageToggle/LanguageToggle';

import styles from './PageHeader.module.css';

/**
 * DESIGN.md §4.4 — two rows, one structure on every route. Row 1: the
 * language toggle alone, pinned right (a site-wide setting). Row 2:
 * back-arrow / route label / the page's own action (a where-you-are
 * concern) — kept apart from row 1 deliberately; an earlier version crammed
 * both into one row.
 */
export function PageHeader({
  routeLabel,
  backHref = '/',
  action,
  showBackRow = true,
}: {
  routeLabel?: string;
  backHref?: string;
  action?: ReactNode;
  /** `/` has nowhere to go back to and no route to label — see `Landing`. */
  showBackRow?: boolean;
}) {
  const t = useTranslations('chrome');

  return (
    <header className={styles.header}>
      <div className={styles.languageRow}>
        <LanguageToggle />
      </div>
      {showBackRow && (
        <div className={styles.backRow}>
          <Link href={backHref} className={styles.back}>
            <span aria-hidden="true">←</span> {t('back')}
          </Link>
          <p className={styles.routeLabel}>{routeLabel}</p>
          <div className={styles.action}>{action}</div>
        </div>
      )}
    </header>
  );
}
