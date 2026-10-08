import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import { profile } from '@/content/items';
import {
  getResumeContent,
  resumeContact,
  resumeProjectLinks,
  type ResumeContent,
  type ResumeRole,
} from '@/content/resume';

import styles from './Resume.module.css';

/**
 * The CV's sections, server-rendered. `PagedBook` flows them across the
 * pages of the book; on print they become one plain document
 * (`Resume.module.css`).
 * Text comes from `content/resume.ts` for the current locale (English is
 * verbatim from `docs/CV.md`).
 */

/** The CV text for the current locale. */
function useContent(): ResumeContent {
  return getResumeContent(useLocale());
}

function Role({ role }: { role: ResumeRole }) {
  return (
    <article className={styles.role}>
      <h3 className={styles.roleTitle}>
        {role.title} · {role.company}
      </h3>
      <p className={`${styles.roleMeta} ${styles.roleMetaSplit}`}>
        <span>{role.location}</span>
        <span>{role.dates}</span>
      </p>
      <ul className={styles.bullets}>
        {role.bullets.map((b) => (
          <li key={b.label ?? b.text}>
            {b.label && <strong className={styles.bulletLabel}>{b.label}: </strong>}
            {b.text}
          </li>
        ))}
      </ul>
    </article>
  );
}

function PageOne() {
  const t = useTranslations('resume');
  const tCommon = useTranslations('common');
  const c = useContent();
  return (
    <>
      <div className={styles.identity}>
        <h1 className={styles.name}>{profile.name}</h1>
        <p className={styles.headline}>
          {c.headline}
          <span className={styles.headlineStack}>{c.headlineStack}</span>
        </p>
        <p className={styles.contact}>
          <span>{c.city}</span>
          <a href={`mailto:${resumeContact.email}`}>{resumeContact.email}</a>
          <a href={resumeContact.linkedin}>{tCommon('linkedin')}</a>
          <a href={resumeContact.github}>{tCommon('github')}</a>
        </p>
      </div>
      <p className={styles.summary}>{c.summary}</p>
      <section aria-labelledby="resume-skills">
        <h2 id="resume-skills" className={styles.sectionHeading}>
          {t('skills')}
        </h2>
        <dl className={styles.skills}>
          {c.skills.map((s) => (
            <div key={s.group} className={styles.skillRow}>
              <dt>{s.group}</dt>
              <dd>{s.items.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

function PageTwo() {
  const t = useTranslations('resume');
  const c = useContent();
  return (
    <section aria-labelledby="resume-work">
      <h2 id="resume-work" className={styles.sectionHeading}>
        {t('workExperience')}
      </h2>
      <Role role={c.roles[0]} />
    </section>
  );
}

function PageThree() {
  const t = useTranslations('resume');
  const tCommon = useTranslations('common');
  const c = useContent();
  return (
    <>
      {/* The second role continues the "Work experience" section from the
          previous page; it has no heading of its own. */}
      <Role role={c.roles[1]} />
      <section aria-labelledby="resume-projects">
        <h2 id="resume-projects" className={styles.sectionHeading}>
          {t('projects')}
        </h2>
        {c.projects.map((p) => {
          const links = resumeProjectLinks(p);
          return (
            <article key={p.repo} className={styles.role}>
              <h3 className={styles.roleTitle}>
                {p.name}
                <span className={styles.projectLinks}>
                  {links.demo && <a href={links.demo}>{tCommon('liveDemo')}</a>}
                  <a href={links.code}>{tCommon('code')}</a>
                </span>
              </h3>
              <p className={styles.roleMeta}>{p.stack.join(' · ')}</p>
              <p className={styles.projectText}>{p.text}</p>
            </article>
          );
        })}
      </section>
    </>
  );
}

function PageFour() {
  const t = useTranslations('resume');
  const c = useContent();
  return (
    <section aria-labelledby="resume-education">
      <h2 id="resume-education" className={styles.sectionHeading}>
        {t('educationLanguages')}
      </h2>
      <ul className={styles.education}>
        {c.education.map((e) => (
          <li key={e.school}>
            <strong>{e.school}</strong> – {e.program} · {e.place}
          </li>
        ))}
      </ul>
      <p className={styles.languages}>
        <strong>{t('languages')}:</strong> {c.languages}
      </p>
    </section>
  );
}

/**
 * The whole CV as one continuous flow. `PagedBook` lays it out in columns,
 * one per page, so where a page ends depends on the size of the book — there
 * are no fixed "pages" here, only sections in reading order.
 */
/** The book's last leaf: the photo and the three ways to reach her. Not in print. */
export function ResumeClosing() {
  const tCommon = useTranslations('common');
  return (
    <section className={styles.closing} aria-labelledby="resume-contact" data-closing="">
      <h2 id="resume-contact" className={styles.sectionHeading}>
        {tCommon('getInTouch')}
      </h2>
      <Image
        src={profile.photo}
        alt={profile.name}
        width={160}
        height={160}
        className={styles.photo}
      />
      <ul className={styles.contactLinks}>
        <li>
          <a href={resumeContact.linkedin}>{tCommon('linkedin')}</a>
        </li>
        <li>
          <a href={resumeContact.github}>{tCommon('github')}</a>
        </li>
        <li>
          <a href={`mailto:${resumeContact.email}`}>{tCommon('email')}</a>
        </li>
      </ul>
      <p className={styles.closingNote}>{tCommon('closingNote')}</p>
    </section>
  );
}

export function ResumeContent() {
  return (
    <>
      <PageOne />
      <PageTwo />
      <PageThree />
      <PageFour />
    </>
  );
}
