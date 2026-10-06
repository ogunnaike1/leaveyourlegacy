'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { Product } from '@/lib/catalogue';
import { money } from '@/lib/format';
import { useCart } from '@/lib/cart-store';
import { magnetic, magneticTransform } from '@/components/motion/Magnetic';

export default function ProductInfo({ p }: { p: Product }) {
  const router = useRouter();
  const add = useCart(s => s.add);
  const [colorSel, setColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);

  const color = colorSel || p.colors[0].name;
  const stock = p.stock === 'Made to order' ? 'Made to order · ships in 6–8 weeks' : p.stock === 'Low stock' ? 'Low stock · ships in 1 week' : 'In stock · ships in 2 weeks';
  const addToBag = () => { add(p.id, color, qty); setAdded(true); clearTimeout(t.current); t.current = setTimeout(() => setAdded(false), 2000); };
  const buyNow = () => { add(p.id, color, qty, false); router.push('/checkout'); };

  return (
    <div className="flex-[1_1_380px] max-w-[520px] sticky top-[110px] flex flex-col gap-[28px]">
      <div className="flex gap-[8px] [font:400_11px/1_var(--font-mono)] tracking-[.1em] uppercase text-[#6B6761]">
        <Link href="/shop" className="text-inherit no-underline">Shop</Link><span>/</span><Link href={'/shop?c=' + p.category} className="text-inherit no-underline">{p.category}</Link>
      </div>
      <div className="flex flex-col gap-[14px]">
        <h1 className="m-0 font-medium [font-stretch:82%] text-[clamp(48px,5.4vw,92px)] leading-[.88] tracking-[-.03em] uppercase">{p.name}</h1>
        <div className="flex justify-between items-baseline gap-[16px] flex-wrap">
          <span className="text-[15px] text-[#4A4743]">{p.type}</span>
          <a href="#details" className="text-[13px] text-[#4A4743] no-underline">★ {p.rating.toFixed(1)} <span className="underline underline-offset-4">{p.reviews} reviews</span></a>
        </div>
      </div>
      <span className="[font:400_22px/1_var(--font-mono)]">{money(p.price)}</span>
      <p className="m-0 text-[16px] leading-[1.65] text-[#3A3835] [text-wrap:pretty]">{p.desc}</p>
      <div className="flex flex-col gap-[14px] pt-[24px] [border-top:1px_solid_rgba(28,27,25,.12)]">
        <div className="flex justify-between text-[13px]"><span className="text-[#6B6761]">Finish</span><span className="font-medium">{color}</span></div>
        <div className="flex gap-[10px] flex-wrap">
          {p.colors.map(c => (
            <button
              key={c.name} onClick={() => setColor(c.name)} aria-label={c.name} aria-pressed={c.name === color}
              className="appearance-none w-[40px] h-[40px] rounded-full p-0 bg-[#F7F5F1] cursor-pointer flex items-center justify-center [transition:border-color_.3s]"
              style={{ border: `1px solid ${c.name === color ? '#1C1B19' : 'transparent'}` }}
            >
              <span className="w-[30px] h-[30px] rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,.12)]" style={{ background: c.hex }} />
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-[10px]">
        <div className="flex items-center [border:1px_solid_rgba(28,27,25,.25)] h-[58px] flex-none">
          <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease" className="appearance-none [background:none] border-0 w-[46px] h-[56px] cursor-pointer text-[18px] text-[#1C1B19]">−</button>
          <span className="min-w-[28px] text-center [font:400_14px/1_var(--font-mono)]">{qty}</span>
          <button onClick={() => setQty(qty + 1)} aria-label="Increase" className="appearance-none [background:none] border-0 w-[46px] h-[56px] cursor-pointer text-[18px] text-[#1C1B19]">+</button>
        </div>
        <button
          onClick={addToBag} {...magnetic}
          className="flex-1 h-[58px] border-0 bg-[#1C1B19] text-[#F2EFEA] [font:500_12px/1_var(--font-sans)] tracking-[.14em] uppercase cursor-pointer flex items-center justify-between p-[0_22px] [transition:transform_.35s_ease,background_.3s] hover:bg-black"
          style={magneticTransform}
        >
          <span>{added ? 'Added to bag ✓' : 'Add to bag'}</span><span className="font-mono tracking-normal">{money(p.price * qty)}</span>
        </button>
      </div>
      <button onClick={buyNow} className="h-[58px] [border:1px_solid_#1C1B19] bg-transparent text-[#1C1B19] [font:500_12px/1_var(--font-sans)] tracking-[.14em] uppercase cursor-pointer mt-[-18px] [transition:background_.3s,color_.3s] hover:bg-[#1C1B19] hover:text-[#F2EFEA]">Buy now</button>
      <div className="flex flex-col gap-[10px] text-[13px] text-[#4A4743]">
        <span className="flex gap-[10px] items-center"><span className="w-[6px] h-[6px] rounded-full" style={{ background: p.stock === 'In stock' ? '#5E7A5A' : '#B08A4E' }} />{stock}</span>
        <span>White-glove delivery and installation included. 30-day trial in your home.</span>
      </div>
    </div>
  );
}
