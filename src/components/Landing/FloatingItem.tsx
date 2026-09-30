import type { CSSProperties } from 'react';

import { Link } from '@/i18n/navigation';
import type { PortfolioItem } from '@/content/items';
import { BookCover } from '@/components/BookCover/BookCover';

import styles from './FloatingItem.module.css';

/**
 * The selected item, floating above the pile — DESIGN.md §4.1/§2.1. A
 * 28px spine slab plus the hero cover, tilted `rotateY(-3deg)` so it reads
 * as a book seen slightly edge-on rather than a flat poster.
 *
 * On desktop every item links straight to its route (one click, no bring-to-
 * front step — §4.1), published or not — the unbuilt routes 404 for now
 * *(Kateryna's call)*. No publish-status badge either way — DESIGN.md's
 * canvas draws every cover as finished art.
 *
 * Plain and synchronous — `Landing` resolves labels once via
 * `next-intl/server` and passes them down, rather than every slide calling
 * translation itself. That keeps this unit-testable like `BookCover` and
 * `ClosedBook`, and keeps it out of `Carousel`'s client bundle either way:
 * `Carousel` only ever receives this already rendered, never imports it.
 */
export function FloatingItem({ item }: { item: PortfolioItem }) {
  const isNotebook = item.kind === 'notebook';
  // `--cover-scale` is `BookCover`'s hero scale (293 / 216); the notebook's holes
  // below sit on the same pitch as the cover's coils.
  const style = { '--spine-fill': item.cover, '--cover-scale': 293 / 216 } as CSSProperties;

  const assembly = (
    <>
      {/* The notebook has no hardcover spine: its strip is the stacked page edges, under the coils. */}
      <span
        className={isNotebook ? styles.pageEdge : styles.spine}
        style={style}
        aria-hidden="true"
      />
      <div className={styles.coverWrap}>
        <BookCover item={item} size="hero" />
      </div>
    </>
  );

  return (
    <div className={styles.floating}>
      <div aria-hidden="true">{assembly}</div>
      {/* Desktop only — on mobile a tap flips the book (see `Carousel`) and
          the item's own button is what navigates. */}
      <Link
        href={item.route}
        className={styles.desktopLink}
        aria-label={`${item.title} — ${item.cta}`}
      />
    </div>
  );
}
