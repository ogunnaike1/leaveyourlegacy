'use client';
import Link from 'next/link';
import { useCart, useUI, cartLines, cartCount, cartSubtotal } from '@/lib/cart-store';
import { money } from '@/lib/format';
import ImageSlot from '@/components/ui/ImageSlot';
import { magnetic, magneticTransform } from '@/components/motion/Magnetic';

export default function CartDrawer() {
  const open = useUI(s => s.cart);
  const set = useUI(s => s.set);
  const raw = useCart(s => s.lines);
  const setQty = useCart(s => s.setQty);
  const remove = useCart(s => s.remove);
  const lines = cartLines(raw);
  const close = () => set({ cart: false });

  return (
    <>
      <div onClick={close} className="fixed inset-0 z-[70] bg-[rgba(18,17,16,.42)] [transition:opacity_.6s_ease]" style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }} />
      <aside
        className="fixed top-0 right-0 bottom-0 z-[71] w-[min(460px,100vw)] bg-[#F7F5F1] text-[#1C1B19] font-sans flex flex-col [transition:transform_.75s_cubic-bezier(.7,0,.2,1)] shadow-[-30px_0_60px_rgba(0,0,0,.08)]"
        style={{ transform: open ? 'translateX(0)' : 'translateX(102%)' }}
        aria-hidden={!open}
      >
        <div className="flex justify-between items-center p-[24px_28px] [border-bottom:1px_solid_rgba(28,27,25,.12)]">
          <span className="font-medium text-[15px] tracking-[.02em]">Your bag <span className="[font:400_12px/1_var(--font-mono)] text-[#6B6761] ml-[6px]">({cartCount(raw)})</span></span>
          <button onClick={close} className="appearance-none [background:none] border-0 [font:500_11px/1_var(--font-sans)] tracking-[.14em] uppercase text-[#1C1B19] cursor-pointer py-[12px] px-0">Close</button>
        </div>
        <div className="flex-1 overflow-auto p-[0_28px]">
          {lines.length === 0 && (
            <div className="py-[64px] px-0 flex flex-col gap-[20px] items-start">
              <p className="m-0 font-serif text-[34px] leading-[1.1]">Your bag is empty.</p>
              <Link href="/shop" onClick={close} className="text-[#1C1B19] text-[13px] tracking-[.06em] underline-offset-[5px]">Continue to the shop</Link>
            </div>
          )}
          {lines.map(l => (
            <div key={l.key} className="grid grid-cols-[96px_1fr] gap-[18px] py-[22px] px-0 [border-bottom:1px_solid_rgba(28,27,25,.1)]">
              <div className="relative w-[96px] h-[120px] bg-[#E7E2DA] text-[#8C877F]">
                <ImageSlot id={'p-' + l.id + '-1'} caption="Product" sizes="96px" />
              </div>
              <div className="flex flex-col gap-[6px] min-w-0">
                <div className="flex justify-between gap-[12px]">
                  <Link href={'/products/' + l.id} onClick={close} className="text-inherit no-underline text-[15px] font-medium">{l.product.name}</Link>
                  <span className="[font:400_13px/1.4_var(--font-mono)]">{money(l.qty * l.product.price)}</span>
                </div>
                <span className="text-[12px] text-[#6B6761]">{l.product.type} · {l.color}</span>
                <div className="mt-auto flex justify-between items-center">
                  <div className="flex items-center [border:1px_solid_rgba(28,27,25,.2)] h-[36px]">
                    <button onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease" className="appearance-none [background:none] border-0 w-[36px] h-[34px] cursor-pointer text-[16px] text-[#1C1B19]">−</button>
                    <span className="min-w-[22px] text-center [font:400_12px/1_var(--font-mono)]">{l.qty}</span>
                    <button onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase" className="appearance-none [background:none] border-0 w-[36px] h-[34px] cursor-pointer text-[16px] text-[#1C1B19]">+</button>
                  </div>
                  <button onClick={() => remove(l.key)} className="appearance-none [background:none] border-0 text-[12px] text-[#6B6761] underline underline-offset-4 cursor-pointer py-[8px] px-0">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {lines.length > 0 && (
          <div className="p-[24px_28px_28px] [border-top:1px_solid_rgba(28,27,25,.12)] flex flex-col gap-[14px]">
            <div className="flex justify-between text-[15px] font-medium"><span>Subtotal</span><span className="font-mono font-normal">{money(cartSubtotal(raw))}</span></div>
            <span className="text-[12px] text-[#6B6761]">White-glove delivery included on equipment. Taxes calculated at checkout.</span>
            <Link
              href="/checkout" {...magnetic} onClick={close}
              className="flex items-center justify-center h-[56px] bg-[#1C1B19] text-[#F2EFEA] no-underline text-[13px] font-medium tracking-[.12em] uppercase [transition:transform_.3s_ease,background_.3s_ease] hover:bg-black hover:text-[#F2EFEA]"
              style={magneticTransform}
            >Checkout</Link>
          </div>
        )}
      </aside>
    </>
  );
}
