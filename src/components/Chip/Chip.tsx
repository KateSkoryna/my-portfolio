import type { ReactNode } from 'react';

import styles from './Chip.module.css';

/** DESIGN.md §1.1 `sage` — metadata chips, e.g. the two per item on `/`. */
export function Chip({ children }: { children: ReactNode }) {
  return <span className={styles.chip}>{children}</span>;
}
