import { PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';
import { Landing } from '@/components/Landing/Landing';

/**
 * The stack — DESIGN.md §4.1. One item floats, four sit in the pile below.
 * `/` has no "back" and no route label, so the header's second row is
 * skipped here (`PageHeader`'s `showBackRow`).
 *
 * No `setRequestLocale` — `next/root-params` (via `i18n/request.ts`) is
 * what makes this render statically per locale now; next-intl's own
 * request-locale cache is deprecated as of 4.14.
 */
export default function Home() {
  return (
    <>
      <PageHeader showBackRow={false} />
      <Landing />
      <PageFooter />
    </>
  );
}
