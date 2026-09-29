'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

import { ArrowButton } from '@/components/ArrowButton/ArrowButton';
import { DotIndicator } from '@/components/DotIndicator/DotIndicator';
import { MarginNote } from '@/components/MarginNote/MarginNote';
import { Link } from '@/i18n/navigation';

import { SelectItemContext } from './CarouselContext';
import styles from './Carousel.module.css';

/**
 * Phones: the book and the pile are fixed-pixel art, so the whole stack is
 * scaled to the width the page gives it instead of hardcoding sizes per
 * screen. The pile (384px) is the widest thing in it; the scale is that
 * width's ratio to the space available, kept within sane limits.
 */
const STACK_DESIGN_WIDTH = 384;
/** How much of the available width the pile should fill (the rest is air). */
const STACK_FILL = 0.8;
const STACK_FIT_MIN = 0.6;
const STACK_FIT_MAX = 1.1;

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
  /** Scale of the whole stack; only applied on phones (`Carousel.module.css`). */
  const [fit, setFit] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const scale = (stage.clientWidth * STACK_FILL) / STACK_DESIGN_WIDTH;
      setFit(Math.min(STACK_FIT_MAX, Math.max(STACK_FIT_MIN, scale)));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

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
   * Touch swipe on the book: left → next, right → previous. The arrows are
   * hidden on phones and tablets (`Carousel.module.css`), and the dots below
   * remain the non-gesture way to move (WCAG 2.5.1). A swipe also fires a
   * `click` on release — which would flip the book on a phone or open its page
   * on a tablet — so `swiped` swallows that one. A mouse never swipes.
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
      <div ref={stageRef} className={styles.stage}>
        <ArrowButton direction="prev" label={prevLabel} onClick={() => advance(-1)} />
        <div className={styles.stack} style={{ '--fit': fit } as CSSProperties}>
          <div
            key={`floating-${index}`}
            className={styles.floatingWrap}
            data-flipped={flipped}
            onPointerDown={(event) => {
              if (event.pointerType === 'mouse') return;
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
            onClickCapture={(event) => {
              if (!swiped.current) return;
              swiped.current = false;
              event.preventDefault();
              event.stopPropagation();
            }}
          >
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
              onClick={() => setFlipped((f) => !f)}
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
