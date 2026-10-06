import LineReveal from '@/components/motion/LineReveal';
import ImageSlot from '@/components/ui/ImageSlot';

const principles = [
  { num: '01', title: 'Materials that age well', text: 'Full-grain leather, oiled walnut, 3mm steel. Chosen because they look better in year ten than in week one — and can be repaired rather than replaced.' },
  { num: '02', title: 'Engineering you feel, not see', text: 'Sealed bearings, machined tolerances, welds ground flush. Every adjustment is a single movement. The quiet is deliberate.' },
  { num: '03', title: 'Proportion before performance', text: 'Each piece is drawn at room scale before gym scale. Low silhouettes, honest lines, finishes that sit beside oak floors and linen sofas.' },
  { num: '04', title: 'For training, and for living', text: 'Commercial load ratings in a form you would put in the living room. One object, both jobs, no compromise on either.' }
];

export default function Philosophy() {
  return (
    <section id="philosophy" data-theme="light" data-screen-label="08 Philosophy" className="bg-[#F2EFEA] p-[clamp(96px,12vw,180px)_clamp(20px,3.4vw,48px)]">
      <div className="max-w-[1680px] mx-auto flex flex-wrap gap-[64px_clamp(40px,7vw,140px)] items-start">
        <div className="flex-[1_1_420px] sticky top-[110px] flex flex-col gap-[40px]">
          <div data-reveal="" className="flex flex-col gap-[24px]">
            <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#6B6761]">Philosophy</span>
            <h2 className="m-0 font-medium [font-stretch:82%] text-[clamp(48px,6.8vw,124px)] leading-[.88] tracking-[-.03em] uppercase">
              <LineReveal dur={1.4}>Built to</LineReveal>
              <LineReveal dur={1.4} delay={0.1}>live with you.</LineReveal>
            </h2>
          </div>
          <div
            data-reveal=""
            className="relative aspect-[5/4] max-w-[560px] overflow-hidden bg-[#E1DBD2] text-[#8C877F] [transition:clip-path_1.6s_cubic-bezier(.7,0,.2,1)_.2s]"
            style={{ clipPath: 'inset(0 calc((1 - var(--in,0)) * 100%) 0 0)' }}
          >
            <ImageSlot id="philosophy-detail" caption="Detail — walnut cradle meeting powder-coated steel" sizes="560px" />
          </div>
        </div>
        <div className="flex-[1_1_440px] flex flex-col pt-[clamp(0px,6vw,96px)]">
          <p
            data-reveal=""
            className="m-[0_0_72px] font-serif text-[clamp(28px,2.6vw,40px)] leading-[1.2] text-[#1C1B19] [text-wrap:pretty] [transition:opacity_1.2s_ease,transform_1.4s_cubic-bezier(.2,.7,.1,1)]"
            style={{ opacity: 'var(--in,0)', transform: 'translateY(calc((1 - var(--in,0)) * 24px))' }}
          >We started Halden because the best equipment we trained on was the worst thing in the room. Everything we make now has to earn its place twice.</p>
          {principles.map(pr => (
            <div key={pr.num} data-reveal="" className="grid grid-cols-[56px_1fr] gap-[8px_16px] py-[32px] [border-top:1px_solid_rgba(28,27,25,.14)]">
              <span className="[font:400_11px/1.9_var(--font-mono)] text-[#6B6761] [transition:opacity_1s_ease]" style={{ opacity: 'var(--in,0)' }}>{pr.num}</span>
              <div className="flex flex-col gap-[12px]">
                <LineReveal dur={1.1} mask="none" from="105%" innerClassName="text-[22px] font-medium tracking-[-.005em]">{pr.title}</LineReveal>
                <p
                  className="m-0 text-[15px] leading-[1.65] text-[#4A4743] max-w-[460px] [text-wrap:pretty] [transition:opacity_1.1s_ease_.15s,transform_1.2s_cubic-bezier(.2,.7,.1,1)_.15s]"
                  style={{ opacity: 'var(--in,0)', transform: 'translateY(calc((1 - var(--in,0)) * 14px))' }}
                >{pr.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
