import { getProducts } from '@/app/actions/products';
import TilesClient from './TilesClient';

export default async function TilesPage() {
  // For static export, get all products and let client handle everything
  const allProducts = await getProducts();

  return (
    <TilesClient 
      products={allProducts}
    />
  );
}
