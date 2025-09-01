import { getProductBySlug } from '@/app/actions/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import ProductDetail from './ProductDetail';
import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProductDetail product={product as any} />
      <Footer />
    </div>
  );
}

// Static params disabled to avoid heavy prerender and build-time data issues.

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Produit' };
  return {
    title: `${product.koleksiyonu} ${product.renk} ${product.olcusu}`,
    description: `${product.koleksiyonu} • ${product.renk} • ${product.olcusu}`,
    alternates: { canonical: `https://royalcarrelages.fr/carrelages/${slug}` },
    openGraph: {
      title: `${product.koleksiyonu} ${product.renk} ${product.olcusu}`,
      description: `${product.koleksiyonu} • ${product.renk} • ${product.olcusu}`,
      url: `https://royalcarrelages.fr/carrelages/${slug}`,
      type: 'product',
    },
  };
}