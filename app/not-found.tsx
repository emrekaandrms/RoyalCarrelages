import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-7xl md:text-8xl font-light text-gray-900 tracking-tight">404</h1>
            <p className="mt-6 text-2xl md:text-3xl font-light text-gray-800">
              Page introuvable
            </p>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée. Utilisez la navigation
              ou revenez à l'accueil.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/" className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors cursor-pointer">
                Revenir à l'accueil
              </Link>
              <Link href="/tiles" className="border border-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                Voir les carreaux
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}