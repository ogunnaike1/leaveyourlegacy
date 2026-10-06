import LineReveal from '@/components/motion/LineReveal';
import ProductCard from '@/components/product/ProductCard';

const bestIds = ['form-bench', 'monolith-dumbbells', 'still-rower', 'line-treadmill', 'ground-mat', 'vessel-bottle'];

export default function Bestsellers() {
  return (
    <section data-theme="light" data-screen-label="07 Bestsellers" className="bg-[#F7F5F1] p-[clamp(88px,10vw,150px)_clamp(20px,3.4vw,48px)]">
      <div className="max-w-[1680px] mx-auto">
        <div data-reveal="" className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] gap-[24px_48px] items-end mb-[56px]">
          <div className="flex flex-col gap-[22px]">
            <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#6B6761]">Bestsellers</span>
            <h2 className="m-0 font-medium [font-stretch:82%] text-[clamp(40px,5vw,84px)] leading-[.92] tracking-[-.03em] uppercase"><LineReveal dur={1.3}>Most lived with.</LineReveal></h2>
          </div>
          <p className="m-0 max-w-[380px] justify-self-end text-[15px] leading-[1.6] text-[#4A4743] [text-wrap:pretty]">The pieces our clients reorder for second homes, studios and the friends who visited and noticed.</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,360px),1fr))] gap-[64px_24px]">
          {bestIds.map((id, i) => {
            const delay = (i % 3) * 0.08 + 's';
            return (
              <div key={id} data-reveal="" style={{ opacity: 'var(--in,0)', transform: 'translateY(calc((1 - var(--in,0)) * 40px))', transition: `opacity 1s ease ${delay},transform 1.3s cubic-bezier(.2,.7,.1,1) ${delay}` }}>
                <ProductCard pid={id} number={String(i + 1).padStart(2, '0')} alwaysAdd ratio="1 / 1" sizes="(max-width: 760px) 100vw, 33vw" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
