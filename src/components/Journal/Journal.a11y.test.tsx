// @vitest-environment jsdom
import axe from 'axe-core';
import { NextIntlClientProvider } from 'next-intl';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import enMessages from '../../../messages/en.json';
import deMessages from '../../../messages/de.json';
import { PagedBook } from '../PagedBook/PagedBook';

import { JournalEntry } from './JournalEntry';
import { PostMenu, type PostLink } from './PostMenu';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: React.ComponentProps<'a'>) => (
    <a href={String(href)} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => '/journal/middle',
}));

beforeEach(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(cleanup);

const posts: PostLink[] = [
  { slug: 'newest', title: '[NEWEST]', date: '2026-09-01' },
  { slug: 'middle', title: '[MIDDLE]', date: '2026-03-15' },
  { slug: 'oldest', title: '[OLDEST]', date: '2025-12-01' },
];

const entry = {
  slug: 'middle',
  title: '[MIDDLE]',
  date: '2026-03-15',
  category: 'mylearning' as const,
  excerpt: '[One line.]',
  tags: ['[A]', '[B]'],
  related: [
    { kind: 'post' as const, slug: 'other', title: '[OTHER POST]' },
    { kind: 'handbook' as const },
  ],
};

function withIntl(locale: 'en' | 'de', node: React.ReactNode) {
  return (
    <NextIntlClientProvider locale={locale} messages={locale === 'en' ? enMessages : deMessages}>
      {node}
    </NextIntlClientProvider>
  );
}

const violations = async (container: HTMLElement) =>
  (await axe.run(container, { rules: { 'color-contrast': { enabled: false } } })).violations.map(
    (v) => `${v.id}: ${v.help}`,
  );

describe.each([['en' as const], ['de' as const]])('Journal — DESIGN.md §4.3b (%s)', (locale) => {
  it('has no axe violations with the menu closed and open, and on an entry in the book', async () => {
    const menu = render(withIntl(locale, <PostMenu posts={posts} current="middle" />));
    expect(await violations(menu.container)).toEqual([]);
    fireEvent.click(screen.getByRole('button', { expanded: false }));
    expect(await violations(menu.container)).toEqual([]);
    menu.unmount();

    const book = render(
      withIntl(
        locale,
        <PagedBook binding="spiral" prevLabel="Prev" nextLabel="Next" lang={locale}>
          <JournalEntry entry={entry}>
            <p>[BODY]</p>
          </JournalEntry>
        </PagedBook>,
      ),
    );
    expect(await violations(book.container)).toEqual([]);
  });
});

describe('PostMenu', () => {
  it('opens a panel of real links grouped by year, newest first, the open post marked', () => {
    render(withIntl('en', <PostMenu posts={posts} current="middle" />));
    const button = screen.getByRole('button', { name: /All posts/ });
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('link')).toBeNull();

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      '2026',
      '2025',
    ]);
    const links = screen.getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href')?.split('/').pop())).toEqual([
      'newest',
      'middle',
      'oldest',
    ]);
    expect(links.filter((a) => a.getAttribute('aria-current') === 'page').length).toBe(1);
    expect(links[1].getAttribute('aria-current')).toBe('page');
  });

  it('closes on Escape, on a click outside, and on choosing a post', () => {
    render(withIntl('en', <PostMenu posts={posts} current="middle" />));
    const button = screen.getByRole('button', { name: /All posts/ });
    const isOpen = () => button.getAttribute('aria-expanded') === 'true';

    fireEvent.click(button);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(button);

    fireEvent.click(button);
    fireEvent.pointerDown(document.body);
    expect(isOpen()).toBe(false);

    fireEvent.click(button);
    fireEvent.click(screen.getAllByRole('link')[0]);
    expect(isOpen()).toBe(false);
  });

  it('lists 100 posts without changing the closed menu', () => {
    const many: PostLink[] = Array.from({ length: 100 }, (_, i) => ({
      slug: `post-${i}`,
      title: `[POST ${i}]`,
      date: `${2020 + (i % 6)}-01-${String((i % 28) + 1).padStart(2, '0')}`,
    }));
    render(withIntl('en', <PostMenu posts={many} />));
    fireEvent.click(screen.getByRole('button', { name: /All posts/ }));
    expect(screen.getAllByRole('link').length).toBe(100);
  });
});

