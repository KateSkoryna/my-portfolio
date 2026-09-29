'use client';

import { useCallback, useLayoutEffect, useRef, type ReactNode } from 'react';

import styles from './Handbook.module.css';

/**
 * One text page of the book. The eyebrow/title/underline (`head`) always render
 * at full size; the body is scaled down when it would overflow the page — the
 * published handbook's fit-to-page behaviour, longer German copy included.
 *
 * To keep the visible width at exactly 100% after scaling, the body's layout
 * width is first widened by the inverse scale, then re-measured: two passes
 * account for the changed line wrapping.
 */
export function HandbookPage({
  className,
  side,
  num,
  head,
  children,
}: {
  className: string;
  /** Which side the page number sits on. */
  side: 'left' | 'right';
  num: string;
  head: ReactNode;
  children: ReactNode;
}) {
  const pageRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const fit = useCallback(() => {
    const page = pageRef.current;
    const inner = innerRef.current;
    if (!page || !inner) return;

    inner.style.transform = 'none';
    inner.style.width = '100%';

    // Layout (unscaled) measurements only: the whole book sits inside a
    // scaled stage, which would skew getBoundingClientRect.
    const paddingBottom = parseFloat(getComputedStyle(page).paddingBottom) || 0;
    const avail = page.clientHeight - paddingBottom - inner.offsetTop;
    let need = inner.scrollHeight;
    if (need <= avail || need <= 0 || avail <= 0) return;

    let scale = Math.min(1, avail / need);
    for (let i = 0; i < 2; i++) {
      inner.style.width = `${(100 / scale).toFixed(4)}%`;
      need = inner.scrollHeight;
      scale = Math.min(1, avail / need);
    }
    inner.style.width = `${(100 / scale).toFixed(4)}%`;
    inner.style.transform = `scale(${scale.toFixed(4)})`;
  }, []);

  useLayoutEffect(() => {
    fit();
    // Web fonts change line breaks; the language changes the text under us.
    void document.fonts?.ready.then(fit);
    const observer = new MutationObserver(fit);
    if (innerRef.current) {
      observer.observe(innerRef.current, { childList: true, subtree: true, characterData: true });
    }
    window.addEventListener('resize', fit);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [fit]);

  return (
    <div ref={pageRef} className={className}>
      <div className={styles.pageHead}>{head}</div>
      <div ref={innerRef} className={styles.pageInner}>
        {children}
      </div>
      <span className={`${styles.pagenum} ${side === 'left' ? styles.l : styles.r}`}>{num}</span>
    </div>
  );
}
