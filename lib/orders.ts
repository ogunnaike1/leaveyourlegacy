'use client';
// Orders placed in this browser, kept in localStorage so the account page can list them.
export type OrderLine = { id: string; name: string; color: string; qty: number; price: number };
export type Order = {
  no: string; placedAt: string; email: string; name: string; address: string;
  shipping: string; payment: string; lines: OrderLine[];
  subtotal: number; discount: number; code: string; shippingPrice: number; total: number;
};

const KEY = 'leaveyourlegacy.orders.v1';

export function listOrders(): Order[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
}
export function saveOrder(o: Order) {
  try { localStorage.setItem(KEY, JSON.stringify([o, ...listOrders()])); } catch {}
}
