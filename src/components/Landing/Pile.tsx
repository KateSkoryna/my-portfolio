import { Link } from '@/i18n/navigation';
import type { PortfolioItem } from '@/content/items';
import { ClosedBook } from '@/components/ClosedBook/ClosedBook';

import { PileSelectButton } from './CarouselContext';
import { PILE_WIDTH } from './pileLayout';

import styles from './Pile.module.css';

/**
 * One closed book of the pile — DESIGN.md §4.1. A Server Component: `Landing`
 * renders all five once and hands them to `PileStack` (client), which decides
 * which four are showing and where, so the books stay on the page and can move
 * between slots instead of being rebuilt on every selection.
 *
 * On desktop every book is a direct link to its own route — no bring-to-
 * front-then-click — published or not; the unbuilt routes 404 for now *(Kateryna's
 * call)*. DESIGN.md's canvas draws the pile with no publish-status marker
 * at all, so the closed spine's title is the only label.
 */
export function PileBook({ item }: { item: PortfolioItem }) {
  return (
    <div className={styles.link}>
      <div aria-hidden="true">
        <ClosedBook item={item} width={PILE_WIDTH} />
      </div>
      {/* Desktop: the book is a direct link to its route. Mobile: a tap
          selects it instead — only the item's own button navigates. CSS shows
          one of the two. */}
      <Link href={item.route} className={styles.desktopLink} aria-label={item.title} />
      <PileSelectButton itemId={item.id} label={item.title} className={styles.mobileSelect} />
    </div>
  );
}
