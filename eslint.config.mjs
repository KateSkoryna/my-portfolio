import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Must stay last: turns off the stylistic rules Prettier owns, so the two
  // never disagree about formatting.
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    '.vitest/**',
    'next-env.d.ts',
    'src/styles/tokens.css',
  ]),
]);

export default eslintConfig;
