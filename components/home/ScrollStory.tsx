'use client';
import { useVw } from '@/lib/use-vw';
import ImageSlot from '@/components/ui/ImageSlot';

const frames = [
  { label: '01 / 04 — THE WHOLE OBJECT', text: 'Every line on the Form Bench is structural. Nothing is there to look fast.', op: 'clamp(0,calc((.25 - var(--sp,0)) * 14),1)' },
  { label: '02 / 04 — MATERIAL', text: 'Full-grain leather from a family tannery in Tuscany, saddle-stitched with waxed linen thread.', op: 'clamp(0,min(calc((var(--sp,0) - .25) * 14),calc((.5 - var(--sp,0)) * 14)),1)' },
  { label: '03 / 04 — MECHANISM', text: 'A machined ladder and spring pop-pin. Adjusts in one movement and locks without play.', op: 'clamp(0,min(calc((var(--sp,0) - .5) * 14),calc((.75 - var(--sp,0)) * 14)),1)' },
  { label: '04 / 04 — IN PLACE', text: 'Sized and finished to live in the room — not hidden in the garage.', op: 'clamp(0,calc((var(--sp,0) - .75) * 14),1)' }
];

// Frames 2–4 reveal over frame 1: --r ramps from the given start; 2–3 wipe bottom-up, 4 from the right.
const layers = [
  { id: 'story-2', cap: 'Macro — leather grain and saddle stitch', start: '.19', bg: '#2B2824', fg: '#8C877F', clip: 'inset(calc((1 - var(--r)) * 100%) 0 0 0)' },
  { id: 'story-3', cap: 'Detail — machined ladder and aluminium pop-pin', start: '.44', bg: '#201F1D', fg: '#8C877F', clip: 'inset(calc((1 - var(--r)) * 100%) 0 0 0)' },
  { id: 'story-4', cap: 'Interior — bench in a finished home gym, walnut and plaster', start: '.69', bg: '#3A352F', fg: '#A39C92', clip: 'inset(0 0 0 calc((1 - var(--r)) * 100%))' }
];

export default function ScrollStory() {
  const m = useVw() < 900;
  return (
    <section data-pin="--sp" data-theme="dark" data-screen-label="04 Scroll story" className="relative h-[440vh] bg-[#1A1917] text-[#F2EFEA]">
      <div
        className="sticky top-0 h-[100vh] supports-[height:100svh]:h-[100svh] overflow-hidden grid"
        style={{ gridTemplateColumns: m ? '1fr' : 'minmax(0,38fr) minmax(0,62fr)', gridTemplateRows: m ? '58% 42%' : '1fr' }}
      >
        <div className="relative flex flex-col justify-between" style={{ padding: m ? '24px 20px 28px' : '120px clamp(20px,3.4vw,48px) 48px', order: m ? 2 : 0 }}>
          <div className="flex flex-col gap-[22px]" style={{ transform: 'translateY(calc(var(--sp,0) * -30px))' }}>
            <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#9C978F]">Form Bench, in detail</span>
            <h2 className="m-0 font-medium [font-stretch:82%] leading-[.9] tracking-[-.03em] uppercase" style={{ fontSize: m ? '40px' : 'clamp(44px,4.6vw,84px)' }}>Designed around<br />the way you move.</h2>
          </div>
          <div className="relative min-h-[150px]">
            {frames.map(f => (
              <div key={f.label} className="absolute inset-[auto_0_0_0] flex flex-col gap-[12px]" style={{ opacity: f.op }}>
                <span className="[font:400_11px/1_var(--font-mono)] tracking-[.12em] text-[#9C978F]">{f.label}</span>
                <p className="m-0 max-w-[380px] text-[17px] leading-[1.55] text-[#D9D3CA] [text-wrap:pretty]">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[repeat(4,1fr)] gap-[6px]">
            {[0, 1, 2, 3].map(i => (
              <span key={i} className="h-px bg-[rgba(242,239,234,.18)] relative overflow-hidden">
                <span className="absolute inset-0 bg-[#F2EFEA] origin-left" style={{ transform: `scaleX(clamp(0,calc(var(--sp,0) * 4${i ? ' - ' + i : ''}),1))` }} />
              </span>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden bg-[#24221F] text-[#7D786F]" style={{ margin: m ? '64px 0 0' : '0' }}>
          <div className="absolute inset-0" style={{ transform: 'scale(calc(1.02 + var(--sp,0) * .08))' }}>
            <ImageSlot id="story-1" caption="Form Bench — full profile, raking window light" sizes="(max-width: 900px) 100vw, 62vw" />
          </div>
          {layers.map(l => (
            <div key={l.id} className="absolute inset-0" style={{ ['--r' as string]: `clamp(0,calc((var(--sp,0) - ${l.start}) * 8),1)`, background: l.bg, color: l.fg, clipPath: l.clip }}>
              <div className="absolute inset-0" style={{ transform: 'scale(calc(1.18 - var(--r) * .16))' }}>
                <ImageSlot id={l.id} caption={l.cap} sizes="(max-width: 900px) 100vw, 62vw" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
