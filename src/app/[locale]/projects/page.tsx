import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';

import { HeaderLink, PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';
import { Projects } from '@/components/Projects/Projects';
import { localizeFeaturedRepo } from '@/content/items';
import { getProjectIssues } from '@/lib/github/repos';
import { pageMetadata } from '@/lib/seo';

/**
 * ISR: the repo stats are fetched on the server and the rendered page is
 * reused for an hour. Must match `REVALIDATE_SECONDS` in `lib/github/repos.ts`
 * — Next needs a literal here, so it cannot import the constant.
 */
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'items.projects' });
  return pageMetadata({ locale, path: '/projects', title: t('title'), description: t('blurb') });
}

export default async function ProjectsPage() {
  const tChrome = await getTranslations('chrome');
  const tCommon = await getTranslations('common');
  const locale = await getLocale();
  const tProjects = await getTranslations('projects');
  const { issues: rawIssues, fetchedAt } = await getProjectIssues();
  const issues = rawIssues.map((issue) => localizeFeaturedRepo(issue, tProjects));

  return (
    <>
      <PageHeader
        backLabel={tCommon('backToStack')}
        action={
          <HeaderLink href="/shelf" arrow="forward" shortLabel={tChrome('shelfShort')}>
            {tCommon('goToShelf')}
          </HeaderLink>
        }
      />
      <main id="main">
        <Projects issues={issues} fetchedAt={fetchedAt} locale={locale} />
      </main>
      <PageFooter />
    </>
  );
}
