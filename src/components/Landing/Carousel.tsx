'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import { ArrowButton } from '@/components/ArrowButton/ArrowButton';
import { DotIndicator } from '@/components/DotIndicator/DotIndicator';
import { MarginNote } from '@/components/MarginNote/MarginNote';
import { Link } from '@/i18n/navigation';

import { SelectItemContext } from './CarouselContext';
import styles from './Carousel.module.css';

/** Horizontal travel, in px, that counts as a swipe rather than a tap. */
const SWIPE_MIN_DISTANCE = 40;

interface Slide {
  id: string;
  /** The description, printed on the back of the book (mobile). */
  back: ReactNode;
  floating: ReactNode;
  pile: ReactNode;
  description: ReactNode;
  /** Same button as inside `description`; shown under the book on mobile. */
  cta: ReactNode;
}

/**
 * The interactive slice of the stack — index state, `←`/`→`, the arrow and
 * dot controls. Every item's cover, pile and description text is rendered
 * server-side once, in `Landing`, and handed down here as five already-built
 * `Slide`s; this component only decides which one is visible. That keeps
 * `BookCover`, `ClosedBook` and the rest of the visual construction out of
 * the client bundle entirely — advancing reorders, it does not animate a
 * physical move (DESIGN.md §4.1, locked), and state is an index, not a
 * reducer (PLAN.md's own KISS example for this exact carousel).
 */
export function Carousel({
  slides,
  prevLabel,
  nextLabel,
  defaultIndex,
  goToShelfLabel,
  pileNote,
  pileNoteCaption,
  flipLabel,
}: {
  slides: readonly Slide[];
  prevLabel: string;
  nextLabel: string;
  defaultIndex: number;
  goToShelfLabel: string;
  pileNote: string;
  pileNoteCaption: string;
  /** Accessible name of the mobile flip button. */
  flipLabel: string;
}) {
  const [index, setIndex] = useState(defaultIndex);
  /** Mobile: the book is flipped and its description is showing. */
  const [flipped, setFlipped] = useState(false);

  const select = useCallback((i: number) => {
    setIndex(i);
    setFlipped(false);
  }, []);

  const advance = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + slides.length) % slides.length);
      setFlipped(false);
    },
    [slides.length],
  );

  /*
   * Mobile swipe on the book: left → next, right → previous. The arrows are
   * hidden on phones (`Carousel.module.css`), and the dots below remain the
   * non-gesture way to move (WCAG 2.5.1). A swipe also fires a `click` on
   * release, so `swiped` swallows that one instead of flipping the book.
   */
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const selectById = useCallback(
    (id: string) => {
      const i = slides.findIndex((s) => s.id === id);
      if (i !== -1) select(i);
    },
    [slides, select],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') advance(1);
      if (event.key === 'ArrowLeft') advance(-1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advance]);

  const slide = slides[index];

  return (
    <SelectItemContext.Provider value={selectById}>
      <div className={styles.stage}>
        <ArrowButton direction="prev" label={prevLabel} onClick={() => advance(-1)} />
        <div className={styles.stack}>
          <div key={`floating-${index}`} className={styles.floatingWrap} data-flipped={flipped}>
            <div className={styles.flipper}>
              <div className={styles.front}>{slide.floating}</div>
              {/* `inert` while the book is closed — the back holds a link, and
                  it must not be tabbable or read out until it is showing. */}
              <div className={styles.back} inert={!flipped}>
                {slide.back}
              </div>
            </div>
            {/* Mobile only: a tap flips the book and reveals its description;
                the item's own button (below) is what navigates. */}
            <button
              type="button"
              className={styles.flipButton}
              aria-label={flipLabel}
              aria-expanded={flipped}
              onPointerDown={(event) => {
                swipeStart.current = { x: event.clientX, y: event.clientY };
                swiped.current = false;
              }}
              onPointerUp={(event) => {
                const start = swipeStart.current;
                swipeStart.current = null;
                if (!start) return;
                const dx = event.clientX - start.x;
                const dy = event.clientY - start.y;
                if (Math.abs(dx) >= SWIPE_MIN_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
                  swiped.current = true;
                  advance(dx < 0 ? 1 : -1);
                }
              }}
              onPointerCancel={() => {
                swipeStart.current = null;
              }}
              onClick={() => {
                if (swiped.current) {
                  swiped.current = false;
                  return;
                }
                setFlipped((f) => !f);
              }}
            />
          </div>
          <div className={styles.suspensionShadow} aria-hidden="true" />
          <div key={`cta-${index}`} className={styles.mobileCta}>
            {slide.cta}
          </div>
          <div key={`pile-${index}`} className={styles.pileWrap}>
            {slide.pile}
            <svg
              className={styles.pileNoteArrow}
              viewBox="0 0 145 40"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 6 C 70 6, 60 32, 141 34"
                stroke="var(--color-emerald)"
                strokeWidth="1.6"
                strokeDasharray="1 7"
                strokeLinecap="round"
              />
              <circle cx="141" cy="34" r="3" fill="var(--color-emerald)" />
            </svg>
            <div className={styles.pileNote}>
              <MarginNote>{pileNote}</MarginNote>
              <p className={styles.pileNoteCaption}>{pileNoteCaption}</p>
              <Link href="/shelf" className={styles.pileShelfLink}>
                <svg className={styles.pileShelfIcon} viewBox="0 0 16 16" aria-hidden="true">
                  <rect fill="currentColor" x="1.4" y="3" width="3" height="9.6" rx="1" />
                  <rect fill="currentColor" x="5.9" y="1.6" width="3" height="11" rx="1" />
                  <rect fill="currentColor" x="10.4" y="4.2" width="4.2" height="8.4" rx="1" />
                  <rect fill="currentColor" x="0.4" y="13.4" width="15.2" height="1.7" rx=".85" />
                </svg>
                {goToShelfLabel}
                <span className={styles.pileShelfArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
          <div className={styles.pileShadow} aria-hidden="true" />
          <div className={styles.dots}>
            <DotIndicator count={slides.length} activeIndex={index} onSelect={select} />
          </div>
        </div>
        <ArrowButton direction="next" label={nextLabel} onClick={() => advance(1)} />
      </div>

      <div className={styles.desktopDescription}>{slide.description}</div>
    </SelectItemContext.Provider>
  );
}
