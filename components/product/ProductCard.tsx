'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { byId } from '@/lib/catalogue';
import { money } from '@/lib/format';
import { useCart } from '@/lib/cart-store';
import { hover } from '@/components/motion/hover';
import ImageSlot from '@/components/ui/ImageSlot';

type Props = { pid?: string; ratio?: string; number?: string; alwaysAdd?: boolean; sizes?: string };

export default function ProductCard({ pid = 'form-bench', ratio = '4 / 5', number = '', alwaysAdd = false, sizes = '(max-width: 640px) 50vw, 25vw' }: Props) {
  const p = byId(pid);
  const add = useCart(s => s.add);
  const [added, setAdded] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => { setCoarse(matchMedia('(pointer: coarse)').matches); return () => clearTimeout(t.current); }, []);

  const always = !!alwaysAdd || coarse;
  const onAdd = (e?: MouseEvent) => {
    e && e.stopPropagation();
    if (!p) return;
    add(p.id, p.colors[0].name, 1, !alwaysAdd);
    setAdded(true); clearTimeout(t.current); t.current = setTimeout(() => setAdded(false), 1800);
  };
  const name = p ? p.name : '';
  const price = p ? money(p.price) : '';
  const href = p ? '/products/' + p.id : '#';
  const colors = p && p.colors.length > 1 ? p.colors : [];
  const addLabel = added ? 'Added to bag ✓' : (always ? 'Add to bag' : 'Quick add');

  return (
    <article {...hover} className="relative flex flex-col gap-[16px] font-sans text-[#1C1B19] min-w-0">
      <div data-cursor="View" className="relative bg-[#E8E4DD] overflow-hidden text-[#8C877F]" style={{ aspectRatio: ratio }}>
        <Link href={href} aria-label={name} className="absolute inset-0 block text-inherit">
          <div className="absolute inset-0 [transition:transform_1.4s_cubic-bezier(.2,.7,.2,1)]" style={{ transform: 'scale(calc(1 + var(--h,0) * .03))' }}>
            <ImageSlot id={'p-' + pid + '-1'} caption={(p ? p.name : 'Product') + ' · studio, front ¾'} sizes={sizes} />
          </div>
          <div className="absolute inset-0 bg-[#DAD4CA] text-[#7A756D] [transition:opacity_.7s_ease]" style={{ opacity: 'var(--h,0)' }}>
            <ImageSlot id={'p-' + pid + '-2'} caption={(p ? p.name : 'Product') + ' · alternate angle'} sizes={sizes} />
          </div>
        </Link>
        {number && (
          <span className="absolute top-[14px] left-[14px] [font:400_11px/1_var(--font-mono)] tracking-[.1em] text-[#1C1B19] pointer-events-none">No. {number}</span>
        )}
        {!always && (
          <button
            onClick={onAdd}
            className="absolute left-[12px] right-[12px] bottom-[12px] h-[50px] border-0 bg-[#F7F5F1] text-[#1C1B19] flex items-center justify-between p-[0_18px] [font:500_12px/1_var(--font-sans)] tracking-[.12em] uppercase cursor-pointer [transition:opacity_.45s_ease,transform_.6s_cubic-bezier(.2,.7,.2,1),background_.3s] hover:bg-white"
            style={{ opacity: 'var(--h,0)', transform: 'translateY(calc((1 - var(--h,0)) * 12px))' }}
          >
            <span>{addLabel}</span><span className="[font:400_12px/1_var(--font-mono)] tracking-normal">{price}</span>
          </button>
        )}
      </div>
      <div className="flex flex-col gap-[6px]">
        <div className="flex justify-between items-baseline gap-[12px]">
          <Link href={href} className="text-inherit no-underline text-[15px] font-medium tracking-[.01em]">{name}</Link>
          <span className="[font:400_13px/1_var(--font-mono)] whitespace-nowrap">{price}</span>
        </div>
        <div className="flex justify-between items-center gap-[12px] min-h-[16px]">
          <span className="text-[13px] text-[#6B6761]">{p ? p.type : ''}</span>
          <div className="flex gap-[6px] items-center">
            {colors.map(c => (
              <span key={c.name} title={c.name} className="w-[10px] h-[10px] rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,.12)]" style={{ background: c.hex }} />
            ))}
          </div>
        </div>
        {always && (
          <button
            onClick={onAdd}
            className="mt-[10px] h-[46px] [border:1px_solid_#1C1B19] [font:500_12px/1_var(--font-sans)] tracking-[.12em] uppercase cursor-pointer [transition:background_.35s_ease,color_.35s_ease] hover:!bg-[#1C1B19] hover:!text-[#F2EFEA]"
            style={{ background: added ? '#1C1B19' : 'transparent', color: added ? '#F2EFEA' : '#1C1B19' }}
          >{addLabel}</button>
        )}
      </div>
    </article>
  );
}
