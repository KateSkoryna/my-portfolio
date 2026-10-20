'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { LOCALE_COOKIE, routing } from '@/i18n/routing';
import { usePathname, useRouter } from '@/i18n/navigation';

import styles from './LanguageToggle.module.css';

function rememberLocale(code: string) {
  document.cookie = `${LOCALE_COOKIE}=${code}; path=/; SameSite=Lax`;
}

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('chrome.languageToggle');
  // The switch remounts this component; moving the thumb first lets its slide play.
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
              rememberLocale(code);
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
