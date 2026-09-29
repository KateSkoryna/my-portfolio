import type { PortfolioItem } from '@/content/items';
import { resumePdfPath } from '@/content/resume';
import { PillButton } from '@/components/PillButton/PillButton';

import styles from './Carousel.module.css';

/**
 * The item's "open it" button. Rendered twice per slide — in the description
 * panel (desktop) and under the floating book's shadow (mobile) — with CSS
 * showing one at a time, so the two never drift apart.
 *
 * `withDownload` adds the item's secondary action (the CV's "Download PDF")
 * to its left, the same size. Mobile passes it, because the book's back cover no longer holds
 * that link; on desktop it stays with the chips in the description panel.
 */
export function ItemCta({
  item,
  withDownload = false,
}: {
  item: PortfolioItem;
  withDownload?: boolean;
}) {
  return (
    <>
      {withDownload && item.secondaryCta ? (
        <PillButton href={resumePdfPath} download variant="outline">
          {item.secondaryCta}
          <span className={styles.ctaArrow} aria-hidden="true">
            ↓
          </span>
        </PillButton>
      ) : null}
      <PillButton href={item.route}>
        {item.cta}
        <span className={styles.ctaArrow} aria-hidden="true">
          →
        </span>
      </PillButton>
    </>
  );
}
