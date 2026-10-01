import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Contact } from '@/components/Contact/Contact';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return pageMetadata({ locale, path: '/contact', title: t('title') });
}

/** The contact form, linked from the legal notice. Static page; the form posts to a server action. */
export default async function ContactPage() {
  const tCommon = await getTranslations('common');
  return (
    <>
      <PageHeader backLabel={tCommon('backToStack')} />
      <main id="main">
        <Contact />
      </main>
      <PageFooter />
    </>
  );
}
