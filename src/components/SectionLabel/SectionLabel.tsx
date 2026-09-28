import type { ReactNode } from 'react';

import styles from './SectionLabel.module.css';

/** DESIGN.md §1.3 `sectionLabel` type pattern: Manrope 800 / 9.5px / .20em / uppercase / muted. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className={styles.sectionLabel}>{children}</p>;
}
