'use client';
import { useState } from 'react';
import type { Product } from '@/lib/catalogue';

/** One panel open at a time; the + rotates 45°. Copy verbatim from Product.dc.html. */
export default function DetailsAccordion({ p }: { p: Product }) {
  const [open, setOpen] = useState(0);
  const items: [string, string][] = [
    ['Description', p.desc + ' Designed in Zürich and built in small batches by partner workshops in northern Italy and southern Germany.'],
    ['Dimensions', p.dims],
    ['Materials', p.materials],
    ['Delivery', 'Equipment is delivered by our own two-person team, carried to the room, assembled, levelled and packaging removed. Typical lead time is 2–3 weeks in Europe and North America; made-to-order pieces 6–8 weeks.'],
    ['Warranty', '10 years on frames and welds, 3 years on upholstery, moving parts and electronics. Parts and refinishing are available for the life of the product.']
  ];
  return (
    <div className="flex-[1.4_1_520px] [border-top:1px_solid_rgba(28,27,25,.14)]">
      {items.map(([title, body], i) => (
        <div key={title} className="[border-bottom:1px_solid_rgba(28,27,25,.14)]">
          <button
            onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}
            className="appearance-none w-full [background:none] border-0 py-[24px] px-0 grid grid-cols-[48px_1fr_20px] items-center cursor-pointer text-[#1C1B19] text-left"
          >
            <span className="[font:400_11px/1_var(--font-mono)] text-[#6B6761]">0{i + 1}</span>
            <span className="text-[18px] font-medium">{title}</span>
            <span className="text-[20px] font-light [transition:transform_.5s_cubic-bezier(.2,.7,.2,1)]" style={{ transform: `rotate(${open === i ? '45deg' : '0deg'})` }}>+</span>
          </button>
          {open === i && <p className="m-0 p-[0_0_28px_48px] max-w-[620px] text-[15px] leading-[1.7] text-[#3A3835] [text-wrap:pretty]">{body}</p>}
        </div>
      ))}
    </div>
  );
}
