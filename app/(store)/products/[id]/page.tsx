import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { byId, products } from '@/lib/catalogue';
import ProductView from './ProductView';

export const generateStaticParams = () => products.map(p => ({ id: p.id }));

// Unknown ids fall back to the first product, as the reference did.
const find = (id: string) => byId(id) || products[0];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = find((await params).id);
  return { title: p.name + ' — Leave Your Legacy', description: p.desc };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const p = find((await params).id);
  return (
    <div data-theme="light" className="font-sans text-[#1C1B19] bg-[#F7F5F1]">
      <Header current="shop" />
      <ProductView p={p} />
      <Footer />
    </div>
  );
}
