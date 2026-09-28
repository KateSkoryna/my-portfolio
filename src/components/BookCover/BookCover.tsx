import type { CSSProperties } from 'react';

import type { PortfolioItem } from '@/content/items';

import styles from './BookCover.module.css';

export type CoverSize = 'shelf' | 'hero';

/**
 * DESIGN.md §2.1 reference dimensions the whole component scales from.
 * `hero` is the design's 244×340 scaled up 20% (Kateryna's call — the
 * floating book read too small) — keep in step with `FloatingItem.module.css`,
 * which sizes the spine and cover offset from the same 1.2 factor.
 */
const BASE = { shelf: 216, hero: 293 } as const;
const BASE_HEIGHT = { shelf: 260, hero: 408 } as const;

/**
 * All five cover designs from DESIGN.md §2.1, switching on `item.kind`.
 * Values below are the §2.1 px specs at the 216×260 `shelf` reference size;
 * `--cover-scale` (a plain number, not a length) rescales every `calc(Npx *
 * var(--cover-scale))` offset for the 244×340 `hero` size, so there is one
 * source of truth for the art instead of two near-duplicate layouts.
 */
export function BookCover({ item, size = 'shelf' }: { item: PortfolioItem; size?: CoverSize }) {
  const scale = BASE[size] / BASE.shelf;
  const style = {
    '--cover-scale': scale,
    '--cover-w': `${BASE[size]}px`,
    '--cover-h': `${BASE_HEIGHT[size]}px`,
    '--cover-fill': item.cover,
    '--cover-dark': item.coverDark,
    /* The floating hero cover sits well above the page (DESIGN.md §2.1's
       perspective tilt); the flat shelf row doesn't, so it keeps the
       lighter, closer shadow. */
    '--cover-shadow': size === 'hero' ? 'var(--shadow-raised)' : 'var(--shadow-rest)',
  } as CSSProperties;

  return (
    <div className={`${styles.cover} ${styles[item.kind]}`} style={style}>
      <div className={styles.foreEdge} aria-hidden="true" />
      {item.kind === 'book' && (
        <>
          <div className={styles.bookCircleCoral} aria-hidden="true" />
          <div className={styles.bookCircleSage} aria-hidden="true" />
          <div className={styles.bookDotGrid} aria-hidden="true" />
          <p className={styles.kicker}>{item.coverKicker}</p>
          <p className={styles.bookTitle}>{item.coverTitle}</p>
          <svg className={styles.bookUnderline} viewBox="0 0 84 7" aria-hidden="true">
            <path
              d="M2 4.5 C 20 1, 50 7, 82 2.5"
              fill="none"
              stroke="var(--color-coral)"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
          </svg>
          <p className={styles.bookFoot}>{item.coverFoot}</p>
        </>
      )}
      {item.kind === 'magazine' && (
        <>
          <div className={styles.mastheadBand} aria-hidden="true">
            <span className={styles.mastheadTitle}>{item.coverTitle}</span>
          </div>
          <p className={styles.issueLine}>{item.coverKicker}</p>
          <div className={styles.thumbGrid} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className={styles.magRule} aria-hidden="true" />
          <p className={styles.magHeadline}>{item.coverFoot}</p>
        </>
      )}
      {item.kind === 'notebook' && (
        <>
          <div className={styles.ruledField} aria-hidden="true" />
          <div className={styles.elasticBand} aria-hidden="true" />
          <div className={styles.ribbon} aria-hidden="true" />
          <p className={styles.notebookTitle}>{item.coverTitle}</p>
        </>
      )}
      {item.kind === 'newspaper' && (
        <>
          <div className={styles.crease} aria-hidden="true" />
          <div className={styles.mastheadRules} aria-hidden="true" />
          <p className={styles.paperTitle}>{item.coverTitle}</p>
          <p className={styles.dateline}>{item.coverKicker}</p>
          <p className={styles.headline}>{item.coverFoot}</p>
          <div className={styles.columns} aria-hidden="true">
            <span />
            <span className={styles.photoBlock} />
            <span />
          </div>
        </>
      )}
      {item.kind === 'fieldguide' && (
        <>
          <div className={styles.fgCircleCoral} aria-hidden="true" />
          <div className={styles.fgCircleMustard} aria-hidden="true" />
          <div className={styles.fgCircleSage} aria-hidden="true" />
          <div className={styles.dotGrid} aria-hidden="true" />
          <p className={styles.kicker}>{item.coverKicker}</p>
          <p className={styles.fgTitle}>{item.coverTitle}</p>
          <p className={styles.fgStrapline}>{item.coverFoot}</p>
        </>
      )}
    </div>
  );
}
