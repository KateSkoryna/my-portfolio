import type { ReactNode } from 'react';

import styles from './Journal.module.css';

/**
 * A box inside a post: an icon (a lightbulb for "Good to know", a star for "Fun
 * facts"), a short label, an optional bold title, then the text. In MDX: `<Callout label="Good to know" title="…" icon="bulb">` with the
 * text below, separated by blank lines. The label is passed per language, since
 * the post itself is written once per language.
 */
export function Callout({
  label,
  title,
  icon = 'bulb',
  children,
}: {
  label: string;
  title?: string;
  icon?: 'bulb' | 'star';
  children: ReactNode;
}) {
  return (
    <div role="note" className={styles.callout}>
      <p className={styles.calloutLabel}>
        <svg
          className={styles.bulb}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          {icon === 'star' ? (
            <path
              d="M8 1.2l1.9 4.1 4.5.5-3.3 3.1.9 4.4L8 10.9l-4 2.4.9-4.4L1.6 5.8l4.5-.5L8 1.2Z"
              fill="currentColor"
            />
          ) : (
            <>
              <path
                d="M8 1.5a4.5 4.5 0 0 0-2.6 8.2c.4.3.6.7.6 1.2v.6h4v-.6c0-.5.2-.9.6-1.2A4.5 4.5 0 0 0 8 1.5Z"
                fill="currentColor"
              />
              <path
                d="M6.3 13.2h3.4M6.9 14.7h2.2"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
        {label}
      </p>
      {title && <p className={styles.calloutTitle}>{title}</p>}
      {children}
    </div>
  );
}
