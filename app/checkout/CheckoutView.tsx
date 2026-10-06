'use client';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useCart, cartLines, cartCount, cartSubtotal } from '@/lib/cart-store';
import { money } from '@/lib/format';
import ImageSlot from '@/components/ui/ImageSlot';
import { Logo } from '@/components/brand/Logo';
import { findPromo, type Promo } from '@/lib/promo';
import { saveOrder } from '@/lib/orders';

// Card checks run before an order is accepted: Luhn-valid number, unexpired MM/YY, 3–4 digit CVC.
const luhn = (n: string) => { let sum = 0; for (let i = 0; i < n.length; i++) { let d = +n[n.length - 1 - i]; if (i % 2) { d *= 2; if (d > 9) d -= 9; } sum += d; } return sum % 10 === 0; };
function cardErrors(f: FormData) {
  const e: Record<string, string> = {};
  const num = String(f.get('cardNumber') || '').replace(/\s+/g, '');
  if (!/^\d{13,19}$/.test(num) || !luhn(num)) e.cardNumber = 'Enter a valid card number.';
  const m = String(f.get('cardExpiry') || '').match(/^\s*(\d{1,2})\s*\/\s*(\d{2})\s*$/);
  const now = new Date();
  if (!m || +m[1] < 1 || +m[1] > 12 || new Date(2000 + +m[2], +m[1], 1) <= now) e.cardExpiry = 'Enter a valid expiry date (MM / YY).';
  if (!/^\d{3,4}$/.test(String(f.get('cardCvc') || '').trim())) e.cardCvc = 'Enter the 3 or 4 digit code.';
  if (!String(f.get('cardName') || '').trim()) e.cardName = 'Enter the name on the card.';
  return e;
}

// Inputs: 54px, 1px rgba(28,27,25,.22) border, white fill, charcoal border on focus.
const field = 'h-[54px] p-[0_16px] [border:1px_solid_rgba(28,27,25,.22)] bg-white text-[15px] text-[#1C1B19] [font-family:inherit] focus:outline-none focus:!border-[#1C1B19]';
const legend = 'p-[0_0_18px] flex gap-[14px] items-baseline text-[18px] font-medium';
const legendNum = '[font:400_11px/1_var(--font-mono)] text-[#6B6761]';

const ships = [
  { name: 'White-glove delivery & installation', note: 'Two-person team, room of choice, packaging removed · 2–3 weeks', price: 0 },
  { name: 'Kerbside delivery', note: 'Smaller items only · 3–5 working days', price: 0 },
  { name: 'Scheduled evening slot', note: 'Pick a 2-hour window after 6pm', price: 95 }
];
const pays = ['Card', 'Bank transfer', 'Pay in 3'];

