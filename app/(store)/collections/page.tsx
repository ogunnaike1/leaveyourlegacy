import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CollectionsView from './CollectionsView';

export const metadata: Metadata = { title: 'Collections — HALDEN' };

export default function CollectionsPage() {
  return (
    <div data-theme="light" className="font-sans text-[#1C1B19] bg-[#F2EFEA]">
      <Header current="collections" />
      <CollectionsView />
      <Footer />
    </div>
  );
}
