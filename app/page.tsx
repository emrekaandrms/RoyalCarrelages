
'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TileGrid from '@/components/TileGrid';
import FeatureSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <TileGrid />
      <FeatureSection />
      <Footer />
    </div>
  );
}