export default function CheckoutView() {
  const raw = useCart(s => s.lines);
  const clear = useCart(s => s.clear);
  const [email, setEmail] = useState('');
  const [ship, setShip] = useState(0);
  const [pay, setPay] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [orderNo, setOrderNo] = useState('');
  const [code, setCode] = useState('');
  const [promo, setPromo] = useState<Promo | null>(null);
  const [codeMsg, setCodeMsg] = useState('');
  const [errs, setErrs] = useState<Record<string, string>>({});
  const apply = () => {
    if (!code.trim()) { setCodeMsg('Enter a code.'); return; }
    const p = findPromo(code);
    if (p) { setPromo(p); setCodeMsg(p.label + ' applied.'); } else { setPromo(null); setCodeMsg('That code isn’t recognised.'); }
  };

  const lines = cartLines(raw);
  const sub = cartSubtotal(raw);
  const shipPrice = ships[ship].price;
  const discount = promo ? Math.round(sub * promo.percent) / 100 : 0;
  const total = sub - discount + shipPrice;
  const empty = lines.length === 0;
  const payNote = pay === 1
    ? 'We will email bank details with your confirmation. Your order is reserved for 7 days and scheduled for delivery once payment clears.'
    : 'Split the total into three interest-free payments over 60 days. You will be redirected to confirm after placing the order.';

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!lines.length) return;
    const f = new FormData(e.currentTarget);
    const ce = pay === 0 ? cardErrors(f) : {};
    setErrs(ce);
    if (Object.keys(ce).length) return;
    const no = 'LYL-' + Math.floor(100000 + Math.random() * 899999);
    const g = (k: string) => String(f.get(k) || '').trim();
    saveOrder({
      no, placedAt: new Date().toISOString(), email, name: g('firstName') + ' ' + g('lastName'),
      address: [g('address'), g('apartment'), g('city') + ' ' + g('postcode'), g('country')].filter(Boolean).join(', '),
      shipping: ships[ship].name, payment: pays[pay],
      lines: lines.map(l => ({ id: l.id, name: l.product.name, color: l.color, qty: l.qty, price: l.product.price })),
      subtotal: sub, discount, code: promo?.code || '', shippingPrice: shipPrice, total
    });
    clear(); setOrderNo(no); setPlaced(true); window.scrollTo(0, 0);
  };
  const errText = (k: string) => errs[k] ? <span role="alert" className="text-[13px] text-[#9B3B2E] col-[1/-1]">{errs[k]}</span> : null;

  return (
    <div className="font-sans text-[#1C1B19] bg-[#F7F5F1] min-h-screen">
      <header className="h-[76px] flex justify-between items-center p-[0_clamp(20px,3.4vw,48px)] [border-bottom:1px_solid_rgba(28,27,25,.1)]">
        <Link href="/" aria-label="Leave Your Legacy — home" className="text-inherit no-underline flex items-center"><Logo size={18} /></Link>
        <Link href="/shop" className="text-[13px] text-[#4A4743] no-underline">← Continue shopping</Link>
      </header>

      {placed ? (
        <section className="max-w-[720px] mx-auto p-[clamp(96px,12vw,180px)_24px] flex flex-col gap-[24px]">
          <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#6B6761]">Order {orderNo}</span>
          <h1 className="m-0 font-medium [font-stretch:82%] text-[clamp(48px,7vw,96px)] leading-[.9] tracking-[-.03em] uppercase">Thank you.</h1>
          <p className="m-0 text-[17px] leading-[1.6] text-[#3A3835] max-w-[520px]">A confirmation is on its way to {email}. Our delivery team will call within two working days to arrange a time.</p>
          <Link href="/account" className="self-start text-[#1C1B19] text-[13px] tracking-[.06em] underline-offset-[5px]">View your orders</Link>
          <Link href="/" className="self-start mt-[16px] inline-flex items-center h-[54px] p-[0_30px] bg-[#1C1B19] text-[#F2EFEA] hover:text-[#F2EFEA] no-underline text-[12px] font-medium tracking-[.14em] uppercase">Back to Leave Your Legacy</Link>
        </section>
      ) : (
        <form onSubmit={submit} className="max-w-[1280px] mx-auto p-[clamp(40px,5vw,72px)_clamp(20px,3.4vw,48px)_120px] flex flex-wrap-reverse gap-[48px_clamp(40px,6vw,96px)] items-start">
          <div className="flex-[1.4_1_520px] flex flex-col gap-[48px] min-w-0">
            <h1 className="m-0 font-medium [font-stretch:82%] text-[clamp(40px,4.4vw,64px)] leading-[.9] tracking-[-.03em] uppercase">Checkout</h1>

            <fieldset className="border-0 m-0 p-0 flex flex-col gap-[14px]">
              <legend className={legend}><span className={legendNum}>01</span>Contact</legend>
              <input type="email" name="email" autoComplete="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className={field + ' [transition:border-color_.2s]'} />
              <input type="tel" name="phone" autoComplete="tel" placeholder="Phone (for delivery scheduling)" className={field} />
              <label className="flex gap-[10px] items-center text-[14px] text-[#4A4743] cursor-pointer"><input type="checkbox" className="w-[16px] h-[16px] accent-[#1C1B19] m-0" /> Email me about new pieces and product drops</label>
            </fieldset>

            <fieldset className="border-0 m-0 p-0 grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-[14px]">
              <legend className={legend}><span className={legendNum}>02</span>Delivery</legend>
              <input name="firstName" autoComplete="given-name" required placeholder="First name" className={field} />
              <input name="lastName" autoComplete="family-name" required placeholder="Last name" className={field} />
              <input name="address" autoComplete="address-line1" required placeholder="Address" className={field + ' col-[1/-1]'} />
              <input name="apartment" autoComplete="address-line2" placeholder="Apartment, floor, access notes (optional)" className={field + ' col-[1/-1]'} />
              <input name="city" autoComplete="address-level2" required placeholder="City" className={field} />
              <input name="postcode" autoComplete="postal-code" required placeholder="Postcode" className={field} />
              <select name="country" autoComplete="country-name" className={field + ' col-[1/-1]'}>
                <option>Switzerland</option><option>Germany</option><option>United Kingdom</option><option>United States</option><option>France</option><option>Netherlands</option>
              </select>
            </fieldset>

            <fieldset className="border-0 m-0 p-0 flex flex-col gap-[10px]">
              <legend className={legend}><span className={legendNum}>03</span>Shipping</legend>
              {ships.map((sh, i) => (
                <button
                  key={sh.name} type="button" onClick={() => setShip(i)} role="radio" aria-checked={ship === i}
                  className="appearance-none grid grid-cols-[20px_1fr_auto] gap-[14px] items-center text-left p-[18px_16px] bg-white cursor-pointer text-[#1C1B19] [transition:border-color_.25s]"
                  style={{ border: `1px solid ${ship === i ? '#1C1B19' : 'rgba(28,27,25,.22)'}` }}
                >
                  <span className="w-[16px] h-[16px] rounded-full box-border [border:1px_solid_#1C1B19] [transition:box-shadow_.25s]" style={{ boxShadow: `inset 0 0 0 ${ship === i ? '4px' : '0px'} #1C1B19` }} />
                  <span className="flex flex-col gap-[4px]"><span className="text-[15px] font-medium">{sh.name}</span><span className="text-[13px] text-[#6B6761]">{sh.note}</span></span>
                  <span className="[font:400_13px/1_var(--font-mono)]">{sh.price ? money(sh.price) : 'Included'}</span>
                </button>
              ))}
            </fieldset>

            <fieldset className="border-0 m-0 p-0 flex flex-col gap-[14px]">
              <legend className={legend}><span className={legendNum}>04</span>Payment</legend>
              <div className="flex [border:1px_solid_rgba(28,27,25,.22)]">
                {pays.map((n, i) => (
                  <button
                    key={n} type="button" onClick={() => setPay(i)} aria-pressed={pay === i}
                    className="appearance-none flex-1 h-[48px] border-0 [font:500_12px/1_var(--font-sans)] tracking-[.1em] uppercase cursor-pointer [transition:background_.25s,color_.25s]"
                    style={{ background: pay === i ? '#1C1B19' : 'transparent', color: pay === i ? '#F2EFEA' : '#1C1B19' }}
                  >{n}</button>
                ))}
              </div>
              {pay === 0 ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-[14px]">
                  <input name="cardNumber" autoComplete="cc-number" required inputMode="numeric" placeholder="Card number" className={field + ' col-[1/-1]'} />{errText('cardNumber')}
                  <input name="cardExpiry" autoComplete="cc-exp" required placeholder="MM / YY" className={field} />
                  <input name="cardCvc" autoComplete="cc-csc" required inputMode="numeric" placeholder="CVC" className={field} />{errText('cardExpiry')}{errText('cardCvc')}
                  <input name="cardName" autoComplete="cc-name" required placeholder="Name on card" className={field + ' col-[1/-1]'} />{errText('cardName')}
                </div>
              ) : (
                <p className="m-0 p-[18px_16px] bg-[#EFEBE5] text-[14px] leading-[1.6] text-[#4A4743]">{payNote}</p>
              )}
            </fieldset>

            <button
              type="submit" disabled={empty}
              className="h-[62px] border-0 bg-[#1C1B19] text-[#F2EFEA] [font:500_13px/1_var(--font-sans)] tracking-[.14em] uppercase cursor-pointer flex items-center justify-between p-[0_24px] [transition:background_.3s] hover:bg-black"
              style={{ opacity: empty ? 0.4 : 1 }}
            ><span>Place order</span><span className="font-mono tracking-normal">{money(total)}</span></button>
            <span className="text-[12px] text-[#6B6761] mt-[-32px]">Secure payment. 30-day trial and free collection on all equipment.</span>
          </div>

          <aside className="flex-[1_1_360px] sticky top-[32px] bg-[#EFEBE5] p-[clamp(24px,2.6vw,36px)] flex flex-col gap-[20px] box-border">
            <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase text-[#6B6761]">Order summary · {cartCount(raw)} items</span>
            {empty && <p className="m-0 text-[14px] text-[#4A4743]">Your bag is empty. <Link href="/shop">Visit the shop</Link>.</p>}
            {lines.map(l => (
              <div key={l.key} className="grid grid-cols-[64px_1fr_auto] gap-[14px] items-center">
                <div className="relative w-[64px] h-[80px] bg-[#E0DAD1] text-[#8C877F]">
                  <ImageSlot id={'p-' + l.id + '-1'} caption="" sizes="64px" />
                  <span className="absolute top-[-8px] right-[-8px] min-w-[20px] h-[20px] rounded-[10px] bg-[#1C1B19] text-[#F2EFEA] [font:400_10px/20px_var(--font-mono)] text-center">{l.qty}</span>
                </div>
                <div className="flex flex-col gap-[4px] min-w-0"><span className="text-[14px] font-medium">{l.product.name}</span><span className="text-[12px] text-[#6B6761]">{l.color}</span></div>
                <span className="[font:400_13px/1_var(--font-mono)]">{money(l.qty * l.product.price)}</span>
              </div>
            ))}
            <div className="flex gap-[8px] pt-[20px] [border-top:1px_solid_rgba(28,27,25,.12)]">
              <input aria-label="Gift card or code" value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); apply(); } }} placeholder="Gift card or code" className="flex-1 min-w-0 h-[48px] p-[0_14px] [border:1px_solid_rgba(28,27,25,.22)] bg-white text-[14px] text-[#1C1B19] [font-family:inherit] focus:outline-none focus:!border-[#1C1B19]" />
              <button type="button" onClick={apply} className="h-[48px] p-[0_18px] [border:1px_solid_#1C1B19] bg-transparent [font:500_11px/1_var(--font-sans)] tracking-[.12em] uppercase text-[#1C1B19] cursor-pointer">Apply</button>
            </div>
            {codeMsg && <span role="status" className={'text-[13px] -mt-[8px] ' + (promo ? 'text-[#5E7A5A]' : 'text-[#9B3B2E]')}>{codeMsg}</span>}
            <div className="flex flex-col gap-[10px] text-[14px] text-[#3A3835]">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-mono text-[13px]">{money(sub)}</span></div>
              {promo && <div className="flex justify-between"><span>Discount ({promo.code})</span><span className="font-mono text-[13px]">−{money(discount)}</span></div>}
              <div className="flex justify-between"><span>Shipping</span><span className="font-mono text-[13px]">{shipPrice ? money(shipPrice) : 'Included'}</span></div>
              <div className="flex justify-between"><span>VAT (8.1%, included)</span><span className="font-mono text-[13px]">{money(total - total / 1.081)}</span></div>
            </div>
            <div className="flex justify-between items-baseline pt-[16px] [border-top:1px_solid_rgba(28,27,25,.12)]"><span className="text-[16px] font-medium">Total</span><span className="[font:400_20px/1_var(--font-mono)]">{money(total)}</span></div>
          </aside>
        </form>
      )}
    </div>
  );
}
