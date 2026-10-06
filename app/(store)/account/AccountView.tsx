'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listOrders, type Order } from '@/lib/orders';
import { money } from '@/lib/format';

export default function AccountView() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  useEffect(() => { setOrders(listOrders()); }, []);
  if (orders === null) return null;
  if (!orders.length) {
    return (
      <div className="py-[28px] [border-top:1px_solid_rgba(28,27,25,.14)] flex flex-col gap-[20px] items-start">
        <p className="m-0 font-serif text-[36px] leading-[1.1]">No orders yet.</p>
        <Link href="/shop" className="text-[#1C1B19] text-[13px] tracking-[.06em] underline-offset-[5px]">Visit the shop</Link>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      {orders.map(o => (
        <article key={o.no} data-order={o.no} className="py-[28px] [border-top:1px_solid_rgba(28,27,25,.14)] flex flex-col gap-[16px]">
          <div className="flex flex-wrap justify-between gap-[12px] items-baseline">
            <h2 className="m-0 text-[20px] font-medium">Order {o.no}</h2>
            <span className="[font:400_11px/1_var(--font-mono)] tracking-[.1em] uppercase text-[#6B6761]">{new Date(o.placedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · {o.payment}</span>
          </div>
          <div className="flex flex-col gap-[8px]">
            {o.lines.map(l => (
              <div key={l.id + l.color} className="flex justify-between gap-[16px] text-[14px]">
                <span><Link href={'/products/' + l.id} className="text-inherit">{l.name}</Link> <span className="text-[#6B6761]">· {l.color} · ×{l.qty}</span></span>
                <span className="font-mono text-[13px]">{money(l.qty * l.price)}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-[6px] text-[14px] text-[#3A3835] pt-[12px] [border-top:1px_solid_rgba(28,27,25,.08)]">
            {o.discount > 0 && <div className="flex justify-between"><span>Discount ({o.code})</span><span className="font-mono text-[13px]">−{money(o.discount)}</span></div>}
            <div className="flex justify-between"><span>{o.shipping}</span><span className="font-mono text-[13px]">{o.shippingPrice ? money(o.shippingPrice) : 'Included'}</span></div>
            <div className="flex justify-between font-medium text-[#1C1B19]"><span>Total</span><span className="font-mono">{money(o.total)}</span></div>
          </div>
          <span className="text-[13px] text-[#6B6761]">Delivering to {o.name}, {o.address} · confirmation sent to {o.email}</span>
        </article>
      ))}
    </div>
  );
}
