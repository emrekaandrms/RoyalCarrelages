
'use client';

import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TileGrid() {
  const { t } = useLanguage();
  const [featured, setFeatured] = useState<Array<{ slug: string; image: string; name: string }>>([]);
  const [fallback, setFallback] = useState<Array<{ slug: string; image: string; name: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/featured', { cache: 'no-store' });
        if (res.ok) {
          const items = await res.json();
          setFeatured(
            items.map((it: any) => ({
              slug: it.product.slug,
              image: `/${it.product.imagePath}`,
              name: `${it.product.koleksiyonu} ${it.product.renk} ${it.product.olcusu}`,
            }))
          );
        }
        if ((!res.ok) || (featured.length === 0)) {
          const p = await fetch('/api/products?limit=6', { cache: 'no-store' });
          if (p.ok) {
            const j = await p.json();
            setFallback(
              (j.products || []).map((it: any) => ({
                slug: it.slug,
                image: `/${it.imagePath}`,
                name: `${it.koleksiyonu} ${it.renk} ${it.olcusu}`,
              }))
            );
          }
        }
      } catch {
        // ignore errors
      }
    })();
  }, []);

  const tiles = [
    {
      id: 1,
      name: t.tileGrid.tiles.beige,
      image: 'https://readdy.ai/api/search-image?query=Close-up%20view%20of%20concrete-effect%20ceramic%20tile%20in%20warm%20beige%20color%2C%20natural%20texture%20with%20subtle%20variations%2C%20minimal%20clean%20background%2C%20high-quality%20detailed%20surface%20texture%2C%20modern%20minimalist%20aesthetic%2C%20soft%20natural%20lighting%20highlighting%20texture%20details&width=600&height=600&seq=tile-beige&orientation=squarish',
      description: t.tileGrid.tiles.beige_desc
    },
    {
      id: 2,
      name: t.tileGrid.tiles.gray,
      image: 'https://readdy.ai/api/search-image?query=Close-up%20view%20of%20concrete-effect%20ceramic%20tile%20in%20soft%20gray%20color%2C%20natural%20stone%20texture%20with%20organic%20variations%2C%20minimal%20clean%20background%2C%20premium%20quality%20surface%20detail%2C%20contemporary%20design%2C%20gentle%20natural%20lighting&width=600&height=600&seq=tile-gray&orientation=squarish',
      description: t.tileGrid.tiles.gray_desc
    },
    {
      id: 3,
      name: t.tileGrid.tiles.terracotta,
      image: 'https://readdy.ai/api/search-image?query=Close-up%20view%20of%20concrete-effect%20ceramic%20tile%20in%20clay%20terracotta%20color%2C%20Mediterranean%20inspired%20warm%20earth%20tone%2C%20natural%20texture%20variations%2C%20minimal%20clean%20background%2C%20artisanal%20quality%20surface%2C%20warm%20soft%20lighting&width=600&height=600&seq=tile-terracotta&orientation=squarish',
      description: t.tileGrid.tiles.terracotta_desc
    },
    {
      id: 4,
      name: t.tileGrid.tiles.white,
      image: 'https://readdy.ai/api/search-image?query=Close-up%20view%20of%20concrete-effect%20ceramic%20tile%20in%20natural%20white%20color%2C%20subtle%20texture%20with%20gentle%20variations%2C%20clean%20minimal%20background%2C%20premium%20quality%20surface%20finish%2C%20Japandi%20aesthetic%2C%20soft%20diffused%20lighting&width=600&height=600&seq=tile-white&orientation=squarish',
      description: t.tileGrid.tiles.white_desc
    },
    {
      id: 5,
      name: t.tileGrid.tiles.sand,
      image: 'https://readdy.ai/api/search-image?query=Close-up%20view%20of%20concrete-effect%20ceramic%20tile%20in%20warm%20sand%20color%2C%20natural%20texture%20with%20subtle%20grain%20patterns%2C%20minimal%20clean%20background%2C%20luxury%20surface%20quality%2C%20Mediterranean%20warmth%2C%20natural%20lighting&width=600&height=600&seq=tile-sand&orientation=squarish',
      description: t.tileGrid.tiles.sand_desc
    },
    {
      id: 6,
      name: t.tileGrid.tiles.charcoal,
      image: 'https://readdy.ai/api/search-image?query=Close-up%20view%20of%20concrete-effect%20ceramic%20tile%20in%20deep%20charcoal%20color%2C%20sophisticated%20dark%20texture%20with%20natural%20variations%2C%20minimal%20clean%20background%2C%20premium%20surface%20quality%2C%20modern%20elegance%2C%20dramatic%20lighting&width=600&height=600&seq=tile-charcoal&orientation=squarish',
      description: t.tileGrid.tiles.charcoal_desc
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-gray-800 mb-4">
            {t.tileGrid.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.tileGrid.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(featured.length > 0 ? featured : fallback).map((item, idx) => (
            <Link key={idx} href={`/tiles/${item.slug}`} className="group cursor-pointer">
              <div className="aspect-square overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  {item.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/tiles" className="bg-gray-800 text-white px-10 py-4 hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap font-medium inline-block">
            {t.tileGrid.viewAllBtn}
          </Link>
        </div>
      </div>
    </section>
  );
}
