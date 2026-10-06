import type { CSSProperties, ReactNode } from 'react';

/** Oversized layer shifted by --py = (centre − viewportCentre) × −factor (written by the engine). */
export default function Parallax({ factor, inset, className, style, children }: { factor: number; inset: string; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div data-parallax={String(factor)} className={'absolute left-0 right-0 ' + (className || '')} style={{ top: inset, bottom: inset, transform: 'translateY(var(--py,0px))', ...style }}>
      {children}
    </div>
  );
}
