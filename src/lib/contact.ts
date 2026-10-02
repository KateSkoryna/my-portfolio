/**
 * The contact form's rules and the email it sends. Kept apart from the server action
 * and the page so both can be tested without a browser: `validate` decides what is
 * acceptable, `send` posts to Resend's REST API with plain `fetch` (no SDK, no new
 * dependency).
 */

import { renderHtml } from './contactEmail';

export const LIMITS = { name: 100, email: 254, messageMin: 10, messageMax: 4000 } as const;

/** What the form can say went wrong. The page maps each code to a sentence in the visitor's language. */
export type ContactError =
  'email_invalid' | 'message_short' | 'message_long' | 'name_long' | 'unavailable' | 'failed';

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export type Validation =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: Partial<Record<'name' | 'email' | 'message', ContactError>> };

// One `@`, no spaces, a dot in the domain. The real check is that the address can be replied to.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(input: ContactInput): Validation {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const errors: Partial<Record<'name' | 'email' | 'message', ContactError>> = {};

  if (name.length > LIMITS.name) errors.name = 'name_long';
  if (!EMAIL.test(email) || email.length > LIMITS.email) errors.email = 'email_invalid';
  if (message.length < LIMITS.messageMin) errors.message = 'message_short';
  else if (message.length > LIMITS.messageMax) errors.message = 'message_long';

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data: { name, email, message } };
}

/** The sender's name goes into the subject line, so line breaks must not get through. */
export function subjectName(name: string): string {
  return name.replace(/[\r\n]+/g, ' ').trim();
}

export interface ContactEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

/** `'unavailable'` when the form is not set up (no key, recipient or sender): the page then points to plain email. */
export async function send(
  data: ContactInput,
  env: ContactEnv,
  fetchImpl: typeof fetch = fetch,
): Promise<'sent' | 'unavailable' | 'failed'> {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) return 'unavailable';

  const who = subjectName(data.name) || data.email;
  try {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        // Hitting "reply" in the mailbox answers the visitor, not the form.
        reply_to: data.email,
        subject: `Message from ${who} via the contact form`,
        html: renderHtml(data, who),
        text: `${data.message}\n\n--\n${data.name || '(no name)'} <${data.email}>`,
      }),
    });
    return res.ok ? 'sent' : 'failed';
  } catch {
    return 'failed';
  }
}
