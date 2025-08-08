'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';

interface Product {
  id: string;
  koleksiyonu: string;
  olcusu: string;
  renk: string;
  finish: string | null;
  imagePath: string;
  slug: string;
}

export default function TilesClient({ 
  products: initialProducts
}: { 
  products: Product[]; 
}) {
  const { t } = useLanguage();
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();



  // Initialize filters and pagination from URL
  useEffect(() => {
    const pageFromUrl = searchParams.get('page');
    const sizeFromUrl = searchParams.get('size');
    const colorFromUrl = searchParams.get('color');
    const searchFromUrl = searchParams.get('search');

    if (sizeFromUrl) setSelectedSize(sizeFromUrl);
    if (colorFromUrl) setSelectedColor(colorFromUrl);
    if (searchFromUrl) setSearchTerm(searchFromUrl);

    if (pageFromUrl) {
      const page = Math.max(1, parseInt(pageFromUrl, 10));
      setCurrentPage(page);
    } else {
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Get unique sizes and colors from all products
  const sizes = useMemo(() => {
    const set = new Set(initialProducts.map((p) => p.olcusu));
    return Array.from(set).sort();
  }, [initialProducts]);

  const colors = useMemo(() => {
    const set = new Set(initialProducts.map((p) => p.renk));
    return Array.from(set).sort();
  }, [initialProducts]);

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const sizeMatch = selectedSize === 'all' || p.olcusu === selectedSize;
      const colorMatch = selectedColor === 'all' || p.renk === selectedColor;
      const searchMatch = searchTerm === '' || 
        p.koleksiyonu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.renk.toLowerCase().includes(searchTerm.toLowerCase());
      
      return sizeMatch && colorMatch && searchMatch;
    });
  }, [initialProducts, selectedSize, selectedColor, searchTerm]);

  // Paginate filtered results
  const itemsPerPage = 24;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const calculatedTotalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const updateUrl = (filters: { size?: string; color?: string; search?: string; page?: number }) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    if (filters.size !== undefined) {
      if (filters.size === 'all') {
        newSearchParams.delete('size');
      } else {
        newSearchParams.set('size', filters.size);
      }
    }
    
    if (filters.color !== undefined) {
      if (filters.color === 'all') {
        newSearchParams.delete('color');
      } else {
        newSearchParams.set('color', filters.color);
      }
    }
    
    if (filters.search !== undefined) {
      if (filters.search === '') {
        newSearchParams.delete('search');
      } else {
        newSearchParams.set('search', filters.search);
      }
    }
    
    if (filters.page !== undefined) {
      if (filters.page === 1) {
        newSearchParams.delete('page');
      } else {
        newSearchParams.set('page', filters.page.toString());
      }
    }

    router.push(`/tiles?${newSearchParams.toString()}`);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setCurrentPage(1);
    updateUrl({ size, page: 1 });
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setCurrentPage(1);
    updateUrl({ color, page: 1 });
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
    updateUrl({ search, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl({ page });
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination buttons
  const generatePaginationButtons = () => {
    const buttons = [];
    const maxButtons = 7;
    const halfButtons = Math.floor(maxButtons / 2);
    
    let startPage = Math.max(1, currentPage - halfButtons);
    let endPage = Math.min(calculatedTotalPages, currentPage + halfButtons);
    
    // Adjust if we're near the beginning or end
    if (currentPage <= halfButtons) {
      endPage = Math.min(calculatedTotalPages, maxButtons);
    }
    if (currentPage > calculatedTotalPages - halfButtons) {
      startPage = Math.max(1, calculatedTotalPages - maxButtons + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      buttons.push(1);
      if (startPage > 2) {
        buttons.push('...');
      }
    }

    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    // Add ellipsis and last page if needed
    if (endPage < calculatedTotalPages) {
      if (endPage < calculatedTotalPages - 1) {
        buttons.push('...');
      }
      buttons.push(calculatedTotalPages);
    }

    return buttons;
  };

  const paginationButtons = generatePaginationButtons();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              {t.tiles.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t.tiles.description}
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {t.tiles.filters.search}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={t.tiles.filters.searchPlaceholder}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Size Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {t.tiles.filters.size}
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 text-sm bg-white"
                >
                  <option value="all">{t.tiles.filters.allSizes}</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {t.tiles.filters.color}
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 text-sm bg-white"
                >
                  <option value="all">{t.tiles.filters.allColors}</option>
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {(t.product.colors as any)[color] || color}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Counter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {t.tiles.pagination.page} {currentPage} / {calculatedTotalPages}
                </label>
                                 <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600">
                   {filteredProducts.length} {filteredProducts.length === 1 ? t.tiles.product : t.tiles.products}
                 </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-800 border-t-transparent"></div>
                <span className="text-lg text-gray-600">{t.tiles.loading}</span>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <>
              {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {paginatedProducts.map((product) => (
                    product.slug ? (
                      <Link
                        key={product.id}
                        href={`/tiles/${product.slug}`}
                        className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-400 transform hover:-translate-y-1"
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={`/${product.imagePath}`}
                            alt={product.koleksiyonu}
                            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                            {product.koleksiyonu}
                          </h3>
                          <div className="space-y-2 mb-4">
                                                         <div className="flex items-center text-sm text-gray-600">
                               <span className="font-medium">{t.product.color}:</span>
                               <span className="ml-2 px-2 py-1 bg-gray-100 rounded-lg">
                                 {(t.product.colors as any)[product.renk] || product.renk}
                               </span>
                             </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="font-medium">{t.product.size}:</span>
                              <span className="ml-2 px-2 py-1 bg-gray-100 rounded-lg">
                                {product.olcusu}
                              </span>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-xl text-center font-medium text-sm group-hover:from-gray-900 group-hover:to-black transition-all duration-200">
                            {t.tiles.viewDetails}
                          </div>
                        </div>
                      </Link>
                    ) : null
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.881-6.07 2.33" />
                    </svg>
                  </div>
                                     <h3 className="text-xl font-medium text-gray-600 mb-2">{t.tiles.noResults}</h3>
                   <p className="text-gray-500">{t.tiles.noResultsDesc}</p>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {!loading && calculatedTotalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                             <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                 {t.tiles.pagination.page} {currentPage} / {calculatedTotalPages} - {filteredProducts.length} {t.tiles.totalProducts}
               </div>
              
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {t.tiles.pagination.previous}
                </button>

                {/* Page Buttons */}
                <div className="flex space-x-1">
                  {paginationButtons.map((button, index) => (
                    <span key={index}>
                      {typeof button === 'string' ? (
                        <span className="px-3 py-2 text-gray-400">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(button)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            button === currentPage
                              ? 'bg-gray-900 text-white shadow-lg'
                              : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                          }`}
                        >
                          {button}
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === calculatedTotalPages}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    currentPage === calculatedTotalPages
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {t.tiles.pagination.next}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
} 