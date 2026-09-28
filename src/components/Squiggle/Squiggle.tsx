/**
 * Hand-drawn underline. Decoration only — the text it sits under already
 * carries the meaning, so it is `aria-hidden`. DESIGN.md §5.4: never let
 * this carry unique information.
 */
export function Squiggle({
  width = 64,
  color = 'var(--color-coral)',
}: {
  width?: number;
  color?: string;
}) {
  const height = Math.round(width * 0.12);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 8"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1 5.5C6 2 11 1 16 3.5C21 6 26 6.5 31 4C36 1.5 41 1 46 3.5C51 6 56 6.5 61 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
