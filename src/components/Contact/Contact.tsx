import { useTranslations } from 'next-intl';

import { Eyebrow } from '@/components/Eyebrow/Eyebrow';
import { sendMessage } from '@/app/[locale]/contact/actions';

import { ContactForm } from './ContactForm';
import styles from './Contact.module.css';

/** `/contact` — the contact form, the second way to reach me that the legal notice names. */
export function Contact() {
  const t = useTranslations('contact');
  return (
    <article className={styles.page}>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.text}>{t('intro')}</p>
      <ContactForm action={sendMessage} />
    </article>
  );
}
