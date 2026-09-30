import type { ReactNode } from 'react';

import styles from './SocialLink.module.css';

const ICONS = {
  github: {
    viewBox: '0 0 16 16',
    d: 'M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.3c-2.23.48-2.7-1.08-2.7-1.08-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.23 1.87.87 2.33.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.52.56.83 1.28.83 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z',
  },
  linkedin: {
    viewBox: '0 0 24 24',
    d: 'M3.2 8.4h4.1V21H3.2V8.4zm2.05-6.3a2.38 2.38 0 1 1 0 4.76 2.38 2.38 0 0 1 0-4.76zM9.75 8.4h3.93v1.72h.06c.55-1.04 1.88-2.14 3.87-2.14 4.14 0 4.91 2.73 4.91 6.28V21h-4.1v-5.98c0-1.43-.03-3.26-1.99-3.26-1.99 0-2.3 1.55-2.3 3.16V21H9.75V8.4z',
  },
  email: {
    viewBox: '0 0 16 16',
    d: 'M1.6 3.6A1.6 1.6 0 0 1 3.2 2h9.6a1.6 1.6 0 0 1 1.6 1.6v8.8a1.6 1.6 0 0 1-1.6 1.6H3.2a1.6 1.6 0 0 1-1.6-1.6V3.6Zm1.72.2 4.86 3.65a.6.6 0 0 0 .72 0l4.86-3.65a.4.4 0 0 0-.24-.72H3.56a.4.4 0 0 0-.24.72Z',
  },
} as const;

/**
 * The outlined pill with a small icon — GitHub, LinkedIn or email — used in the
 * landing page's identity block and at the end of a journal post. A real
 * `<a href>`. `className` lets a layout adjust its size, as the landing does on
 * phones.
 */
export function SocialLink({
  kind,
  href,
  className,
  children,
}: {
  kind: keyof typeof ICONS;
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const icon = ICONS[kind];
  return (
    <a href={href} className={`${styles.link} ${className ?? ''}`}>
      <svg className={styles.icon} viewBox={icon.viewBox} aria-hidden="true">
        <path fill="currentColor" d={icon.d} />
      </svg>
      {children}
    </a>
  );
}
