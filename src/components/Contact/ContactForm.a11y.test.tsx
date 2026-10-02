// @vitest-environment jsdom
import axe from 'axe-core';
import { NextIntlClientProvider } from 'next-intl';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ContactState } from '@/app/[locale]/contact/actions';

import deMessages from '../../../messages/de.json';
import enMessages from '../../../messages/en.json';
import { ContactForm } from './ContactForm';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: React.ComponentProps<'a'>) => (
    <a href={String(href)} {...rest}>
      {children}
    </a>
  ),
}));

afterEach(cleanup);

const idle = async (state: ContactState) => state;

describe.each([['en' as const], ['de' as const]])('ContactForm (%s)', (locale) => {
  const messages = locale === 'en' ? enMessages : deMessages;
  const page = (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ContactForm action={idle} />
    </NextIntlClientProvider>
  );

  it('has no axe violations', async () => {
    const { container } = render(page);
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });

  it('labels every field a person fills in, and hides the bot trap from them', () => {
    const { container } = render(page);
    expect(screen.getByLabelText(messages.contact.email)).toHaveProperty('type', 'email');
    expect(screen.getByLabelText(messages.contact.message).tagName).toBe('TEXTAREA');
    expect(screen.getByLabelText(messages.contact.name)).toBeTruthy();
    const trap = container.querySelector('input[name="website"]')!;
    expect(trap.getAttribute('tabindex')).toBe('-1');
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByRole('button', { name: messages.contact.submit })).toBeTruthy();
  });

  it('links to the privacy notice', () => {
    render(page);
    expect(screen.getByRole('link', { name: messages.contact.privacyLink })).toHaveProperty(
      'href',
      expect.stringContaining('/privacy'),
    );
  });
});
