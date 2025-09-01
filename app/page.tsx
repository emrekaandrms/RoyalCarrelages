
// server component (no 'use client') so we can export metadata

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TileGrid from '@/components/TileGrid';
import FeatureSection from '@/components/FeatureSection';
// Metadata exported in a client component is disallowed; use layout metadata template instead.
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Carrelages Céramiques Premium à Paris | Royal Carrelages',
  description: "Carrelages effet béton, marbre et bois. Showroom Paris. Devis et conseil design.",
  alternates: { canonical: 'https://royalcarrelages.fr/' },
  openGraph: {
    title: 'Royal Carrelages – Carrelages Céramiques Premium',
    description: "Collections carrelages effet béton, marbre, bois. Showroom Paris. Devis rapide.",
    url: 'https://royalcarrelages.fr/',
    siteName: 'Royal Carrelages',
    type: 'website',
  },
};

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
