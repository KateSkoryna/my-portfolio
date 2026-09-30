import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { itemsBase, localizeItems, profile } from '@/content/items';
import { SocialLink } from '@/components/SocialLink/SocialLink';

import { FloatingItem } from './FloatingItem';
import { Pile } from './Pile';
import { DescriptionPanel } from './DescriptionPanel';
import { Carousel } from './Carousel';
import { ItemCta } from './ItemCta';
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
  const [roleLead, roleLast] = splitFirstWord(tProfile('role'));

  const slides = items.map((item, i) => ({
    id: item.id,
    back: <BookBack item={item} />,
    floating: <FloatingItem item={item} />,
    pile: <Pile items={items.filter((_, j) => j !== i)} />,
    description: <DescriptionPanel item={item} descriptionLabel={t('descriptionLabel')} />,
    cta: <ItemCta item={item} withDownload />,
  }));

  return (
    <main id="main" className={styles.landing}>
      <section className={styles.identity} aria-label={t('identityLabel')}>
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
            {roleLead}
            <br />
            {roleLast}
          </p>
          <h1 className={styles.name}>{profile.name}</h1>
        </div>
        <div className={styles.identityAbout}>
          <p className={styles.stack}>
            {profile.stackLine}
            <br />
            {t('basedIn', { city: tProfile('city') })}
          </p>
          <p className={styles.bio}>{tProfile('bio')}</p>
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
