'use client';

import { useLayoutEffect } from 'react';

import { INTRO_DURATION_MOBILE_MS, INTRO_DURATION_MS, INTRO_STORAGE_KEY } from './intro';

/**
 * Marks the session as having seen the intro once it has played. It does NOT
 * flip `<main data-intro>` at that point: doing so removes the intro rules and
 * the pile's and book's ordinary cross-fade takes over again, which restarts
 * as a visible blink. `Carousel` flips it when the selection changes, when
 * those elements are re-created anyway. On a client-side navigation back to
 * `/` the inline skip script does not run, so this checks the flag before
 * paint. Renders nothing.
 */
export function IntroGate() {
  useLayoutEffect(() => {
    const main = document.getElementById('main');
    if (!main) return;

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(INTRO_STORAGE_KEY) !== null;
    } catch {
      // Storage blocked: the intro just plays each time.
    }

    if (alreadySeen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      main.dataset.intro = 'seen';
      return;
    }

    const isPhone = window.matchMedia('(max-width: 800px)').matches;
    const timer = window.setTimeout(
      () => {
        try {
          sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
        } catch {
          // See above.
        }
      },
      isPhone ? INTRO_DURATION_MOBILE_MS : INTRO_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
