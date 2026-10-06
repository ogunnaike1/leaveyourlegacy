'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getMotion } from './engine';
import { useCart, CART_KEY } from '@/lib/cart-store';

/** Boots the motion layer and the persisted cart (with cross-tab sync, as store.js did). */
export default function MotionRoot() {
  const pathname = usePathname();
  useEffect(() => {
    useCart.persist.rehydrate();
    const onStorage = (e: StorageEvent) => { if (e.key === CART_KEY) useCart.persist.rehydrate(); };
    addEventListener('storage', onStorage);
    return () => removeEventListener('storage', onStorage);
  }, []);
  useEffect(() => { getMotion().start(); }, [pathname]);
  return null;
}
