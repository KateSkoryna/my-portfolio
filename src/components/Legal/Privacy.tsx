import { useTranslations } from 'next-intl';

import { Eyebrow } from '@/components/Eyebrow/Eyebrow';
import { profile } from '@/content/items';

import { Address } from './Address';
import styles from './Legal.module.css';

interface Section {
  title: string;
  body: string[];
}

/**
 * `/privacy` — the privacy notice (Art. 13 GDPR). Who is responsible, then one
 * short section per thing the site does with data: hosting, cookies, links, email,
 * rights. The sections are plain text in `messages` (`privacy.sections`), so each
 * language reads as written, not as a translation of the other.
 */
export function Privacy() {
  const t = useTranslations('privacy');
  const sections = t.raw('sections') as Section[];
  return (
    <article className={`${styles.page} ${styles.wide}`}>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.updated}>{t('updated')}</p>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>{t('controllerHeading')}</h2>
        <Address />
        <p className={styles.text}>
          {t('controllerNote')}: <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      </section>

      {sections.map((section) => (
        <section key={section.title} className={styles.section}>
          <h2 className={styles.subtitle}>{section.title}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph} className={styles.text}>
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
