import type { CSSProperties } from 'react';
import { MARK_D, MARK_H, MARK_W } from './mark-path';

/**
 * Leave Your Legacy — brand system, built from the supplied logo artwork.
 * Mark: two stepped L's joined by a sweep, in brass. Wordmark: lowercase "leaveyourlegacy" in Jost with "your"
 * in brass. Brass (#A8865A) is the original gold toned down to sit with the site's charcoal / stone palette.
 */
export const BRASS = '#A8865A';

export function LogoMark({ size = 24, color = BRASS, className, style, title = 'Leave Your Legacy' }: { size?: number; color?: string; className?: string; style?: CSSProperties; title?: string }) {
  return (
    <svg
      viewBox={`0 0 ${MARK_W} ${MARK_H}`} height={size} width={(size * MARK_W) / MARK_H}
      className={className} style={{ display: 'block', ...style }} fill={color}
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
    >
      <path d={MARK_D} />
    </svg>
  );
}

/** "leaveyourlegacy" — Jost, lowercase, set solid; "your" in brass. Inherits the text colour for the rest. */
export function Wordmark({ size = 16, accent = BRASS, weight = 400, className, style }: { size?: number; accent?: string; weight?: number; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={'whitespace-nowrap ' + (className || '')}
      style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: weight, fontSize: size, lineHeight: 1, letterSpacing: '.01em', ...style }}
    >leave<span style={{ color: accent }}>your</span>legacy</span>
  );
}

/** Horizontal lockup: mark + wordmark. Mark height ≈ 1.9× the wordmark size balances the two optically. */
export function Logo({ size = 16, markSize, gap, showWordmark = true, className, style }: { size?: number; markSize?: number; gap?: number; showWordmark?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <span className={'inline-flex items-center ' + (className || '')} style={{ gap: gap ?? Math.round(size * 0.6), ...style }}>
      <LogoMark size={markSize ?? Math.round(size * 1.9)} title="" />
      {showWordmark ? <Wordmark size={size} /> : <span className="sr-only">Leave Your Legacy</span>}
    </span>
  );
}

/** Stacked lockup, as in the original artwork: mark centred above the wordmark. */
export function LogoStacked({ size = 32, className, style }: { size?: number; className?: string; style?: CSSProperties }) {
  return (
    <span className={'inline-flex flex-col items-center ' + (className || '')} style={{ gap: size * 0.55, ...style }}>
      <LogoMark size={size * 3.6} title="" />
      <Wordmark size={size} />
    </span>
  );
}

/** Oversized wordmark that always spans its container exactly (footer). */
export function WordmarkFit({ className, style, accent }: { className?: string; style?: CSSProperties; accent?: string }) {
  return (
    <svg viewBox="0 0 1000 120" className={'block w-full h-auto ' + (className || '')} style={style} role="img" aria-label="Leave Your Legacy" preserveAspectRatio="xMinYMid meet">
      <text x="0" y="98" textLength="1000" lengthAdjust="spacingAndGlyphs" fill="currentColor" style={{ fontFamily: 'var(--font-jost), sans-serif', fontWeight: 400, fontSize: 132 }}>
        leave<tspan fill={accent ?? 'currentColor'}>your</tspan>legacy
      </text>
    </svg>
  );
}
