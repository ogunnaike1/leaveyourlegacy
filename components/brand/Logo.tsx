import type { CSSProperties } from 'react';

/**
 * Leave Your Legacy — brand mark.
 * L · Y · L as one architectural glyph: two L's facing each other with the Y rising between them. Their feet and
 * the Y's stem meet on a shared baseline, read as a plinth: something built to stand for a long time.
 * Drawn on a 48-unit grid with 4-unit strokes; every part is a rectangle or a straight polygon so it extrudes
 * cleanly in 3D (see LogoMark3D) and stays crisp down to 16px.
 */
export const MARK_PARTS: { kind: 'rect' | 'poly'; d: number[] }[] = [
  { kind: 'rect', d: [4, 6, 4, 36] },    // left L — stem
  { kind: 'rect', d: [4, 38, 15, 4] },   // left L — foot
  { kind: 'rect', d: [40, 6, 4, 36] },   // right L — stem
  { kind: 'rect', d: [29, 38, 15, 4] },  // right L — foot
  { kind: 'rect', d: [22, 21, 4, 21] },  // Y — stem
  // Y — arms, cut flat at the cap height (y = 6) to align with the L stems
  { kind: 'poly', d: [12.62, 6, 17.38, 6, 26, 19.41, 26, 24, 22, 24, 22, 20.59] },
  { kind: 'poly', d: [35.38, 6, 30.62, 6, 22, 19.41, 22, 24, 26, 24, 26, 20.59] }
];

export function LogoMark({ size = 24, className, style, title = 'Leave Your Legacy' }: { size?: number; className?: string; style?: CSSProperties; title?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} style={style} fill="currentColor" {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}>
      {MARK_PARTS.map((p, i) =>
        p.kind === 'rect'
          ? <rect key={i} x={p.d[0]} y={p.d[1]} width={p.d[2]} height={p.d[3]} />
          : <polygon key={i} points={p.d.join(' ')} />
      )}
    </svg>
  );
}

/** Wordmark: Archivo 600, wide (118%), tracked out — the same voice as the original HALDEN wordmark. */
export function Wordmark({ size = 13, tracking = '.3em', className, style }: { size?: number; tracking?: string; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={'font-sans font-semibold whitespace-nowrap [font-stretch:118%] ' + (className || '')}
      style={{ fontSize: size, letterSpacing: tracking, marginRight: `-${tracking}`, lineHeight: 1, ...style }}
    >LEAVE YOUR LEGACY</span>
  );
}

/** Horizontal lockup: mark + wordmark. `markSize` ≈ 1.75 × wordmark cap size keeps the optical weights balanced. */
export function Logo({ size = 13, markSize, gap = 12, showWordmark = true, className, style }: { size?: number; markSize?: number; gap?: number; showWordmark?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <span className={'inline-flex items-center ' + (className || '')} style={{ gap, ...style }}>
      <LogoMark size={markSize ?? Math.round(size * 1.75)} title="" />
      {showWordmark ? <Wordmark size={size} /> : <span className="sr-only">Leave Your Legacy</span>}
    </span>
  );
}

/** Oversized wordmark that always spans its container exactly (footer). */
export function WordmarkFit({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 1000 64" className={'block w-full h-auto ' + (className || '')} style={style} role="img" aria-label="Leave Your Legacy" preserveAspectRatio="xMinYMid meet">
      <text
        x="0" y="58" textLength="1000" lengthAdjust="spacingAndGlyphs" fill="currentColor"
        style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontStretch: '125%', fontSize: 72, letterSpacing: '.04em' }}
      >LEAVE YOUR LEGACY</text>
    </svg>
  );
}
