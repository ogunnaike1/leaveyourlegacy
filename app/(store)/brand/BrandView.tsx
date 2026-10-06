'use client';
import dynamic from 'next/dynamic';
import LineReveal from '@/components/motion/LineReveal';
import { Logo, LogoMark, Wordmark } from '@/components/brand/Logo';

const BrandScene = dynamic(() => import('@/components/brand/BrandScene'), { ssr: false });

const eyebrow = '[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#6B6761]';
const palette = [
  ['Charcoal', '#1C1B19'], ['Stone', '#F2EFEA'], ['Paper', '#F7F5F1'], ['Beige', '#E5DCCF'],
  ['Night', '#121110'], ['Walnut', '#5E4232'], ['Brushed Steel', '#A9ADB0']
];
const files = [
  ['Mark — charcoal (SVG)', '/brand/mark-charcoal.svg'],
  ['Mark — stone (SVG)', '/brand/mark-stone.svg'],
  ['Lockup — on stone (PNG)', '/brand/lockup-on-stone.png'],
  ['Lockup — on night (PNG)', '/brand/lockup-on-night.png'],
  ['3D mark render (PNG)', '/brand/mark-3d.png']
];

export default function BrandView() {
  return (
    <>
      <section data-screen-label="Brand header" className="max-w-[1680px] mx-auto p-[clamp(120px,14vw,200px)_clamp(20px,3.4vw,48px)_clamp(56px,7vw,96px)]">
        <div data-reveal="" className="flex flex-wrap justify-between items-end gap-[24px_48px]">
          <h1 className="m-0 font-medium [font-stretch:80%] text-[clamp(64px,11.5vw,200px)] leading-[.82] tracking-[-.04em] uppercase"><LineReveal dur={1.4} pb=".03em">Identity</LineReveal></h1>
          <p className="m-[0_0_12px] max-w-[380px] text-[15px] leading-[1.6] text-[#4A4743] [text-wrap:pretty] [transition:opacity_1.2s_ease_.4s]" style={{ opacity: 'var(--in,0)' }}>
            Two L&rsquo;s facing each other with a Y rising between them. Their feet and the Y&rsquo;s stem meet on one baseline — a plinth. Things that are built properly are what you leave behind.
          </p>
        </div>
      </section>

      <section data-theme="dark" data-screen-label="3D mark" className="relative h-[min(86vh,820px)] min-h-[480px] bg-[#141311] text-[#F2EFEA]">
        <BrandScene />
        <div className="absolute left-[clamp(20px,3.4vw,48px)] bottom-[clamp(24px,4vw,48px)] flex flex-col gap-[10px] pointer-events-none">
          <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#C9C2B8]">The mark in three dimensions</span>
          <span className="text-[14px] text-[#9C978F]">Brushed steel on walnut · drag to turn</span>
        </div>
      </section>

      <section data-screen-label="Logo system" className="max-w-[1680px] mx-auto p-[clamp(88px,10vw,150px)_clamp(20px,3.4vw,48px)] flex flex-col gap-[clamp(56px,7vw,96px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,520px),1fr))] gap-[20px]">
          <div className="flex flex-col gap-[14px]">
            <div className="aspect-[16/9] bg-[#F2EFEA] [border:1px_solid_rgba(28,27,25,.1)] flex items-center justify-center text-[#1C1B19]"><Logo size={20} gap={18} /></div>
            <span className={eyebrow}>Primary lockup · on stone</span>
          </div>
          <div className="flex flex-col gap-[14px]">
            <div className="aspect-[16/9] bg-[#121110] flex items-center justify-center text-[#F2EFEA]"><Logo size={20} gap={18} /></div>
            <span className={eyebrow}>Primary lockup · on night</span>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[48px_40px] items-start">
          <div className="flex flex-col gap-[20px]">
            <span className={eyebrow}>Mark</span>
            <div className="flex items-end gap-[28px] text-[#1C1B19]"><LogoMark size={96} /><LogoMark size={48} /><LogoMark size={24} /><LogoMark size={16} /></div>
            <p className="m-0 text-[14px] leading-[1.6] text-[#4A4743] max-w-[360px]">Built on a 48-unit grid with 4-unit strokes. Stays crisp at 16px; use it alone where the name is already present.</p>
          </div>
          <div className="flex flex-col gap-[20px]">
            <span className={eyebrow}>Clear space</span>
            <div className="relative self-start p-[24px] [outline:1px_dashed_rgba(28,27,25,.3)] text-[#1C1B19]"><LogoMark size={72} /></div>
            <p className="m-0 text-[14px] leading-[1.6] text-[#4A4743] max-w-[360px]">Keep clear space equal to one third of the mark&rsquo;s height on every side. Never stretch, outline, rotate or recolour it outside the palette.</p>
          </div>
          <div className="flex flex-col gap-[20px]">
            <span className={eyebrow}>Wordmark</span>
            <div className="text-[#1C1B19]"><Wordmark size={18} /></div>
            <p className="m-0 text-[14px] leading-[1.6] text-[#4A4743] max-w-[360px]">Archivo SemiBold at 118% width, uppercase, tracked +0.3em. Body copy in Archivo, editorial accents in Instrument Serif, labels in JetBrains Mono.</p>
          </div>
        </div>

        <div className="flex flex-col gap-[20px]">
          <span className={eyebrow}>Colour</span>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-[12px]">
            {palette.map(([n, hex]) => (
              <div key={n} className="flex flex-col gap-[10px]">
                <div className="aspect-[4/3] [border:1px_solid_rgba(28,27,25,.1)]" style={{ background: hex }} />
                <span className="text-[13px] font-medium">{n}</span>
                <span className="[font:400_12px/1_var(--font-mono)] text-[#6B6761]">{hex}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[16px] pt-[28px] [border-top:1px_solid_rgba(28,27,25,.14)]">
          <span className={eyebrow}>Files</span>
          <div className="flex flex-wrap gap-[12px_32px]">
            {files.map(([n, href]) => (
              <a key={href} href={href} download className="text-[#1C1B19] text-[14px] underline-offset-[5px]">{n}</a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
