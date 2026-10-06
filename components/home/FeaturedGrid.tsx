import Link from 'next/link';
import LineReveal from '@/components/motion/LineReveal';
import ProductCard from '@/components/product/ProductCard';

const featIds = ['form-bench', 'olympic-bar', 'monolith-dumbbells', 'axis-cable', 'line-treadmill', 'adjust-kettlebell', 'recovery-set', 'ledge-rack'];

export default function FeaturedGrid() {
  return (
    <section data-theme="light" data-screen-label="03 Featured" className="bg-[#F7F5F1] p-[clamp(88px,10vw,150px)_clamp(20px,3.4vw,48px)]">
      <div className="max-w-[1680px] mx-auto">
        <div data-reveal="" className="flex flex-wrap justify-between items-end gap-[24px] pb-[28px] mb-[48px] [border-bottom:1px_solid_rgba(28,27,25,.14)]">
          <div className="flex flex-col gap-[22px]">
            <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#6B6761]">Featured equipment</span>
            <h2 className="m-0 font-medium [font-stretch:82%] text-[clamp(40px,5vw,84px)] leading-[.92] tracking-[-.03em] uppercase"><LineReveal dur={1.3}>Engineered for more.</LineReveal></h2>
          </div>
          <Link href="/shop" className="text-[#1C1B19] text-[13px] font-medium tracking-[.08em] uppercase underline-offset-[6px]">Shop all equipment</Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(calc(50%_-_10px),300px),1fr))] gap-[56px_20px]">
          {featIds.map((id, i) => {
            const delay = (i % 4) * 0.08 + 's';
            return (
              <div key={id} data-reveal="" style={{ opacity: 'var(--in,0)', transform: 'translateY(calc((1 - var(--in,0)) * 40px))', transition: `opacity 1s ease ${delay},transform 1.3s cubic-bezier(.2,.7,.1,1) ${delay}` }}>
                <ProductCard pid={id} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
