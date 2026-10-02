import { describe, expect, it, vi } from 'vitest';

import { LIMITS, send, subjectName, validate } from './contact';
import { renderHtml } from './contactEmail';

const good = { name: 'Ada', email: 'ada@example.com', message: 'Hello, I would like to talk.' };
const env = {
  RESEND_API_KEY: 'key',
  CONTACT_TO_EMAIL: 'me@example.com',
  CONTACT_FROM_EMAIL: 'form@example.com',
};

describe('validate', () => {
  it('accepts a normal message and trims it', () => {
    const result = validate({
      name: '  Ada ',
      email: ' ada@example.com ',
      message: ` ${good.message} `,
    });
    expect(result).toEqual({ ok: true, data: good });
  });

  it('allows an empty name', () => {
    expect(validate({ ...good, name: '' }).ok).toBe(true);
  });

  it.each(['', 'ada', 'ada@', '@example.com', 'ada@example', 'a da@example.com'])(
    'rejects the email "%s"',
    (email) => {
      const result = validate({ ...good, email });
      expect(result).toMatchObject({ ok: false, errors: { email: 'email_invalid' } });
    },
  );

  it('rejects a message that is too short or too long, and a name that is too long', () => {
    expect(validate({ ...good, message: 'short' })).toMatchObject({
      errors: { message: 'message_short' },
    });
    expect(validate({ ...good, message: 'x'.repeat(LIMITS.messageMax + 1) })).toMatchObject({
      errors: { message: 'message_long' },
    });
    expect(validate({ ...good, name: 'n'.repeat(LIMITS.name + 1) })).toMatchObject({
      errors: { name: 'name_long' },
    });
  });
});

describe('subjectName', () => {
  it('removes line breaks so a name cannot add mail headers', () => {
    expect(subjectName('Ada\r\nBcc: spam@example.com')).toBe('Ada Bcc: spam@example.com');
  });
});

describe('renderHtml', () => {
  it('escapes what the visitor typed', () => {
    const html = renderHtml(
      { name: '<b>Ada</b>', email: 'ada@example.com', message: '<script>x</script>\nline two' },
      'Ada',
    );
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<b>Ada</b>');
    expect(html).toContain('&lt;script&gt;x&lt;/script&gt;<br>line two');
  });

  it('falls back to the address when there is no name', () => {
    const html = renderHtml({ ...good, name: '' }, good.email);
    expect(html).toContain('Reply to ada@example.com');
  });
});

describe('send', () => {
  it('says "unavailable" without calling anything when the form is not set up', async () => {
    const fetchMock = vi.fn();
    expect(await send(good, {}, fetchMock)).toBe('unavailable');
    expect(await send(good, { ...env, CONTACT_FROM_EMAIL: undefined }, fetchMock)).toBe(
      'unavailable',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts to Resend with the visitor as reply-to and the message as HTML and plain text', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    expect(await send(good, env, fetchMock)).toBe('sent');

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer key');
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      from: 'form@example.com',
      to: ['me@example.com'],
      reply_to: 'ada@example.com',
    });
    expect(body.text).toContain(good.message);
    expect(body.html).toContain(good.message);
    expect(body.html).toContain('mailto:ada@example.com');
  });

  it('says "failed" when Resend refuses or the network is down', async () => {
    expect(await send(good, env, vi.fn().mockResolvedValue({ ok: false }))).toBe('failed');
    expect(await send(good, env, vi.fn().mockRejectedValue(new Error('offline')))).toBe('failed');
  });
});
