import styles from './ArrowButton.module.css';

type Direction = 'prev' | 'next';

/**
 * Circular 56px arrow (DESIGN.md §4.1/§4.3). The drawn circle is 56px but
 * `.hitArea` still guarantees the 44px a11y minimum around it via padding —
 * here the drawn size already clears the minimum, so the hit area matches.
 * A real `<button>`, disables at the ends where the surface isn't a loop
 * (DESIGN.md §4.3) via the ordinary `disabled` attribute.
 */
export function ArrowButton({
  direction,
  label,
  onClick,
  disabled,
}: {
  direction: Direction;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={styles.arrow}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        {direction === 'prev' ? (
          <path
            d="M12.5 4L6.5 10L12.5 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M7.5 4L13.5 10L7.5 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
