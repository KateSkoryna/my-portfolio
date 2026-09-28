'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { routing } from '@/i18n/routing';
import { usePathname, useRouter } from '@/i18n/navigation';

import styles from './LanguageToggle.module.css';

/**
 * DESIGN.md §4.4 — sage pill track, filled emerald circle on the selected
 * language, muted text for the other. Both are real `<button>`s with
 * `aria-label`; `.hitArea` guarantees the §5.3 44px minimum around the
 * 30/26px drawn circle without enlarging it.
 *
 * Per-language labels come from `Intl.DisplayNames` (each language's own
 * endonym — "Deutsch", not a translated "German") rather than a message key
 * per locale code. `docs/PLAN.md`: adding a locale must be one new file under
 * `messages/` and nothing else — a `chrome.languageToggle.<code>` key would
 * mean editing every *existing* locale file each time a new one is added.
 * Caught by actually adding a throwaway third locale in Phase 1 and
 * rebuilding, per this phase's own definition of done.
 *
 * `PageHeader` (and this) lives inside `page.tsx`, the segment that changes
 * on a locale switch, so `router.replace` swaps in a whole new RSC tree —
 * this component remounts already on the new locale, with no live DOM node
 * for the thumb's `transform` transition to animate from. `pendingLocale`
 * flips the thumb's position optimistically, in this still-mounted
 * instance, the moment the button is clicked — the slide plays before the
 * route swap replaces the tree under it.
 */
export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('chrome.languageToggle');
  const [pendingLocale, setPendingLocale] = useState<string | null>(null);

  const activeLocale = pendingLocale ?? locale;
  const selectedIndex = routing.locales.findIndex((code) => code === activeLocale);

  return (
    <div
      className={styles.track}
      data-selected-index={selectedIndex}
      role="group"
      aria-label={t('label')}
    >
      <span className={styles.thumb} aria-hidden="true" />
      {routing.locales.map((code) => {
        const selected = code === activeLocale;
        const endonym = new Intl.DisplayNames([code], { type: 'language' }).of(code) ?? code;
        return (
          <button
            key={code}
            type="button"
            className={`${styles.hitArea} ${styles.option} ${selected ? styles.selected : ''}`}
            aria-pressed={selected}
            aria-label={t('switchTo', { language: endonym })}
            onClick={() => {
              setPendingLocale(code);
              router.replace(pathname, { locale: code });
            }}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
