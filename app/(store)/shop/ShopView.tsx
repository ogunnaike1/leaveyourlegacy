'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAnimate } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { products, type Product } from '@/lib/catalogue';
import { useVw } from '@/lib/use-vw';
import Header from '@/components/layout/Header';
import LineReveal from '@/components/motion/LineReveal';
import ProductCard from '@/components/product/ProductCard';
import CategoryTabs from '@/components/shop/CategoryTabs';
import SortSelect, { type Sort } from '@/components/shop/SortSelect';
import ActiveChips, { type Chip } from '@/components/shop/ActiveChips';
import FilterPanel, { type FilterGroup } from '@/components/shop/FilterPanel';

type Group = 'price' | 'equipment' | 'color' | 'avail';
type Sel = Record<Group, string[]>;
const EMPTY: Sel = { price: [], equipment: [], color: [], avail: [] };

const ranges = [{ k: 'Under $250', a: 0, b: 250 }, { k: '$250 – $1,000', a: 250, b: 1000 }, { k: '$1,000 – $5,000', a: 1000, b: 5000 }, { k: '$5,000 and above', a: 5000, b: 1e9 }];
const availOf = (p: Product) => (p.stock === 'Made to order' ? 'Made to order' : 'In stock');
const titles: Record<string, [string, string]> = {
  gym: ['Gym', 'Strength and cardio equipment, rated for commercial use and proportioned for the home.'],
  home: ['Home', 'Mirrors, light, textiles and storage — made in the same workshops, to the same tolerances.']
};

export type ShopInit = { cat: string; line: string; sort: Sort; sel: Sel };

