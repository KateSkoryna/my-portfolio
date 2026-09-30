import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

import styles from './PageHeader.module.css';

/**
 * The same flat outlined pill as the back and forward links (`HeaderLink`), for
 * a control that opens something in place instead of going to a URL — a real
 * `<button>`. In its own file, without the header's server-side parts, so a
 * client component can use it.
 */
export function HeaderButton({
  children,
  glyph,
  ref,
  ...rest
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'type'> & {
  children: ReactNode;
  /** A decorative arrow after the label, like the links' `←` / `→`. */
  glyph?: string;
  ref?: Ref<HTMLButtonElement>;
}) {
  return (
    <button ref={ref} type="button" className={styles.link} {...rest}>
      {children} {glyph && <span aria-hidden="true">{glyph}</span>}
    </button>
  );
}
