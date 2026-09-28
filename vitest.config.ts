import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

/**
 * Default environment is `node` (fast, no DOM) for token/logic tests.
 * `*.a11y.test.tsx` opts into `jsdom` per-file via a `// @vitest-environment
 * jsdom` docblock, because it renders real components and scans the real DOM
 * with `axe-core` directly — see `ScratchContent.a11y.test.tsx`.
 *
 * `resolve.alias` mirrors `tsconfig.json`'s `@/*` path — Vite doesn't read
 * tsconfig paths on its own.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
  },
});
