// @vitest-environment jsdom
import axe from 'axe-core';
import { NextIntlClientProvider } from 'next-intl';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ProjectIssue } from '@/lib/github/repos';

import messages from '../../../messages/en.json';

import { Projects } from './Projects';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: React.ComponentProps<'a'>) => (
    <a href={String(href)} {...rest}>
      {children}
    </a>
  ),
}));

afterEach(cleanup);

const withStats: ProjectIssue = {
  repo: 'alpha',
  title: 'Alpha',
  summary: '[ONE LINE ON WHAT IT DOES AND THE HARD PART.]',
  url: 'https://github.com/x/alpha',
  stats: {
    pushedAt: '2026-09-01T10:00:00Z',
    description: null,
    languages: [
      { name: 'TypeScript', percent: 80 },
      { name: 'CSS', percent: 20 },
    ],
  },
};

// The API-failure path: same issue, no stats, no error state.
const degraded: ProjectIssue = { ...withStats, repo: 'beta', title: 'Beta', stats: null };

function renderProjects(issues: readonly ProjectIssue[]) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Projects issues={issues} fetchedAt="2026-09-29T08:00:00Z" locale="en" />
    </NextIntlClientProvider>,
  );
}

describe('Projects — DESIGN.md §5 accessibility contract', () => {
  it('has zero axe violations with live stats and after an API failure', async () => {
    const { container } = renderProjects([withStats, degraded]);
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it('drops the demo link when a repo has no deployment', () => {
    renderProjects([withStats]);
    expect(screen.queryByRole('link', { name: 'Live demo' })).toBeNull();
  });

  it('shows no stats row and no error text when the API failed', () => {
    renderProjects([degraded]);
    expect(screen.queryByText('Last commit')).toBeNull();
    expect(screen.queryByText(/error|unavailable/i)).toBeNull();
  });

  it('swaps a clicked card into the feature slot and keeps the button mounted', () => {
    renderProjects([withStats, { ...withStats, repo: 'gamma', title: 'Gamma' }]);
    expect(screen.getByRole('heading', { level: 2, name: 'Alpha' })).toBeTruthy();

    const button = screen.getByRole('button', { name: 'Show Gamma as the feature project' });
    fireEvent.click(button);

    const feature = document.querySelector('article');
    expect(feature?.querySelector('h2')?.textContent).toBe('Gamma');
    expect(screen.getByRole('button', { name: 'Show Alpha as the feature project' })).toBe(button);
    expect(screen.getByRole('status').textContent).toBe('Gamma is now the feature project');
  });
});
