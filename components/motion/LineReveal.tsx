import type { CSSProperties, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Transition duration in seconds. */
  dur: number;
  delay?: number;
  /** Mask padding: 'display' = 0 .1em <pb> 0 with -.1em right margin (glyph overhang); 'serif' = bottom only. */
  mask?: 'display' | 'serif' | 'none';
  pb?: string;
  /** Hidden offset, 108% for headlines. */
  from?: string;
  ease?: string;
  innerClassName?: string;
  innerStyle?: CSSProperties;
};

/** One line in an overflow-hidden mask; the inner line rises from translateY(from) as --in goes 0 → 1. */
export default function LineReveal({ children, dur, delay = 0, mask = 'display', pb = '.04em', from = '108%', ease = 'cubic-bezier(.2,.7,.1,1)', innerClassName, innerStyle }: Props) {
  const outer: CSSProperties =
    mask === 'display' ? { padding: `0 .1em ${pb} 0`, marginRight: '-.1em' } : mask === 'serif' ? { paddingBottom: pb } : {};
  return (
    <span className="block overflow-hidden" style={outer}>
      <span
        className={'block ' + (innerClassName || '')}
        style={{ ...innerStyle, transform: `translateY(calc((1 - var(--in,0)) * ${from}))`, transition: `transform ${dur}s ${ease}${delay ? ' ' + delay + 's' : ''}` }}
      >
        {children}
      </span>
    </span>
  );
}
