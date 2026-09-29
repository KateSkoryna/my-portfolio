import { getLocale, getTranslations } from 'next-intl/server';

import { HeaderLink, PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';
import { Projects } from '@/components/Projects/Projects';
import { getProjectIssues } from '@/lib/github/repos';

/**
 * ISR: the repo stats are fetched on the server and the rendered page is
 * reused for an hour. Must match `REVALIDATE_SECONDS` in `lib/github/repos.ts`
 * — Next needs a literal here, so it cannot import the constant.
 */
export const revalidate = 3600;

export default async function ProjectsPage() {
  const t = await getTranslations('projects');
  const tChrome = await getTranslations('chrome');
  const locale = await getLocale();
  const { issues, fetchedAt } = await getProjectIssues();

  return (
    <>
      <PageHeader
        backLabel={t('backToStack')}
        action={
          <HeaderLink href="/shelf" arrow="forward" shortLabel={tChrome('shelfShort')}>
            {t('goToShelf')}
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
