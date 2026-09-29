'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { MarginNote } from '@/components/MarginNote/MarginNote';
import type { ProjectIssue, RepoLanguage } from '@/lib/github/repos';

import { FetchedAgo } from './FetchedAgo';
import styles from './Projects.module.css';

/** A summary still in [BRACKETS] is a placeholder awaiting Kateryna — CLAUDE.md rule 2. */
const isPlaceholder = (text: string) => text.startsWith('[');

/** Accent per project, fixed to the repo so its colour follows it into the feature slot. */
const ACCENTS = ['emerald', 'coral', 'mustard', 'deep'] as const;

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
  // `slots[0]` is the feature, the rest are the cards in order. Swapping keeps
  // every card in its own slot, so the button the visitor just pressed stays
  // mounted and keeps focus.
  const [slots, setSlots] = useState(() => issues.map((_, i) => i));
  const [announce, setAnnounce] = useState('');

  const date = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const summaryOf = (issue: ProjectIssue) =>
    isPlaceholder(issue.summary) ? issue.summary : issue.summary || issue.stats?.description || '';

  function promote(slot: number) {
    setSlots((prev) => {
      const next = [...prev];
      [next[0], next[slot]] = [next[slot], next[0]];
      return next;
    });
    setAnnounce(t('nowFeatured', { name: issues[slots[slot]].repo }));
  }

  const feature = issues[slots[0]];
  const featureAccent = ACCENTS[slots[0] % ACCENTS.length];
  const featureSummary = summaryOf(feature);
  const featureLanguages = feature.stats?.languages ?? [];

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
        <MarginNote>{t('marginNote')}</MarginNote>
      </div>

      <article className={styles.feature} data-accent={featureAccent}>
        <div className={styles.featurePanel}>
          <span className={styles.circle} aria-hidden="true" />
          <span className={styles.circleGold} aria-hidden="true" />
          <span className={styles.dotGrid} aria-hidden="true" />
          <p className={styles.featureKicker}>{t('featureProject')}</p>
          <div className={styles.featurePanelFoot}>
            <h2 className={styles.panelName}>{feature.repo}</h2>
            <p className={`${styles.links} ${styles.linksOnDark}`}>
              <a href={feature.url} className={styles.link}>
                {t('viewCode')} <span aria-hidden="true">→</span>
              </a>
              {feature.demoUrl && (
                <a href={feature.demoUrl} className={styles.link}>
                  {t('demo')} <span aria-hidden="true">→</span>
                </a>
              )}
            </p>
          </div>
        </div>

        <div className={styles.featureBody}>
          <p className={isPlaceholder(featureSummary) ? styles.placeholder : styles.summary}>
            {featureSummary}
          </p>

          {feature.stats && (
            <dl className={styles.facts}>
              <div>
                <dt>{t('lastCommit')}</dt>
                <dd>{date.format(new Date(feature.stats.pushedAt))}</dd>
              </div>
              {featureLanguages.length > 0 && (
                <>
                  {!feature.stack && (
                    <div>
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

          <div className={styles.stackBlock}>
            <p className={styles.stackLabel}>{t('stack')}</p>
            <ul className={styles.stack}>
              {(feature.stack ?? [t('stackPlaceholder')]).map((name) => (
                <li key={name} className={feature.stack ? undefined : styles.stackPlaceholder}>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.screenshot}>
          {feature.screenshot ? (
            <Image
              src={feature.screenshot.src}
              width={feature.screenshot.width}
              height={feature.screenshot.height}
              alt={feature.screenshot.alt}
              sizes="(min-width: 1200px) 25vw, 100vw"
              className={styles.screenshotImage}
            />
          ) : (
            <p>{t('screenshot')}</p>
          )}
        </div>
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
                  aria-label={t('makeFeature', { name: issue.repo })}
                  onClick={() => promote(i + 1)}
                >
                  {issue.repo}
                </button>
              </h2>
              <p className={isPlaceholder(summary) ? styles.placeholder : styles.summary}>
                {summary}
              </p>

              <div className={styles.cardFoot}>
                {languages.length > 0 && <LanguageBar languages={languages} />}
                {issue.stats && (
                  <p className={styles.cardMeta}>
                    {issue.stack ? issue.stack.join(' · ') : languages[0]?.name}
                  </p>
                )}
                <div className={styles.cardBottom}>
                  <p className={styles.links}>
                    <a href={issue.url} className={styles.link}>
                      {t('code')} <span aria-hidden="true">→</span>
                    </a>
                    {issue.demoUrl && (
                      <a href={issue.demoUrl} className={styles.link}>
                        {t('demo')} <span aria-hidden="true">→</span>
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
