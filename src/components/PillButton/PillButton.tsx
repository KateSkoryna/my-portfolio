import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import { Link } from '@/i18n/navigation';

import styles from './PillButton.module.css';

type Variant = 'filled' | 'outline';

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
};

type AsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

/**
 * DESIGN.md §4.4: `filled` carries `shadow.button` (a CTA); `outline` stays
 * flat by intent. Always a real `<button>` or `<a href>` — CLAUDE.md rule 3 —
 * chosen by whether `href` is passed, never `onClick` on a styled `div`.
 */
export function PillButton({ children, variant = 'filled', href, ...rest }: AsButton | AsLink) {
  const className = `${styles.pill} ${variant === 'outline' ? styles.outline : styles.filled}`;

  if (href && 'download' in rest && rest.download !== undefined) {
    // A file, not a route — a plain `<a download>`, not the locale-aware `Link`.
    return (
      <a href={href} className={className} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
