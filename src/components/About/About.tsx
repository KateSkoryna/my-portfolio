import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { MarginNote } from '@/components/MarginNote/MarginNote';

import styles from './About.module.css';

/**
 * The photo essay: each picture sits after the fact numbered `after`. The
 * files are in `public/`; `position` keeps the face in frame when a portrait
 * photo is cropped to the 4:3 block.
 */
const PHOTOS = [
  { id: 'snow', after: 2, src: '/snow.jpg', position: '50% 50%' },
  { id: 'walk', after: 6, src: '/walk.webp', position: '50% 25%' },
  { id: 'book', after: 7, src: '/book.webp', position: '50% 50%' },
  { id: 'cruise', after: 10, src: '/cruise.webp', position: '50% 55%' },
] as const;

interface Fact {
  title: string;
  body: string;
}

/** Anything still in [BRACKETS] is a placeholder awaiting Kateryna — CLAUDE.md rule 2. */
const isPlaceholder = (text: string) => text.startsWith('[');

/**
 * DESIGN.md §3 `/about` — the newspaper: a double-ruled masthead, one
 * headline, then the facts and the photo essay in columns (four with a centre
 * fold on desktop, two on tablets, one on phones). It prints on the site's
 * own paper, so it reads as a newspaper through rules and columns only.
 *
 * Static, no client JS. Every fact and caption is a placeholder until she
 * writes them; the structure is what this phase delivers.
 */
export function About() {
  const t = useTranslations('about');
  const tItem = useTranslations('items.about');
  const facts = t.raw('facts') as Fact[];

  return (
    <article className={styles.page}>
      <header className={styles.masthead}>
        <p className={styles.dateline}>{tItem('coverKicker')}</p>
        <h1 className={styles.title}>{tItem('title')}</h1>
      </header>

      <div className={styles.headlineRow}>
        <h2 className={styles.headline}>{tItem('coverFoot')}</h2>
        <svg className={styles.underline} viewBox="0 0 84 7" fill="none" aria-hidden="true">
          <path
            d="M2 4.5 C 20 1, 50 7, 82 2.5"
            stroke="var(--color-coral)"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </svg>
        <MarginNote>{t('marginNote')}</MarginNote>
      </div>

      <div className={styles.columns}>
        {facts.flatMap((fact, i) => {
          const n = i + 1;
          const nodes = [
            <section key={`fact-${n}`} className={styles.fact}>
              <p className={styles.number} aria-hidden="true">
                {String(n).padStart(2, '0')}
              </p>
              <h3
                className={`${styles.factTitle} ${isPlaceholder(fact.title) ? styles.placeholder : ''}`}
              >
                {fact.title}
              </h3>
              <p
                className={`${styles.factBody} ${isPlaceholder(fact.body) ? styles.placeholder : ''}`}
              >
                {fact.body}
              </p>
            </section>,
          ];
          const photo = PHOTOS.find((p) => p.after === n);
          if (photo) {
            nodes.push(
              <figure key={`photo-${photo.id}`} className={styles.figure}>
                <div className={styles.photo}>
                  <Image
                    src={photo.src}
                    alt={t(`photos.${photo.id}.alt`)}
                    fill
                    sizes="(min-width: 1100px) 25vw, (min-width: 700px) 50vw, 100vw"
                    className={styles.image}
                    style={{ objectPosition: photo.position }}
                  />
                </div>
                <figcaption className={styles.caption}>
                  {t(`photos.${photo.id}.caption`)}
                </figcaption>
              </figure>,
            );
          }
          return nodes;
        })}
      </div>
    </article>
  );
}
