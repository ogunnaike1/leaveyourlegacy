'use client';
import { useSyncExternalStore } from 'react';

const sub = (cb: () => void) => { addEventListener('resize', cb); return () => removeEventListener('resize', cb); };

/** window.innerWidth (1280 during SSR, as the prototype's fallback). */
export const useVw = () => useSyncExternalStore(sub, () => innerWidth, () => 1280);
/** window.innerHeight (900 during SSR). */
export const useVh = () => useSyncExternalStore(sub, () => innerHeight, () => 900);
