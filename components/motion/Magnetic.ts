import type { CSSProperties } from 'react';

/** Spread onto any [data-magnetic] element: the engine writes --mx (±3) / --my (±2). */
export const magnetic = { 'data-magnetic': '' } as const;
export const magneticTransform: CSSProperties = { transform: 'translate(calc(var(--mx,0) * 1px),calc(var(--my,0) * 1px))' };
