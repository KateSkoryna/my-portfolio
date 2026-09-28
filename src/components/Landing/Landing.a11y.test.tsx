// @vitest-environment jsdom
import axe from 'axe-core';
import { cleanup, render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { itemsBase, type PortfolioItem } from '@/content/items';

import enMessages from '../../../messages/en.json';
import deMessages from '../../../messages/de.json';

import { Carousel } from './Carousel';
import { FloatingItem } from './FloatingItem';
import { Pile } from './Pile';
import { DescriptionPanel } from './DescriptionPanel';

/*
 * Same stand-in as `ScratchContent.a11y.test.tsx` — `@/i18n/navigation`'s
 * `Link`/`useRouter` need a mounted Next.js app-router context this unit
 * test doesn't have, and routing itself has no DESIGN.md a11y requirement.
 */
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: React.ComponentProps<'a'>) => (
    <a href={String(href)} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

afterEach(cleanup);

/**
 * Mirrors `Landing`'s own slide-building — `FloatingItem`/`Pile`/
 * `DescriptionPanel` are plain functions (not Server Components calling
 * `next-intl/server`, which needs a Next.js request context this test
 * doesn't have), so they're exercised directly against each locale's own
 * JSON rather than through `localizeItems`' translator interface.
 */
type Messages = typeof enMessages;

function buildItems(messages: Messages): readonly PortfolioItem[] {
  return itemsBase.map((base) => ({
    ...base,
    ...messages.items[base.id as keyof Messages['items']],
  }));
}

function buildSlides(items: readonly PortfolioItem[], descriptionLabel: string) {
  return items.map((item, i) => ({
    floating: <FloatingItem item={item} />,
    pile: <Pile items={items.filter((_, j) => j !== i)} />,
    description: <DescriptionPanel item={item} descriptionLabel={descriptionLabel} />,
  }));
}

describe.each([
  ['en', enMessages],
  ['de', deMessages],
])('Carousel (%s) — DESIGN.md §5 accessibility contract', (locale, messages) => {
  it('has zero axe violations', async () => {
    const items = buildItems(messages);
    const { container } = render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Carousel
          slides={buildSlides(items, messages.landing.descriptionLabel)}
          prevLabel={messages.landing.prevItem}
          nextLabel={messages.landing.nextItem}
          defaultIndex={0}
          goToShelfLabel={messages.landing.goToShelf}
          pileNote={messages.landing.pileNote}
          pileNoteCaption={messages.landing.pileNoteCaption}
        />
      </NextIntlClientProvider>,
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
