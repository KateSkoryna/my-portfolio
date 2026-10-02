'use client';

import { useActionState, useId } from 'react';

import { useTranslations } from 'next-intl';

import { PillButton } from '@/components/PillButton/PillButton';
import { profile } from '@/content/items';
import { Link } from '@/i18n/navigation';
import { LIMITS } from '@/lib/contact';

import type { ContactState } from '@/app/[locale]/contact/actions';

import styles from './Contact.module.css';

const INITIAL: ContactState = {
  status: 'idle',
  values: { name: '', email: '', message: '' },
  errors: {},
};

/**
 * The contact form. Real labels, real `<button>`, native `required` for the browser's own
 * hint and the same rules checked again on the server. The server's answer comes back as
 * state: what the visitor typed stays in the fields, each problem is tied to its field
 * with `aria-describedby`, and the result is announced (`role="status"` / `role="alert"`).
 * `website` is a trap for bots: off-screen, skipped by keyboard and screen readers.
 */
export function ContactForm({
  action,
}: {
  action: (state: ContactState, formData: FormData) => Promise<ContactState>;
}) {
  const t = useTranslations('contact');
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const id = useId();
  const field = (name: string) => `${id}-${name}`;

  if (state.status === 'sent') {
    return (
      <div className={styles.sent} role="status">
        <p className={styles.sentTitle}>{t('sentTitle')}</p>
        <p className={styles.text}>{t('sentText')}</p>
      </div>
    );
  }

  const fieldError = (name: 'name' | 'email' | 'message') => state.errors[name];
  const formError = state.errors.form;

  return (
    <form action={formAction} className={styles.form} noValidate={false}>
      {formError && (
        <p className={styles.formError} role="alert">
          {t(`errors.${formError}`)} <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor={field('name')} className={styles.label}>
          {t('name')}
        </label>
        <input
          id={field('name')}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={LIMITS.name}
          defaultValue={state.values.name}
          aria-invalid={fieldError('name') ? true : undefined}
          aria-describedby={fieldError('name') ? field('name-error') : undefined}
          className={styles.input}
        />
        {fieldError('name') && (
          <p id={field('name-error')} className={styles.error}>
            {t(`errors.${fieldError('name')}`)}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor={field('email')} className={styles.label}>
          {t('email')}
        </label>
        <input
          id={field('email')}
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={LIMITS.email}
          defaultValue={state.values.email}
          aria-invalid={fieldError('email') ? true : undefined}
          aria-describedby={fieldError('email') ? field('email-error') : undefined}
          className={styles.input}
        />
        {fieldError('email') && (
          <p id={field('email-error')} className={styles.error}>
            {t(`errors.${fieldError('email')}`)}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor={field('message')} className={styles.label}>
          {t('message')}
        </label>
        <textarea
          id={field('message')}
          name="message"
          rows={8}
          required
          minLength={LIMITS.messageMin}
          maxLength={LIMITS.messageMax}
          defaultValue={state.values.message}
          aria-invalid={fieldError('message') ? true : undefined}
          aria-describedby={fieldError('message') ? field('message-error') : undefined}
          className={styles.input}
        />
        {fieldError('message') && (
          <p id={field('message-error')} className={styles.error}>
            {t(`errors.${fieldError('message')}`)}
          </p>
        )}
      </div>

      <div className={styles.trap} aria-hidden="true">
        <input name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className={styles.actions}>
        <PillButton type="submit" disabled={pending}>
          {pending ? t('sending') : t('submit')}
        </PillButton>
        <p className={styles.note}>
          {t('privacyNote')} <Link href="/privacy">{t('privacyLink')}</Link>
        </p>
      </div>
    </form>
  );
}
