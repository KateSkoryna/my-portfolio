import { existsSync } from 'node:fs';
import { join } from 'node:path';

import type { ComponentType } from 'react';

import registry from '@/content/journal/posts.json';
import { routing } from '@/i18n/routing';

/** The three kinds of post; the blog is published in this order. */
export const CATEGORIES = ['mylearning', 'myexperience', 'justtalkoutloud'] as const;
export type Category = (typeof CATEGORIES)[number];

export type HeadingGap = 'small' | 'line';

/** What `posts.json` holds for one post in one language. */
interface Translation {
  title: string;
  excerpt: string;
  /** At least one; shown as chips and used to filter. */
  tags: string[];
}

/** One post in `posts.json`: what does not change with language, plus a block per language. */
interface Post {
  slug: string;
  /** ISO date, `YYYY-MM-DD`. Posts are listed newest first by this. */
  date: string;
  /** What kind of post it is: my learning, my experience, or just talking out loud. */
  category: Category;
  /** Set to hide a post everywhere without deleting it. */
  draft?: boolean;
  /** What to read next: another post's slug, or `handbook`. At least one. */
  related: string[];
  /**
   * Room under each sub-heading, in whole lines so the text stays on the ruling:
   * `small` gives the heading two lines to sit in (a little air above and below it),
   * `line` adds one empty line under it. Without it a heading sits directly on its text.
   */
  headingGap?: HeadingGap;
  en: Translation;
  de?: Translation;
}

/** A pointer at the end of a post: another post (with its title in this language) or the handbook. */
export type Related = { kind: 'post'; slug: string; title: string } | { kind: 'handbook' };

export interface Entry extends Translation {
  slug: string;
  date: string;
  category: Category;
  related: Related[];
  headingGap?: HeadingGap;
}

const ROOT = join(process.cwd(), 'src', 'content', 'journal');
const FALLBACK = routing.defaultLocale;

/** Reads `posts.json` and stops the build on a post that would break a page. */
function readPosts(): Post[] {
  const posts = registry.posts as Post[];
  const seen = new Set<string>();

  for (const post of posts) {
    const where = `src/content/journal/posts.json, post "${post.slug}"`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(post.slug)) throw new Error(`${where}: bad slug`);
    if (seen.has(post.slug)) throw new Error(`${where}: duplicate slug`);
    seen.add(post.slug);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) throw new Error(`${where}: date is not YYYY-MM-DD`);
    if (!CATEGORIES.includes(post.category))
      throw new Error(`${where}: category must be one of ${CATEGORIES.join(', ')}`);

    if (!post.related?.length)
      throw new Error(`${where}: at least one related post (or "handbook") is required`);
    for (const target of post.related) {
      if (target === post.slug) throw new Error(`${where}: related points at itself`);
      if (target !== 'handbook' && !posts.some((other) => other.slug === target)) {
        throw new Error(`${where}: related "${target}" is not a post in posts.json`);
      }
    }

    for (const locale of routing.locales) {
      const block = (post as unknown as Record<string, Translation | undefined>)[locale];
      if (!block) {
        if (locale === FALLBACK) throw new Error(`${where}: no "${locale}" block`);
        continue;
      }
      if (!block.title || !block.excerpt)
        throw new Error(`${where} (${locale}): title and excerpt are required`);
      if (!block.tags?.length)
        throw new Error(`${where} (${locale}): at least one tag is required`);
      if (!existsSync(join(ROOT, locale, `${post.slug}.mdx`))) {
        throw new Error(
          `${where}: listed in "${locale}" but src/content/journal/${locale}/${post.slug}.mdx is missing`,
        );
      }
    }
  }
  return posts.filter((post) => !post.draft);
}

const posts = readPosts();

export function getSlugs(): string[] {
  return posts.map((post) => post.slug);
}

/** The language a post is shown in: the requested one if it has a block, else English. */
function languageOf(post: Post, locale: string): 'en' | 'de' {
  return locale === 'de' && post.de ? 'de' : 'en';
}

function toEntry(post: Post, locale: string): Entry {
  const related = post.related.map((target): Related => {
    if (target === 'handbook') return { kind: 'handbook' };
    const other = posts.find((p) => p.slug === target)!;
    return { kind: 'post', slug: target, title: other[languageOf(other, locale)]!.title };
  });
  return {
    slug: post.slug,
    date: post.date,
    category: post.category,
    related,
    headingGap: post.headingGap,
    ...post[languageOf(post, locale)]!,
  };
}

/** All posts for a language, newest first. */
export async function getEntries(locale: string): Promise<Entry[]> {
  return posts.map((post) => toEntry(post, locale)).sort((a, b) => b.date.localeCompare(a.date));
}

/** One post's properties and its rendered body, or `null` for an unknown slug. */
export async function getEntry(locale: string, slug: string) {
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;
  const language = languageOf(post, locale);
  // The folder is a literal prefix so the bundler can see every possible file.
  const { default: Body } = (await import(`@/content/journal/${language}/${slug}.mdx`)) as {
    default: ComponentType;
  };
  return { entry: toEntry(post, locale), Body };
}
