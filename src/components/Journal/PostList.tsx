import { getLocale, getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

import type { PostLink } from './PostMenu';
import styles from './Journal.module.css';

/**
 * Every post, always visible beside the notebook on wide screens: real links
 * grouped by year, newest first, the open post `aria-current`. Narrower screens
 * have no room for it and use the `PostMenu` button in the header instead
 * (`Journal.module.css` shows one or the other).
 */
export async function PostList({ posts, current }: { posts: PostLink[]; current?: string }) {
  const t = await getTranslations('journal');
  const locale = await getLocale();
  const formatDate = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale, {
    day: 'numeric',
    month: 'long',
  });
  const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))];

  return (
    <nav className={styles.sidebar} aria-label={t('allPosts')}>
      {years.map((year) => (
        <section key={year} aria-label={year}>
          <h2 className={styles.year}>{year}</h2>
          <ul className={styles.posts}>
            {posts
              .filter((post) => post.date.startsWith(year))
              .map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/journal/${post.slug}`}
                    className={styles.post}
                    aria-current={post.slug === current ? 'page' : undefined}
                  >
                    <span className={styles.postTitle}>{post.title}</span>
                    <time className={styles.postDate} dateTime={post.date}>
                      {formatDate.format(new Date(post.date))}
                    </time>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
