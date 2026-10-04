'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { motion } from '@/lib/design/tokens';
import type { ProjectIssue, RepoLanguage } from '@/lib/github/repos';

import { FetchedAgo } from './FetchedAgo';
import styles from './Projects.module.css';

/** A summary still in [BRACKETS] is a placeholder awaiting Kateryna — CLAUDE.md rule 2. */
const isPlaceholder = (text: string) => text.startsWith('[');

const summaryOf = (issue: ProjectIssue) =>
  isPlaceholder(issue.summary) ? issue.summary : issue.summary || issue.stats?.description || '';

/** Accent per project, fixed to the repo so its colour follows it into the feature slot. */
const ACCENTS = ['emerald', 'coral', 'mustard', 'deep'] as const;

interface Sweep {
  /** Issue index of the project being replaced. */
  from: number;
  /** Size of the feature card, so the copy of the old project matches it exactly. */
  width: number;
  height: number;
}

/**
 * DESIGN.md §3 `/projects` — the magazine: a coral masthead, one large feature
 * project, and the rest as cards beneath. Clicking a card swaps it with the
 * feature. A repo whose API call failed renders without its stats — no error
 * state.
 *
 * Client component only for the swap; the data arrives from the server as props.
 */
export function Projects({
  issues,
  fetchedAt,
  locale,
}: {
  issues: readonly ProjectIssue[];
  fetchedAt: string;
  locale: string;
}) {
  const t = useTranslations('projects');
  const tCommon = useTranslations('common');
  // `slots[0]` is the feature, the rest are the cards in order. Swapping keeps
  // every card in its own slot, so the button the visitor just pressed stays
  // mounted and keeps focus.
  const [slots, setSlots] = useState(() => issues.map((_, i) => i));
  const [announce, setAnnounce] = useState('');
  const [sweep, setSweep] = useState<Sweep | null>(null);
  const featureRef = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  const date = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  function swap(slot: number) {
    setSlots((prev) => {
      const next = [...prev];
      [next[0], next[slot]] = [next[slot], next[0]];
      return next;
    });
  }

  function promote(slot: number) {
    if (sweep) return; // one change at a time
    setAnnounce(t('nowFeatured', { name: issues[slots[slot]].title }));

    const box = featureRef.current?.getBoundingClientRect();
    if (!box?.width || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      swap(slot);
      return;
    }

    // The old project stays on top and is wiped away by an edge that swings
    // 180° about the card's bottom centre, like a wiper, uncovering the new
    // project. The slots swap straight away underneath, so the new project is
    // already there.
    setSweep({ from: slots[0], width: box.width, height: box.height });
    swap(slot);
    timers.current.push(window.setTimeout(() => setSweep(null), motion.sweepTurn));
  }

  const feature = issues[slots[0]];
  const featureAccent = ACCENTS[slots[0] % ACCENTS.length];
  return (
    <div className={styles.page}>
      <div className={styles.masthead}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.selectedWork}>{t('selectedWork')}</p>
      </div>
      <div className={styles.strip}>
        <p className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          <FetchedAgo iso={fetchedAt} />
        </p>
      </div>

      <article ref={featureRef} className={styles.feature} data-accent={featureAccent}>
        <FeatureContent feature={feature} locale={locale} />
        {sweep && (
          <div className={styles.sweep} aria-hidden="true">
            <div
              className={`${styles.feature} ${styles.featureClone} ${styles.sweepOld}`}
              data-accent={ACCENTS[sweep.from % ACCENTS.length]}
              style={{ width: sweep.width, height: sweep.height }}
              inert
            >
              <FeatureContent feature={issues[sweep.from]} locale={locale} />
            </div>
          </div>
        )}
      </article>

      <ul className={styles.cards}>
        {slots.slice(1).map((issueIndex, i) => {
          const issue = issues[issueIndex];
          const summary = summaryOf(issue);
          const languages = issue.stats?.languages ?? [];

          return (
            <li key={i} className={styles.card} data-accent={ACCENTS[issueIndex % ACCENTS.length]}>
              <span className={styles.tab} aria-hidden="true" />
              <h2 className={styles.cardTitle}>
                {/* The button's `::after` stretches over the whole card, so the
                    card is one click target without nesting the links below
                    inside a button. */}
                <button
                  type="button"
                  className={styles.promote}
                  aria-label={t('makeFeature', { name: issue.title })}
                  onClick={() => promote(i + 1)}
                >
                  {issue.title}
                </button>
              </h2>
              <p className={isPlaceholder(summary) ? styles.placeholder : styles.summary}>
                {summary}
              </p>

              <div className={styles.cardMobileOnly}>
                {languages.length > 0 && (
                  <dl className={styles.facts}>
                    <div className={styles.languageSplit}>
                      <dt>{t('languageSplit')}</dt>
                      <dd>
                        <LanguageBar languages={languages} />
                        <span className={styles.splitText}>
                          {languages.map((l) => `${l.name} ${l.percent}%`).join(' · ')}
                        </span>
                      </dd>
                    </div>
                  </dl>
                )}
                <StackBlock stack={issue.stack} />
                <div className={styles.cardScreenshot}>
                  <ScreenshotImage screenshot={issue.screenshot} />
                </div>
              </div>

              <div className={styles.cardFoot}>
                {languages.length > 0 && (
                  <div className={styles.cardDesktopOnly}>
                    <LanguageBar languages={languages} />
                  </div>
                )}
                {issue.stats && (
                  <p className={`${styles.cardMeta} ${styles.cardDesktopOnly}`}>
                    {issue.stack ? issue.stack.join(' · ') : languages[0]?.name}
                  </p>
                )}
                <div className={styles.cardBottom}>
                  <p className={styles.links}>
                    <a href={issue.url} className={styles.link}>
                      {tCommon('code')} <span aria-hidden="true">→</span>
                    </a>
                    {issue.demoUrl && (
                      <a href={issue.demoUrl} className={styles.link}>
                        {tCommon('liveDemo')} <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </p>
                  {issue.stats && (
                    <time className={styles.cardDate} dateTime={issue.stats.pushedAt}>
                      {date.format(new Date(issue.stats.pushedAt))}
                    </time>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className={styles.srOnly} role="status">
        {announce}
      </p>
    </div>
  );
}

/** The three panels of the feature card. Rendered once live and, during a project change, again inside every flipping tile. */
function FeatureContent({ feature, locale }: { feature: ProjectIssue; locale: string }) {
  const t = useTranslations('projects');
  const tCommon = useTranslations('common');
  const date = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const featureSummary = summaryOf(feature);
  const featureLanguages = feature.stats?.languages ?? [];

  return (
    <>
      <div className={styles.featurePanel}>
        <span className={styles.circle} aria-hidden="true" />
        <span className={styles.circleGold} aria-hidden="true" />
        <span className={styles.dotGrid} aria-hidden="true" />
        <p className={styles.featureKicker}>{t('featureProject')}</p>
        <div className={styles.featurePanelFoot}>
          <h2 className={styles.panelName}>{feature.title}</h2>
          <p className={`${styles.links} ${styles.linksOnDark}`}>
            <a href={feature.url} className={styles.link}>
              {t('viewCode')} <span aria-hidden="true">→</span>
            </a>
            {feature.demoUrl && (
              <a href={feature.demoUrl} className={styles.link}>
                {tCommon('liveDemo')} <span aria-hidden="true">→</span>
              </a>
            )}
          </p>
        </div>
      </div>

      <div className={styles.featureBody}>
        <div className={styles.featureMobileHead}>
          <span className={styles.tab} aria-hidden="true" />
          <h2 className={styles.cardTitle}>{feature.title}</h2>
        </div>
        <p className={isPlaceholder(featureSummary) ? styles.placeholder : styles.summary}>
          {featureSummary}
        </p>

        {feature.stats && (
          <dl className={styles.facts}>
            <div className={styles.factDesktopOnly}>
              <dt>{t('lastCommit')}</dt>
              <dd>{date.format(new Date(feature.stats.pushedAt))}</dd>
            </div>
            {featureLanguages.length > 0 && (
              <>
                {!feature.stack && (
                  <div className={styles.factDesktopOnly}>
                    <dt>{t('language')}</dt>
                    <dd>{featureLanguages[0].name}</dd>
                  </div>
                )}
                <div className={styles.languageSplit}>
                  <dt>{t('languageSplit')}</dt>
                  <dd>
                    <LanguageBar languages={featureLanguages} />
                    <span className={styles.splitText}>
                      {featureLanguages.map((l) => `${l.name} ${l.percent}%`).join(' · ')}
                    </span>
                  </dd>
                </div>
              </>
            )}
          </dl>
        )}

        <StackBlock stack={feature.stack} />
      </div>

      <div className={styles.screenshot}>
        <ScreenshotImage screenshot={feature.screenshot} />
      </div>

      <div className={styles.featureMobileFoot}>
        <p className={styles.links}>
          <a href={feature.url} className={styles.link}>
            {tCommon('code')} <span aria-hidden="true">→</span>
          </a>
          {feature.demoUrl && (
            <a href={feature.demoUrl} className={styles.link}>
              {tCommon('liveDemo')} <span aria-hidden="true">→</span>
            </a>
          )}
        </p>
        {feature.stats && (
          <time className={styles.cardDate} dateTime={feature.stats.pushedAt}>
            {date.format(new Date(feature.stats.pushedAt))}
          </time>
        )}
      </div>
    </>
  );
}

function StackBlock({ stack }: { stack: readonly string[] | undefined }) {
  const t = useTranslations('projects');
  return (
    <div className={styles.stackBlock}>
      <p className={styles.stackLabel}>{t('stack')}</p>
      <ul className={styles.stack}>
        {(stack ?? [t('stackPlaceholder')]).map((name) => (
          <li key={name} className={stack ? undefined : styles.stackPlaceholder}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScreenshotImage({ screenshot }: { screenshot: ProjectIssue['screenshot'] }) {
  const t = useTranslations('projects');
  if (!screenshot) return <p>{t('screenshot')}</p>;
  return (
    <Image
      src={screenshot.src}
      width={screenshot.width}
      height={screenshot.height}
      alt={screenshot.alt}
      sizes="(min-width: 1200px) 25vw, 100vw"
      className={styles.screenshotImage}
    />
  );
}

/** Decorative — the same numbers are printed as text beside it. */
function LanguageBar({ languages }: { languages: readonly RepoLanguage[] }) {
  return (
    <div className={styles.bar} aria-hidden="true">
      {languages.map((l, j) => (
        <span
          key={l.name}
          className={styles.segment}
          data-tone={j % 3}
          style={{ flexGrow: l.percent }}
        />
      ))}
    </div>
  );
}
