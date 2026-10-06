'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useUI } from '@/lib/cart-store';
import { products } from '@/lib/catalogue';
import { money } from '@/lib/format';

export default function SearchSheet() {
  const search = useUI(s => s.search);
  const set = useUI(s => s.set);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!search) return;
    const t = setTimeout(() => ref.current && ref.current.focus(), 300);
    return () => clearTimeout(t);
  }, [search]);

  const query = q.trim().toLowerCase();
  const results = (query ? products.filter(p => (p.name + ' ' + p.type + ' ' + p.category + ' ' + p.materials).toLowerCase().includes(query)) : products.filter(p => p.best)).slice(0, 8);
  const close = () => set({ search: false });

  return (
    <>
      <div onClick={close} className="fixed inset-0 z-[55] bg-[rgba(18,17,16,.4)] [transition:opacity_.5s_ease]" style={{ opacity: search ? 1 : 0, pointerEvents: search ? 'auto' : 'none' }} />
      <div
        className="fixed left-0 right-0 top-0 z-[56] bg-[#F2EFEA] text-[#1C1B19] font-sans p-[clamp(20px,3.4vw,48px)] [transition:transform_.7s_cubic-bezier(.7,0,.2,1)] max-h-[88vh] overflow-auto"
        style={{ transform: search ? 'translateY(0)' : 'translateY(-102%)' }}
        aria-hidden={!search}
      >
        <div className="flex justify-between items-center [font:400_11px/1_var(--font-mono)] tracking-[.1em] uppercase text-[#6B6761]">
          <span>Search</span>
          <button onClick={close} className="appearance-none [background:none] border-0 [font:inherit] [letter-spacing:inherit] [text-transform:inherit] text-[#1C1B19] cursor-pointer py-[12px] px-0">Close</button>
        </div>
        <input
          ref={ref} value={q} onChange={e => setQ(e.target.value)} placeholder="Bench, dumbbells, mirror…"
          className="w-full mt-[16px] border-0 [border-bottom:1px_solid_#1C1B19] bg-transparent outline-none font-sans font-normal [font-stretch:90%] text-[clamp(32px,5vw,64px)] tracking-[-.02em] p-[8px_0_16px] text-[#1C1B19]"
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-[0_32px] mt-[24px]">
          {results.map(p => (
            <Link key={p.id} href={'/products/' + p.id} onClick={close} className="flex justify-between items-baseline gap-[16px] py-[14px] [border-bottom:1px_solid_rgba(28,27,25,.12)] text-inherit no-underline">
              <span className="flex flex-col gap-[4px]"><span className="text-[15px] font-medium">{p.name}</span><span className="text-[12px] text-[#6B6761]">{p.type}</span></span>
              <span className="[font:400_12px/1_var(--font-mono)]">{money(p.price)}</span>
            </Link>
          ))}
        </div>
        {!!query && results.length === 0 && (
          <p className="m-[24px_0_0] text-[14px] text-[#6B6761]">Nothing matches that yet. Try “bench” or “walnut”.</p>
        )}
      </div>
    </>
  );
}
