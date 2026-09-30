import type { CSSProperties } from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { itemsBase, localizeItems, profile } from '@/content/items';
import { SocialLink } from '@/components/SocialLink/SocialLink';

import { FloatingItem } from './FloatingItem';
import { PileBook } from './Pile';
import { DescriptionPanel } from './DescriptionPanel';
import { Carousel } from './Carousel';
import { ItemCta } from './ItemCta';
import { IntroGate } from './IntroGate';
import { TypedText } from './TypedText';
import { introSkipScript } from './intro';
import { BookBack } from './BookBack';
import styles from './Landing.module.css';

/** Lands on the CV first — the item recruiters look for. */
const DEFAULT_INDEX = Math.max(
  0,
  itemsBase.findIndex((item) => item.id === 'resume'),
);

/** Splits off the first word so the role eyebrow breaks after "Frontend-Focused". */
function splitFirstWord(text: string): [string, string] {
  const firstSpace = text.indexOf(' ');
  return firstSpace === -1 ? [text, ''] : [text.slice(0, firstSpace), text.slice(firstSpace + 1)];
}

/**
 * The stack — DESIGN.md §4.1. A Server Component: every item's cover, pile
 * and description are rendered here once, up front, and handed to
 * `Carousel` (the only client-side piece) as five pre-built slides — see
 * the note on `FloatingItem` for why that split exists.
 */
export async function Landing() {
  const t = await getTranslations('landing');
  const tProfile = await getTranslations('profile');
  const tItems = await getTranslations('items');
  const tCommon = await getTranslations('common');
  const items = localizeItems(tItems);
  const bio = tProfile('bio');
  const basedIn = t('basedIn', { city: tProfile('city') });
  const [roleLead, roleLast] = splitFirstWord(tProfile('role'));

  const slides = items.map((item) => ({
    id: item.id,
    back: <BookBack item={item} />,
    floating: <FloatingItem item={item} />,
    description: <DescriptionPanel item={item} descriptionLabel={t('descriptionLabel')} />,
    cta: <ItemCta item={item} withDownload />,
  }));

  const pileBooks = items.map((item) => ({
    id: item.id,
    thickness: item.thickness,
    node: <PileBook item={item} />,
  }));

  return (
    <main id="main" className={styles.landing} data-intro="play" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: introSkipScript }} />
      <IntroGate />
      <section
        className={styles.identity}
        aria-label={t('identityLabel')}
        style={{ '--bio-chars': bio.length } as CSSProperties}
      >
        <div className={styles.identityMain}>
          {profile.photo.startsWith('[') ? (
            <div className={styles.photo}>{profile.photo}</div>
          ) : (
            <Image
              src={profile.photo}
              alt={profile.name}
              width={220}
              height={220}
              className={styles.photoImage}
              priority
            />
          )}
          <p className={styles.role}>
            <TypedText
              text={roleLead}
              intro
              start="var(--motion-intro-text-at)"
              step="var(--motion-type-char-fast)"
            />
            <br />
            <TypedText
              text={roleLast}
              intro
              start="var(--motion-intro-text-at)"
              step="var(--motion-type-char-fast)"
              startIndex={roleLead.length + 1}
            />
          </p>
          <h1 className={styles.name}>
            <TypedText
              text={profile.name}
              intro
              start="calc(var(--motion-intro-text-at) + 2 * var(--motion-intro-stagger))"
              step="var(--motion-type-char)"
            />
          </h1>
        </div>
        <div className={styles.identityAbout}>
          <p className={styles.stack}>
            <TypedText
              text={profile.stackLine}
              intro
              start="calc(var(--motion-intro-text-at) + 12 * var(--motion-intro-stagger))"
              step="var(--motion-type-char-fast)"
            />
            <br />
            <TypedText
              text={basedIn}
              intro
              start="calc(var(--motion-intro-text-at) + 12 * var(--motion-intro-stagger))"
              step="var(--motion-type-char-fast)"
              startIndex={profile.stackLine.length + 1}
            />
          </p>
          <p className={styles.bio}>
            <TypedText
              text={tProfile('bio')}
              intro
              start="calc(var(--motion-intro-text-at) + 15 * var(--motion-intro-stagger))"
              step="var(--motion-type-char-fast)"
            />
          </p>
          <div className={styles.socials}>
            <SocialLink kind="github" href={profile.github} className={styles.socialItem}>
              GitHub
            </SocialLink>
            <SocialLink kind="linkedin" href={profile.linkedin} className={styles.socialItem}>
              LinkedIn
            </SocialLink>
            <SocialLink kind="email" href={`mailto:${profile.email}`} className={styles.socialItem}>
              {tCommon('email')}
            </SocialLink>
          </div>
        </div>
      </section>

      <Carousel
        slides={slides}
        pileBooks={pileBooks}
        prevLabel={tCommon('prevItem')}
        nextLabel={tCommon('nextItem')}
        defaultIndex={DEFAULT_INDEX}
        goToShelfLabel={tCommon('goToShelf')}
        pileNote={t('pileNote')}
        pileNoteCaption={t('pileNoteCaption')}
        flipLabel={t('flipBook')}
      />
    </main>
  );
}
