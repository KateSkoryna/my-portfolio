'use client';

import { useTranslations } from 'next-intl';

import styles from './DotIndicator.module.css';

/**
 * DESIGN.md §4.3 — dots only, no counter text. Active dot widens to coral
 * and carries `aria-current` so a screen-reader user still gets a position
 * cue even with the text label removed. Each dot is a `<button>` with its
 * own `aria-label` and a 44px hit area via padding, not a resized dot.
 */
export function DotIndicator({
  count,
  activeIndex,
  onSelect,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const t = useTranslations('dots');

  return (
    <div className={styles.row} role="group">
      {Array.from({ length: count }, (_, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={i}
            type="button"
            className={styles.hit}
            aria-label={t('goTo', { n: i + 1 })}
            aria-current={active ? 'true' : undefined}
            onClick={() => onSelect(i)}
          >
            <span className={`${styles.dot} ${active ? styles.active : ''}`} />
          </button>
        );
      })}
    </div>
  );
}
