'use client';
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import type { Product } from '@/lib/catalogue';
import ZoomStage from './ZoomStage';
import Spin360 from './Spin360';

const angles: [string, string][] = [['Front ¾', 'studio, front three-quarter'], ['Profile', 'side profile, raking light'], ['Detail', 'material close-up'], ['In room', 'installed in a finished space'], ['360°', '']];

export default function Gallery({ p, mobile: m }: { p: Product; mobile: boolean }) {
  const [view, setView] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [o, setO] = useState({ x: 50, y: 50 });
  const [spin, setSpin] = useState(0);
  const drag = useRef<(() => void) | null>(null);
  useEffect(() => () => drag.current?.(), []);

  const isSpin = view === 4;
  const views = angles.map((a, i) => ({ short: a[0], slot: 'p-' + p.id + '-' + (i + 1), cap: p.name + ' · ' + a[1] }));
  const rel = (e: MouseEvent<HTMLDivElement>) => { const r = e.currentTarget.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }; };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!isSpin) {
      if (e.pointerType === 'mouse') { setO(rel(e)); setZoom(z => !z); }
      return;
    }
    const x0 = e.clientX, a0 = spin;
    const mv = (ev: globalThis.PointerEvent) => setSpin(a0 + (ev.clientX - x0) * 0.6);
    const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); drag.current = null; };
    addEventListener('pointermove', mv); addEventListener('pointerup', up);
    drag.current = up;
  };

  return (
    <div className="flex-[1_1_560px] min-w-0 flex gap-[16px]" style={{ flexDirection: m ? 'column-reverse' : 'row' }}>
      <div className="no-scrollbar flex gap-[10px] flex-none overflow-auto" style={{ flexDirection: m ? 'row' : 'column' }}>
        {angles.map((a, i) => (
          <button
            key={a[0]} onClick={() => { setView(i); setZoom(false); }} aria-label={a[0]}
            className="appearance-none p-0 border-0 bg-[#E8E4DD] w-[72px] h-[90px] flex-none relative cursor-pointer text-[#8C877F] outline-offset-[3px] [transition:outline-color_.3s]"
            style={{ outline: `1px solid ${view === i ? '#1C1B19' : 'transparent'}` }}
          >
            <span className="absolute inset-0 flex items-end p-[8px] [font:400_9px/1.2_var(--font-mono)] tracking-[.06em] uppercase text-[#6B6761] text-left">{a[0]}</span>
          </button>
        ))}
      </div>
      <div
        data-cursor={isSpin ? 'Drag' : (zoom ? 'Close' : 'Zoom')}
        onMouseMove={e => { if (isSpin || !zoom) return; setO(rel(e)); }}
        onMouseLeave={() => zoom && setZoom(false)}
        onPointerDown={onPointerDown}
        className="relative flex-1 min-w-0 aspect-[4/5] max-h-[calc(100vh_-_140px)] bg-[#E8E4DD] overflow-hidden"
        style={{ touchAction: isSpin ? 'none' : 'auto' }}
      >
        <ZoomStage views={views} active={view} zoom={zoom} origin={o.x + '% ' + o.y + '%'} />
        {isSpin && <Spin360 angle={spin} frames={p.spin} />}
        <div className="absolute left-[16px] bottom-[16px] flex gap-[8px] pointer-events-none">
          <span className="[font:400_10px/1_var(--font-mono)] tracking-[.1em] uppercase text-[#4A4743] bg-[rgba(247,245,241,.85)] p-[7px_10px]">{angles[view][0] + (zoom ? ' · 2×' : '')}</span>
        </div>
      </div>
    </div>
  );
}
