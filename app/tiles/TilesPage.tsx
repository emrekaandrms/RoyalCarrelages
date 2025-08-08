
'use client';

import { useLanguage } from '@/lib/language-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import Link from 'next/link';

export default function TilesPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');

  const categories = [
    { id: 'all', name: 'Tous', nameEn: 'All' },
    { id: 'kitchen', name: 'Cuisine', nameEn: 'Kitchen' },
    { id: 'bathroom', name: 'Salle de Bain', nameEn: 'Bathroom' },
    { id: 'living', name: 'Salon', nameEn: 'Living Room' },
    { id: 'outdoor', name: 'Extérieur', nameEn: 'Outdoor' }
  ];

  const colors = [
    { id: 'all', name: 'Toutes Couleurs', nameEn: 'All Colors' },
    { id: 'beige', name: 'Beige', nameEn: 'Beige' },
    { id: 'gray', name: 'Gris', nameEn: 'Gray' },
    { id: 'white', name: 'Blanc', nameEn: 'White' },
    { id: 'terracotta', name: 'Terre Cuite', nameEn: 'Terracotta' }
  ];

  const tiles = [
    {
      id: 1,
      name: 'Béton Beige Classic',
      nameEn: 'Classic Beige Concrete',
      category: 'kitchen',
      color: 'beige',
      size: '30x30cm',
      image: 'https://readdy.ai/api/search-image?query=Premium%20concrete-effect%20ceramic%20tile%20in%20warm%20beige%20color%20with%20natural%20texture%20variations%2C%20clean%20minimal%20background%2C%20high-quality%20surface%20detail%2C%20modern%20minimalist%20aesthetic%2C%20professional%20product%20photography&width=400&height=400&seq=tile-beige-1&orientation=squarish'
    },
    {
      id: 2,
      name: 'Gris Pierre Moderne',
      nameEn: 'Modern Stone Gray',
      category: 'bathroom',
      color: 'gray',
      size: '30x60cm',
      image: 'https://readdy.ai/api/search-image?query=Premium%20concrete-effect%20ceramic%20tile%20in%20sophisticated%20gray%20color%20with%20stone-like%20texture%2C%20natural%20variations%2C%20clean%20background%2C%20luxury%20surface%20finish%2C%20contemporary%20design&width=400&height=400&seq=tile-gray-1&orientation=squarish'
    },
    {
      id: 3,
      name: 'Blanc Naturel Pure',
      nameEn: 'Pure Natural White',
      category: 'living',
      color: 'white',
      size: '60x60cm',
      image: 'https://readdy.ai/api/search-image?query=Premium%20concrete-effect%20ceramic%20tile%20in%20pure%20white%20color%20with%20subtle%20texture%2C%20minimal%20clean%20background%2C%20elegant%20surface%20quality%2C%20Japandi%20aesthetic%20inspiration&width=400&height=400&seq=tile-white-1&orientation=squarish'
    },
    {
      id: 4,
      name: 'Terre Cuite Méditerranéenne',
      nameEn: 'Mediterranean Terracotta',
      category: 'outdoor',
      color: 'terracotta',
      size: '30x30cm',
      image: 'https://readdy.ai/api/search-image?query=Premium%20concrete-effect%20ceramic%20tile%20in%20warm%20terracotta%20clay%20color%2C%20Mediterranean%20inspired%20earth%20tone%2C%20natural%20texture%2C%20artisanal%20quality%20surface%20finish&width=400&height=400&seq=tile-terracotta-1&orientation=squarish'
    },
    {
      id: 5,
      name: 'Beige Sable Chaud',
      nameEn: 'Warm Sand Beige',
      category: 'kitchen',
      color: 'beige',
      size: '20x40cm',
      image: 'https://readdy.ai/api/search-image?query=Premium%20concrete-effect%20ceramic%20tile%20in%20warm%20sand%20beige%20color%20with%20natural%20grain%20patterns%2C%20subtle%20texture%20variations%2C%20clean%20background%2C%20luxury%20quality&width=400&height=400&seq=tile-sand-1&orientation=squarish'
    },
    {
      id: 6,
      name: 'Gris Charbon Profond',
      nameEn: 'Deep Charcoal Gray',
      category: 'bathroom',
      color: 'gray',
      size: '30x60cm',
      image: 'https://readdy.ai/api/search-image?query=Premium%20concrete-effect%20ceramic%20tile%20in%20deep%20charcoal%20gray%20color%2C%20sophisticated%20dark%20texture%20with%20natural%20variations%2C%20dramatic%20elegant%20surface%20finish&width=400&height=400&seq=tile-charcoal-1&orientation=squarish'
    }
  ];

  const filteredTiles = tiles.filter(tile => {
    const categoryMatch = selectedCategory === 'all' || tile.category === selectedCategory;
    const colorMatch = selectedColor === 'all' || tile.color === selectedColor;
    return categoryMatch && colorMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
              Collection de Carreaux
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez notre gamme complète de carreaux céramiques effet béton, parfaits pour créer des espaces élégants et naturels.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-12">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pr-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
              <select 
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="pr-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                {colors.map(color => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTiles.map((tile) => (
              <Link key={tile.id} href={`/tiles/${tile.id}`} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={tile.image}
                    alt={tile.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {tile.name}
                  </h3>
                  <p className="text-gray-600 mb-4">Taille: {tile.size}</p>
                  <div className="w-full bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap text-center">
                    Voir Détails
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
