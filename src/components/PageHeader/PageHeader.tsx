import type { ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import { profile } from '@/content/items';
import { Link } from '@/i18n/navigation';
import { LanguageToggle } from '@/components/LanguageToggle/LanguageToggle';

import styles from './PageHeader.module.css';

/**
 * The flat outlined pill both header links share — the back-arrow and a
 * page's forward action (e.g. "Go to shelf →") — so they cannot drift apart.
 */
export function HeaderLink({
  href,
  arrow,
  children,
  shortLabel,
}: {
  href: string;
  arrow: 'back' | 'forward';
  children: ReactNode;
  /** Replaces `children` on phones, where the row is too narrow for the full text. */
  shortLabel?: string;
}) {
  const glyph = <span aria-hidden="true">{arrow === 'back' ? '←' : '→'}</span>;
  return (
    <Link href={href} className={styles.link}>
      {arrow === 'back' && glyph} <ResponsiveLabel short={shortLabel}>{children}</ResponsiveLabel>{' '}
      {arrow === 'forward' && glyph}
    </Link>
  );
}

/** The full label, or — on phones — the short one. Only the visible one is read out. */
function ResponsiveLabel({ short, children }: { short?: string; children: ReactNode }) {
  if (!short) return <>{children}</>;
  return (
    <>
      <span className={styles.backLong}>{children}</span>
      <span className={styles.backShort}>{short}</span>
    </>
  );
}

/**
 * The same pill for a file download — a plain `<a download>`, not the
 * locale-aware `Link`, since the file is not a route.
 */
export function HeaderDownload({
  href,
  children,
  shortLabel,
}: {
  href: string;
  children: ReactNode;
  /** Replaces `children` on phones, where the row is too narrow for the full text. */
  shortLabel?: string;
}) {
  return (
    <a href={href} download className={styles.link}>
      <ResponsiveLabel short={shortLabel}>{children}</ResponsiveLabel>{' '}
      <span aria-hidden="true">↓</span>
    </a>
  );
}

/**
 * DESIGN.md §4.4 — two rows, one structure on every route. Row 1: the
 * language toggle alone, pinned right (a site-wide setting). Row 2:
 * back-arrow / route label / the page's own action (a where-you-are
 * concern) — kept apart from row 1 deliberately; an earlier version crammed
 * both into one row.
 */
export function PageHeader({
  routeLabel,
  center,
  backHref = '/',
  backLabel,
  action,
  showBackRow = true,
}: {
  routeLabel?: string;
  /** Replaces the route label in the middle cell — e.g. a download button. */
  center?: ReactNode;
  backHref?: string;
  /** Falls back to the generic "Back" — a route can say where it goes back to. */
  backLabel?: string;
  action?: ReactNode;
  /** `/` has nowhere to go back to and no route to label — see `Landing`. */
  showBackRow?: boolean;
}) {
  const t = useTranslations('chrome');

  return (
    <header className={styles.header}>
      <div className={styles.languageRow}>
        <Link href="/" className={styles.homeLink}>
          {profile.name}
        </Link>
        <LanguageToggle />
      </div>
      {showBackRow && (
        <div className={styles.backRow}>
          <HeaderLink href={backHref} arrow="back">
            {backLabel ? (
              <>
                <span className={styles.backLong}>{backLabel}</span>
                <span className={styles.backShort}>{t('back')}</span>
              </>
            ) : (
              t('back')
            )}
          </HeaderLink>
          {center ?? <p className={styles.routeLabel}>{routeLabel}</p>}
          <div className={styles.action}>{action}</div>
        </div>
      )}
    </header>
  );
}
