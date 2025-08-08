
'use client';

import { useLanguage } from '@/lib/language-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function FaucetsPage() {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState('all');

  const types = [
    { id: 'all', name: 'Tous', nameEn: 'All' },
    { id: 'kitchen', name: 'Cuisine', nameEn: 'Kitchen' },
    { id: 'bathroom', name: 'Salle de Bain', nameEn: 'Bathroom' },
    { id: 'shower', name: 'Douche', nameEn: 'Shower' }
  ];

  const faucets = [
    {
      id: 1,
      name: 'Robinet Cuisine Moderne',
      nameEn: 'Modern Kitchen Faucet',
      type: 'kitchen',
      finish: 'Acier Inoxydable',
      image: 'https://readdy.ai/api/search-image?query=Modern%20minimalist%20kitchen%20faucet%20in%20brushed%20stainless%20steel%20finish%2C%20clean%20lines%2C%20contemporary%20design%2C%20professional%20product%20photography%2C%20white%20background%2C%20high-end%20quality&width=400&height=400&seq=faucet-kitchen-1&orientation=squarish'
    },
    {
      id: 2,
      name: 'Mitigeur Salle de Bain Élégant',
      nameEn: 'Elegant Bathroom Mixer',
      type: 'bathroom',
      finish: 'Chrome',
      image: 'https://readdy.ai/api/search-image?query=Elegant%20bathroom%20faucet%20mixer%20in%20polished%20chrome%20finish%2C%20sophisticated%20design%2C%20single%20handle%2C%20modern%20minimalist%20style%2C%20professional%20product%20shot&width=400&height=400&seq=faucet-bathroom-1&orientation=squarish'
    },
    {
      id: 3,
      name: 'Robinet Douche Premium',
      nameEn: 'Premium Shower Faucet',
      type: 'shower',
      finish: 'Noir Mat',
      image: 'https://readdy.ai/api/search-image?query=Premium%20shower%20faucet%20system%20in%20matte%20black%20finish%2C%20contemporary%20design%2C%20luxury%20bathroom%20fixture%2C%20professional%20product%20photography%2C%20clean%20background&width=400&height=400&seq=faucet-shower-1&orientation=squarish'
    },
    {
      id: 4,
      name: 'Mitigeur Cuisine Design',
      nameEn: 'Designer Kitchen Mixer',
      type: 'kitchen',
      finish: 'Laiton Brossé',
      image: 'https://readdy.ai/api/search-image?query=Designer%20kitchen%20mixer%20faucet%20in%20brushed%20brass%20finish%2C%20modern%20elegant%20design%2C%20pull-out%20spray%20head%2C%20premium%20quality%20construction&width=400&height=400&seq=faucet-kitchen-2&orientation=squarish'
    },
    {
      id: 5,
      name: 'Robinet Lavabo Classique',
      nameEn: 'Classic Basin Faucet',
      type: 'bathroom',
      finish: 'Chrome Poli',
      image: 'https://readdy.ai/api/search-image?query=Classic%20basin%20faucet%20in%20polished%20chrome%20finish%2C%20timeless%20design%2C%20single%20handle%2C%20elegant%20curves%2C%20bathroom%20fixture%2C%20professional%20photography&width=400&height=400&seq=faucet-basin-1&orientation=squarish'
    },
    {
      id: 6,
      name: 'Système Douche Luxe',
      nameEn: 'Luxury Shower System',
      type: 'shower',
      finish: 'Acier Inoxydable',
      image: 'https://readdy.ai/api/search-image?query=Luxury%20shower%20system%20in%20stainless%20steel%20finish%2C%20rain%20shower%20head%2C%20hand%20shower%2C%20modern%20thermostatic%20controls%2C%20premium%20bathroom%20fixture&width=400&height=400&seq=faucet-shower-2&orientation=squarish'
    }
  ];

  const filteredFaucets = faucets.filter(faucet => {
    return selectedType === 'all' || faucet.type === selectedType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
              Collection de Robinets
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez notre sélection de robinets premium alliant design moderne et fonctionnalité exceptionnelle pour votre cuisine et salle de bain.
            </p>
          </div>

          <div className="mb-12">
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pr-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFaucets.map((faucet) => (
              <div key={faucet.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                  <img
                    src={faucet.image}
                    alt={faucet.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {faucet.name}
                  </h3>
                  <p className="text-gray-600 mb-4">Finition: {faucet.finish}</p>
                  <button className="w-full bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap">
                    Voir Détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}