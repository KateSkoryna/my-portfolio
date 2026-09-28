import type { ReactNode } from 'react';

import styles from './MarginNote.module.css';

/**
 * DESIGN.md §1.3: Caveat, margin notes and asides only — never for text a
 * reader must be able to read. It is a real, readable `<p>` (19px clears the
 * §5.4 11px floor), just never the sole carrier of information a page needs.
 */
export function MarginNote({ children }: { children: ReactNode }) {
  return <p className={styles.note}>{children}</p>;
}
