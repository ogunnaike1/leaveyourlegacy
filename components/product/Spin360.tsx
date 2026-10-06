'use client';
import { useEffect, useRef } from 'react';

/**
 * 360° viewer. Angle is driven by pointer drag on the stage (0.6°/px, see Gallery); frame = angle / 10 of 36.
 * With `frames` (product.spin, 36 renders) the sequence is preloaded and drawn to a canvas; without it the
 * reference's placeholder dial is shown.
 */
export default function Spin360({ angle, frames }: { angle: number; frames?: string[] }) {
  const norm = ((angle % 360) + 360) % 360;
  const frame = Math.round(norm / 10) % 36;
  const canvas = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    if (!frames?.length) return;
    imgs.current = frames.map(src => { const i = new Image(); i.src = src; return i; });
  }, [frames]);

  useEffect(() => {
    const c = canvas.current, img = imgs.current[frame];
    if (!c || !img) return;
    const draw = () => {
      const w = (c.width = c.clientWidth * devicePixelRatio), h = (c.height = c.clientHeight * devicePixelRatio);
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      c.getContext('2d')!.drawImage(img, (w - img.naturalWidth * s) / 2, (h - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
    };
    if (img.complete && img.naturalWidth) draw(); else img.onload = draw;
  }, [frame, frames]);

  if (frames?.length) {
    return <canvas ref={canvas} className="absolute inset-0 w-full h-full bg-[#E3DED6] select-none cursor-grab" />;
  }
  return (
    <div className="absolute inset-0 bg-[#E3DED6] flex flex-col items-center justify-center gap-[28px] select-none cursor-grab">
      <div className="relative w-[min(60%,340px)] aspect-square rounded-full [border:1px_solid_rgba(28,27,25,.18)]">
        <div className="absolute left-1/2 top-1/2 w-px h-1/2 bg-[#1C1B19] origin-top" style={{ transform: `translateX(-50%) rotate(${angle}deg)` }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[8px]">
          <span className="[font:400_40px/1_var(--font-mono)]">{Math.round(norm)}°</span>
          <span className="[font:400_10px/1_var(--font-mono)] tracking-[.1em] uppercase text-[#6B6761]">Frame {String(frame + 1).padStart(2, '0')} / 36</span>
        </div>
      </div>
      <span className="max-w-[300px] text-center [font:400_10px/1.6_var(--font-mono)] tracking-[.08em] uppercase text-[#6B6761]">360° viewer — drag to rotate. Supply a 36-frame render sequence in product.spin to replace this guide.</span>
    </div>
  );
}
