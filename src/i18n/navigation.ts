import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

/**
 * Locale-aware `Link`, `redirect`, `usePathname`, `useRouter`. Use these
 * instead of `next/link` / `next/navigation` in any component that needs to
 * stay on the current locale.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
