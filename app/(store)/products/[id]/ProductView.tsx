'use client';
import Link from 'next/link';
import { products, type Product } from '@/lib/catalogue';
import { useVw } from '@/lib/use-vw';
import LineReveal from '@/components/motion/LineReveal';
import Parallax from '@/components/motion/Parallax';
import ImageSlot from '@/components/ui/ImageSlot';
import Gallery from '@/components/product/Gallery';
import ProductInfo from '@/components/product/ProductInfo';
import DetailsAccordion from '@/components/product/DetailsAccordion';
import ProductCard from '@/components/product/ProductCard';

export default function ProductView({ p }: { p: Product }) {
  const m = useVw() < 900;
  const related = products.filter(x => x.id !== p.id && (x.category === p.category || x.line === p.line)).slice(0, 4);
  return (
    <>
      <section data-screen-label="Product hero" className="max-w-[1680px] mx-auto p-[clamp(88px,8vw,112px)_clamp(20px,3.4vw,48px)_clamp(72px,8vw,120px)] flex flex-wrap gap-[40px_clamp(32px,5vw,96px)] items-start">
        <Gallery key={p.id} p={p} mobile={m} />
        <ProductInfo key={'i' + p.id} p={p} />
      </section>

      <section id="details" data-screen-label="Product details" className="max-w-[1680px] mx-auto p-[0_clamp(20px,3.4vw,48px)_clamp(96px,10vw,160px)] flex flex-wrap gap-[40px_clamp(32px,5vw,96px)]">
        <div className="flex-[1_1_360px] flex flex-col gap-[20px]">
          <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#6B6761]">Details</span>
          <h2 className="m-0 font-serif font-normal text-[clamp(36px,3.6vw,56px)] leading-[1.05] max-w-[440px]">Everything you would ask in the showroom.</h2>
        </div>
        <DetailsAccordion key={p.id} p={p} />
      </section>

      <section data-theme="dark" data-screen-label="Designed for your space" className="relative h-[110vh] min-h-[640px] overflow-hidden bg-[#1A1917] text-[#F2EFEA]">
        <Parallax factor={0.14} inset="-12%" className="text-[#6E6A63]">
          <ImageSlot id={'p-' + p.id + '-space'} caption={p.name + ' · wide interior, modern home gym'} />
        </Parallax>
        <div className="absolute inset-0 pointer-events-none [background:linear-gradient(90deg,rgba(18,17,16,.7)_0%,rgba(18,17,16,.15)_55%,rgba(18,17,16,0)_100%)]" />
        <div data-reveal="" className="absolute left-[clamp(20px,3.4vw,48px)] bottom-[clamp(56px,9vw,120px)] max-w-[560px] flex flex-col gap-[24px] pointer-events-none">
          <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#C9C2B8]">In residence</span>
          <h2 className="m-0 font-medium [font-stretch:82%] text-[clamp(48px,7vw,120px)] leading-[.88] tracking-[-.03em] uppercase">
            <LineReveal dur={1.5}>Designed for</LineReveal>
            <LineReveal dur={1.5} delay={0.1}>your space.</LineReveal>
          </h2>
          <p className="m-0 text-[16px] leading-[1.6] text-[#D9D3CA] max-w-[420px] [transition:opacity_1.2s_ease_.5s]" style={{ opacity: 'var(--in,0)' }}>Our studio plans rooms free of charge — layout, flooring, light and clearances — before anything ships.</p>
        </div>
      </section>

      <section data-screen-label="Related" className="max-w-[1680px] mx-auto p-[clamp(88px,10vw,150px)_clamp(20px,3.4vw,48px)]">
        <div className="flex justify-between items-end gap-[24px] pb-[28px] mb-[48px] [border-bottom:1px_solid_rgba(28,27,25,.14)]">
          <h2 className="m-0 font-medium [font-stretch:82%] text-[clamp(36px,4vw,64px)] leading-[.92] tracking-[-.03em] uppercase">Pairs well with</h2>
          <Link href="/shop" className="text-[#1C1B19] text-[13px] font-medium tracking-[.08em] uppercase underline-offset-[6px]">Shop all</Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(calc(50%_-_10px),290px),1fr))] gap-[56px_20px]">
          {related.map(r => <ProductCard key={r.id} pid={r.id} />)}
        </div>
      </section>
    </>
  );
}
