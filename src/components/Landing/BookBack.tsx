import type { CSSProperties, ReactNode } from 'react';

import { itemsBase, type PortfolioItem } from '@/content/items';
import coverStyles from '@/components/BookCover/BookCover.module.css';

import styles from './BookBack.module.css';

type Kind = PortfolioItem['kind'];

/**
 * Text colour per cover, picked for contrast on that cover's own fill: cream
 * on the two dark gradients, charcoal on the cream magazine and the
 * newsprint, deep emerald on the sage notebook.
 */
const INK: Record<Kind, string> = {
  book: 'var(--color-cream)',
  fieldguide: 'var(--color-cream)',
  magazine: 'var(--color-charcoal)',
  newspaper: 'var(--color-charcoal)',
  notebook: 'var(--color-emerald-deep)',
};

/**
 * The gradient covers, turned over: `BookCover.module.css` runs 150° (book,
 * field guide) and 160° (notebook) from the cover colour to the dark end, so
 * the back runs the same gradient mirrored left↔right (210° / 200°). That puts
 * the light end of the fill next to the spine, exactly as on the front — where
 * the flat cover-coloured spine meets the board's light edge — so the spine
 * and board match on both sides. The magazine and newspaper are flat.
 */
const MIRRORED_FILL: Partial<Record<Kind, string>> = {
  book: styles.mirroredBook,
  fieldguide: styles.mirroredBook,
  notebook: styles.mirroredNotebook,
};

/**
 * The front's own decorations — same classes, so same colours and sizes —
 * drawn on the back mirrored left↔right (`.decor` flips the layer). Only the
 * text-free pieces are carried over; the printed text is the description.
 */
function decor(kind: Kind): ReactNode {
  switch (kind) {
    case 'book':
      return (
        <>
          <div className={coverStyles.bookCircleCoral} />
          <div className={coverStyles.bookCircleSage} />
          <div className={coverStyles.bookDotGrid} />
        </>
      );
    case 'fieldguide':
      return (
        <>
          <div className={coverStyles.fgCircleCoral} />
          <div className={coverStyles.fgCircleMustard} />
          <div className={coverStyles.fgCircleSage} />
          <div className={coverStyles.dotGrid} />
        </>
      );
    case 'notebook':
      // The elastic wraps round to the back, still by the fore-edge.
      return (
        <>
          <div className={coverStyles.ruledField} />
          <div className={coverStyles.elasticBand} />
        </>
      );
    case 'magazine':
      return <div className={coverStyles.mastheadBand} />;
    case 'newspaper':
      return (
        <>
          <div className={`${coverStyles.mastheadRule} ${coverStyles.mastheadRuleTop}`} />
          <div className={`${coverStyles.mastheadRule} ${coverStyles.mastheadRuleBottom}`} />
        </>
      );
  }
}

/**
 * Where the printed text has to start so it stays clear of that cover's
 * decoration (and, on the dark covers, off the coral circle, where cream text
 * would fail contrast).
 */
const CONTENT_CLEARANCE: Record<Kind, string> = {
  book: `${styles.belowCircles} ${styles.raisedTitle}`,
  fieldguide: styles.belowCircles,
  notebook: styles.besideElastic,
  magazine: styles.belowBand,
  newspaper: styles.betweenRules,
};

/**
 * The back of the floating book on mobile — the description panel's
 * content, printed on the back cover. Built as the mirror of `FloatingItem`:
 * same 293×408 board (it reuses `BookCover`'s own per-kind fill and gradient
 * classes, so the colours cannot drift), with the spine slab on the *right*
 * and the page-edge strip on the *left*, as on a real book turned over — the
 * rounded corners are on the left too, the square ones next to the spine. The
 * spine is the cover colour, as on the front, and the front's decorations
 * return mirrored. The text itself is not mirrored. The item's main button
 * stays under the book (`ItemCta`).
 */
export function BookBack({ item }: { item: PortfolioItem }) {
  const isDark = item.kind === 'book' || item.kind === 'fieldguide';
  const style = {
    '--cover-scale': 293 / 216,
    '--cover-w': '293px',
    '--cover-h': '408px',
    '--cover-fill': item.cover,
    '--cover-dark': item.coverDark,
    '--cover-shadow': isDark ? 'var(--shadow-raised-dark)' : 'var(--shadow-raised)',
    '--spine-fill': item.cover,
    '--back-ink': INK[item.kind],
  } as CSSProperties;

  const boardClasses = [
    coverStyles.cover,
    coverStyles[item.kind],
    styles.board,
    MIRRORED_FILL[item.kind],
    item.kind === 'notebook' ? undefined : styles.mirroredCorners,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.book} style={style}>
      <span className={styles.spine} aria-hidden="true" />
      <div className={boardClasses}>
        <div className={styles.decor} aria-hidden="true">
          {decor(item.kind)}
        </div>
        <span className={styles.foreEdge} aria-hidden="true" />
        <div className={`${styles.content} ${CONTENT_CLEARANCE[item.kind]}`}>
          <div className={styles.counterRow}>
            <p className={styles.counter}>
              {item.n} / {String(itemsBase.length).padStart(2, '0')}
            </p>
            <span className={styles.counterLine} aria-hidden="true" />
            <p className={styles.kind}>{item.kindLabel}</p>
          </div>
          <h2 className={styles.title}>{item.title}</h2>
          <p className={styles.blurb}>{item.blurb}</p>
          <ul role="list" className={styles.chips}>
            {item.chips.map((chip) => (
              <li key={chip} className={styles.chip}>
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
