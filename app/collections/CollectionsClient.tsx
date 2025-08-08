'use client';

import { useLanguage } from '@/lib/language-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

interface Collection {
  koleksiyonu: string;
  imagePath: string;
  renk: string;
  olcusu: string;
}

interface CollectionsClientProps {
  collections: Collection[];
}

export default function CollectionsClient({ collections }: CollectionsClientProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-4xl font-light text-gray-800 mb-8 text-center">
            {t.collections.title}
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.koleksiyonu}
                href={`/tiles?search=${encodeURIComponent(collection.koleksiyonu)}`}
                className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="aspect-square relative bg-gray-100">
                  <Image
                    src={collection.imagePath}
                    alt={collection.koleksiyonu}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-medium text-gray-800">
                    {collection.koleksiyonu}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/tiles"
              className="inline-block bg-gray-800 text-white px-8 py-3 rounded hover:bg-gray-700 transition-colors"
            >
              {t.collections.viewAll} →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 