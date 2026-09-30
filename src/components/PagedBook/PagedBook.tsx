'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import { ArrowButton } from '@/components/ArrowButton/ArrowButton';
import { DotIndicator } from '@/components/DotIndicator/DotIndicator';
import { motion } from '@/lib/design/tokens';

// The book's mechanics (frame, columns, leaf, arrows, dots) live in the resume's
// stylesheet, next to the CV styles they grew up with; `/journal` shares them.
import styles from '../Resume/Resume.module.css';

/** Must match the `@media (min-width: 900px)` breakpoint in `../Resume/Resume.module.css`. */
const SPREAD_QUERY = '(min-width: 900px)';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(SPREAD_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/** Server and first client render assume mobile, so hydration always matches. */
function useIsSpread() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(SPREAD_QUERY).matches,
    () => false,
  );
}

/** Horizontal travel, in px, that counts as a swipe rather than a tap. */
const SWIPE_MIN_DISTANCE = 40;

/** A turn in flight: the left-hand page index before and after. */
interface Turn {
  dir: 'next' | 'prev';
  from: number;
  to: number;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * One page's worth of the flow, drawn on its own — a face of the turning leaf
 * or the old page left standing under it. Decorative (the real text is in the
 * main flow), so it is hidden from assistive tech and inert, and its copies of
 * the headings' `id`s are dropped to keep ids unique.
 */
function PageClone({
  index,
  blank,
  pitch,
  side,
  back,
  children,
}: {
  index: number;
  /** Past the last real page (the empty right page of the last spread). */
  blank: boolean;
  pitch: number;
  side: 'left' | 'right';
  back?: boolean;
  children: ReactNode;
}) {
  const flowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const flow = flowRef.current;
    if (!flow) return;
    flow.scrollLeft = index * pitch;
    flow.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
  }, [index, pitch]);

  return (
    <div
      className={`${styles.clone} ${side === 'left' ? styles.pageLeft : styles.pageRight} ${back ? styles.faceBack : ''}`}
      aria-hidden="true"
      inert
    >
      <div className={styles.viewport}>
        <div ref={flowRef} className={`${styles.flow} ${styles.cloneFlow}`}>
          {blank ? null : children}
        </div>
      </div>
      {blank ? null : (
        <span className={side === 'left' ? styles.pageNumLeft : styles.pageNumRight}>
          {index + 1}
        </span>
      )}
    </div>
  );
}

/**
 * DESIGN.md §4.3 — the opened book, for `/resume` and `/journal`. The book is a
 * fixed-size frame; `children` is the whole text (the CV, or one journal entry) as one flow that CSS lays out in columns, one per page, each
 * exactly a page tall (see `Resume.module.css`). Text therefore runs on from
 * one page to the next and nothing scrolls inside a page. Turning the page
 * scrolls the flow by whole columns — no transforms, so reduced-motion needs
 * no special case.
 *
 * How many pages there are is measured, not declared: it is however many
 * columns the text needs at this size. Desktop shows two at a time (a
 * spread), mobile one. A book does not loop — the arrows disable at the first
 * and last spread / page.
 *
 * All the text stays in the DOM (the off-screen columns are just clipped), so
 * screen readers read the whole CV; if focus moves into a clipped column the
 * browser scrolls it into view and the scroll handler catches the page up.
 */
