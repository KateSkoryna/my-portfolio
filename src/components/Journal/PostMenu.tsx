'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { HeaderButton } from '@/components/PageHeader/HeaderButton';
import { Link, usePathname } from '@/i18n/navigation';

import styles from './Journal.module.css';

export interface PostLink {
  slug: string;
  title: string;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
}

/**
 * A menu of every post, for when there are too many to page through: a real
 * `<button>` (`aria-expanded`) that opens a panel of real links, grouped by
 * year, newest first, the open post marked `aria-current`. The list scrolls
 * inside the panel; the book itself never does. Escape and a click outside
 * close it, as does choosing a post.
 */
export function PostMenu({ posts, current }: { posts: PostLink[]; current?: string }) {
  const t = useTranslations('journal');
  const locale = useLocale();
  const pathname = usePathname();
  // Open for the page it was opened on only: moving to another post closes it,
  // however the link was reached, without an effect to reset it.
  const [menuTop, setMenuTop] = useState(0);
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (next: boolean) => setOpenAt(next ? pathname : null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpenAt(null);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setOpenAt(null);
      buttonRef.current?.focus();
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const formatDate = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale, {
    day: 'numeric',
    month: 'long',
  });
  const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))];

  return (
    <div ref={rootRef} className={styles.menu}>
      <HeaderButton
        ref={buttonRef}
        glyph={open ? '↑' : '↓'}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          // Where the panel hangs from, so it can be capped to the room below it.
          setMenuTop(buttonRef.current?.getBoundingClientRect().bottom ?? 0);
          setOpen(!open);
        }}
      >
        {t('allPosts')}
      </HeaderButton>
      {open && (
        // Scrollable, so it must be reachable by keyboard.
        <div
          id={panelId}
          className={styles.panel}
          style={{ '--menu-top': `${menuTop}px` } as CSSProperties}
          tabIndex={0}
          aria-label={t('allPosts')}
        >
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
                        onClick={() => setOpen(false)}
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
        </div>
      )}
    </div>
  );
}
