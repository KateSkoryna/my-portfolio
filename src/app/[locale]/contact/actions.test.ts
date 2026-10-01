import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sendMessage, type ContactState } from './actions';

const empty: ContactState = {
  status: 'idle',
  values: { name: '', email: '', message: '' },
  errors: {},
};

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const valid = { name: 'Ada', email: 'ada@example.com', message: 'Hello, I would like to talk.' };

beforeEach(() => {
  vi.stubEnv('RESEND_API_KEY', 'key');
  vi.stubEnv('CONTACT_TO_EMAIL', 'me@example.com');
  vi.stubEnv('CONTACT_FROM_EMAIL', 'form@example.com');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('sendMessage', () => {
  it('sends a valid message and empties the form', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    const state = await sendMessage(empty, form(valid));
    expect(state).toMatchObject({ status: 'sent', values: { name: '', email: '', message: '' } });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('keeps what was typed and names the field when something is wrong', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const state = await sendMessage(empty, form({ ...valid, email: 'nope' }));
    expect(state.status).toBe('error');
    expect(state.errors.email).toBe('email_invalid');
    expect(state.values.message).toBe(valid.message);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('drops a message that fills the hidden field, without sending or saying why', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const state = await sendMessage(empty, form({ ...valid, website: 'https://spam.example' }));
    expect(state.status).toBe('sent');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('keeps the message and says so when sending fails or is not set up', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const failed = await sendMessage(empty, form(valid));
    expect(failed).toMatchObject({ status: 'error', errors: { form: 'failed' } });
    expect(failed.values.message).toBe(valid.message);

    vi.stubEnv('RESEND_API_KEY', '');
    const unavailable = await sendMessage(empty, form(valid));
    expect(unavailable.errors.form).toBe('unavailable');
  });
});
