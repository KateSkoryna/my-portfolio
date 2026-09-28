// @vitest-environment jsdom
import axe from 'axe-core';
import { cleanup, render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';

import enMessages from '../../../../messages/en.json';
import deMessages from '../../../../messages/de.json';

import { ScratchContent } from './ScratchContent';

/*
 * `@/i18n/navigation`'s `Link`/`useRouter` wrap `next/link` and
 * `next/navigation`, which require a mounted Next.js app-router context this
 * unit test doesn't have. Standing in a plain anchor and no-op router keeps
 * the test about accessibility, not Next's router plumbing — routing itself
 * has no `DESIGN.md` a11y requirements of its own.
 */
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: React.ComponentProps<'a'>) => (
    <a href={String(href)} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => '/_scratch',
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

afterEach(cleanup);

describe.each([
  ['en', enMessages],
  ['de', deMessages],
])('ScratchContent (%s) — DESIGN.md §5 accessibility contract', (locale, messages) => {
  it('has zero axe violations', async () => {
    const { container } = render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ScratchContent />
      </NextIntlClientProvider>,
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
