'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';

import { ArrowButton } from '@/components/ArrowButton/ArrowButton';
import { DotIndicator } from '@/components/DotIndicator/DotIndicator';
import { MarginNote } from '@/components/MarginNote/MarginNote';
import { Link } from '@/i18n/navigation';

import styles from './Carousel.module.css';

interface Slide {
  floating: ReactNode;
  pile: ReactNode;
  description: ReactNode;
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
}: {
  slides: readonly Slide[];
  prevLabel: string;
  nextLabel: string;
  defaultIndex: number;
  goToShelfLabel: string;
  pileNote: string;
  pileNoteCaption: string;
}) {
  const [index, setIndex] = useState(defaultIndex);

  const advance = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + slides.length) % slides.length);
    },
    [slides.length],
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
    <>
      <div className={styles.stage}>
        <ArrowButton direction="prev" label={prevLabel} onClick={() => advance(-1)} />
        <div className={styles.stack}>
          <div key={`floating-${index}`}>{slide.floating}</div>
          <div className={styles.suspensionShadow} aria-hidden="true" />
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
            <DotIndicator count={slides.length} activeIndex={index} onSelect={setIndex} />
          </div>
        </div>
        <ArrowButton direction="next" label={nextLabel} onClick={() => advance(1)} />
      </div>

      {slide.description}
    </>
  );
}
