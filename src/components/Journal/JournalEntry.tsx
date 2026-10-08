import type { ReactNode } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { Chip } from '@/components/Chip/Chip';
import { SocialLink } from '@/components/SocialLink/SocialLink';
import { profile } from '@/content/items';
import { Link } from '@/i18n/navigation';
import type { Entry } from '@/lib/journal';

import styles from './Journal.module.css';

/** `Developer vocabulary` → `#DeveloperVocabulary`: a hashtag has no spaces. */
function hashtag(tag: string) {
  const words = tag.trim().split(/\s+/);
  return `#${words.map((word, i) => (i === 0 ? word : word[0].toUpperCase() + word.slice(1))).join('')}`;
}

/**
 * One entry as the text that flows across the notebook's pages: date, title
 * (the page's `<h1>`), tags, the MDX body, a pointer to what to read next (another post
 * or the handbook), and a handwritten invitation to write
 * back, with LinkedIn and Gmail buttons, at the end.
 */
export function JournalEntry({ entry, children }: { entry: Entry; children: ReactNode }) {
  const t = useTranslations('journal');
  const tItems = useTranslations('items');
  const locale = useLocale();
  const date = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article>
      <header>
        <p className={styles.meta}>
          <span className={styles.category}>{t(`categories.${entry.category}`)}</span>
          <span aria-hidden="true">·</span>
          <time className={styles.date} dateTime={entry.date}>
            {date.format(new Date(entry.date))}
          </time>
        </p>
        <h1 className={styles.title}>{entry.title}</h1>
        {entry.tags.length > 0 && (
          <ul className={styles.tags}>
            {entry.tags.map((tag, i) => (
              <li key={`${tag}-${i}`}>
                <Chip size="small">{hashtag(tag)}</Chip>
              </li>
            ))}
          </ul>
        )}
      </header>
      <div
        className={
          entry.headingGap === 'line'
            ? `${styles.prose} ${styles.gapLine}`
            : entry.headingGap === 'small'
              ? `${styles.prose} ${styles.gapSmall}`
              : styles.prose
        }
      >
        {children}
      </div>
      <section className={styles.related} aria-labelledby="journal-related">
        <h2 id="journal-related" className={styles.relatedLabel}>
          {t('related')}
        </h2>
        <ul className={styles.relatedList}>
          {entry.related.map((target) => (
            <li key={target.kind === 'post' ? target.slug : 'handbook'}>
              <Link
                href={target.kind === 'post' ? `/journal/${target.slug}` : '/handbook'}
                className={styles.relatedLink}
              >
                {/* One flex item, so a title that wraps keeps the arrow after its last word. */}
                <span>
                  {target.kind === 'post' ? target.title : tItems('handbook.title')}{' '}
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <footer className={styles.cta}>
        <p className={styles.ctaNote}>{t('cta')}</p>
        {/* The sign-off on its own line, with a heart drawn like the handwriting: a
            single coral line with round ends, not a filled icon. */}
        <p className={styles.ctaSignoff}>
          {t('signoff')}{' '}
          <svg className={styles.heart} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8.2 13.6C4.4 10.9 1.9 8.6 2 5.6 2.1 3.6 3.6 2.4 5.3 2.5c1.2.1 2.3.9 2.9 2 .7-1.1 1.9-1.9 3.2-1.9 1.8 0 3.1 1.5 3 3.5-.1 2.8-2.6 5.2-6.2 7.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>
        <div className={styles.ctaLinks}>
          <SocialLink kind="linkedin" href={profile.linkedin}>
            LinkedIn
          </SocialLink>
          <SocialLink kind="email" href={`mailto:${profile.email}`}>
            Gmail
          </SocialLink>
        </div>
      </footer>
    </article>
  );
}
