/**
 * The landing intro plays once per browser session. `<main>` carries
 * `data-intro="play"` from the server; the CSS in the Landing modules only
 * animates while that is the value, and `"seen"` turns every intro rule off.
 */
export const INTRO_STORAGE_KEY = 'landing-intro-seen';

/** A little past the last text finishing typing (`Carousel.module.css`, ~3.7s). */
export const INTRO_DURATION_MS = 4200;

/**
 * Runs while the HTML is parsed — before first paint — so a visitor who has
 * already seen the intro never sees it start and then get cut. Sits as the
 * first child of `<main>`; `IntroGate` covers client-side navigations, where
 * inline scripts do not run.
 */
export const introSkipScript = `try{if(sessionStorage.getItem('${INTRO_STORAGE_KEY}'))document.currentScript.parentElement.dataset.intro='seen'}catch(e){}`;
