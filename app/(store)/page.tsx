import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import CollectionsEditorial from '@/components/home/CollectionsEditorial';
import FeaturedGrid from '@/components/home/FeaturedGrid';
import ScrollStory from '@/components/home/ScrollStory';
import HomeEdit from '@/components/home/HomeEdit';
import Statement from '@/components/home/Statement';
import Bestsellers from '@/components/home/Bestsellers';
import Philosophy from '@/components/home/Philosophy';

export default function HomePage() {
  return (
    <div className="font-sans text-[#1C1B19] bg-[#F2EFEA]">
      <Header dark />
      <Hero />
      <CollectionsEditorial />
      <FeaturedGrid />
      <ScrollStory />
      <HomeEdit />
      <Statement />
      <Bestsellers />
      <Philosophy />
      <Footer />
    </div>
  );
}
