import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JournalView } from '@/components/Journal/JournalView';
import { routing } from '@/i18n/routing';
import { getEntry, getSlugs } from '@/lib/journal';
import { pageMetadata } from '@/lib/seo';

type Params = Promise<{ locale: string; slug: string }>;

/** Every entry in every language, built ahead of time; an unknown slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams(): Array<{ locale: string; slug: string }> {
  return routing.locales.flatMap((locale) => getSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const found = await getEntry(locale, slug);
  return found
    ? pageMetadata({
        locale,
        path: `/journal/${slug}`,
        title: found.entry.title,
        description: found.entry.excerpt,
      })
    : {};
}

export default async function JournalEntryPage({ params }: { params: Params }) {
  const { slug } = await params;
  if (!getSlugs().includes(slug)) notFound();
  return <JournalView slug={slug} />;
}
