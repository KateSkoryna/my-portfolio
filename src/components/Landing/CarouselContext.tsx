'use client';

import { createContext, useContext } from 'react';

/**
 * Lets the server-rendered `Pile` hand each closed book a button that
 * selects it in the client-side `Carousel`, without `Pile` itself becoming a
 * client component (which would pull `ClosedBook` into the bundle).
 */
export const SelectItemContext = createContext<(id: string) => void>(() => {});

/**
 * Mobile-only replacement for the pile's route link — tapping a book brings
 * it to the front instead of navigating; the item's own button does that.
 * An empty overlay: the book art sits beside it, so no interactive content
 * is nested inside the button.
 */
export function PileSelectButton({
  itemId,
  label,
  className,
}: {
  itemId: string;
  label: string;
  className: string;
}) {
  const select = useContext(SelectItemContext);
  return (
    <button type="button" className={className} aria-label={label} onClick={() => select(itemId)} />
  );
}
