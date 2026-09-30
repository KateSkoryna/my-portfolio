import { createElement, type ReactNode } from 'react';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import { getHandbookContent } from '@/content/handbook';
import { profile } from '@/content/items';
import { resumeContact } from '@/content/resume';

import styles from './Handbook.module.css';
import { HandbookPage } from './HandbookPage';

const s = styles;

/**
 * The ten faces of the handbook's five leaves, ported from the published
 * `index.html`. Text comes from `content/handbook.<locale>.ts` by key; `H` puts
 * one of those HTML fragments into an element. Static, server-rendered.
 */

function useContent() {
  return getHandbookContent(useLocale());
}

/** `page-inner` -> `pageInner`, matching the class names in `Handbook.module.css`. */
const camel = (name: string) => name.replace(/-(\w)/g, (_, ch: string) => ch.toUpperCase());

/**
 * The text fragments carry plain class names (`class="k"`, `class="chip"`…); the
 * module renames its classes, so map each one to the module's name.
 */
const localize = (html: string) =>
  html.replace(/class="([^"]*)"/g, (_, names: string) => {
    const mapped = names.split(' ').map((n) => styles[camel(n)] ?? n);
    return `class="${mapped.join(' ')}"`;
  });

/** An element whose content is a keyed HTML fragment from the locale's text. */
function H({
  id,
  as,
  className,
}: {
  id: string;
  as: 'div' | 'p' | 'h1' | 'h2' | 'li' | 'span';
  className?: string;
}) {
  const c = useContent();
  return createElement(as, { className, dangerouslySetInnerHTML: { __html: localize(c[id]) } });
}

function Leaf1Front() {
  return (
    <>
      <div className={s.cover}>
        <span className={`${s.blob} ${s.b1}`} />
        <span className={`${s.blob} ${s.b2}`} />
        <span className={`${s.blob} ${s.b3}`} />
        <span className={s.dots} />
        <H id="l1f_kicker_1" as="div" className={s.kicker} />
        <H id="l1f_h1_2" as="h1" />
        <H id="l1f_sub_3" as="div" className={s.sub} />
        <svg className={s.subline} preserveAspectRatio="none" viewBox="0 0 120 8">
          <path
            d="M2 5 C 30 1, 70 8, 118 3"
            fill="none"
            stroke="var(--color-coral)"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </svg>
        <div className={s.foot}>
          <span className={s.name}>Kateryna Skoryna</span>
          <br />
          Software Developer · 2026
          <H id="l1f_turnhint_4" as="div" className={s.turnhint} />
        </div>
      </div>
    </>
  );
}

function Leaf1Back() {
  return (
    <>
      <div className={s.blankpage}>
        <span className={s.corner} />
        <H id="l1b_insideJoke_5" as="div" className={s.insideJoke} />
        <H id="l1b_tiny_6" as="span" className={s.tiny} />
      </div>
    </>
  );
}

function Leaf2Front() {
  return (
    <>
      <HandbookPage
        className={`${s.page} ${s.page2}`}
        side="right"
        num="2"
        head={
          <>
            <H id="l2f_eyebrow_7" as="div" className={s.eyebrow} />
            <H id="l2f_title_8" as="h2" className={s.title} />
            <svg className={s.underline} preserveAspectRatio="none" viewBox="0 0 118 9">
              <path
                d="M2 6 C 30 1, 78 9, 116 3"
                fill="none"
                stroke="var(--color-coral)"
                strokeLinecap="round"
                strokeWidth="4.5"
              />
            </svg>
          </>
        }
      >
        <H id="l2f_lead_9" as="p" className={s.lead} />
        <div className={s.blocks}>
          <H id="l2f_block_10" as="div" className={s.block} />
          <H id="l2f_block_11" as="div" className={s.block} />
          <H id="l2f_block_12" as="div" className={s.block} />
          <H id="l2f_block_13" as="div" className={s.block} />
          <H id="l2f_block_14" as="div" className={s.block} />
          <H id="l2f_block_15" as="div" className={s.block} />
        </div>
        <H id="l2f_tip_16" as="div" className={s.tip} />
        <div className={s.promptcard}>
          <H id="l2f_head_17" as="div" className={s.head} />
          <H id="l2f_prow_18" as="div" className={s.prow} />
          <H id="l2f_prow_19" as="div" className={s.prow} />
          <H id="l2f_prow_20" as="div" className={s.prow} />
          <H id="l2f_prow_21" as="div" className={s.prow} />
          <span className={s.blob} />
          <span className={`${s.blob} ${s.b}`} />
        </div>
      </HandbookPage>
    </>
  );
}

