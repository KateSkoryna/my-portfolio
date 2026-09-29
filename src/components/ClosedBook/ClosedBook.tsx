import type { CSSProperties } from 'react';

import { closedBook, color } from '@/lib/design/tokens';
import type { PortfolioItem } from '@/content/items';

import styles from './ClosedBook.module.css';

/**
 * The spine-out closed book, DESIGN.md §2.2 — "the important one". Appears
 * in the landing pile and `/shelf`'s closed row.
 *
 * Flat cover-colour fill, height = `item.thickness` (never hardcoded per
 * item — read the note on that in `tokens.ts`). Volume is entirely
 * box-shadow (`closedBook.containerShadow` / `selectedShadow`), never a
 * gradient or a page block.
 */
export function ClosedBook({
  item,
  width,
  selected = false,
}: {
  item: PortfolioItem;
  width: number;
  selected?: boolean;
}) {
  // `/shelf` §4.2: the selected title turns `emeraldDeep`, regardless of
  // the per-cover ink `closedBook.ink` would otherwise pick.
  const ink = selected ? color.emeraldDeep : closedBook.ink(item.cover);
  const band = closedBook.band(item.cover);
  const shadow = selected
    ? closedBook.selectedShadow(item.coverDark)
    : closedBook.containerShadow(item.coverDark);

  const style = {
    '--closed-w': `${width}px`,
    '--closed-h': `${item.thickness}px`,
    '--closed-fill': item.cover,
    '--closed-dark': item.coverDark,
    '--closed-ink': ink,
    '--closed-band': band,
    '--closed-shadow': shadow,
    '--closed-label-size': closedBook.labelSize(item.thickness),
    /*
     * DESIGN.md §2.2 gives the two bands' right-offsets as 30/23px on the
     * reference spec, 7px apart. `closedBook.spineWidth` (17 below 18px
     * thickness, 23 at/above it) supplies the near band's offset and scales
     * the pair down together on the thinnest spine (`/about`, 16px) rather
     * than letting two 2px bands collide on a 16px-tall bar.
     */
    '--closed-band-inset': `${closedBook.spineWidth(item.thickness)}px`,
  } as CSSProperties;

  return (
    <div className={styles.container} style={style}>
      {/*
       * No `aria-hidden` — the printed title is real text, so when this
       * sits inside an `<a>` (the pile / `/shelf`) it becomes
       * the link's accessible name for free, with nothing to duplicate.
       */}
      <span className={styles.edgeTop} />
      <span className={styles.label}>{item.title}</span>
      <span className={styles.band} style={{ right: `calc(var(--closed-band-inset) + 7px)` }} />
      <span className={styles.band} style={{ right: 'var(--closed-band-inset)' }} />
      <span className={styles.edgeBottom} />
    </div>
  );
}
