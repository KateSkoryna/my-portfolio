import { useTranslations } from 'next-intl';

import { Eyebrow } from '@/components/Eyebrow/Eyebrow';
import { profile } from '@/content/items';
import { Link } from '@/i18n/navigation';

import { Address } from './Address';

import styles from './Legal.module.css';

/**
 * `/impressum` — the legal notice a German site needs (§ 5 DDG): who runs it, a
 * postal address, an email. Plain text on the page, no object: it is not part of the
 * stack. The responsible person for the blog's content is named too (§ 18 (2) MStV).
 */
export function Legal() {
  const t = useTranslations('legal');
  return (
    <article className={styles.page}>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <h1 className={styles.title}>{t('title')}</h1>

      <section className={styles.section}>
        <h2 className={styles.heading}>{t('infoHeading')}</h2>
        <Address />
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{t('contactHeading')}</h2>
        <p className={styles.text}>
          {t('email')}: <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
        <p className={styles.text}>
          {t('contactForm')}: <Link href="/contact">{t('contactFormLink')}</Link>
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{t('responsibleHeading')}</h2>
        <Address />
      </section>
    </article>
  );
}
