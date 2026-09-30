'use client';

import type { CSSProperties, ReactNode } from 'react';

import { layoutPile } from './pileLayout';
import styles from './Pile.module.css';

export interface PileBookData {
  id: string;
  thickness: number;
  /** The server-rendered `PileBook`. */
  node: ReactNode;
}

/**
 * The pile: the four books that are not floating, top to bottom, in the
 * stack's own cyclic order — the one after the selection is on top, the one
 * before it at the bottom. Choosing the next book therefore moves every pile
 * book up one place and puts the book that was floating at the bottom.
 *
 * All five books stay mounted, keyed by id, and only their position changes
 * (`Pile.module.css` transitions it) — the selected one is hidden in place
 * under the floating book. `arrivingId` is the book that was just floating:
 * it is flown around the side of the pile into its slot (`pileArc`).
 */
export function PileStack({
  books,
  selectedIndex,
  arrivingId,
}: {
  books: readonly PileBookData[];
  selectedIndex: number;
  arrivingId: string | null;
}) {
  const count = books.length;
  const ordered = Array.from(
    { length: count - 1 },
    (_, k) => books[(selectedIndex + 1 + k) % count],
  );
  const slots = layoutPile(ordered.map((book) => book.thickness));

  return (
    <div className={styles.wrap}>
      <ul role="list" className={styles.pile}>
        {books.map((book, index) => {
          const selected = index === selectedIndex;
          const slotIndex = ordered.indexOf(book);
          // The floating book's own place is the top slot, where it sits hidden.
          const slot = slots[selected ? 0 : slotIndex];
          const style = {
            '--pile-x': `${slot.x}px`,
            '--pile-y': `${slot.y}px`,
            '--pile-rotate': `${slot.rotate}deg`,
            '--pile-z': selected ? 0 : slot.z,
            /* Intro stagger: the bottom book drops first. */
            '--pile-i': selected ? 0 : slots.length - 1 - slotIndex,
          } as CSSProperties;

          return (
            <li
              key={book.id}
              className={styles.slot}
              style={style}
              data-selected={selected}
              data-arriving={book.id === arrivingId && !selected}
              inert={selected}
            >
              {book.node}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
