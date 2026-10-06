import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrandView from './BrandView';

export const metadata: Metadata = { title: 'Identity — Leave Your Legacy', description: 'The Leave Your Legacy mark, wordmark, colour and files.' };

export default function BrandPage() {
  return (
    <div data-theme="light" className="font-sans text-[#1C1B19] bg-[#F2EFEA]">
      <Header />
      <BrandView />
      <Footer />
    </div>
  );
}
