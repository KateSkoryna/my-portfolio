// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import type { PortfolioItem } from '@/content/items';

import { ClosedBook } from './ClosedBook';

afterEach(cleanup);

const baseItem: PortfolioItem = {
  id: 'test',
  n: '01',
  kind: 'book',
  kindLabel: 'Book',
  title: 'Test Item',
  route: '/test',
  coverKicker: '',
  coverTitle: '',
  coverFoot: '',
  blurb: '',
  shortBlurb: '',
  chips: [],
  cta: '',
  cover: '#1F6F5F',
  coverDark: '#103C33',
  thickness: 28,
  published: true,
};

describe('ClosedBook', () => {
  it('bar height tracks item.thickness, not a hardcoded value', () => {
    const { container: thin } = render(
      <ClosedBook item={{ ...baseItem, thickness: 16 }} width={220} />,
    );
    const { container: thick } = render(
      <ClosedBook item={{ ...baseItem, thickness: 36 }} width={220} />,
    );

    const thinBar = thin.firstElementChild as HTMLElement;
    const thickBar = thick.firstElementChild as HTMLElement;

    expect(thinBar.style.getPropertyValue('--closed-h')).toBe('16px');
    expect(thickBar.style.getPropertyValue('--closed-h')).toBe('36px');
  });

  it('picks cream ink on the dark covers and deep emerald on sage, per DESIGN.md §2.2', () => {
    const { container: emerald } = render(
      <ClosedBook item={{ ...baseItem, cover: '#1F6F5F' }} width={220} />,
    );
    const { container: sage } = render(
      <ClosedBook item={{ ...baseItem, cover: '#DCE9E2' }} width={220} />,
    );
    const { container: coral } = render(
      <ClosedBook item={{ ...baseItem, cover: '#FF6F61' }} width={220} />,
    );

    const ink = (c: HTMLElement) =>
      (c.firstElementChild as HTMLElement).style.getPropertyValue('--closed-ink');
    expect(ink(emerald)).toBe('#FFF7ED');
    expect(ink(sage)).toBe('#155246');
    expect(ink(coral)).toBe('#232323');
  });

  it('shows a coil edge instead of two spine bands for the notebook', () => {
    const { container: book } = render(<ClosedBook item={baseItem} width={220} />);
    const { container: notebook } = render(
      <ClosedBook item={{ ...baseItem, kind: 'notebook' }} width={220} />,
    );

    // edgeTop + label + two bands + edgeBottom, versus edgeTop + label + coils + edgeBottom.
    expect(book.firstElementChild?.children.length).toBe(5);
    expect(notebook.firstElementChild?.children.length).toBe(4);
  });
});
