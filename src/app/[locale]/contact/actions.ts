'use server';

import { send, validate, type ContactError } from '@/lib/contact';

export interface ContactState {
  status: 'idle' | 'sent' | 'error';
  /** What the visitor typed, so a failed send does not empty the form. */
  values: { name: string; email: string; message: string };
  errors: Partial<Record<'name' | 'email' | 'message' | 'form', ContactError>>;
}

const text = (data: FormData, key: string) => {
  const value = data.get(key);
  return typeof value === 'string' ? value : '';
};

/**
 * The contact form's server action. A hidden field no person sees (`website`) catches
 * simple bots: if it is filled the message is dropped and the form still says "sent".
 * Nothing is stored; the message goes to the mailbox through Resend and is not logged.
 */
export async function sendMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: text(formData, 'name'),
    email: text(formData, 'email'),
    message: text(formData, 'message'),
  };

  if (text(formData, 'website') !== '')
    return { status: 'sent', values: { name: '', email: '', message: '' }, errors: {} };

  const result = validate(values);
  if (!result.ok) return { status: 'error', values, errors: result.errors };

  const outcome = await send(result.data, {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  });
  if (outcome === 'sent')
    return { status: 'sent', values: { name: '', email: '', message: '' }, errors: {} };
  return { status: 'error', values, errors: { form: outcome } };
}
