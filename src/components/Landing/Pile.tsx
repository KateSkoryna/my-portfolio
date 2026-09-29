import type { CSSProperties } from 'react';

import { Link } from '@/i18n/navigation';
import type { PortfolioItem } from '@/content/items';
import { ClosedBook } from '@/components/ClosedBook/ClosedBook';

import { PileSelectButton } from './CarouselContext';

import styles from './Pile.module.css';

const PILE_WIDTH = 380;
/** Per-book x offset — not a flat step; tuned per book, not a formula. */
const PILE_X_OFFSETS = [0, 4, 0, 2];
/** Per-book y offset — tuned per book, not accumulated from thickness. */
const PILE_Y_OFFSETS = [0, 45, 72, 104];
const FOURTH_BOOK_ROTATE = 0;

/**
 * The four items not currently floating — DESIGN.md §4.1. Kept in the same
 * order as the stack itself (`items`'s own declaration order), not resorted
 * by thickness — x/y offsets and ±0.6–1.4° rotations give it an organic (not
 * perfectly ruled) look without reshuffling which book sits where.
 *
 * On desktop every book is a direct link to its own route — no bring-to-
 * front-then-click — published or not; the unbuilt routes 404 for now *(Kateryna's
 * call)*. DESIGN.md's canvas draws the pile with no publish-status marker
 * at all — the "coming soon" row this used to render below it was our own
 * addition, not the design's, so it's gone; the closed spine's title is
 * the only label.
 */
export function Pile({ items }: { items: readonly PortfolioItem[] }) {
  const ordered = items;
  const rotations = [-1.4, 0.9, -0.7, 1.2];

  return (
    <div className={styles.wrap}>
      <ul role="list" className={styles.pile}>
        {ordered.map((item, i) => {
          const style = {
            '--pile-x': `${PILE_X_OFFSETS[i]}px`,
            '--pile-y': `${PILE_Y_OFFSETS[i]}px`,
            '--pile-rotate': `${i === 3 ? FOURTH_BOOK_ROTATE : rotations[i % rotations.length]}deg`,
            '--pile-z': ordered.length - i,
          } as CSSProperties;

          return (
            <li key={item.id} className={styles.slot} style={style}>
              <div className={styles.link}>
                <div aria-hidden="true">
                  <ClosedBook item={item} width={PILE_WIDTH} />
                </div>
                {/* Desktop: the book is a direct link to its route. Mobile:
                    a tap selects it instead — only the item's own button
                    navigates. CSS shows one of the two. */}
                <Link href={item.route} className={styles.desktopLink} aria-label={item.title} />
                <PileSelectButton
                  itemId={item.id}
                  label={item.title}
                  className={styles.mobileSelect}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
