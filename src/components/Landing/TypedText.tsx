import type { CSSProperties } from 'react';

import shared from '@/styles/shared.module.css';

import styles from './Carousel.module.css';

/**
 * Text that is typed out a character at a time (`Carousel.module.css`,
 * `.char`). Each character is its own span with its index in `--i`; words stay
 * whole (`.word`) so wrapping is the same as plain text. The characters are
 * `aria-hidden` and the real text follows as one visually hidden run, so a
 * screen reader reads a sentence, not letters.
 *
 * Two uses: on a book change the description types itself (no props — the
 * timing comes from the description's own CSS), and at the start of a session
 * the identity block and the pile note do (`intro`, with `start` — when the
 * first character appears — and `step` — time per character — as CSS times).
 * `startIndex` continues the count from an earlier run of text in the same
 * line, so two pieces type one after the other.
 */
export function TypedText({
  text,
  intro = false,
  start,
  step,
  startIndex = 0,
}: {
  text: string;
  intro?: boolean;
  start?: string;
  step?: string;
  startIndex?: number;
}) {
  let index = startIndex;
  const style = { '--type-start': start, '--type-step': step } as CSSProperties;
  return (
    <>
      <span className={shared.visuallyHidden}>{text}</span>
      <span
        aria-hidden="true"
        className={styles.typed}
        data-type={intro ? 'intro' : undefined}
        style={style}
      >
        {text.split(' ').map((word, w) => (
          <span key={w}>
            {w > 0 && ' '}
            <span className={styles.word}>
              {Array.from(word).map((char) => (
                <span
                  key={index}
                  className={styles.char}
                  style={{ '--i': index++ } as CSSProperties}
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
