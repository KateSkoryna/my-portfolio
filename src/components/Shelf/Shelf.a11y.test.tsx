// @vitest-environment jsdom
import axe from 'axe-core';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { itemsBase, type PortfolioItem } from '@/content/items';
import { BookCover } from '@/components/BookCover/BookCover';
import { ClosedBook } from '@/components/ClosedBook/ClosedBook';

import enMessages from '../../../messages/en.json';
import deMessages from '../../../messages/de.json';

import { Shelf, type ShelfSlide } from './Shelf';
import styles from './Shelf.module.css';

/*
 * Same stand-in as `Landing.a11y.test.tsx` — `@/i18n/navigation`'s `Link`
 * needs a mounted Next.js app-router context this unit test doesn't have.
 */
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: React.ComponentProps<'a'>) => (
    <a href={String(href)} {...rest}>
      {children}
    </a>
  ),
}));

afterEach(cleanup);

type Messages = typeof enMessages;
const COVER_WIDTH = 216;

function buildItems(messages: Messages): readonly PortfolioItem[] {
  return itemsBase.map((base) => ({
    ...base,
    ...messages.items[base.id as keyof Messages['items']],
  }));
}

/** Mirrors `page.tsx`'s own slide-building — see the note on `Shelf`. */
function buildSlides(messages: Messages): readonly ShelfSlide[] {
  return buildItems(messages).map((item) => {
    const caption = (
      <div className={styles.caption}>
        <p className={styles.captionTitle}>{item.title}</p>
        <p className={styles.captionBlurb}>{item.shortBlurb}</p>
      </div>
    );

    return {
      id: item.id,
      route: item.route,
      title: item.title,
      cover: (
        <>
          <BookCover item={item} size="shelf" />
          {caption}
        </>
      ),
      coverSelected: (
        <>
          <BookCover item={item} size="shelf" selected />
          {caption}
        </>
      ),
      closed: <ClosedBook item={item} width={COVER_WIDTH} />,
      closedSelected: <ClosedBook item={item} width={COVER_WIDTH} selected />,
    };
  });
}

describe.each([
  ['en', enMessages],
  // DE lacks namespaces Kateryna hasn't translated yet; the app falls back to EN per key.
  ['de', deMessages as typeof enMessages],
])('Shelf (%s) — DESIGN.md §5 accessibility contract', (locale, messages) => {
  it('has zero axe violations', async () => {
    const { container } = render(
      <Shelf
        slides={buildSlides(messages)}
        prevLabel={messages.shelf.prevItem}
        nextLabel={messages.shelf.nextItem}
      />,
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
