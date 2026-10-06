import LineReveal from '@/components/motion/LineReveal';
import Parallax from '@/components/motion/Parallax';
import ImageSlot from '@/components/ui/ImageSlot';

export default function Statement() {
  return (
    <section data-theme="dark" data-screen-label="06 Statement" className="relative h-[120vh] min-h-[680px] overflow-hidden bg-[#171614] text-[#F2EFEA]">
      <Parallax factor={0.18} inset="-14%" className="text-[#6E6A63]">
        <ImageSlot id="statement" caption="Wide — home gym at dusk, floor-to-ceiling glass, cable station in silhouette" />
      </Parallax>
      <div className="absolute inset-0 pointer-events-none [background:linear-gradient(0deg,rgba(18,17,16,.72)_0%,rgba(18,17,16,.1)_50%,rgba(18,17,16,.3)_100%)]" />
      <div data-reveal="" className="absolute left-[clamp(20px,3.4vw,48px)] right-[clamp(20px,3.4vw,48px)] bottom-[clamp(56px,9vw,120px)] flex flex-wrap justify-between items-end gap-[32px] pointer-events-none">
        <h2 className="m-0 font-medium [font-stretch:82%] text-[clamp(60px,11.5vw,210px)] leading-[.86] tracking-[-.035em] uppercase">
          <LineReveal dur={1.6}>Your space.</LineReveal>
          <LineReveal dur={1.6} delay={0.12}>Your standard.</LineReveal>
        </h2>
        <span className="[font:400_11px/1.7_var(--font-mono)] tracking-[.12em] uppercase text-[#C9C2B8] [transition:opacity_1.4s_ease_.6s]" style={{ opacity: 'var(--in,0)' }}>Private residence<br />Lake Zürich, 2026</span>
      </div>
    </section>
  );
}
