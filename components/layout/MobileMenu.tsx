'use client';
import Link from 'next/link';
import { useUI } from '@/lib/cart-store';
import { NAV } from './nav';

export default function MobileMenu() {
  const menu = useUI(s => s.menu);
  const set = useUI(s => s.set);
  return (
    <div
      className="fixed inset-0 z-[60] bg-[#121110] text-[#F2EFEA] font-sans flex flex-col p-[0_24px_32px] [transition:clip-path_.8s_cubic-bezier(.7,0,.2,1)]"
      style={{ clipPath: menu ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)', pointerEvents: menu ? 'auto' : 'none' }}
      aria-hidden={!menu}
    >
      <div className="h-[64px] flex items-center justify-between">
        <span className="font-semibold [font-stretch:118%] text-[15px] tracking-[.3em]">HALDEN</span>
        <button onClick={() => set({ menu: false })} className="appearance-none [background:none] border-0 text-inherit [font:500_12px/1_var(--font-sans)] tracking-[.14em] uppercase py-[14px] px-0 cursor-pointer">Close</button>
      </div>
      <nav className="flex flex-col gap-[4px] mt-[9vh]">
        {NAV.map(n => (
          <Link key={n.key} href={n.href} onClick={() => set({ menu: false })} className="text-inherit no-underline flex items-baseline gap-[16px] py-[8px] [border-bottom:1px_solid_rgba(242,239,234,.12)] overflow-hidden">
            <span className="[font:400_11px/1_var(--font-mono)] text-[#9C978F]">0{n.num}</span>
            <span
              className="block font-medium [font-stretch:84%] text-[clamp(44px,13vw,72px)] leading-none tracking-[-.02em] uppercase"
              style={{ transform: menu ? 'translateY(0)' : 'translateY(110%)', transition: `transform .9s cubic-bezier(.2,.7,.2,1) ${n.delay}` }}
            >{n.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex flex-wrap gap-[12px_24px] text-[13px] text-[#B9B3AA]">
        <Link href="/checkout" className="text-inherit no-underline">Account</Link>
        <Link href="/#journal" className="text-inherit no-underline">Shipping &amp; Returns</Link>
        <Link href="/" className="text-inherit no-underline">Contact</Link>
        <Link href="/" className="text-inherit no-underline">Instagram</Link>
      </div>
    </div>
  );
}