describe('PagedBook with a spiral binding', () => {
  function renderBook(binding?: 'spiral') {
    return render(
      withIntl(
        'en',
        <PagedBook binding={binding} prevLabel="Prev" nextLabel="Next" lang="en">
          <p>[BODY]</p>
        </PagedBook>,
      ),
    );
  }

  it('draws the coils and holes, hidden from assistive tech, only when asked', () => {
    const { container, unmount } = renderBook('spiral');
    const book = container.querySelector('[data-binding="spiral"]') as HTMLElement;
    expect(book.querySelectorAll('[aria-hidden="true"][class*="spiral"]').length).toBe(1);
    expect(book.querySelectorAll('[aria-hidden="true"][class*="holes"]').length).toBe(1);
    unmount();

    const plain = renderBook().container;
    expect(plain.querySelector('[class*="spiral"]')).toBeNull();
  });

  it('works without a closing leaf, and disables the arrows on a one-page text', () => {
    renderBook('spiral');
    expect((screen.getByRole('button', { name: 'Prev' }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: 'Next' }) as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('JournalEntry', () => {
  it('makes the entry title the page heading, with its date and tags', () => {
    render(
      withIntl(
        'en',
        <JournalEntry entry={entry}>
          <p>[BODY]</p>
        </JournalEntry>,
      ),
    );
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('[MIDDLE]');
    expect(screen.getByText('15 March 2026').getAttribute('datetime')).toBe('2026-03-15');
    expect(
      within(screen.getAllByRole('list')[0])
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    ).toEqual(['#[A]', '#[B]']);
  });

  it('shows tags as hashtags with no spaces', () => {
    render(
      withIntl(
        'en',
        <JournalEntry entry={{ ...entry, tags: ['Developer vocabulary', 'a11y'] }}>
          <p>[BODY]</p>
        </JournalEntry>,
      ),
    );
    expect(
      within(screen.getAllByRole('list')[0])
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    ).toEqual(['#DeveloperVocabulary', '#a11y']);
  });

  it('ends with a handwritten invitation and LinkedIn and Gmail buttons, and no share button', () => {
    render(
      withIntl(
        'en',
        <JournalEntry entry={entry}>
          <p>[BODY]</p>
        </JournalEntry>,
      ),
    );
    expect(screen.getByText('Got a thought about this? Write me!')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'LinkedIn' }).getAttribute('href')).toMatch(
      /linkedin\.com/,
    );
    expect(screen.getByRole('link', { name: 'Gmail' }).getAttribute('href')).toMatch(/^mailto:/);
    expect(screen.queryByRole('button', { name: /share/i })).toBeNull();
  });

  it.each([
    ['en', 'Kind regards, Katja'],
    ['de', 'Liebe Grüße, Katja'],
  ] as const)('signs off on its own line, with a heart (%s)', (locale, text) => {
    const { container } = render(
      withIntl(
        locale,
        <JournalEntry entry={entry}>
          <p>[BODY]</p>
        </JournalEntry>,
      ),
    );
    const signoff = screen.getByText(text);
    expect(signoff.querySelector('svg[aria-hidden="true"]')).toBeTruthy();
    expect(
      container.querySelectorAll('svg[aria-hidden="true"] path[stroke="currentColor"]').length,
    ).toBe(1);
  });

  it.each([
    ['en', 'If you found this interesting, have a look at', 'Prompting Handbook'],
    ['de', 'Wenn dich das interessiert hat, schau dir auch das an', 'Prompting-Handbuch'],
  ] as const)(
    'ends with a pointer to another post and to the handbook (%s)',
    (locale, label, handbook) => {
      render(
        withIntl(
          locale,
          <JournalEntry entry={entry}>
            <p>[BODY]</p>
          </JournalEntry>,
        ),
      );
      expect(screen.getByRole('heading', { level: 2, name: label })).toBeTruthy();
      const post = screen.getByRole('link', { name: /\[OTHER POST\]/ });
      expect(post.getAttribute('href')).toBe('/journal/other');
      expect(screen.getByRole('link', { name: new RegExp(handbook) }).getAttribute('href')).toBe(
        '/handbook',
      );
    },
  );
});
