import type { ReactNode } from 'react';

import styles from './Chip.module.css';

/**
 * DESIGN.md §1.1 `sage` — metadata chips, e.g. the two per item on `/`.
 * `small` is the compact one (journal tags): less padding, same 11px text —
 * the text stays at the §5.4 floor because a tag is information.
 */
export function Chip({
  children,
  size = 'default',
}: {
  children: ReactNode;
  size?: 'default' | 'small';
}) {
  return (
    <span className={`${styles.chip} ${size === 'small' ? styles.small : ''}`}>{children}</span>
  );
}
