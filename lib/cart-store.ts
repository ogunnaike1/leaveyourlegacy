'use client';
// HALDEN — cart. Same API, line shape and localStorage key/format as design-reference/store.js.
import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';
import { byId, type Product } from './catalogue';

export type CartLine = { key: string; id: string; color: string; qty: number };
export type CartLineWithProduct = CartLine & { product: Product };

export const CART_KEY = 'halden.cart.v1';

type CartState = {
  lines: CartLine[];
  add: (id: string, color?: string | null, qty?: number, open?: boolean) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

// Persist the bare line array (not zustand's {state, version} envelope) so the key holds
// exactly what the prototype wrote.
const storage: PersistStorage<Pick<CartState, 'lines'>> = {
  getItem: name => {
    try {
      const raw = localStorage.getItem(name);
      const lines = raw ? JSON.parse(raw) : [];
      return { state: { lines: Array.isArray(lines) ? lines : [] }, version: 0 };
    } catch {
      return { state: { lines: [] }, version: 0 };
    }
  },
  setItem: (name, value) => {
    try { localStorage.setItem(name, JSON.stringify(value.state.lines)); } catch {}
  },
  removeItem: name => {
    try { localStorage.removeItem(name); } catch {}
  }
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add(id, color, qty = 1, open = true) {
        const p = byId(id); if (!p) return;
        const c = color || p.colors[0].name; const key = id + '|' + c;
        const lines = get().lines;
        const ex = lines.find(l => l.key === key);
        set({ lines: ex ? lines.map(l => (l.key === key ? { ...l, qty: l.qty + qty } : l)) : [...lines, { key, id, color: c, qty }] });
        if (open) useUI.getState().openCart();
      },
      setQty(key, qty) {
        const lines = get().lines;
        if (!lines.find(x => x.key === key)) return;
        set({ lines: lines.map(l => (l.key === key ? { ...l, qty: Math.max(0, qty) } : l)).filter(x => x.qty > 0) });
      },
      remove(key) { set({ lines: get().lines.filter(x => x.key !== key) }); },
      clear() { set({ lines: [] }); }
    }),
    { name: CART_KEY, storage, partialize: s => ({ lines: s.lines }), skipHydration: true }
  )
);

export const cartLines = (lines: CartLine[]): CartLineWithProduct[] =>
  lines.map(l => ({ ...l, product: byId(l.id)! })).filter(l => l.product);
export const cartCount = (lines: CartLine[]) => lines.reduce((a, l) => a + l.qty, 0);
export const cartSubtotal = (lines: CartLine[]) => cartLines(lines).reduce((a, l) => a + l.qty * l.product.price, 0);

/** Overlay state shared by the header, drawers and add-to-bag buttons. */
type UIState = {
  menu: boolean; search: boolean; cart: boolean;
  set: (s: Partial<Pick<UIState, 'menu' | 'search' | 'cart'>>) => void;
  openCart: () => void;
};
export const useUI = create<UIState>()(set => ({
  menu: false, search: false, cart: false,
  set: s => set(s),
  openCart: () => set({ cart: true, search: false, menu: false })
}));
