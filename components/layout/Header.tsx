'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart, useUI, cartCount } from '@/lib/cart-store';
import { useVw } from '@/lib/use-vw';
import { hover } from '@/components/motion/hover';
import { NAV } from './nav';
import { Logo, LogoMark } from '@/components/brand/Logo';
import MobileMenu from './MobileMenu';
import SearchSheet from './SearchSheet';
import CartDrawer from './CartDrawer';

type Props = { dark?: boolean; current?: '' | 'shop' | 'gym' | 'home' | 'collections' };

export default function Header({ dark: darkProp = false, current = '' }: Props) {
  const [dark, setDark] = useState(!!darkProp);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [bump, setBump] = useState(false);
  const { menu, search, cart, set } = useUI();
  const lines = useCart(s => s.lines);
  const vw = useVw();
  const pathname = usePathname();
  const st = useRef({ dark: !!darkProp, scrolled: false, hidden: false, lastY: 0, raf: 0 });

  // Every page load starts with overlays closed (the prototype navigated by full reload).
  useEffect(() => { set({ menu: false, search: false, cart: false }); }, [pathname, set]);

  // Count bump on any cart change after hydration.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const unsub = useCart.subscribe((s, prev) => {
      if (s.lines === prev.lines || !useCart.persist.hasHydrated()) return;
      setBump(true); clearTimeout(t); t = setTimeout(() => setBump(false), 320);
    });
    return () => { unsub(); clearTimeout(t); };
  }, []);

  useEffect(() => {
    const s = st.current;
    s.lastY = window.scrollY;
    const onScroll = () => {
      if (s.raf) return;
      s.raf = requestAnimationFrame(() => {
        s.raf = 0;
        const y = window.scrollY;
        let d = !!darkProp;
        document.querySelectorAll('[data-theme]').forEach(el => { const r = el.getBoundingClientRect(); if (r.top <= 38 && r.bottom > 38) d = el.getAttribute('data-theme') === 'dark'; });
        const h = y > 600 && y > s.lastY + 4 ? true : (y < s.lastY - 4 ? false : s.hidden);
        s.lastY = y;
        if (d !== s.dark || (y > 8) !== s.scrolled || h !== s.hidden) {
          s.dark = d; s.scrolled = y > 8; s.hidden = h;
          setDark(d); setScrolled(y > 8); setHidden(h);
        }
      });
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') useUI.getState().set({ menu: false, search: false, cart: false }); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('keydown', onKey);
    onScroll();
    return () => { removeEventListener('scroll', onScroll); removeEventListener('keydown', onKey); cancelAnimationFrame(s.raf); s.raf = 0; };
  }, [darkProp]);

  // Lock page scroll while any overlay is open.
  useEffect(() => {
    document.documentElement.style.overflow = menu || cart || search ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [menu, cart, search]);

  const isMobile = vw < 900;
  const overHero = dark && !scrolled;
  const fg = dark ? '#F2EFEA' : '#1C1B19';
  const bg = overHero ? 'transparent' : (dark ? 'rgba(21,20,19,.72)' : 'rgba(242,239,234,.86)');
  const blur = overHero ? 'none' : 'saturate(1.2) blur(14px)';
  const rule = overHero ? 'transparent' : (dark ? 'rgba(242,239,234,.08)' : 'rgba(28,27,25,.08)');

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-[clamp(20px,3.4vw,48px)] font-sans [border-bottom:1px_solid] [transition:background_.5s_ease,color_.5s_ease,border-color_.5s_ease,transform_.6s_cubic-bezier(.7,0,.2,1)]"
        style={{ height: isMobile ? '64px' : '76px', color: fg, background: bg, backdropFilter: blur, WebkitBackdropFilter: blur, borderBottomColor: rule, transform: hidden && !menu ? 'translateY(-100%)' : 'translateY(0)' }}
      >
        <div className="flex items-center gap-[28px]">
          {isMobile ? (
            <button onClick={() => set({ menu: true })} className="appearance-none [background:none] border-0 p-[12px_12px_12px_0] text-inherit [font:500_12px/1_var(--font-sans)] tracking-[.14em] uppercase cursor-pointer flex items-center gap-[10px]">
              <span className="flex flex-col gap-[5px]"><span className="block w-[20px] h-px bg-current" /><span className="block w-[14px] h-px bg-current" /></span>
              Menu
            </button>
          ) : (
            <Link href="/" aria-label="Leave Your Legacy — home" className="text-inherit no-underline flex items-center">
              <Logo size={12} showWordmark={vw >= 1280} />
            </Link>
          )}
        </div>
        {!isMobile && (
          <nav className="flex gap-[40px] items-center">
            {NAV.map(n => (
              <Link key={n.key} href={n.href} {...hover} className="relative text-inherit no-underline text-[13px] font-medium tracking-[.06em] py-[8px]">
                {n.label}
                <span className="absolute left-0 right-0 bottom-[2px] h-px bg-current origin-left [transition:transform_.45s_cubic-bezier(.2,.7,.2,1)]" style={{ transform: `scaleX(calc(max(var(--h,0), ${current === n.key ? 1 : 0})))` }} />
              </Link>
            ))}
          </nav>
        )}
        {isMobile && (
          <Link href="/" aria-label="Leave Your Legacy — home" className="text-inherit no-underline flex items-center">
            <LogoMark size={28} title="" />
          </Link>
        )}
        <div className="flex justify-end items-center gap-[6px]">
          <button onClick={() => set({ search: true })} aria-label="Search" className="appearance-none [background:none] border-0 text-inherit w-[44px] h-[44px] flex items-center justify-center cursor-pointer">
            <svg width="19" height="19" viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }}><circle cx="11" cy="11" r="7.5" /><path d="m20.5 20.5-4.2-4.2" /></svg>
          </button>
          {!isMobile && (
            <Link href="/checkout" aria-label="Account" className="text-inherit w-[44px] h-[44px] flex items-center justify-center">
              <svg width="19" height="19" viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }}><circle cx="12" cy="8" r="4.5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
            </Link>
          )}
          <button onClick={() => set({ cart: true })} aria-label="Bag" className="appearance-none [background:none] border-0 text-inherit h-[44px] p-[0_0_0_10px] flex items-center gap-[8px] cursor-pointer [font:500_12px/1_var(--font-mono)]">
            <svg width="19" height="19" viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinejoin: 'round' }}><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            <span className="inline-block min-w-[14px] [transition:transform_.4s_cubic-bezier(.3,1.6,.5,1)]" style={{ transform: `scale(${bump ? 1.45 : 1})` }}>{cartCount(lines)}</span>
          </button>
        </div>
      </header>
      <MobileMenu />
      <SearchSheet />
      <CartDrawer />
    </>
  );
}
