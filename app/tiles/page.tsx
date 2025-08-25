import { getProducts } from '@/app/actions/products';
import TilesClient from './TilesClient';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carreaux',
  description: 'Découvrez notre gamme complète de carreaux céramiques effet béton.',
};

export default async function TilesPage() {
  // For static export, get all products and let client handle everything
  const allProducts = await getProducts();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TilesClient products={allProducts} />
    </Suspense>
  );
}
