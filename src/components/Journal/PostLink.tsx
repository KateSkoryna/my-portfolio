import type { ComponentPropsWithoutRef } from 'react';

import { useTranslations } from 'next-intl';

import shared from '@/styles/shared.module.css';

/**
 * A link inside a post's text (`[text](https://…)` in MDX). A link to another
 * site opens in a new tab, and says so to a screen reader; a link on this site
 * or within the page (`/…`, `#…`) behaves as usual.
 */
export function PostLink({ href, children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  const t = useTranslations('journal');
  const external = typeof href === 'string' && /^https?:\/\//.test(href);

  if (!external) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <span className={shared.visuallyHidden}> ({t('opensInNewTab')})</span>
    </a>
  );
}
