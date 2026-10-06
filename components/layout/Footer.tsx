'use client';
import Link from 'next/link';
import { useState } from 'react';

const colHead = '[font:400_11px/1_var(--font-mono)] tracking-[.12em] uppercase text-[#8A857D]';
const colLink = 'text-[#E4DFD8] no-underline';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <footer data-theme="dark" className="bg-[#121110] text-[#F2EFEA] font-sans p-[clamp(72px,10vw,140px)_clamp(20px,3.4vw,48px)_32px]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-[48px_64px] items-end pb-[clamp(64px,8vw,120px)] [border-bottom:1px_solid_rgba(242,239,234,.12)]">
        <div className="flex flex-col gap-[20px]">
          <span className="[font:400_11px/1_var(--font-mono)] tracking-[.12em] uppercase text-[#9C978F]">Newsletter</span>
          <h2 className="m-0 font-medium [font-stretch:84%] text-[clamp(48px,7vw,104px)] leading-[.9] tracking-[-.025em] uppercase">The good stuff.</h2>
          <p className="m-0 max-w-[380px] text-[15px] leading-[1.55] text-[#B9B3AA]">Occasional product drops, training spaces and design inspiration. Four or five letters a year.</p>
        </div>
        <div className="flex flex-col gap-[14px]">
          {!done ? (
            <>
              <form onSubmit={e => { e.preventDefault(); if (email.includes('@')) setDone(true); }} className="flex items-stretch [border-bottom:1px_solid_rgba(242,239,234,.5)] [transition:border-color_.3s]">
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[#F2EFEA] [font:400_18px/1_var(--font-sans)] py-[18px] px-0" />
                <button type="submit" className="appearance-none [background:none] border-0 text-[#F2EFEA] [font:500_12px/1_var(--font-sans)] tracking-[.14em] uppercase cursor-pointer p-[0_0_0_20px] flex items-center gap-[10px]">Subscribe <span className="text-[15px]">→</span></button>
              </form>
              <span className="text-[12px] text-[#8A857D]">No sales cadence. Unsubscribe in one click.</span>
            </>
          ) : (
            <p className="m-0 font-serif text-[30px] leading-[1.2]">Thank you. The next letter is on its way to {email}.</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[40px_32px] p-[56px_0_72px] text-[14px]">
        <div className="flex flex-col gap-[14px]">
          <span className={colHead}>Store</span>
          <Link href="/shop" className={colLink}>Shop</Link>
          <Link href="/collections" className={colLink}>Collections</Link>
          <Link href="/#philosophy" className={colLink}>About</Link>
        </div>
        <div className="flex flex-col gap-[14px]">
          <span className={colHead}>Service</span>
          <Link href="/" className={colLink}>Shipping</Link>
          <Link href="/" className={colLink}>Returns</Link>
          <Link href="/" className={colLink}>Contact</Link>
        </div>
        <div className="flex flex-col gap-[14px]">
          <span className={colHead}>Follow</span>
          <Link href="/" className={colLink}>Instagram</Link>
        </div>
        <div className="flex flex-col gap-[14px]">
          <span className={colHead}>Showroom</span>
          <span className="text-[#E4DFD8] leading-[1.6]">Kalkbreite 4<br />8003 Zürich<br />By appointment</span>
        </div>
      </div>
      <div className="font-semibold [font-stretch:125%] text-[clamp(64px,17.5vw,300px)] leading-[.8] tracking-[.06em] text-[#2A2826] select-none overflow-hidden whitespace-nowrap">HALDEN</div>
      <div className="flex flex-wrap justify-between gap-[16px] pt-[28px] [font:400_11px/1_var(--font-mono)] tracking-[.08em] uppercase text-[#8A857D]">
        <span>© 2026 Halden Studio AG</span>
        <div className="flex gap-[24px]"><Link href="/" className="text-inherit no-underline">Privacy</Link><Link href="/" className="text-inherit no-underline">Terms</Link></div>
      </div>
    </footer>
  );
}
