'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  koleksiyonu: string;
  olcusu: string;
  renk: string;
  finish?: string;
  imagePath: string;
  slug: string;
}

interface FormData {
  koleksiyonu: string;
  olcusu: string;
  renk: string;
  finish: string;
  imagePath: string;
  slug: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({
    koleksiyonu: '',
    olcusu: '',
    renk: '',
    finish: '',
    imagePath: '',
    slug: ''
  });

  // Ürünleri yükle
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Slug oluşturma fonksiyonu
  const createSlug = (koleksiyon: string, olcu: string, renk: string) => {
    return `${koleksiyon}-${olcu}-${renk}`
      .toLowerCase()
      .replace(/[çÇ]/g, 'c')
      .replace(/[ğĞ]/g, 'g')
      .replace(/[ıI]/g, 'i')
      .replace(/[öÖ]/g, 'o')
      .replace(/[şŞ]/g, 's')
      .replace(/[üÜ]/g, 'u')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const slug = formData.slug || createSlug(formData.koleksiyonu, formData.olcusu, formData.renk);
      const productData = {
        ...formData,
        slug,
        finish: formData.finish || null
      };

      if (editingProduct) {
        // Güncelleme
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        
        if (response.ok) {
          await fetchProducts();
          setEditingProduct(null);
        } else {
          throw new Error('Güncelleme başarısız');
        }
      } else {
        // Yeni ürün ekleme
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        
        if (response.ok) {
          await fetchProducts();
        } else {
          throw new Error('Ekleme başarısız');
        }
      }
      
      setFormData({
        koleksiyonu: '',
        olcusu: '',
        renk: '',
        finish: '',
        imagePath: '',
        slug: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('İşlem hatası:', error);
      alert('İşlem sırasında bir hata oluştu');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      koleksiyonu: product.koleksiyonu,
      olcusu: product.olcusu,
      renk: product.renk,
      finish: product.finish || '',
      imagePath: product.imagePath,
      slug: product.slug
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchProducts();
        } else {
          throw new Error('Silme başarısız');
        }
      } catch (error) {
        console.error('Silme hatası:', error);
        alert('Silme sırasında bir hata oluştu');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-gray-600">Ürünler yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light text-gray-800">Ürün Yönetimi</h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingProduct(null);
            setFormData({
              koleksiyonu: '',
              olcusu: '',
              renk: '',
              finish: '',
              imagePath: '',
              slug: ''
            });
          }}
          className="flex items-center bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>
          Yeni Ürün Ekle
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
          </h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Koleksiyon *
              </label>
              <input
                type="text"
                value={formData.koleksiyonu}
                onChange={(e) => setFormData({...formData, koleksiyonu: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                placeholder="Örn: Atlantis"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ölçü *
              </label>
              <input
                type="text"
                value={formData.olcusu}
                onChange={(e) => setFormData({...formData, olcusu: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                placeholder="Örn: 60x120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renk *
              </label>
              <input
                type="text"
                value={formData.renk}
                onChange={(e) => setFormData({...formData, renk: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                placeholder="Örn: Beyaz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Finish
              </label>
              <input
                type="text"
                value={formData.finish}
                onChange={(e) => setFormData({...formData, finish: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                placeholder="Örn: Mat"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görsel Yolu *
              </label>
              <input
                type="text"
                value={formData.imagePath}
                onChange={(e) => setFormData({...formData, imagePath: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                placeholder="Örn: /Urun_Gorselleri/Atlantis/atlantis-beyaz.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                placeholder="Boş bırakılırsa otomatik oluşturulur"
              />
              <p className="text-xs text-gray-500 mt-1">
                Boş bırakılırsa otomatik olarak koleksiyon-ölçü-renk şeklinde oluşturulur
              </p>
            </div>

            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                {editingProduct ? 'Güncelle' : 'Ekle'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Koleksiyon</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Ölçü</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Renk</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Finish</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Slug</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-800">{product.koleksiyonu}</div>
                </td>
                <td className="py-4 px-4 text-gray-600">{product.olcusu}</td>
                <td className="py-4 px-4 text-gray-600">{product.renk}</td>
                <td className="py-4 px-4 text-gray-600">{product.finish || '-'}</td>
                <td className="py-4 px-4 text-gray-600 text-sm">{product.slug}</td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
                      title="Düzenle"
                    >
                      <i className="ri-edit-line"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex items-center text-red-600 hover:text-red-800 cursor-pointer"
                      title="Sil"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Henüz ürün bulunmuyor. İlk ürününüzü ekleyin.
          </div>
        )}
      </div>
    </div>
  );
}
