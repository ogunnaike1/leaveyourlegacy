import type { Metadata } from 'next';
import Footer from '@/components/layout/Footer';
import type { Sort } from '@/components/shop/SortSelect';
import ShopView from './ShopView';

export const metadata: Metadata = { title: 'Shop — Leave Your Legacy' };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || '';
const list = (v: string | string[] | undefined) => one(v).split(',').filter(Boolean);
const SORTS: Sort[] = ['featured', 'price-asc', 'price-desc', 'name'];

export default async function ShopPage({ searchParams }: { searchParams: Promise<SP> }) {
  const q = await searchParams;
  const sort = one(q.sort) as Sort;
  const init = {
    cat: one(q.c) || 'All',
    line: one(q.line),
    sort: SORTS.includes(sort) ? sort : 'featured',
    sel: { price: list(q.price), equipment: list(q.equipment), color: list(q.color), avail: list(q.avail) }
  };
  return (
    <div data-theme="light" className="font-sans text-[#1C1B19] bg-[#F7F5F1] min-h-screen">
      {/* Keyed by the entry URL so header links (Shop / Gym / Home) start a fresh view, as a page load did. */}
      <ShopView key={init.cat + '|' + init.line} init={init} />
      <Footer />
    </div>
  );
}
