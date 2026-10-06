import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

/** Shared shell for service pages (shipping, returns, contact, legal, account): big title, intro, body column. */
export default function InfoPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <div data-theme="light" className="font-sans text-[#1C1B19] bg-[#F7F5F1] min-h-screen">
      <Header />
      <section data-screen-label={title} className="max-w-[1680px] mx-auto p-[clamp(120px,14vw,200px)_clamp(20px,3.4vw,48px)_clamp(88px,10vw,150px)] flex flex-wrap gap-[40px_clamp(32px,6vw,120px)] items-start">
        <div className="flex-[1_1_360px] flex flex-col gap-[24px] min-[1000px]:sticky top-[110px]">
          <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#6B6761]">{eyebrow}</span>
          <h1 className="m-0 font-medium [font-stretch:82%] text-[clamp(52px,7vw,112px)] leading-[.88] tracking-[-.03em] uppercase">{title}</h1>
          {intro && <p className="m-0 max-w-[400px] text-[16px] leading-[1.6] text-[#4A4743] [text-wrap:pretty]">{intro}</p>}
        </div>
        <div className="flex-[1.4_1_520px] min-w-0 flex flex-col">{children}</div>
      </section>
      <Footer />
    </div>
  );
}

/** A numbered row in the body column, matching the product-page details accordion styling. */
export function InfoBlock({ num, title, children }: { num: string; title: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[48px_1fr] gap-[8px_0] py-[28px] [border-top:1px_solid_rgba(28,27,25,.14)]">
      <span className="[font:400_11px/1.9_var(--font-mono)] text-[#6B6761]">{num}</span>
      <div className="flex flex-col gap-[12px]">
        <h2 className="m-0 text-[20px] font-medium">{title}</h2>
        <div className="text-[15px] leading-[1.7] text-[#3A3835] max-w-[640px] [text-wrap:pretty] flex flex-col gap-[12px]">{children}</div>
      </div>
    </div>
  );
}
