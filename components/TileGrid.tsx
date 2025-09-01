
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
              image: it.overrideImageUrl ? it.overrideImageUrl : `/${it.product.imagePath}`,
              name: it.overrideTitle && String(it.overrideTitle).trim().length
                ? String(it.overrideTitle)
                : `${it.product.koleksiyonu} ${it.product.renk} ${it.product.olcusu}`,
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
      description: t.tileGrid.tiles.beige_desc
    },
    {
      id: 2,
      name: t.tileGrid.tiles.gray,
      description: t.tileGrid.tiles.gray_desc
    },
    {
      id: 3,
      name: t.tileGrid.tiles.terracotta,
      description: t.tileGrid.tiles.terracotta_desc
    },
    {
      id: 4,
      name: t.tileGrid.tiles.white,
      description: t.tileGrid.tiles.white_desc
    },
    {
      id: 5,
      name: t.tileGrid.tiles.sand,
      description: t.tileGrid.tiles.sand_desc
    },
    {
      id: 6,
      name: t.tileGrid.tiles.charcoal,
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
            <Link key={idx} href={`/carrelages/${item.slug}`} className="group cursor-pointer">
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
          <Link href="/carrelages" className="bg-gray-800 text-white px-10 py-4 hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap font-medium inline-block">
            {t.tileGrid.viewAllBtn}
          </Link>
        </div>
      </div>
    </section>
  );
}