export default function ShopView({ init }: { init: ShopInit }) {
  const [cat, setCat] = useState(init.cat);
  const [line, setLine] = useState(init.line);
  const [sel, setSel] = useState<Sel>(init.sel);
  const [sort, setSort] = useState<Sort>(init.sort);
  const vw = useVw();
  const m = vw < 900;
  // null = default for the breakpoint (open on desktop, closed on mobile); reset when crossing 900px.
  const [openState, setOpen] = useState<boolean | null>(null);
  useEffect(() => { setOpen(null); }, [m]);
  const open = openState ?? !m;

  // Grid fade-up on any filter/sort change (700ms, 45ms stagger capped at 8).
  const [grid, animate] = useAnimate<HTMLDivElement>();
  const k = [cat, line, sort, JSON.stringify(sel)].join('|');
  const lastK = useRef(k);
  useEffect(() => {
    if (lastK.current === k) return;
    lastK.current = k;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !grid.current) return;
    const items = grid.current.querySelectorAll('[data-item]');
    if (items.length) animate(items, { opacity: [0, 1], transform: ['translateY(18px)', 'none'] }, { duration: 0.7, delay: i => Math.min(i, 8) * 0.045, ease: [0.2, 0.7, 0.1, 1] });
  }, [k, animate, grid]);

  // Mirror state to the URL; if the URL changes for any other reason (a header link), adopt it.
  const spStr = useSearchParams().toString();
  const written = useRef<string | null>(null);
  useEffect(() => {
    if (written.current === null || spStr === written.current) return;
    const q = new URLSearchParams(spStr), list = (g: string) => (q.get(g) || '').split(',').filter(Boolean);
    const so = q.get('sort') as Sort;
    setCat(q.get('c') || 'All'); setLine(q.get('line') || '');
    setSort(['featured', 'price-asc', 'price-desc', 'name'].includes(so) ? so : 'featured');
    setSel({ price: list('price'), equipment: list('equipment'), color: list('color'), avail: list('avail') });
  }, [spStr]);
  useEffect(() => {
    const q = new URLSearchParams();
    if (cat !== 'All') q.set('c', cat);
    if (line) q.set('line', line);
    if (sort !== 'featured') q.set('sort', sort);
    (Object.keys(sel) as Group[]).forEach(g => { if (sel[g].length) q.set(g, sel[g].join(',')); });
    const s = q.toString();
    written.current = s;
    window.history.replaceState(window.history.state, '', location.pathname + (s ? '?' + s : ''));
  }, [cat, line, sort, sel]);

  const v = useMemo(() => {
    const base = line ? products.filter(p => p.line === line) : products;
    const test = (p: Product, skip?: Group) => (cat === 'All' || p.category === cat)
      && (skip === 'price' || !sel.price.length || sel.price.some(key => { const r = ranges.find(x => x.k === key)!; return p.price >= r.a && p.price < r.b; }))
      && (skip === 'equipment' || !sel.equipment.length || sel.equipment.includes(p.equipment))
      && (skip === 'color' || !sel.color.length || p.colors.some(c => sel.color.includes(c.name)))
      && (skip === 'avail' || !sel.avail.length || sel.avail.includes(availOf(p)));
    let items = base.filter(p => test(p));
    if (sort === 'price-asc') items = [...items].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') items = [...items].sort((a, b) => b.price - a.price);
    if (sort === 'name') items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    const toggle = (g: Group, val: string) => setSel(st => { const cur = st[g]; return { ...st, [g]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] }; });
    const opt = (g: Group, label: string, n: number, swatch?: string) => ({ label, count: n, on: sel[g].includes(label), swatch, toggle: () => toggle(g, label) });
    const pool = (g: Group) => base.filter(p => test(p, g));
    const cats = ['All', 'Strength', 'Cardio', 'Accessories', 'Home'].map(c => ({
      key: c, label: c, count: c === 'All' ? base.length : base.filter(p => p.category === c).length, active: cat === c
    })).filter(c => c.count > 0 || c.label === 'All');
    const equipment = [...new Set(base.map(p => p.equipment))];
    const colorMap: Record<string, string> = {}; base.forEach(p => p.colors.forEach(c => { colorMap[c.name] = c.hex; }));
    const groups: FilterGroup[] = [
      { title: 'Price', options: ranges.map(r => opt('price', r.k, pool('price').filter(p => p.price >= r.a && p.price < r.b).length)) },
      { title: 'Equipment type', options: equipment.map(e => opt('equipment', e, pool('equipment').filter(p => p.equipment === e).length)) },
      { title: 'Colour & finish', options: Object.keys(colorMap).map(c => opt('color', c, pool('color').filter(p => p.colors.some(x => x.name === c)).length, colorMap[c])) },
      { title: 'Availability', options: ['In stock', 'Made to order'].map(a => opt('avail', a, pool('avail').filter(p => availOf(p) === a).length)) }
    ];
    const chips: Chip[] = [];
    (Object.keys(sel) as Group[]).forEach(g => sel[g].forEach(val => chips.push({ label: val, remove: () => toggle(g, val) })));
    return { items, cats, groups, chips };
  }, [cat, line, sel, sort]);

  const t = titles[line] || ['Shop', 'Equipment, accessories and objects for rooms where training is part of living.'];
  const title = cat !== 'All' && !line ? cat : t[0];
  const nSel = v.chips.length;
  const count = v.items.length;
  const filterLabel = m ? 'Filter' + (nSel ? ' (' + nSel + ')' : '') : (open ? 'Hide filters' : 'Show filters') + (nSel ? ' (' + nSel + ')' : '');
  const clearAll = () => setSel(EMPTY);
  const closeFilters = () => setOpen(m ? false : open);

  return (
    <>
      <Header current={(line || 'shop') as 'shop' | 'gym' | 'home'} />

      <section data-screen-label="Shop header" className="p-[clamp(120px,14vw,200px)_clamp(20px,3.4vw,48px)_0] max-w-[1680px] mx-auto">
        <div data-reveal="" className="flex flex-wrap justify-between items-end gap-[24px_48px]">
          <h1 className="m-0 font-medium [font-stretch:80%] text-[clamp(72px,13vw,220px)] leading-[.82] tracking-[-.04em] uppercase"><LineReveal dur={1.4} pb=".03em">{title}</LineReveal></h1>
          <p className="m-[0_0_12px] max-w-[360px] text-[15px] leading-[1.6] text-[#4A4743] [text-wrap:pretty] [transition:opacity_1.2s_ease_.4s]" style={{ opacity: 'var(--in,0)' }}>{t[1]}</p>
        </div>
        <CategoryTabs cats={v.cats} onPick={setCat} />
        <div className="flex justify-between items-center gap-[16px] py-[18px] px-0 [border-bottom:1px_solid_rgba(28,27,25,.08)]">
          <button onClick={() => setOpen(!open)} className="appearance-none [background:none] border-0 p-[8px_0] cursor-pointer flex items-center gap-[10px] [font:500_12px/1_var(--font-sans)] tracking-[.12em] uppercase text-[#1C1B19]">
            <span className="flex flex-col gap-[4px]"><span className="block w-[16px] h-px bg-current" /><span className="block w-[10px] h-px bg-current ml-[3px]" /><span className="block w-[4px] h-px bg-current ml-[6px]" /></span>
            {filterLabel}
          </button>
          <span className="[font:400_11px/1_var(--font-mono)] tracking-[.1em] uppercase text-[#6B6761]">{count + (count === 1 ? ' product' : ' products')}</span>
          <SortSelect value={sort} onChange={setSort} />
        </div>
        <ActiveChips chips={v.chips} onClear={clearAll} />
      </section>

      <section className="max-w-[1680px] mx-auto p-[40px_clamp(20px,3.4vw,48px)_clamp(96px,10vw,160px)] flex gap-[clamp(32px,3.4vw,56px)] items-start">
        <FilterPanel groups={v.groups} open={open} mobile={m} count={count} onClose={closeFilters} onClear={clearAll} />
        <div className="flex-1 min-w-0">
          <div ref={grid} className="grid grid-cols-[repeat(auto-fill,minmax(min(calc(50%_-_10px),290px),1fr))] gap-[56px_20px]">
            {v.items.map(p => (
              <div key={p.id} data-item="">
                <ProductCard pid={p.id} />
              </div>
            ))}
          </div>
          {count === 0 && (
            <div className="py-[96px] px-0 flex flex-col gap-[20px] items-start">
              <p className="m-0 font-serif text-[40px] leading-[1.1]">Nothing fits all of that.</p>
              <button onClick={clearAll} className="appearance-none [background:none] border-0 p-0 [font:500_13px/1_var(--font-sans)] tracking-[.06em] text-[#1C1B19] underline underline-offset-[5px] cursor-pointer">Clear filters</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
