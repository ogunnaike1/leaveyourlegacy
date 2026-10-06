'use client';
import Link from 'next/link';
import { collections, inCollection } from '@/lib/catalogue';
import { money } from '@/lib/format';
import { hover } from '@/components/motion/hover';
import LineReveal from '@/components/motion/LineReveal';
import Parallax from '@/components/motion/Parallax';
import ImageSlot from '@/components/ui/ImageSlot';

const copy: Record<string, [string, string, string, string]> = {
  strength: ['Strength — bench, rack and bar against raw plaster', 'The core of the catalogue. Benches, racks, bars and free weights engineered to commercial ratings and finished like furniture. Built to be loaded hard and left out in plain sight.', '/shop?c=Strength', '1 / 1'],
  cardio: ['Cardio — walnut rower and slat treadmill, morning light', 'Two machines, made properly. A slat-belt treadmill quiet enough for an apartment, and a water rower in solid walnut that stands upright when you are done.', '/shop?c=Cardio', '4 / 5'],
  'home-gym': ['Home gym — complete room, concrete floor and oak joinery', 'A considered starting point for a dedicated room: bench, dumbbells, rack, rower, mat and mirror. Our studio will plan the layout around your space at no cost.', '/shop?line=gym', '16 / 11'],
  accessories: ['Accessories — rubber mat, rollers and towel, still life', 'The details that make a session: recovery tools and natural-rubber mats edged in vegetable-tanned leather.', '/shop?c=Accessories', '4 / 5'],
  home: ['Home — plaster lamp, arched mirror and linen in soft light', 'Mirrors, light, textiles and storage for the rooms around the room. Made in the same workshops as our equipment, to the same tolerances.', '/shop?line=home', '1 / 1']
};
const themes = [
  { bg: '#F2EFEA', fg: '#1C1B19', muted: '#6B6761', body: '#4A4743', rule: 'rgba(28,27,25,.14)', ph: '#E3DED6', phInk: '#8C877F', theme: 'light' },
  { bg: '#1A1917', fg: '#F2EFEA', muted: '#9C978F', body: '#D9D3CA', rule: 'rgba(242,239,234,.16)', ph: '#262421', phInk: '#7D786F', theme: 'dark' },
  { bg: '#F7F5F1', fg: '#1C1B19', muted: '#6B6761', body: '#4A4743', rule: 'rgba(28,27,25,.14)', ph: '#E3DED6', phInk: '#8C877F', theme: 'light' },
  { bg: '#F2EFEA', fg: '#1C1B19', muted: '#6B6761', body: '#4A4743', rule: 'rgba(28,27,25,.14)', ph: '#E3DED6', phInk: '#8C877F', theme: 'light' },
  { bg: '#E5DCCF', fg: '#2A2520', muted: '#6B6258', body: '#4E463E', rule: 'rgba(42,37,32,.16)', ph: '#D6CBBB', phInk: '#8A8074', theme: 'light' }
];
const cols = collections.map((c, i) => {
  const k = copy[c.id], items = inCollection(c.id);
  return {
    ...themes[i], id: c.id, name: c.name, num: String(i + 1).padStart(2, '0'), label: 'Collection ' + c.name,
    anchor: '#' + c.id, count: items.length, cap: k[0], text: k[1], href: k[2], ratio: k[3], slot: 'collection-' + c.id,
    dir: i % 2 ? 'row-reverse' : 'row',
    items: items.slice(0, 4).map(p => ({ name: p.name + ' — ' + p.type, price: money(p.price), href: '/products/' + p.id }))
  } as const;
});

