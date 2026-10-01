// @vitest-environment jsdom
import axe from 'axe-core';
import { NextIntlClientProvider } from 'next-intl';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import de from '../../../messages/de.json';
import en from '../../../messages/en.json';

import { About } from './About';

afterEach(cleanup);

function renderAbout(locale: 'en' | 'de' = 'en') {
  return render(
    <NextIntlClientProvider locale={locale} messages={locale === 'en' ? en : de}>
      <About />
    </NextIntlClientProvider>,
  );
}

describe('About — DESIGN.md §5 accessibility contract', () => {
  it.each(['en', 'de'] as const)('has zero axe violations in %s', async (locale) => {
    const { container } = renderAbout(locale);
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it('has one h1, one h2, and a level-3 heading for each of the thirteen facts', () => {
    renderAbout();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(13);
  });

  it('never leaves a fact half-filled: title and body are both placeholders or both written', () => {
    for (const fact of en.about.facts) {
      expect(fact.title.startsWith('[')).toBe(fact.body.startsWith('['));
    }
    for (const fact of de.about.facts) {
      expect(fact.title.startsWith('[')).toBe(fact.body.startsWith('['));
    }
  });

  it('gives each of the four photos a description and a caption', () => {
    const { container } = renderAbout();
    const figures = container.querySelectorAll('figure');
    expect(figures).toHaveLength(4);
    for (const figure of figures) {
      expect(figure.querySelector('img')?.getAttribute('alt')).toBeTruthy();
      expect(figure.querySelector('figcaption')?.textContent).toBeTruthy();
    }
  });
});
