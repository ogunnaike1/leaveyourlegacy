'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { pinProgress } from '@/components/motion/engine';
import { hover } from '@/components/motion/hover';
import { magnetic, magneticTransform } from '@/components/motion/Magnetic';
import LineReveal from '@/components/motion/LineReveal';
import { useVh, useVw } from '@/lib/use-vw';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const specRow = 'grid grid-cols-[40px_1fr] py-[16px] [border-bottom:1px_solid_rgba(242,239,234,.2)] text-[14px] leading-[1.5] text-[#D9D3CA]';
const specNum = '[font:400_11px/1.9_var(--font-mono)] text-[#9C978F]';

export default function Hero() {
  const pin = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const vw = useVw(), vh = useVh();

  useEffect(() => {
    const onScroll = () => {
      const p = pinProgress(pin.current);
      const s = p < 0.2 ? 0 : p > 0.78 ? 2 : 1;
      setStage(prev => (prev === s ? prev : s));
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, []);

  const cueDisplay = vh < 700 || vw < 640 ? 'none' : 'flex';

  return (
    <section ref={pin} data-pin="--hp" data-theme="dark" data-screen-label="01 Hero" className="relative h-[300vh] bg-[#141311] text-[#F2EFEA]">
      <div className="sticky top-0 h-[100vh] supports-[height:100svh]:h-[100svh] overflow-hidden">
        <HeroScene />
        <div className="absolute inset-0 pointer-events-none [background:linear-gradient(90deg,rgba(20,19,17,.62)_0%,rgba(20,19,17,.18)_42%,rgba(20,19,17,0)_60%),linear-gradient(0deg,rgba(20,19,17,.6)_0%,rgba(20,19,17,0)_34%),linear-gradient(180deg,rgba(20,19,17,.45)_0%,rgba(20,19,17,0)_18%)]" />
        <div className="absolute inset-0 pointer-events-none opacity-[.09] mix-blend-overlay" style={{ backgroundImage: NOISE }} />

        <div
          data-reveal=""
          className="absolute left-[clamp(20px,3.4vw,48px)] right-[clamp(20px,3.4vw,48px)] bottom-[clamp(96px,15vh,160px)] max-w-[860px] flex flex-col gap-[28px]"
          style={{ opacity: 'clamp(0,calc(1 - var(--hp,0) * 4.5),1)', transform: 'translateY(calc(var(--hp,0) * -140px))', pointerEvents: stage === 0 ? 'auto' : 'none' }}
        >
          <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#C9C2B8] [transition:opacity_1.2s_ease_.2s]" style={{ opacity: 'var(--in,0)' }}>Form Bench — Edition 01</span>
          <h1 className="m-0 font-medium [font-stretch:82%] text-[clamp(52px,8.6vw,150px)] leading-[.88] tracking-[-.03em] uppercase">
            <LineReveal dur={1.5} delay={0.25}>Performance</LineReveal>
            <LineReveal dur={1.5} delay={0.38}>without compromise.</LineReveal>
          </h1>
          <div
            className="flex flex-wrap items-center gap-[28px_40px] [transition:opacity_1.2s_ease_.7s,transform_1.4s_cubic-bezier(.2,.7,.1,1)_.7s]"
            style={{ opacity: 'var(--in,0)', transform: 'translateY(calc((1 - var(--in,0)) * 16px))' }}
          >
            <p className="m-0 max-w-[360px] text-[16px] leading-[1.55] text-[#D9D3CA] [text-wrap:pretty]">Strength equipment made with the precision of furniture and the tolerance of a commercial gym.</p>
            <div className="flex flex-wrap items-center gap-[16px_28px]">
              <Link
                href="/shop?line=gym" {...magnetic}
                className="inline-flex items-center h-[54px] p-[0_30px] bg-[#F2EFEA] text-[#141311] no-underline text-[12px] font-medium tracking-[.14em] uppercase [transition:transform_.35s_ease,background_.3s_ease] hover:bg-white hover:text-[#141311]"
                style={magneticTransform}
              >Shop Equipment</Link>
              <Link href="/collections" {...hover} className="inline-flex items-center gap-[10px] h-[54px] text-[#F2EFEA] hover:text-[#F2EFEA] no-underline text-[12px] font-medium tracking-[.14em] uppercase relative">
                Explore Collection <span className="inline-block [transition:transform_.5s_cubic-bezier(.2,.7,.2,1)]" style={{ transform: 'translateX(calc(var(--h,0) * 5px))' }}>→</span>
                <span className="absolute left-0 right-0 bottom-[14px] h-px bg-current origin-right [transition:transform_.5s_cubic-bezier(.2,.7,.2,1)]" style={{ transform: 'scaleX(calc(1 - var(--h,0)))' }} />
              </Link>
            </div>
          </div>
        </div>

        <div
          className="absolute right-[clamp(20px,3.4vw,48px)] top-1/2 w-[min(340px,calc(100%_-_40px))] flex flex-col gap-[28px] pointer-events-none"
          style={{ opacity: 'clamp(0,min(calc((var(--hp,0) - .26) * 7),calc((.7 - var(--hp,0)) * 7)),1)', transform: 'translateY(calc(-50% + (0.48 - var(--hp,0)) * 120px))' }}
        >
          <h2 className="m-0 font-medium [font-stretch:84%] text-[clamp(30px,3vw,46px)] leading-[.98] tracking-[-.02em] uppercase">Built like furniture.<br />Rated to 450 kg.</h2>
          <div className="flex flex-col [border-top:1px_solid_rgba(242,239,234,.2)]">
            <div className={specRow}><span className={specNum}>01</span>Seven back positions, from flat to 85°.</div>
            <div className={specRow}><span className={specNum}>02</span>3mm steel frame, welded and ground flush by hand.</div>
            <div className={specRow}><span className={specNum}>03</span>Full-grain leather that darkens where you use it.</div>
          </div>
        </div>

        <div
          className="absolute left-[clamp(20px,3.4vw,48px)] right-[clamp(20px,3.4vw,48px)] bottom-[clamp(96px,14vh,150px)] flex flex-wrap items-end justify-between gap-[24px]"
          style={{ opacity: 'clamp(0,calc((var(--hp,0) - .76) * 6),1)', transform: 'translateY(calc((1 - var(--hp,0)) * 60px))', pointerEvents: stage === 2 ? 'auto' : 'none' }}
        >
          <div className="flex flex-col gap-[10px]">
            <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#C9C2B8]">From $1,890 · Ships in 2 weeks</span>
            <span className="font-serif italic text-[clamp(56px,8vw,128px)] leading-[.9] tracking-[-.01em]">The Form Bench</span>
          </div>
          <Link
            href="/products/form-bench" {...magnetic}
            className="inline-flex items-center gap-[12px] h-[54px] p-[0_30px] [border:1px_solid_rgba(242,239,234,.6)] text-[#F2EFEA] no-underline text-[12px] font-medium tracking-[.14em] uppercase [transition:transform_.35s_ease,background_.3s_ease,color_.3s_ease] hover:bg-[#F2EFEA] hover:text-[#141311]"
            style={magneticTransform}
          >View the bench →</Link>
        </div>

        <div className="absolute left-1/2 bottom-[28px] -translate-x-1/2 flex-col items-center gap-[12px] pointer-events-none" style={{ display: cueDisplay, opacity: 'clamp(0,calc(1 - var(--hp,0) * 8),1)' }}>
          <span className="[font:400_10px/1_var(--font-mono)] tracking-[.2em] uppercase text-[#C9C2B8]">Scroll</span>
          <span className="block w-px h-[48px] bg-[rgba(242,239,234,.22)] relative overflow-hidden">
            <span className="absolute left-0 top-0 w-px h-full bg-[#F2EFEA] [animation:hdCue_2.6s_cubic-bezier(.7,0,.3,1)_infinite]" />
          </span>
        </div>
        <div className="absolute left-0 bottom-0 h-px bg-[rgba(242,239,234,.5)]" style={{ width: 'calc(var(--hp,0) * 100%)' }} />
      </div>
    </section>
  );
}
