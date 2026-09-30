import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { JournalView } from '@/components/Journal/JournalView';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'items.journal' });
  return pageMetadata({ locale, path: '/journal', title: t('title'), description: t('blurb') });
}

/** The notebook, open at the newest post. Static; every post also has its own URL. */
export default function JournalPage() {
  return <JournalView />;
}
