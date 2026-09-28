import type { ReactNode } from 'react';

import styles from './Eyebrow.module.css';

/** DESIGN.md §1.3 `eyebrow` type pattern: Manrope 800 / 10px / .24em / uppercase / emerald. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className={styles.eyebrow}>{children}</p>;
}
