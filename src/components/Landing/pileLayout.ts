/**
 * Where each pile slot sits — DESIGN.md §4.1. Pure, so the client-side
 * `PileStack` can re-lay the same five books out on every selection.
 */

export const PILE_WIDTH = 380;
/** Per-slot x offset — not a flat step; tuned per slot, not a formula. */
const PILE_X_OFFSETS = [0, 4, 0, 2];
/**
 * Per-slot y offset — tuned per position, but never closer than the book above
 * is thick: which four books make up the pile changes with the selection, so a
 * thick one (My Projects, 36px) can land where the tuned gap was sized for a
 * thin one, and would lie over the book below it.
 */
const PILE_Y_OFFSETS = [0, 45, 72, 104];
/** Air kept between one book's bottom edge and the next book's top. */
const PILE_MIN_GAP = 6;
/** The three lower books all sit this much higher than their spaced positions. */
const PILE_LIFT = 4;
const PILE_ROTATIONS = [-1.4, 0.9, -0.7, 0];

export interface PileSlot {
  x: number;
  y: number;
  rotate: number;
  z: number;
}

/** `thicknesses` are the pile's books, top to bottom. */
export function layoutPile(thicknesses: readonly number[]): PileSlot[] {
  const spaced: number[] = [];
  thicknesses.forEach((_, i) => {
    const clearOfAbove = i === 0 ? 0 : spaced[i - 1] + thicknesses[i - 1] + PILE_MIN_GAP;
    spaced.push(Math.max(PILE_Y_OFFSETS[i], clearOfAbove));
  });
  return spaced.map((y, i) => ({
    x: PILE_X_OFFSETS[i],
    y: i === 0 ? y : y - PILE_LIFT,
    rotate: PILE_ROTATIONS[i],
    z: thicknesses.length - i,
  }));
}