function Leaf2Back() {
  return (
    <>
      <HandbookPage
        className={`${s.page} ${s.page3}`}
        side="left"
        num="3"
        head={
          <>
            <H id="l2b_eyebrow_22" as="div" className={s.eyebrow} />
            <H id="l2b_title_23" as="h2" className={s.title} />
            <svg className={s.underline} preserveAspectRatio="none" viewBox="0 0 118 9">
              <path
                d="M2 6 C 30 1, 78 9, 116 3"
                fill="none"
                stroke="var(--color-coral)"
                strokeLinecap="round"
                strokeWidth="4.5"
              />
            </svg>
          </>
        }
      >
        <H id="l2b_lead_24" as="p" className={s.lead} />
        <div className={s.cols}>
          <div>
            <H id="l2b_colhead_25" as="div" className={s.colhead} />
            <div className={s.subgroup}>
              <H id="l2b_sg_26" as="div" className={s.sg} />
              <ul>
                <H id="l2b_li_27" as="li" />
                <H id="l2b_li_28" as="li" />
                <H id="l2b_li_29" as="li" />
              </ul>
            </div>
            <div className={s.subgroup}>
              <H id="l2b_sg_30" as="div" className={s.sg} />
              <ul>
                <H id="l2b_li_31" as="li" />
                <H id="l2b_li_32" as="li" />
                <H id="l2b_li_33" as="li" />
              </ul>
            </div>
            <div className={s.subgroup}>
              <H id="l2b_sg_34" as="div" className={s.sg} />
              <ul>
                <H id="l2b_li_35" as="li" />
                <H id="l2b_li_36" as="li" />
                <H id="l2b_li_37" as="li" />
              </ul>
            </div>
          </div>
          <div>
            <H id="l2b_colhead_38" as="div" className={s.colhead} />
            <H id="l2b_fail_39" as="div" className={s.fail} />
            <H id="l2b_fail_40" as="div" className={s.fail} />
            <H id="l2b_fail_41" as="div" className={s.fail} />
            <H id="l2b_handnote_42" as="div" className={s.handnote} />
          </div>
        </div>
      </HandbookPage>
    </>
  );
}

function Leaf3Front() {
  return (
    <>
      <HandbookPage
        className={s.page}
        side="right"
        num="4"
        head={
          <>
            <H id="l3f_eyebrow_43" as="div" className={s.eyebrow} />
            <H id="l3f_title_44" as="h2" className={s.title} />
            <svg className={s.underline} preserveAspectRatio="none" viewBox="0 0 118 9">
              <path
                d="M2 6 C 30 1, 78 9, 116 3"
                fill="none"
                stroke="var(--color-coral)"
                strokeLinecap="round"
                strokeWidth="4.5"
              />
            </svg>
          </>
        }
      >
        <H id="l3f_lead_45" as="p" className={s.lead} />
        <div className={s.modcards}>
          <div className={s.mod}>
            <div className={s.mh}>
              <H id="l3f_t_46" as="span" className={s.t} />
              <span className={s.tag}>Claude / Gemini + Genkit</span>
            </div>
            <H id="l3f_line_47" as="div" className={s.line} />
            <H id="l3f_line_48" as="div" className={s.line} />
          </div>
          <div className={s.mod}>
            <div className={s.mh}>
              <H id="l3f_t_49" as="span" className={s.t} />
              <span className={s.tag}>Claude</span>
            </div>
            <H id="l3f_line_50" as="div" className={s.line} />
            <H id="l3f_line_51" as="div" className={s.line} />
          </div>
          <div className={s.mod}>
            <div className={s.mh}>
              <H id="l3f_t_52" as="span" className={s.t} />
              <span className={s.tag}>NotebookLM (Gemini)</span>
            </div>
            <H id="l3f_line_53" as="div" className={s.line} />
            <H id="l3f_line_54" as="div" className={s.line} />
          </div>
        </div>
      </HandbookPage>
    </>
  );
}

