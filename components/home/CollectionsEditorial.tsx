'use client';
import Link from 'next/link';
import { inCollection } from '@/lib/catalogue';
import { hover } from '@/components/motion/hover';
import LineReveal from '@/components/motion/LineReveal';
import Parallax from '@/components/motion/Parallax';
import ImageSlot from '@/components/ui/ImageSlot';

const count = (id: string) => inCollection(id).length;
const collA = [
  { num: '01', name: 'Strength', line: 'Benches, bars, racks and free weights.', href: '/shop?c=Strength', slot: 'col-strength', cap: 'Strength — bench and rack against raw plaster', w: '56%', offset: '0px', ratio: '1 / 1.08', count: count('strength') },
  { num: '02', name: 'Cardio', line: 'Treadmills and rowers worth looking at.', href: '/shop?c=Cardio', slot: 'col-cardio', cap: 'Cardio — walnut rower by a window, morning', w: '36%', offset: '200px', ratio: '3 / 4', count: count('cardio') },
  { num: '03', name: 'Home Gym', line: 'Complete rooms, planned to the centimetre.', href: '/collections#home-gym', slot: 'col-homegym', cap: 'Home gym — finished room, concrete and oak', w: '42%', offset: '0px', ratio: '4 / 3', count: count('home-gym') },
  { num: '04', name: 'Accessories', line: 'Mats, recovery and the details in between.', href: '/shop?c=Accessories', slot: 'col-accessories', cap: 'Accessories — rubber mat, rollers, towel, still life', w: '50%', offset: '140px', ratio: '16 / 11', count: count('accessories') }
];

export default function CollectionsEditorial() {
  return (
    <section data-theme="light" data-screen-label="02 Collections" className="bg-[#F2EFEA] p-[clamp(96px,12vw,180px)_clamp(20px,3.4vw,48px)_clamp(80px,10vw,160px)]">
      <div className="max-w-[1680px] mx-auto">
        <div data-reveal="" className="flex flex-wrap justify-between items-end gap-[32px] mb-[clamp(56px,7vw,110px)]">
          <div className="flex flex-col gap-[24px]">
            <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#6B6761]">Collections</span>
            <h2 className="m-0 font-medium [font-stretch:82%] text-[clamp(44px,6.4vw,112px)] leading-[.9] tracking-[-.03em] uppercase">
              <LineReveal dur={1.3}>Four disciplines.</LineReveal>
              <LineReveal dur={1.3} delay={0.1}>One standard.</LineReveal>
            </h2>
          </div>
          <p className="m-0 max-w-[340px] text-[15px] leading-[1.6] text-[#4A4743] [text-wrap:pretty] [transition:opacity_1.2s_ease_.4s]" style={{ opacity: 'var(--in,0)' }}>Every piece we make is designed for the room first and the workout second — then tested as if it were the other way round.</p>
        </div>

        <div className="flex flex-wrap justify-between gap-[48px_24px]">
          {collA.map(c => (
            <div key={c.num} {...hover} className="flex flex-col gap-[22px]" style={{ width: `clamp(${c.w},calc((760px - 100%) * 999),100%)`, marginTop: `clamp(0px,calc((100% - 760px) * 999),${c.offset})` }}>
              <div
                data-reveal="" data-cursor="Explore"
                className="relative overflow-hidden bg-[#E3DED6] text-[#8C877F] [transition:clip-path_1.6s_cubic-bezier(.7,0,.2,1)]"
                style={{ aspectRatio: c.ratio, clipPath: 'inset(calc((1 - var(--in,0)) * 100%) 0 0 0)' }}
              >
                <Link href={c.href} aria-label={c.name} className="absolute inset-0 block text-inherit">
                  <Parallax factor={0.06} inset="-9%" className="[transition:transform_1.4s_cubic-bezier(.2,.7,.2,1)]" style={{ transform: 'translateY(var(--py,0px)) scale(calc(1.02 + var(--h,0) * .03))' }}>
                    <ImageSlot id={c.slot} caption={c.cap} sizes="(max-width: 760px) 100vw, 56vw" />
                  </Parallax>
                </Link>
              </div>
              <Link href={c.href} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-[20px] text-[#1C1B19] no-underline">
                <span className="[font:400_11px/1_var(--font-mono)] text-[#6B6761]">{c.num}</span>
                <span className="flex flex-col gap-[8px] [transition:transform_.7s_cubic-bezier(.2,.7,.2,1)]" style={{ transform: 'translateX(calc(var(--h,0) * 6px))' }}>
                  <span className="font-medium [font-stretch:84%] text-[clamp(30px,3vw,48px)] leading-[.95] tracking-[-.02em] uppercase">{c.name}</span>
                  <span className="text-[14px] text-[#4A4743]">{c.line}</span>
                </span>
                <span className="flex items-center gap-[10px] [font:400_12px/1_var(--font-mono)]">
                  <span className="text-[#6B6761]">{c.count}</span>
                  <span className="inline-block w-[28px] overflow-hidden"><span className="inline-block [transition:transform_.6s_cubic-bezier(.2,.7,.2,1)]" style={{ transform: 'translateX(calc(var(--h,0) * 8px - 4px))' }}>→</span></span>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
