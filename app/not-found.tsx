'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-7xl md:text-8xl font-light text-gray-900 tracking-tight">{t.notFound.code}</h1>
            <p className="mt-6 text-2xl md:text-3xl font-light text-gray-800">
              {t.notFound.title}
            </p>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              {t.notFound.description}
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/" className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors cursor-pointer">
                {t.notFound.backHome}
              </Link>
              <Link href="/carrelages" className="border border-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                {t.notFound.viewTiles}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}