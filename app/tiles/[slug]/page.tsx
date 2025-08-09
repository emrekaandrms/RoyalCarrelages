import { getProductBySlug } from '@/app/actions/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import ProductDetail from './ProductDetail';
import fs from 'fs';
import path from 'path';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProductDetail product={product} />
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'products.json'), 'utf-8')) as { slug: string }[];
    return data.map((p) => ({ slug: p.slug }));
  } catch (error) {
    console.error('Error reading products.json:', error);
    return [];
  }
} 