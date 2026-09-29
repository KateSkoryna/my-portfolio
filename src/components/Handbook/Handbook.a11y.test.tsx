// @vitest-environment jsdom
import axe from 'axe-core';
import { NextIntlClientProvider } from 'next-intl';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import messages from '../../../messages/en.json';

import { handbookLeaves } from './HandbookFaces';
import { HandbookBook } from './HandbookBook';

// jsdom has no layout, `matchMedia` or `ResizeObserver`. Reduced motion is
// stubbed on so leaves land instantly instead of waiting for a transition;
// `mobile` stands in for the ≤ 800px one-page layout.
function mockMedia(mobile: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion') || (mobile && query.includes('max-width')),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

beforeEach(() => {
  mockMedia(false);
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function renderBook() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <HandbookBook
        leaves={handbookLeaves()}
        prevLabel="Previous page"
        nextLabel="Next page"
        lang="en"
      />
    </NextIntlClientProvider>,
  );
}

const prev = () => screen.getByRole('button', { name: 'Previous page' }) as HTMLButtonElement;
const next = () => screen.getByRole('button', { name: 'Next page' }) as HTMLButtonElement;

describe('Handbook — DESIGN.md §4.3 and §5', () => {
  it('has zero axe violations', async () => {
    const { container } = renderBook();
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it('disables the arrows at the cover and the back cover instead of looping', () => {
    renderBook();
    expect(prev().disabled).toBe(true);
    for (let i = 0; i < 4; i++) fireEvent.click(next());
    expect(next().disabled).toBe(true);
    expect(prev().disabled).toBe(false);

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(next().disabled).toBe(true);

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(next().disabled).toBe(false);
  });

  it('exposes only the two faces in view', () => {
    const { container } = renderBook();
    const inert = () => container.querySelectorAll('[inert]').length;
    // 10 faces, 2 in view at a time: the cover (front of leaf 1) and the blank
    // left endpaper is not a face — so 9 are inert on the cover spread.
    expect(inert()).toBe(9);
    fireEvent.click(next());
    expect(inert()).toBe(8);
  });

  it('marks the active dot with aria-current and jumps to a leaf from a dot', () => {
    const { container } = renderBook();
    fireEvent.click(screen.getByRole('button', { name: 'Go to 4' }));
    expect(container.querySelector('button[aria-current="true"]')?.getAttribute('aria-label')).toBe(
      'Go to 4',
    );
    expect(prev().disabled).toBe(false);
    expect(next().disabled).toBe(false);
  });

  describe('on a phone (one page at a time)', () => {
    /** jsdom has no PointerEvent; React only reads `type` and the coordinates. */
    function swipe(book: HTMLElement, fromX: number, toX: number, dy = 0) {
      const at = (type: string, x: number, y: number) =>
        fireEvent(book, new MouseEvent(type, { bubbles: true, clientX: x, clientY: y }));
      at('pointerdown', fromX, 200);
      at('pointerup', toX, 200 + dy);
    }

    it('has one dot per page: the cover, both halves of each spread, the back cover', () => {
      mockMedia(true);
      const { container } = renderBook();
      expect(container.querySelectorAll('button[aria-label^="Go to"]').length).toBe(9);
      expect(container.querySelectorAll('button[aria-current="true"]').length).toBe(1);
    });

    it('turns by swiping and stops at the first and last page', () => {
      mockMedia(true);
      const { container } = renderBook();
      const book = container.querySelector('div[lang="en"]') as HTMLElement;
      const active = () =>
        Array.from(container.querySelectorAll('button[aria-label^="Go to"]')).findIndex(
          (b) => b.getAttribute('aria-current') === 'true',
        );

      expect(active()).toBe(0);
      swipe(book, 100, 300); // right at the cover: nothing
      expect(active()).toBe(0);
      swipe(book, 300, 100); // left → next page
      expect(active()).toBe(1);
      swipe(book, 300, 280); // too short
      expect(active()).toBe(1);
      swipe(book, 300, 100, 200); // mostly vertical
      expect(active()).toBe(1);
      swipe(book, 100, 300); // right → back
      expect(active()).toBe(0);
      for (let i = 0; i < 12; i++) swipe(book, 300, 100);
      expect(active()).toBe(8); // the back cover, and no further
    });

    it('exposes only the page in view', () => {
      mockMedia(true);
      const { container } = renderBook();
      const inert = () => container.querySelectorAll('[inert]').length;
      // The cover alone is in view: the other nine faces are inert.
      expect(inert()).toBe(9);
    });
  });
});
