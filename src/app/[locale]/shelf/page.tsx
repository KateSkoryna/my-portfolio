import { getTranslations } from 'next-intl/server';

import { localizeItems } from '@/content/items';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { PageFooter } from '@/components/PageFooter/PageFooter';
import { BookCover } from '@/components/BookCover/BookCover';
import { ClosedBook } from '@/components/ClosedBook/ClosedBook';
import { Eyebrow } from '@/components/Eyebrow/Eyebrow';
import { MarginNote } from '@/components/MarginNote/MarginNote';
import { Shelf, type ShelfSlide } from '@/components/Shelf/Shelf';

import styles from '@/components/Shelf/Shelf.module.css';

/** DESIGN.md §4.2's 216×260 reference cover, shared by `BookCover` and `ClosedBook`. */
const COVER_WIDTH = 216;

/**
 * DESIGN.md §4.2 — five covers (each captioned with its title and blurb)
 * above a separate closed-spine row, same x positions and widths. Mobile: a
 * vertical list of covers only, no closed row or its section
 * (`Shelf.module.css`). The secondary view off the landing pile's "Go to
 * shelf" link.
 *
 * `BookCover`/`ClosedBook` render here, server-side, once per item per
 * selection state — see the note on `Shelf` for why.
 */
export default async function ShelfPage() {
  const t = await getTranslations('shelf');
  const tItems = await getTranslations('items');
  const items = localizeItems(tItems);

  const slides: ShelfSlide[] = items.map((item) => {
    // Same caption under both selection states. Title + blurb only for
    // now — the route path and the metadata chips (dev-detail and
    // implementation-status text, e.g. "ISR · 1h") were both tried and
    // rejected here; what replaces the third line is still Kateryna's call.
    const caption = (
      <div className={styles.caption}>
        <p className={styles.captionTitle}>{item.title}</p>
        <p className={styles.captionBlurb}>{item.shortBlurb}</p>
      </div>
    );

    return {
      id: item.id,
      route: item.route,
      title: item.title,
      cover: (
        <>
          <div className={styles.art}>
            <BookCover item={item} size="shelf" />
          </div>
          {caption}
        </>
      ),
      coverSelected: (
        <>
          <div className={styles.art}>
            <BookCover item={item} size="shelf" selected />
          </div>
          {caption}
        </>
      ),
      closed: <ClosedBook item={item} width={COVER_WIDTH} />,
      closedSelected: <ClosedBook item={item} width={COVER_WIDTH} selected />,
    };
  });

  return (
    <>
      {/* No `routeLabel` — the page's own eyebrow + `<h1>` below already
          say "The shelf", so the header's small centred label was a
          redundant "Shelf" repeated right above it. */}
      <PageHeader backLabel={t('backToStack')} />
      <main id="main" className={styles.page}>
        <div className={styles.heading}>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className={styles.title}>{t('title')}</h1>
          <svg className={styles.titleUnderline} viewBox="0 0 84 7" fill="none" aria-hidden="true">
            <path
              d="M2 4.5 C 20 1, 50 7, 82 2.5"
              stroke="var(--color-coral)"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <Shelf
          slides={slides}
          prevLabel={t('prevItem')}
          nextLabel={t('nextItem')}
          betweenRows={
            <div className={styles.closedHeading}>
              <hr className={styles.separator} />
              <div className={styles.closedHeadingRow}>
                <Eyebrow>{t('closedHeading')}</Eyebrow>
                <MarginNote>{t('closedNote')}</MarginNote>
              </div>
            </div>
          }
          afterClosedRow={<p className={styles.closedExplainer}>{t('closedExplainer')}</p>}
        />
      </main>
      <PageFooter />
    </>
  );
}
