'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';

import { Link } from '@/i18n/navigation';
import { ArrowButton } from '@/components/ArrowButton/ArrowButton';

import styles from './Shelf.module.css';

/**
 * `.covers`/`.closedRow` in `Shelf.module.css` render every slide in a fixed
 * 5-column grid — nothing is ever off-screen at this count, so the arrows
 * have nothing to reveal and disable. Once there are more items than columns
 * they take over that job (still a magic number until the grid itself grows
 * past a fixed 5, at which point this and the CSS `repeat(5, ...)` need to
 * change together).
 */
const VISIBLE_COLUMNS = 5;

export interface ShelfSlide {
  id: string;
  route: string;
  title: string;
  /** Cover art + title/route/blurb caption, `selected={false}`. */
  cover: ReactNode;
  /** Same, `selected={true}` — mustard ring on the cover. */
  coverSelected: ReactNode;
  /** Closed spine, `selected={false}`. */
  closed: ReactNode;
  /** Same, `selected={true}` — mustard ring, emeraldDeep title. */
  closedSelected: ReactNode;
}

/**
 * DESIGN.md §4.2 — five covers (each with a title/route/blurb caption)
 * above a *separate* closed-spine row (its own section, below the
 * separator/heading page.tsx renders in `betweenRows`), same x positions
 * and widths so the two rows can't drift apart. Both rows and the arrows
 * share one `selected` index here; `betweenRows`/`afterClosedRow` let
 * `page.tsx` inject its static (server-rendered) heading and explainer
 * text between them without splitting the selection state across two
 * client components.
 *
 * Only the index state, arrow keys/buttons and which of each item's
 * pre-rendered variants is visible live here — `BookCover` and `ClosedBook`
 * are rendered once per item, per selection state, **server-side** in
 * `page.tsx`, and handed down as `cover`/`coverSelected`/`closed`/
 * `closedSelected`. PLAN.md's own Phase 2 note: an earlier version of the
 * landing carousel imported those components straight into its client
 * component and blew the JS budget (94 perf, 3.1s LCP) until they moved
 * server-side — this follows that fix from the start rather than repeating
 * the mistake.
 *
 * Selection (wraps at both ends, no vertical movement, drives both rows in
 * lockstep by index) and navigation (clicking a cover or a closed book,
 * each its own link to the same route) are independent, mirroring the
 * landing carousel's arrows-vs-click split — arrows browse, the one-click
 * path is the click itself.
 */
export function Shelf({
  slides,
  prevLabel,
  nextLabel,
  betweenRows,
  afterClosedRow,
}: {
  slides: readonly ShelfSlide[];
  prevLabel: string;
  nextLabel: string;
  /** Server-rendered content between the covers row and the closed row. */
  betweenRows?: ReactNode;
  /** Server-rendered content after the closed row. */
  afterClosedRow?: ReactNode;
}) {
  // No book is selected until the visitor actually moves one — arriving on
  // the page shouldn't put a ring/scale on book 1 for no reason (Kateryna's
  // call). The first arrow press or arrow key picks the natural end to
  // start from: `next` lands on the first book, `prev` on the last.
  const [selected, setSelected] = useState<number | null>(null);
  const arrowsDisabled = slides.length <= VISIBLE_COLUMNS;

  const move = useCallback(
    (delta: number) => {
      setSelected((i) =>
        i === null
          ? delta > 0
            ? 0
            : slides.length - 1
          : (i + delta + slides.length) % slides.length,
      );
    },
    [slides.length],
  );

  useEffect(() => {
    if (arrowsDisabled) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move, arrowsDisabled]);

  return (
    <>
      <div className={styles.wrap}>
        <ArrowButton
          direction="prev"
          label={prevLabel}
          onClick={() => move(-1)}
          disabled={arrowsDisabled}
        />
        <ul role="list" className={styles.covers}>
          {slides.map((slide, i) => (
            <li key={slide.id} className={styles.column}>
              <Link
                href={slide.route}
                className={`${styles.coverLink} ${i === selected ? styles.selected : ''}`}
                aria-label={slide.title}
              >
                {i === selected ? slide.coverSelected : slide.cover}
              </Link>
            </li>
          ))}
        </ul>
        <ArrowButton
          direction="next"
          label={nextLabel}
          onClick={() => move(1)}
          disabled={arrowsDisabled}
        />
      </div>

      {betweenRows}

      <ul role="list" className={styles.closedRow}>
        {slides.map((slide, i) => (
          <li key={slide.id} className={styles.column}>
            <Link
              href={slide.route}
              className={`${styles.closedLink} ${i === selected ? styles.selected : ''}`}
              aria-label={slide.title}
            >
              {i === selected ? slide.closedSelected : slide.closed}
            </Link>
          </li>
        ))}
      </ul>

      {afterClosedRow}
    </>
  );
}
