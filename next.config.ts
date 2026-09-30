import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
// Journal entries are `.mdx` modules under `src/content/journal`, imported by
// `src/lib/journal.ts` — not pages, so `pageExtensions` is left alone.
const withMDX = createMDX();

const nextConfig: NextConfig = {};

export default withNextIntl(withMDX(nextConfig));
