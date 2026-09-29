'use client';

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';

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

/** Phones: one page at a time. Must match the 800px breakpoint used across the site. */
const MOBILE_QUERY = '(max-width: 800px)';

/** Horizontal travel, in px, that counts as a swipe rather than a tap. */
const SWIPE_MIN_DISTANCE = 40;

function subscribeMobile(onChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {};
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/** Server and first client render assume desktop, so hydration always matches. */
function useIsMobile() {
  return useSyncExternalStore(
    subscribeMobile,
    () => typeof window.matchMedia === 'function' && window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

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
 * - Phones show one page at a time: a window over the same book, on the right
 *   half of a spread or the left. Nine pages (the cover, then each spread's left
 *   and right, ending on the back cover). Below 1200px there are no arrows —
 *   swipe the book, or use the dots.
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
  const rootRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(0);
  const [target, setTarget] = useState(0);
  const [moving, setMoving] = useState<number | null>(null);
  const mobile = useIsMobile();
  /** Phones: which half of the current spread is showing. */
  const [side, setSide] = useState<'left' | 'right'>('right');
  const sideRef = useRef<'left' | 'right'>('right');
  const mobileRef = useRef(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  // The turning logic runs from event handlers, so it reads refs, not state.
  const flippedRef = useRef(0);
  const targetRef = useRef(0);
  const busyRef = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const count = leaves.length;
  const max = count - 1;

  // Scale the stage to the space there is. The book area is only as tall as the
  // book, so the dots sit right under it (as on the resume, whose book fills its
  // area) and the two are centred together; the height available is what the
  // page leaves once the dots row, the gap and the padding are taken out.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const area = areaRef.current;
    const dots = dotsRef.current;
    if (!root || !area || !dots) return;
    const measure = () => {
      const pages = mobile ? 1 : 2;
      const cs = getComputedStyle(root);
      const chrome =
        (parseFloat(cs.paddingTop) || 0) +
        (parseFloat(cs.paddingBottom) || 0) +
        (parseFloat(cs.rowGap) || 0) +
        dots.offsetHeight;
      const availableHeight = root.clientHeight - chrome;
      const s = Math.min(area.clientWidth / (PAGE_W * pages), availableHeight / PAGE_H, MAX_SCALE);
      setScale(s > 0 ? s : 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(area);
    return () => observer.disconnect();
  }, [mobile]);

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
    // Phones change page instantly, like the resume (one page, no turn to see).
    if (prefersReducedMotion() || mobileRef.current) {
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

  /** Phones: the page shown, 0 … 2 × max (the cover is page 0, on the right). */
  function currentPage() {
    return targetRef.current === 0
      ? 0
      : 2 * targetRef.current - (sideRef.current === 'left' ? 1 : 0);
  }

  /** Phones: show page `p`, turning leaves on the way when the spread changes. */
  function goToPage(p: number) {
    const page = Math.min(Math.max(p, 0), 2 * max);
    sideRef.current = page % 2 === 1 ? 'left' : 'right';
    setSide(sideRef.current);
    goTo(Math.ceil(page / 2));
  }

  function step(dir: number) {
    if (mobileRef.current) goToPage(currentPage() + dir);
    else goTo(targetRef.current + dir);
  }

  // The key listener outlives renders, so it calls whichever `step` is current.
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
    mobileRef.current = mobile;
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
  const page = target === 0 ? 0 : 2 * target - (side === 'left' ? 1 : 0);

  return (
    <div ref={rootRef} className={`${styles.root} ${mobile ? styles.instant : ''}`}>
      <div className={styles.prev}>
        <ArrowButton
          direction="prev"
          label={prevLabel}
          onClick={() => step(-1)}
          disabled={target === 0}
        />
      </div>
      <div
        ref={areaRef}
        className={styles.bookArea}
        style={scale === null ? undefined : { height: PAGE_H * s }}
      >
        <div
          className={`${styles.scaler} ${scale === null ? styles.pending : ''} ${mobile ? styles.scalerClip : ''}`}
          style={{ width: PAGE_W * (mobile ? 1 : 2) * s, height: PAGE_H * s }}
        >
          <div
            className={`${styles.stage} ${mobile ? styles.stageShift : ''}`}
            style={{
              transform: `translateX(${mobile && side === 'right' ? -PAGE_W * s : 0}px) scale(${s})`,
            }}
          >
            <div
              className={styles.book}
              lang={lang}
              onPointerDown={(e) => {
                // A mouse drag is not a swipe.
                if (e.pointerType === 'mouse') return;
                swipeStart.current = { x: e.clientX, y: e.clientY };
                swiped.current = false;
              }}
              onPointerUp={(e) => {
                const start = swipeStart.current;
                swipeStart.current = null;
                if (!start) return;
                const dx = e.clientX - start.x;
                const dy = e.clientY - start.y;
                if (Math.abs(dx) >= SWIPE_MIN_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
                  swiped.current = true;
                  step(dx < 0 ? 1 : -1);
                }
              }}
              onPointerCancel={() => {
                swipeStart.current = null;
              }}
              onClick={(e) => {
                // A swipe also clicks on release — swallow that one.
                if (swiped.current) {
                  swiped.current = false;
                  return;
                }
                // Phones turn by swipe and dots only.
                if (mobile) return;
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
                      inert={(i !== flipped && moving !== i) || (mobile && side === 'left')}
                    >
                      {leaf.front}
                    </div>
                    <div
                      className={`${styles.face} ${styles.back}`}
                      inert={(i !== flipped - 1 && moving !== i) || (mobile && side === 'right')}
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
      <div ref={dotsRef} className={styles.navDots}>
        {mobile ? (
          <DotIndicator count={2 * max + 1} activeIndex={page} onSelect={goToPage} />
        ) : (
          <DotIndicator count={count} activeIndex={target} onSelect={goTo} />
        )}
      </div>
    </div>
  );
}
