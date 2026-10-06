'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { products } from '@/lib/catalogue';
import { money } from '@/lib/format';
import { useCart } from '@/lib/cart-store';
import { hover } from '@/components/motion/hover';
import LineReveal from '@/components/motion/LineReveal';
import Parallax from '@/components/motion/Parallax';
import ImageSlot from '@/components/ui/ImageSlot';

const ratios = ['3 / 4', '4 / 5', '3 / 4', '1 / 1', '3 / 4', '4 / 5', '3 / 4'];
const homeItems = products.filter(p => p.line === 'home' || p.id === 'recovery-set');

const railBtn = 'appearance-none w-[48px] h-[48px] [border:1px_solid_rgba(42,37,32,.3)] bg-transparent text-[#2A2520] cursor-pointer text-[15px] [transition:background_.3s,color_.3s] hover:bg-[#2A2520] hover:text-[#E5DCCF]';

export default function HomeEdit() {
  const rail = useRef<HTMLDivElement>(null);
  const add = useCart(s => s.add);
  const [added, setAdded] = useState<Record<string, 1>>({});
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const scrollRail = (d: number) => { const el = rail.current; if (el) el.scrollBy({ left: d * Math.min(el.clientWidth * 0.8, 800), behavior: 'smooth' }); };
  const onAdd = (id: string) => {
    add(id, null, 1, false);
    setAdded(a => ({ ...a, [id]: 1 }));
    timers.current.push(setTimeout(() => setAdded(a => { const n = { ...a }; delete n[id]; return n; }), 1800));
  };

  return (
    <section data-theme="light" data-screen-label="05 Home collection" className="bg-[#E5DCCF] p-[clamp(96px,12vw,180px)_0_clamp(88px,10vw,150px)]">
      <div className="max-w-[1680px] mx-auto px-[clamp(20px,3.4vw,48px)] flex flex-wrap gap-[48px_clamp(32px,6vw,120px)] items-center">
        <div
          data-reveal=""
          className="flex-[1_1_420px] relative aspect-[4/5] max-h-[86vh] overflow-hidden bg-[#D6CBBB] text-[#8A8074] [transition:clip-path_1.8s_cubic-bezier(.7,0,.2,1)]"
          style={{ clipPath: 'inset(calc((1 - var(--in,0)) * 12%) calc((1 - var(--in,0)) * 12%))' }}
        >
          <Parallax factor={0.07} inset="-10%">
            <ImageSlot id="home-edit-hero" caption="Interior — plaster lamp, folded towels and walnut tray in soft late light" sizes="(max-width: 900px) 100vw, 50vw" />
          </Parallax>
        </div>
        <div data-reveal="" className="flex-[1_1_380px] flex flex-col gap-[28px] max-w-[560px]">
          <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#6B6258]">The Home Edit</span>
          <h2 className="m-0 font-serif font-normal text-[clamp(48px,6vw,104px)] leading-[.95] tracking-[-.015em] text-[#2A2520]">
            <LineReveal dur={1.4} mask="serif" pb=".06em">For the rooms</LineReveal>
            <LineReveal dur={1.4} delay={0.1} mask="serif" pb=".06em" innerClassName="italic">around the room.</LineReveal>
          </h2>
          <p className="m-0 text-[16px] leading-[1.65] text-[#4E463E] max-w-[440px] [text-wrap:pretty] [transition:opacity_1.2s_ease_.5s]" style={{ opacity: 'var(--in,0)' }}>Mirrors, light, linen and storage made in the same workshops as our equipment, to the same tolerances. Pieces for the hour after training — and every other hour.</p>
          <Link href="/shop?line=home" className="self-start text-[#2A2520] text-[13px] font-medium tracking-[.08em] uppercase underline-offset-[6px] [transition:opacity_1.2s_ease_.6s]" style={{ opacity: 'var(--in,0)' }}>Shop the Home Edit</Link>
        </div>
      </div>
      <div className="mt-[clamp(72px,9vw,140px)]">
        <div className="max-w-[1680px] mx-auto p-[0_clamp(20px,3.4vw,48px)_24px] flex justify-between items-center">
          <span className="[font:400_11px/1_var(--font-mono)] tracking-[.12em] uppercase text-[#6B6258]">{homeItems.length} pieces</span>
          <div className="flex gap-[8px]">
            <button onClick={() => scrollRail(-1)} aria-label="Previous" className={railBtn}>←</button>
            <button onClick={() => scrollRail(1)} aria-label="Next" className={railBtn}>→</button>
          </div>
        </div>
        <div
          ref={rail} data-cursor="Drag"
          className="no-scrollbar grid grid-flow-col auto-cols-[clamp(250px,24vw,380px)] gap-[clamp(16px,1.6vw,28px)] overflow-x-auto snap-x snap-mandatory scroll-px-[clamp(20px,3.4vw,48px)] p-[0_clamp(20px,3.4vw,48px)_8px]"
        >
          {homeItems.map((p, i) => (
            <div key={p.id} {...hover} className="snap-start flex flex-col gap-[18px] text-[#2A2520]">
              <div className="relative overflow-hidden bg-[#D6CBBB] text-[#8A8074]" style={{ aspectRatio: ratios[i % ratios.length] }}>
                <div className="absolute inset-0 [transition:transform_1.4s_cubic-bezier(.2,.7,.2,1)]" style={{ transform: 'scale(calc(1 + var(--h,0) * .035))' }}>
                  <ImageSlot id={'p-' + p.id + '-1'} caption={p.name + ' · interior setting'} sizes="380px" />
                </div>
              </div>
              <div className="flex justify-between items-start gap-[16px]">
                <div className="flex flex-col gap-[6px]">
                  <Link href={'/products/' + p.id} className="text-inherit no-underline font-serif text-[28px] leading-none">{p.name}</Link>
                  <span className="text-[13px] text-[#6B6258]">{p.type}</span>
                </div>
                <div className="flex flex-col items-end gap-[10px]">
                  <span className="[font:400_13px/1_var(--font-mono)]">{money(p.price)}</span>
                  <button
                    onClick={() => onAdd(p.id)}
                    className="appearance-none [background:none] border-0 p-[4px_0] [font:500_11px/1_var(--font-sans)] tracking-[.12em] uppercase text-[#2A2520] cursor-pointer underline underline-offset-4 [transition:opacity_.4s]"
                    style={{ opacity: 'calc(.55 + var(--h,0) * .45)' }}
                  >{added[p.id] ? 'Added ✓' : 'Add to bag'}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