function Leaf3Back() {
  const c = useContent();
  return (
    <>
      <HandbookPage
        className={`${s.page} ${s.pageGems} ${s.page5}`}
        side="left"
        num="5"
        head={
          <>
            <H id="l3b_eyebrow_55" as="div" className={s.eyebrow} />
            <H id="l3b_title_56" as="h2" className={s.title} />
            <svg className={s.underline} preserveAspectRatio="none" viewBox="0 0 118 9">
              <path
                d="M2 6 C 30 1, 78 9, 116 3"
                fill="none"
                stroke="var(--color-coral)"
                strokeLinecap="round"
                strokeWidth="4.5"
              />
            </svg>
          </>
        }
      >
        <div className={s.gem}>
          <Image
            src="/handbook/gem-architect.jpg"
            width={520}
            height={390}
            alt={c.alt_gemArchitect}
            className={s.gemImage}
          />
          <div className={s.gemBody}>
            <H id="l3b_gt_57" as="div" className={s.gt} />
            <H id="l3b_row_58" as="div" className={s.row} />
            <H id="l3b_row_59" as="div" className={`${s.row} ${s.instr}`} />
            <H id="l3b_row_60" as="div" className={s.row} />
          </div>
        </div>
        <div className={s.gem}>
          <Image
            src="/handbook/gem-nutritionist.jpg"
            width={520}
            height={390}
            alt={c.alt_gemNutritionist}
            className={s.gemImage}
          />
          <div className={s.gemBody}>
            <H id="l3b_gt_61" as="div" className={s.gt} />
            <H id="l3b_row_62" as="div" className={s.row} />
            <H id="l3b_row_63" as="div" className={`${s.row} ${s.instr}`} />
            <H id="l3b_row_64" as="div" className={s.row} />
          </div>
        </div>
        <div className={s.gem}>
          <Image
            src="/handbook/gem-fullstack.jpg"
            width={520}
            height={390}
            alt={c.alt_gemFullstack}
            className={s.gemImage}
          />
          <div className={s.gemBody}>
            <H id="l3b_gt_65" as="div" className={s.gt} />
            <H id="l3b_row_66" as="div" className={s.row} />
            <H id="l3b_row_67" as="div" className={`${s.row} ${s.instr}`} />
            <H id="l3b_row_68" as="div" className={s.row} />
          </div>
        </div>
        <H id="l3b_pattern_69" as="div" className={s.pattern} />
      </HandbookPage>
    </>
  );
}

function Leaf4Front() {
  return (
    <>
      <HandbookPage
        className={s.page}
        side="right"
        num="6"
        head={
          <>
            <H id="l4f_eyebrow_70" as="div" className={s.eyebrow} />
            <H id="l4f_title_71" as="h2" className={s.title} />
            <svg className={s.underline} preserveAspectRatio="none" viewBox="0 0 118 9">
              <path
                d="M2 6 C 30 1, 78 9, 116 3"
                fill="none"
                stroke="var(--color-coral)"
                strokeLinecap="round"
                strokeWidth="4.5"
              />
            </svg>
          </>
        }
      >
        <H id="l4f_modelNote_72" as="div" className={s.modelNote} />
        <div className={s.checklist}>
          <H id="l4f_check_73" as="div" className={s.check} />
          <H id="l4f_check_74" as="div" className={s.check} />
          <H id="l4f_check_75" as="div" className={s.check} />
          <H id="l4f_check_76" as="div" className={s.check} />
          <H id="l4f_check_77" as="div" className={s.check} />
          <H id="l4f_check_78" as="div" className={s.check} />
          <H id="l4f_check_79" as="div" className={s.check} />
          <H id="l4f_check_80" as="div" className={s.check} />
          <H id="l4f_check_81" as="div" className={s.check} />
          <H id="l4f_check_82" as="div" className={s.check} />
        </div>
        <H id="l4f_closequote_83" as="div" className={s.closequote} />
      </HandbookPage>
    </>
  );
}

function Leaf4Back() {
  return (
    <>
      <div className={s.blankpage}>
        <span className={s.corner} />
        <H id="l4b_insideJoke_84" as="div" className={s.insideJoke} />
      </div>
    </>
  );
}

function Leaf5Front() {
  const tCommon = useTranslations('common');
  return (
    <section className={s.closing} aria-labelledby="handbook-contact">
      <h2 id="handbook-contact" className={s.closingHeading}>
        {tCommon('getInTouch')}
      </h2>
      <Image
        src={profile.photo}
        alt={profile.name}
        width={160}
        height={160}
        className={s.closingPhoto}
      />
      <ul className={s.closingLinks}>
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
      <p className={s.closingNote}>{tCommon('closingNote')}</p>
    </section>
  );
}

function Leaf5Back() {
  return (
    <>
      <div className={s.backcover}>
        <span className={`${s.bcBlob} ${s.a}`} />
        <span className={`${s.bcBlob} ${s.b}`} />
        <span className={s.bcMark}>Prompting Handbook</span>
      </div>
    </>
  );
}

export interface HandbookLeaf {
  front: ReactNode;
  back: ReactNode;
}

/** The five leaves, cover first. Leaf `i` turns to reveal leaf `i + 1`'s front. */
export function handbookLeaves(): HandbookLeaf[] {
  return [
    { front: <Leaf1Front />, back: <Leaf1Back /> },
    { front: <Leaf2Front />, back: <Leaf2Back /> },
    { front: <Leaf3Front />, back: <Leaf3Back /> },
    { front: <Leaf4Front />, back: <Leaf4Back /> },
    { front: <Leaf5Front />, back: <Leaf5Back /> },
  ];
}
