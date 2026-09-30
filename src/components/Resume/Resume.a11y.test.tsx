// @vitest-environment jsdom
import axe from 'axe-core';
import { NextIntlClientProvider } from 'next-intl';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import messages from '../../../messages/en.json';

import { ResumeClosing, ResumeContent } from './ResumePages';
import { PagedBook } from '../PagedBook/PagedBook';

// jsdom does no layout, so the column geometry `PagedBook` measures is
// stubbed: 400px columns, 80px gaps, and text that fills 4 columns.
const COLUMN = 400;
const GAP = 80;
const PAGES = 4;

/** jsdom has no `matchMedia`; `spread` stands in for the ≥ 900px breakpoint. */
function mockViewport(spread: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: spread,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

function renderBook() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <PagedBook
        prevLabel="Previous pages"
        nextLabel="Next pages"
        lang="en"
        closing={<ResumeClosing />}
      >
        <ResumeContent />
      </PagedBook>
    </NextIntlClientProvider>,
  );
}

const prev = () => screen.getByRole('button', { name: 'Previous pages' }) as HTMLButtonElement;
const next = () => screen.getByRole('button', { name: 'Next pages' }) as HTMLButtonElement;

beforeEach(() => {
  mockViewport(true);
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
  // Only the flow gets fake column geometry; testing-library also calls
  // `getComputedStyle` (for role queries) and needs the real thing.
  const realComputedStyle = window.getComputedStyle.bind(window);
  vi.spyOn(window, 'getComputedStyle').mockImplementation((el, pseudo) => {
    const style = realComputedStyle(el, pseudo);
    if (!(el instanceof HTMLElement) || !el.className.includes('flow')) return style;
    return new Proxy(style, {
      get(target, prop) {
        if (prop === 'columnWidth') return `${COLUMN}px`;
        if (prop === 'columnGap') return `${GAP}px`;
        const value = Reflect.get(target, prop);
        return typeof value === 'function' ? value.bind(target) : value;
      },
    });
  });
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(
    (PAGES - 1) * (COLUMN + GAP) + COLUMN,
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Resume — DESIGN.md §4.3 and §5', () => {
  it('has zero axe violations', async () => {
    const { container } = renderBook();
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it('disables the arrows at both ends of the book instead of looping', () => {
    renderBook();
    expect(prev().disabled).toBe(true);
    expect(next().disabled).toBe(false);

    fireEvent.click(next());
    expect(prev().disabled).toBe(false);
    expect(next().disabled).toBe(true);

    // The right arrow key at the last spread does nothing.
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(next().disabled).toBe(true);

    fireEvent.click(prev());
    expect(prev().disabled).toBe(true);
  });

  it('counts spreads on desktop and pages on mobile, one dot each', () => {
    const { container } = renderBook();
    const dots = () => container.querySelectorAll('button[aria-current="true"]').length;
    // Both dot rows are in the DOM (CSS hides one), each with an active dot.
    expect(dots()).toBe(2);
    expect(container.querySelectorAll('button[aria-label^="Go to"]').length).toBe(
      PAGES / 2 + PAGES,
    );
  });

  it('turns pages by swiping on mobile', () => {
    mockViewport(false);
    const { container } = renderBook();
    const book = container.querySelector('div[lang="en"]') as HTMLElement;
    // jsdom has no PointerEvent; React only reads `type` and the coordinates.
    const pointer = (type: string, x: number, y: number) =>
      fireEvent(book, new MouseEvent(type, { bubbles: true, clientX: x, clientY: y }));
    const swipe = (fromX: number, toX: number, dy = 0) => {
      pointer('pointerdown', fromX, 200);
      pointer('pointerup', toX, 200 + dy);
    };

    expect(prev().disabled).toBe(true);
    swipe(300, 100); // left → next page
    expect(prev().disabled).toBe(false);
    swipe(100, 300); // right → back
    expect(prev().disabled).toBe(true);
    swipe(100, 300); // right at the first page: nothing
    expect(prev().disabled).toBe(true);
    swipe(300, 280); // too short: not a swipe
    expect(prev().disabled).toBe(true);
    swipe(300, 100, 200); // mostly vertical: a scroll, not a swipe
    expect(prev().disabled).toBe(true);
    for (let i = 0; i < PAGES + 2; i++) swipe(300, 100);
    expect(next().disabled).toBe(true); // stops at the last page
  });

  it('steps one page at a time on mobile', () => {
    mockViewport(false);
    renderBook();
    for (let i = 0; i < PAGES - 1; i++) fireEvent.click(next());
    expect(next().disabled).toBe(true);
  });
});