export default function CollectionsView() {
  return (
    <>
      <section data-screen-label="Collections header" className="max-w-[1680px] mx-auto p-[clamp(120px,14vw,200px)_clamp(20px,3.4vw,48px)_clamp(64px,8vw,120px)]">
        <div data-reveal="" className="flex flex-wrap justify-between items-end gap-[24px_48px]">
          <h1 className="m-0 font-medium [font-stretch:80%] text-[clamp(64px,11.5vw,200px)] leading-[.82] tracking-[-.04em] uppercase"><LineReveal dur={1.4} pb=".03em">Collections</LineReveal></h1>
          <p className="m-[0_0_12px] max-w-[360px] text-[15px] leading-[1.6] text-[#4A4743] [text-wrap:pretty] [transition:opacity_1.2s_ease_.4s]" style={{ opacity: 'var(--in,0)' }}>Five ways into the catalogue. Each one is edited, not exhaustive — we would rather make fewer things properly.</p>
        </div>
        <nav className="flex flex-wrap gap-[12px_32px] mt-[56px] pt-[20px] [border-top:1px_solid_rgba(28,27,25,.14)]">
          {cols.map(c => (
            <a key={c.id} href={c.anchor} className="flex gap-[8px] items-baseline text-[#1C1B19] no-underline text-[14px] font-medium"><span className="[font:400_10px/1_var(--font-mono)] text-[#6B6761]">{c.num}</span>{c.name}</a>
          ))}
        </nav>
      </section>

      {cols.map(c => (
        <section key={c.id} id={c.id} data-theme={c.theme} data-screen-label={c.label} className="p-[clamp(72px,9vw,140px)_clamp(20px,3.4vw,48px)]" style={{ background: c.bg, color: c.fg }}>
          <div className="max-w-[1680px] mx-auto flex flex-wrap gap-[40px_clamp(32px,6vw,120px)] items-center" style={{ flexDirection: c.dir }}>
            <div
              {...hover} data-reveal=""
              className="flex-[1.3_1_480px] relative overflow-hidden [transition:clip-path_1.6s_cubic-bezier(.7,0,.2,1)]"
              style={{ aspectRatio: c.ratio, background: c.ph, color: c.phInk, clipPath: 'inset(calc((1 - var(--in,0)) * 100%) 0 0 0)' }}
            >
              <Parallax factor={0.06} inset="-9%" className="[transition:transform_1.4s_cubic-bezier(.2,.7,.2,1)]" style={{ transform: 'translateY(var(--py,0px)) scale(calc(1.02 + var(--h,0) * .03))' }}>
                <ImageSlot id={c.slot} caption={c.cap} sizes="(max-width: 900px) 100vw, 56vw" />
              </Parallax>
            </div>
            <div data-reveal="" className="flex-[1_1_360px] flex flex-col gap-[28px] max-w-[520px]">
              <span className="[font:400_11px/1_var(--font-mono)] tracking-[.14em] uppercase" style={{ color: c.muted }}>{c.num} — {c.count} pieces</span>
              <h2 className="m-0 font-medium [font-stretch:82%] text-[clamp(52px,7vw,124px)] leading-[.86] tracking-[-.035em] uppercase"><LineReveal dur={1.4}>{c.name}</LineReveal></h2>
              <p className="m-0 text-[16px] leading-[1.65] [text-wrap:pretty] [transition:opacity_1.2s_ease_.4s]" style={{ color: c.body, opacity: 'var(--in,0)' }}>{c.text}</p>
              <div className="flex flex-col [transition:opacity_1.2s_ease_.55s]" style={{ borderTop: `1px solid ${c.rule}`, opacity: 'var(--in,0)' }}>
                {c.items.map(it => (
                  <Link key={it.href} href={it.href} className="flex justify-between gap-[16px] py-[14px] text-inherit no-underline text-[14px]" style={{ borderBottom: `1px solid ${c.rule}` }}>
                    <span>{it.name}</span><span className="font-mono text-[12px]">{it.price}</span>
                  </Link>
                ))}
              </div>
              <Link href={c.href} className="self-start text-inherit text-[13px] font-medium tracking-[.08em] uppercase underline-offset-[6px]">Shop {c.name}</Link>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
