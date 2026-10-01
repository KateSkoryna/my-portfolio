// @vitest-environment jsdom
import axe from 'axe-core';
import { NextIntlClientProvider } from 'next-intl';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PageFooter } from '@/components/PageFooter/PageFooter';
import { profile } from '@/content/items';

import deMessages from '../../../messages/de.json';
import enMessages from '../../../messages/en.json';
import { Legal } from './Legal';
import { Privacy } from './Privacy';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: React.ComponentProps<'a'>) => (
    <a href={String(href)} {...rest}>
      {children}
    </a>
  ),
}));

afterEach(cleanup);

describe.each([['en' as const], ['de' as const]])('Legal notice — § 5 DDG (%s)', (locale) => {
  const messages = locale === 'en' ? enMessages : deMessages;
  const page = (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Legal />
      <PageFooter />
    </NextIntlClientProvider>
  );

  it('has no axe violations', async () => {
    const { container } = render(page);
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });

  it('names the person, the postal address and an email, and the footer links to the page', () => {
    render(page);
    const { street, postalCode, city } = profile.address;
    expect(screen.getAllByText(new RegExp(profile.name)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(new RegExp(street)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(new RegExp(`${postalCode} ${city}`)).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: profile.email })).toHaveProperty(
      'href',
      `mailto:${profile.email}`,
    );
    expect(screen.getByRole('link', { name: messages.chrome.impressum })).toHaveProperty(
      'href',
      expect.stringContaining('/impressum'),
    );
  });
});

describe.each([['en' as const], ['de' as const]])(
  'Privacy notice — Art. 13 GDPR (%s)',
  (locale) => {
    const messages = locale === 'en' ? enMessages : deMessages;
    const page = (
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Privacy />
        <PageFooter />
      </NextIntlClientProvider>
    );

    it('has no axe violations', async () => {
      const { container } = render(page);
      const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
      expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    });

    it('names the host, the cookie and the authority, and the footer links to the page', () => {
      render(page);
      expect(screen.getAllByText(/Vercel/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/NEXT_LOCALE/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/datenschutz-berlin\.de/).length).toBeGreaterThan(0);
      expect(screen.getByRole('link', { name: messages.chrome.privacy })).toHaveProperty(
        'href',
        expect.stringContaining('/privacy'),
      );
    });
  },
);
