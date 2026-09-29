'use client';

import { useSyncExternalStore } from 'react';

import { useLocale, useTranslations } from 'next-intl';

const MINUTE = 60_000;

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, MINUTE);
  return () => clearInterval(id);
}

/** Floored to the minute so the snapshot is stable between ticks. */
const nowMinute = () => Math.floor(Date.now() / MINUTE) * MINUTE;

/**
 * "Rebuilt from the GitHub API 14 minutes ago". The page is cached for an
 * hour, so a phrase computed on the server would be wrong by the time it is
 * read — it is recomputed in the browser from the fetch timestamp. The server
 * snapshot is the fetch time itself ("now"), which is true on first render.
 */
export function FetchedAgo({ iso }: { iso: string }) {
  const t = useTranslations('projects');
  const locale = useLocale();
  const fetched = new Date(iso).getTime();
  const now = useSyncExternalStore(subscribe, nowMinute, () => fetched);

  const minutes = Math.max(0, Math.round((now - fetched) / MINUTE));
  const ago = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-minutes, 'minute');

  return <>{t('rebuilt', { ago })}</>;
}
