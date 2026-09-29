'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { ArrowButton } from '@/components/ArrowButton/ArrowButton';
import { DotIndicator } from '@/components/DotIndicator/DotIndicator';
import { motion } from '@/lib/design/tokens';

import styles from './Handbook.module.css';
import type { HandbookLeaf } from './HandbookFaces';

/** Must match `--page-w` / `--page-h` in `Handbook.module.css`. */
const PAGE_W = 472;
const PAGE_H = 660;
/** The book is scaled to fit, but never blown up past this. */
const MAX_SCALE = 1.15;

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/**
 * The Prompting Handbook page-flip (Phase 4e), ported from the published
 * `index.html`. Five leaves hinged on the spine, each turned with a CSS
 * transition; the cover is the first face and the back cover the last.
 *
 * - One leaf turns at a time. A dot jump steps through the leaves in between
 *   rather than turning several at once (they would tangle in the stack).
 * - The book is a fixed 2 × 472 × 660 stage scaled to whatever space is left
 *   between the header and the footer.
 * - Arrows disable at the cover and the back cover — a book does not loop. Click
 *   the left or right half of the book, or use ← → / PageUp / PageDown.
 * - Only the two faces you can see are exposed to keyboard and assistive tech.
 *   (The published page also turned leaves on mouse wheel; that hijacks scroll,
 *   so it is not carried over.)
 */
export function HandbookBook({
  leaves,
  prevLabel,
  nextLabel,
  lang,
}: {
  leaves: readonly HandbookLeaf[];
  prevLabel: string;
  nextLabel: string;
  lang: string;
}) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(0);
  const [target, setTarget] = useState(0);
  const [moving, setMoving] = useState<number | null>(null);
  // The turning logic runs from event handlers, so it reads refs, not state.
  const flippedRef = useRef(0);
  const targetRef = useRef(0);
  const busyRef = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const count = leaves.length;
  const max = count - 1;

  // Scale the stage to the space the book area has.
  useLayoutEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const measure = () => {
      const s = Math.min(area.clientWidth / (PAGE_W * 2), area.clientHeight / PAGE_H, MAX_SCALE);
      setScale(s > 0 ? s : 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(area);
    return () => observer.disconnect();
  }, []);

  /**
   * Turn one leaf toward the target, if none is turning. `landed` is true when
   * called because a leaf has just come to rest: that frees the stack first and
   * carries on toward the target.
   */
  function advance(landed = false) {
    if (landed) {
      window.clearTimeout(timer.current);
      busyRef.current = false;
      setMoving(null);
    }
    if (busyRef.current || flippedRef.current === targetRef.current) return;
    const dir = targetRef.current > flippedRef.current ? 1 : -1;
    const leaf = dir > 0 ? flippedRef.current : flippedRef.current - 1;
    flippedRef.current += dir;
    setFlipped(flippedRef.current);
    if (prefersReducedMotion()) {
      advance();
      return;
    }
    busyRef.current = true;
    setMoving(leaf);
    // `transitionend` normally frees the stack; this covers a missed event.
    timer.current = window.setTimeout(() => advance(true), motion.pageTurn + 150);
  }

  function goTo(t: number) {
    targetRef.current = Math.min(Math.max(t, 0), max);
    setTarget(targetRef.current);
    advance();
  }

  function step(dir: number) {
    goTo(targetRef.current + dir);
  }

  // The key listener outlives renders, so it calls whichever `step` is current.
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        stepRef.current(1);
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        stepRef.current(-1);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const s = scale ?? 1;

  return (
    <div className={styles.root}>
      <div className={styles.prev}>
        <ArrowButton
          direction="prev"
          label={prevLabel}
          onClick={() => step(-1)}
          disabled={target === 0}
        />
      </div>
      <div ref={areaRef} className={styles.bookArea}>
        <div
          className={`${styles.scaler} ${scale === null ? styles.pending : ''}`}
          style={{ width: PAGE_W * 2 * s, height: PAGE_H * s }}
        >
          <div className={styles.stage} style={{ transform: `scale(${s})` }}>
            <div
              className={styles.book}
              lang={lang}
              onClick={(e) => {
                // Links and buttons keep their own clicks.
                if ((e.target as HTMLElement).closest('a, button')) return;
                const box = e.currentTarget.getBoundingClientRect();
                step(e.clientX > box.left + box.width / 2 ? 1 : -1);
              }}
            >
              <div className={styles.endpaper} aria-hidden="true">
                <span className={`${styles.epDot} ${styles.a}`} />
                <span className={`${styles.epDot} ${styles.b}`} />
                <span className={styles.epMark}>Prompting Handbook</span>
              </div>
              {leaves.map((leaf, i) => {
                const isFlipped = i < flipped;
                const zIndex = moving === i ? 999 : isFlipped ? i + 1 : count - i;
                return (
                  <div
                    key={i}
                    className={`${styles.leaf} ${isFlipped ? styles.flipped : ''}`}
                    style={{ zIndex }}
                    onTransitionEnd={(e) => {
                      if (e.propertyName === 'transform' && e.target === e.currentTarget)
                        advance(true);
                    }}
                  >
                    {/* Only the faces you can see are reachable; the rest are inert. */}
                    <div
                      className={`${styles.face} ${styles.front}`}
                      inert={i !== flipped && moving !== i}
                    >
                      {leaf.front}
                    </div>
                    <div
                      className={`${styles.face} ${styles.back}`}
                      inert={i !== flipped - 1 && moving !== i}
                    >
                      {leaf.back}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.next}>
        <ArrowButton
          direction="next"
          label={nextLabel}
          onClick={() => step(1)}
          disabled={target === max}
        />
      </div>
      <div className={styles.navDots}>
        <DotIndicator count={count} activeIndex={target} onSelect={goTo} />
      </div>
    </div>
  );
}
