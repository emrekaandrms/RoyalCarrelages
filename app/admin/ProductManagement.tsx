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
  files: File[];
  previews: string[];
  slug: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(24);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({
    koleksiyonu: '',
    olcusu: '',
    renk: '',
    finish: '',
    files: [],
    previews: [],
    slug: ''
  });

  // Charger les produits
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?page=${page}&limit=${limit}`);
      const data = await response.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit]);

  // Fonction de création de slug
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

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const slug = formData.slug || createSlug(formData.koleksiyonu, formData.olcusu, formData.renk);

      if (editingProduct) {
        // Mise à jour
        // Not: Çoklu görsel güncellemesi API tarafında ayrı akış gerektirir; burada temel alanları güncelliyoruz
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            koleksiyonu: formData.koleksiyonu,
            olcusu: formData.olcusu,
            renk: formData.renk,
            finish: formData.finish || null,
            slug,
          })
        });
        
        if (response.ok) {
          await fetchProducts();
          setEditingProduct(null);
        } else {
          throw new Error('Échec de la mise à jour');
        }
      } else {
        // Ajout d’un nouveau produit (multipart + multi images)
        const fd = new FormData();
        fd.append('koleksiyonu', formData.koleksiyonu);
        fd.append('olcusu', formData.olcusu);
        fd.append('renk', formData.renk);
        if (formData.finish) fd.append('finish', formData.finish);
        fd.append('slug', slug);
        for (const f of formData.files) fd.append('files', f);

        const response = await fetch('/api/products', { method: 'POST', body: fd });
        
        if (response.ok) {
          await fetchProducts();
        } else {
          throw new Error('Échec de l’ajout');
        }
      }
      
      setFormData({
        koleksiyonu: '',
        olcusu: '',
        renk: '',
        finish: '',
        files: [],
        previews: [],
        slug: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur d’opération:', error);
      alert('Une erreur s’est produite pendant l’opération');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      koleksiyonu: product.koleksiyonu,
      olcusu: product.olcusu,
      renk: product.renk,
      finish: product.finish || '',
      files: [],
      previews: [],
      slug: product.slug
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchProducts();
        } else {
          throw new Error('Échec de la suppression');
        }
      } catch (error) {
        console.error('Erreur de suppression:', error);
        alert('Une erreur s’est produite lors de la suppression');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-gray-600">Chargement des produits...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light text-gray-800">Gestion des Produits</h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingProduct(null);
            setFormData({
              koleksiyonu: '',
              olcusu: '',
              renk: '',
              finish: '',
              files: [],
              previews: [],
              slug: ''
            });
          }}
          className="flex items-center bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>
          Ajouter un produit
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
          </h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection *
              </label>
              <input
                type="text"
                value={formData.koleksiyonu}
                onChange={(e) => setFormData({...formData, koleksiyonu: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                placeholder="Ex.: Atlantis"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille *
              </label>
              <input
                type="text"
                value={formData.olcusu}
                onChange={(e) => setFormData({...formData, olcusu: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                placeholder="Ex.: 60x120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur *
              </label>
              <input
                type="text"
                value={formData.renk}
                onChange={(e) => setFormData({...formData, renk: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                placeholder="Ex.: Blanc"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Finition
              </label>
              <input
                type="text"
                value={formData.finish}
                onChange={(e) => setFormData({...formData, finish: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                placeholder="Ex.: Mat"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images *
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files ? Array.from(e.target.files) : [];
                  setFormData({
                    ...formData,
                    files,
                    previews: files.map((f) => URL.createObjectURL(f)),
                  });
                }}
                required={!editingProduct}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
              />
              {formData.previews.length > 0 && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formData.previews.map((src, i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded border">
                      <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
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
                placeholder="Si laissé vide, sera généré automatiquement"
              />
              <p className="text-xs text-gray-500 mt-1">
                Si laissé vide, il sera généré automatiquement sous la forme collection-taille-couleur
              </p>
            </div>

            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                {editingProduct ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Collection</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Taille</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Couleur</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Finition</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Slug</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
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
                      title="Modifier"
                    >
                      <i className="ri-edit-line"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex items-center text-red-600 hover:text-red-800 cursor-pointer"
                      title="Supprimer"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">Page {page} / {totalPages}</div>
          <div className="space-x-2">
            <button disabled={page<=1} onClick={() => setPage((p)=>Math.max(1,p-1))} className="px-3 py-1 border rounded disabled:opacity-50">Précédent</button>
            <button disabled={page>=totalPages} onClick={() => setPage((p)=>Math.min(totalPages,p+1))} className="px-3 py-1 border rounded disabled:opacity-50">Suivant</button>
          </div>
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun produit pour le moment. Ajoutez votre premier produit.
          </div>
        )}
      </div>
    </div>
  );
}
