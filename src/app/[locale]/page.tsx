import { profile } from '@/content/items';

import styles from './page.module.css';

/**
 * TEMPORARY scaffold page. Phase 2 replaces this entirely with the landing
 * carousel (DESIGN.md §4.1).
 *
 * It exists so Phase 0's definition of done can actually be checked in a
 * browser: the flat paper background, and all three families rendering. It
 * deliberately carries no portfolio content.
 *
 * No `setRequestLocale` — `next/root-params` (via `i18n/request.ts`) is
 * what makes this render statically per locale now; next-intl's own
 * request-locale cache is deprecated as of 4.14.
 */
export default function Home() {
  return (
    <main id="main" className={styles.main}>
      <p className={styles.label}>Scaffold check — replaced in Phase 2</p>
      <h1 className={styles.display}>{profile.name}</h1>
      <p className={styles.body}>{profile.stackLine}</p>
      <p className={styles.hand}>Caveat renders here</p>
    </main>
  );
}
