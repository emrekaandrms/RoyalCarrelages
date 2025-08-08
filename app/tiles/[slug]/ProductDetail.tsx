'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';

interface Product {
  id: number;
  koleksiyonu: string;
  olcusu: string;
  renk: string;
  finish?: string;
  imagePath: string;
  slug: string;
}

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { t, language } = useLanguage();
  const [isZoomed, setIsZoomed] = useState(false);

  // Color translation function
  const translateColor = (color: string) => {
    const colorKey = color.toLowerCase();
    return t.product.colors[colorKey as keyof typeof t.product.colors] || color;
  };

  // WhatsApp message function
  const handlePriceInfo = () => {
    const translatedColor = translateColor(product.renk);
    const message = encodeURIComponent(
      `Hello, I would like to get price information for ${product.koleksiyonu} - ${translatedColor} (${product.olcusu})`
    );
    window.open(`https://wa.me/33786033509?text=${message}`, '_blank');
  };

  return (
    <>
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-8">
            <Link href="/tiles" className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
              <i className="ri-arrow-left-line"></i>
              {t.product.backToCollection}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="relative">
                <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm mb-4">
                  <img
                    src={`/${product.imagePath}`}
                    alt={`${product.koleksiyonu} ${translateColor(product.renk)}`}
                    className="w-full h-full object-cover object-center cursor-zoom-in"
                    onClick={() => setIsZoomed(true)}
                  />
                  <div className="absolute top-4 right-4 bg-black/20 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                    <i className="ri-search-line w-4 h-4 flex items-center justify-center"></i>
                    {t.product.zoom}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <img
                      src={`/${product.imagePath}`}
                      alt={`${product.koleksiyonu} ${t.product.detail1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <img
                      src={`/${product.imagePath}`}
                      alt={`${product.koleksiyonu} ${t.product.detail2}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
                {product.koleksiyonu} - {translateColor(product.renk)}
              </h1>
              
              <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">{t.product.specifications}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">{t.product.size}:</span>
                    <span className="ml-2 font-medium">{product.olcusu}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t.product.color}:</span>
                    <span className="ml-2 font-medium">{translateColor(product.renk)}</span>
                  </div>
                  {product.finish && (
                    <div>
                      <span className="text-gray-600">{t.product.surface}:</span>
                      <span className="ml-2 font-medium">{product.finish}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">{t.product.material}:</span>
                    <span className="ml-2 font-medium">{t.product.ceramic}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t.product.waterAbsorption}:</span>
                    <span className="ml-2 font-medium">{t.product.waterAbsorptionValue}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t.product.resistance}:</span>
                    <span className="ml-2 font-medium">{t.product.resistanceValue}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">{t.product.description}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t.product.descriptionText
                    .replace('{collection}', product.koleksiyonu)
                    .replace('{color}', translateColor(product.renk))
                    .replace('{size}', product.olcusu)}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">{t.product.features}</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                    {t.product.featuresList.easy_maintenance}
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                    {t.product.featuresList.high_durability}
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                    {t.product.featuresList.indoor_outdoor}
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                    {t.product.featuresList.eco_friendly}
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                    {t.product.featuresList.freeze_resistant}
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                    {t.product.featuresList.stain_resistant}
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handlePriceInfo}
                  className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <i className="ri-phone-line"></i>
                  {t.product.priceInfo}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isZoomed && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setIsZoomed(false)}>
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors z-10"
            >
              <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
            </button>
            <img
              src={`/${product.imagePath}`}
              alt={`${product.koleksiyonu} ${translateColor(product.renk)}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
} 