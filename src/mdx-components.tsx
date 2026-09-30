import type { ComponentPropsWithoutRef } from 'react';
import type { MDXComponents } from 'mdx/types';

import { Callout } from '@/components/Journal/Callout';
import { MarginNote } from '@/components/MarginNote/MarginNote';

/**
 * Required by `@next/mdx`. The entry's own title is the page heading, so a
 * `#` or `##` in a post renders one level down (`h3`), `###` as `h4` — an
 * author cannot break the page's heading order. `<MarginNote>` is the Caveat
 * aside (DESIGN.md §1.3) — asides only, never text a reader needs. `<Callout>` is
 * the "Good to know" box.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props: ComponentPropsWithoutRef<'h3'>) => <h3 {...props} />,
    h2: (props: ComponentPropsWithoutRef<'h3'>) => <h3 {...props} />,
    h3: (props: ComponentPropsWithoutRef<'h4'>) => <h4 {...props} />,
    MarginNote,
    Callout,
    ...components,
  };
}
