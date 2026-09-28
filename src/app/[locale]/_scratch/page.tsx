import { ScratchContent } from './ScratchContent';

/**
 * Not linked from anywhere (DESIGN.md/BUILD.md Phase 1). Exists purely so
 * every primitive can be checked against `tokens.ts` in one place, and so
 * `test:a11y` has a real route to scan instead of a stub — see
 * `ScratchContent.a11y.test.tsx`.
 *
 * No `setRequestLocale` — `next/root-params` (via `i18n/request.ts`) is
 * what makes this render statically per locale now; next-intl's own
 * request-locale cache is deprecated as of 4.14.
 */
export default function ScratchRoute() {
  return <ScratchContent />;
}
