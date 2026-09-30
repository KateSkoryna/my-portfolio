import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import registry from '@/content/journal/posts.json';

import { getEntries, getSlugs } from './journal';

const ROOT = join(process.cwd(), 'src', 'content', 'journal');

describe('journal posts (posts.json)', () => {
  it.each(['en', 'de'])('lists every post for %s, newest first, each with tags', async (locale) => {
    const entries = await getEntries(locale);
    expect(entries.map((e) => e.slug).sort()).toEqual([...getSlugs()].sort());
    expect(entries.map((e) => e.date)).toEqual(
      entries
        .map((e) => e.date)
        .sort()
        .reverse(),
    );
    for (const entry of entries) {
      expect(entry.title).toBeTruthy();
      expect(entry.excerpt).toBeTruthy();
      expect(entry.tags.length).toBeGreaterThan(0);
    }
  });

  it('has a text file for every listed post, and no text file that is not listed', () => {
    for (const locale of ['en', 'de']) {
      const files = readdirSync(join(ROOT, locale)).map((f) => f.replace(/\.mdx$/, ''));
      const listed = registry.posts.map((post) => post.slug); // drafts included
      for (const slug of listed) expect(existsSync(join(ROOT, locale, `${slug}.mdx`))).toBe(true);
      expect(files.filter((f) => !listed.includes(f))).toEqual([]);
    }
  });
});
