import type { MouseEvent } from 'react';

// The prototype drives hover visuals through a --h var toggled by data-hover (see engine.ts stylesheet).
export const hover = {
  onMouseEnter: (e: MouseEvent<HTMLElement>) => e.currentTarget.setAttribute('data-hover', '1'),
  onMouseLeave: (e: MouseEvent<HTMLElement>) => e.currentTarget.setAttribute('data-hover', '0')
};