export function PagedBook({
  children,
  closing,
  binding = 'hinge',
  prevLabel,
  nextLabel,
  lang,
}: {
  children: ReactNode;
  /** The last leaf, if any. Always starts on a right-hand page — see `spacer`. */
  closing?: ReactNode;
  /** `hinge` is the resume's spine shadow; `spiral` the notebook's coils, ruled pages. */
  binding?: 'hinge' | 'spiral';
  prevLabel: string;
  nextLabel: string;
  /** Language of the CV text, for the `lang` attribute on the book. */
  lang: string;
}) {
  const flowRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pitch, setPitch] = useState(0);
  // On desktop an odd number of pages would leave the last spread half empty,
  // and the flow cannot scroll far enough to show a lone last page on the left
  // (it clamps at its scroll width). So an empty trailing column is added to
  // make the count even — that is the blank right-hand page of the last spread.
  const [filler, setFiller] = useState(false);
  const [turn, setTurn] = useState<Turn | null>(null);
  const fillerRef = useRef(false);
  // The closing leaf must open on the right-hand page of a spread. If the CV
  // text runs so that it would land on a left page, one blank page goes in
  // front of it. The text's length changes with language and window size, so
  // this is measured rather than fixed.
  const [spacer, setSpacer] = useState(false);
  const spacerRef = useRef(false);
  const isSpread = useIsSpread();

  // Measure the columns: `pitch` is one page's width (column + gap), and the
  // page count is how many of them the flow's scroll width holds.
  const measure = useCallback(() => {
    const flow = flowRef.current;
    if (!flow) return;
    const cs = getComputedStyle(flow);
    const column = parseFloat(cs.columnWidth);
    const gap = parseFloat(cs.columnGap);
    if (!(column > 0) || !(gap >= 0)) return;
    const step = column + gap;
    setPitch(step);
    const total = Math.max(1, Math.round((flow.scrollWidth + gap) / step));
    const real = fillerRef.current ? total - 1 : total;
    setPageCount(Math.max(1, real));
    // Which page would the closing leaf start on without the spacer?
    const closingEl = flow.querySelector<HTMLElement>('[data-closing]');
    if (closingEl) {
      const column = Math.round(closingEl.offsetLeft / step);
      const natural = Math.max(0, spacerRef.current ? column - 1 : column);
      const wantsSpacer = isSpread && natural % 2 === 0;
      spacerRef.current = wantsSpacer;
      setSpacer(wantsSpacer);
    }
    const wantsFiller = isSpread && real % 2 === 1;
    fillerRef.current = wantsFiller;
    setFiller(wantsFiller);
  }, [isSpread]);

  useLayoutEffect(() => {
    measure();
    const flow = flowRef.current;
    if (!flow) return;
    const observer = new ResizeObserver(measure);
    observer.observe(flow);
    // Web fonts change line breaks, and so page breaks, without resizing anything.
    void document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [measure, filler, spacer]);

  // The CV, then the closing leaf (with a blank page ahead of it if needed).
  const body = (
    <>
      {children}
      {spacer && <div className={styles.filler} />}
      {closing}
    </>
  );

  const perView = isSpread ? 2 : 1;
  const lastView = Math.ceil(pageCount / perView) - 1;
  const view = Math.min(Math.floor(page / perView), lastView);
  const spread = Math.floor(page / 2);
  const spreadCount = Math.ceil(pageCount / 2);

  /**
   * Move to the view whose left-hand page is `nextPage`. On desktop that
   * plays a page turn: a leaf turns about the spine while the flow underneath
   * has already moved to the new spread. Skipped for reduced motion, on
   * mobile (single page) and while another turn is still running.
   */
  const goTo = useCallback(
    (nextPage: number) => {
      if (turn) return;
      const from = view * perView;
      if (nextPage === from) return;
      if (isSpread && pitch && !prefersReducedMotion()) {
        setTurn({ dir: nextPage > from ? 'next' : 'prev', from, to: nextPage });
      }
      setPage(nextPage);
    },
    [turn, view, perView, isSpread, pitch],
  );

  const goToView = useCallback(
    (next: number) => goTo(Math.min(Math.max(next, 0), lastView) * perView),
    [goTo, lastView, perView],
  );

  // Backstop in case `animationend` never fires (tab hidden, animation cut).
  useEffect(() => {
    if (!turn) return;
    const id = window.setTimeout(() => setTurn(null), motion.pageTurn * 2);
    return () => window.clearTimeout(id);
  }, [turn]);

  // Keep the flow's scroll position on the current view.
  useEffect(() => {
    const flow = flowRef.current;
    if (!flow || !pitch) return;
    const left = view * perView * pitch;
    if (Math.abs(flow.scrollLeft - left) > 1) flow.scrollLeft = left;
  }, [view, perView, pitch, pageCount]);

  const atStart = view === 0;
  const atEnd = view === lastView;

  // No arrow buttons on phones and tablets: swipe the book left for the next
  // page (or spread), right for the previous. The dots stay as the
  // non-gesture way to move; the arrows only appear on wide desktops.
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight' && !atEnd) goToView(view + 1);
      if (event.key === 'ArrowLeft' && !atStart) goToView(view - 1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goToView, view, atStart, atEnd]);

  return (
    <div className={styles.stage} data-binding={binding}>
      <div className={styles.prev}>
        <ArrowButton
          direction="prev"
          label={prevLabel}
          onClick={() => goToView(view - 1)}
          disabled={atStart}
        />
      </div>
      <div
        className={styles.book}
        data-binding={binding}
        lang={lang}
        onPointerDown={(event) => {
          // A mouse drag is a text selection, not a swipe.
          if (event.pointerType === 'mouse') return;
          swipeStart.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = swipeStart.current;
          swipeStart.current = null;
          if (!start) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) < SWIPE_MIN_DISTANCE || Math.abs(dx) <= Math.abs(dy) * 1.5) return;
          if (dx < 0 && !atEnd) goToView(view + 1);
          if (dx > 0 && !atStart) goToView(view - 1);
        }}
        onPointerCancel={() => {
          swipeStart.current = null;
        }}
      >
        {binding === 'spiral' && (
          <>
            <div className={styles.holes} aria-hidden="true" />
            <div className={styles.spiral} aria-hidden="true" />
          </>
        )}
        <div className={styles.frames} aria-hidden="true">
          <div className={`${styles.frame} ${styles.frameLeft}`} />
          <div className={`${styles.frame} ${styles.frameRight}`} />
        </div>
        <div className={styles.pageNums} aria-hidden="true">
          {isSpread && <span className={styles.pageNumLeft}>{view * 2 + 1}</span>}
          {(!isSpread || view * 2 + 2 <= pageCount) && (
            <span className={styles.pageNumRight}>{isSpread ? view * 2 + 2 : page + 1}</span>
          )}
        </div>
        <div className={styles.viewport}>
          <div
            ref={flowRef}
            className={styles.flow}
            onScroll={(e) => {
              // Focus or find-in-page pulled another column into view.
              if (pitch) setPage(Math.round(e.currentTarget.scrollLeft / pitch));
            }}
          >
            {body}
            {filler && <div className={styles.filler} />}
          </div>
        </div>
        {turn && isSpread && (
          <>
            {/* The page the leaf is leaving behind stays up until it lands. */}
            <div
              className={`${styles.half} ${turn.dir === 'next' ? styles.halfLeft : styles.halfRight}`}
            >
              <PageClone
                index={turn.dir === 'next' ? turn.from : turn.from + 1}
                blank={(turn.dir === 'next' ? turn.from : turn.from + 1) >= pageCount}
                pitch={pitch}
                side={turn.dir === 'next' ? 'left' : 'right'}
              >
                {body}
              </PageClone>
            </div>
            <div
              className={`${styles.leaf} ${turn.dir === 'next' ? styles.leafNext : styles.leafPrev}`}
              onAnimationEnd={() => setTurn(null)}
            >
              {/* Front: the page being lifted. Back: the page it lands as. */}
              <PageClone
                index={turn.dir === 'next' ? turn.from + 1 : turn.from}
                blank={(turn.dir === 'next' ? turn.from + 1 : turn.from) >= pageCount}
                pitch={pitch}
                side={turn.dir === 'next' ? 'right' : 'left'}
              >
                {body}
              </PageClone>
              <PageClone
                index={turn.dir === 'next' ? turn.to : turn.to + 1}
                blank={(turn.dir === 'next' ? turn.to : turn.to + 1) >= pageCount}
                pitch={pitch}
                side={turn.dir === 'next' ? 'left' : 'right'}
                back
              >
                {body}
              </PageClone>
            </div>
          </>
        )}
      </div>
      <div className={styles.next}>
        <ArrowButton
          direction="next"
          label={nextLabel}
          onClick={() => goToView(view + 1)}
          disabled={atEnd}
        />
      </div>
      <div className={styles.dots}>
        <div className={styles.dotsSpread}>
          <DotIndicator count={spreadCount} activeIndex={spread} onSelect={(i) => goTo(i * 2)} />
        </div>
        <div className={styles.dotsPage}>
          <DotIndicator count={pageCount} activeIndex={page} onSelect={goTo} />
        </div>
      </div>
    </div>
  );
}
