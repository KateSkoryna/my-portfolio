// @vitest-environment jsdom
import axe from 'axe-core';
import { NextIntlClientProvider } from 'next-intl';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import messages from '../../../messages/en.json';

import { handbookLeaves } from './HandbookFaces';
import { HandbookBook } from './HandbookBook';

// jsdom has no layout, `matchMedia` or `ResizeObserver`. Reduced motion is
// stubbed on so leaves land instantly instead of waiting for a transition.
beforeEach(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: true,
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
});
