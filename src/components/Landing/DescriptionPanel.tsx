import { itemsBase, type PortfolioItem } from '@/content/items';
import { Chip } from '@/components/Chip/Chip';
import { Eyebrow } from '@/components/Eyebrow/Eyebrow';

import { ItemCta } from './ItemCta';
import styles from './Carousel.module.css';

/**
 * The right-hand panel — DESIGN.md §4.1: leader line, `0X / 05` counter,
 * item title, blurb, chips, CTA. Plain and synchronous, like `FloatingItem`
 * and `Pile` — see the note there.
 */
export function DescriptionPanel({
  item,
  descriptionLabel,
}: {
  item: PortfolioItem;
  descriptionLabel: string;
}) {
  return (
    <section className={styles.description} aria-label={descriptionLabel}>
      <svg className={styles.leader} viewBox="0 0 182 64" fill="none" aria-hidden="true">
        <path
          d="M7 50 L56 50 C78 50 76 12 98 12 L178 12"
          stroke="var(--color-emerald)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* The dot marks the book end of the line, not the counter end — DESIGN.md's canvas. */}
        <circle cx="7" cy="50" r="3.6" fill="var(--color-coral)" />
      </svg>
      <div className={styles.counterRow}>
        <p className={styles.counter}>
          {item.n} / {String(itemsBase.length).padStart(2, '0')}
        </p>
        <span className={styles.counterLine} aria-hidden="true" />
        <Eyebrow>{item.kindLabel}</Eyebrow>
      </div>
      <h2 className={styles.itemTitle}>{item.title}</h2>
      <svg className={styles.titleUnderline} viewBox="0 0 84 7" fill="none" aria-hidden="true">
        <path
          d="M2 4.5 C 20 1, 50 7, 82 2.5"
          stroke="var(--color-coral)"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </svg>
      <p className={styles.blurb}>{item.blurb}</p>
      <ul role="list" className={styles.chips}>
        {item.chips.map((chip) => (
          <li key={chip}>
            <Chip>{chip}</Chip>
          </li>
        ))}
      </ul>
      <div className={styles.descriptionCta}>
        <ItemCta item={item} withDownload />
      </div>
    </section>
  );
}
