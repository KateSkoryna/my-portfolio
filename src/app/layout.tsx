import type { Metadata } from 'next';
import { Bricolage_Grotesque, Caveat, Manrope } from 'next/font/google';

import '@/styles/tokens.css';
import '@/styles/reset.css';

/*
 * DESIGN.md §1.3. Self-hosted by next/font with `display: swap`, so there is
 * no layout shift from font loading — part of the CLS budget, not a detail.
 * The CSS variable names here are the ones tokens.ts already points at.
 *
 * All three families are variable, so each loads as ONE file covering its
 * whole weight range. Naming explicit weights pulls a separate static file
 * each: measured at eleven files against three, for the same total bytes
 * (~140 KB). Same payload, a third of the requests, and the full 400–800
 * Manrope range DESIGN.md §1.3 asks for stays available.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kateryna Skoryna',
  description: 'Frontend developer. React, TypeScript, Next.js.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${manrope.variable} ${caveat.variable}`}>
      <body>
        <a className="skipLink" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
