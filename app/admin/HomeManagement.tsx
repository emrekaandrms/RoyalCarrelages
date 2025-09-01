"use client";

import { useEffect, useMemo, useState } from 'react';

interface ProductLite {
  id: string;
  koleksiyonu: string;
  olcusu: string;
  renk: string;
  imagePath: string;
  slug: string;
}

export default function HomeManagement() {
  const [allProducts, setAllProducts] = useState<ProductLite[]>([]);
  const [query, setQuery] = useState('');
  const [pickerOpen, setPickerOpen] = useState<{ open: boolean; forPos: number | null }>({ open: false, forPos: null });
  const [heroUrl, setHeroUrl] = useState('');
  const [featured, setFeatured] = useState<Array<{ position: number; productId: string }>>(
    Array.from({ length: 6 }, (_, i) => ({ position: i + 1, productId: '' }))
  );
  const [saving, setSaving] = useState(false);
  const [imageOverrides, setImageOverrides] = useState<Record<number, string>>({});

  useEffect(() => {
    (async () => {
      const [prodsRes, heroRes, featRes, overRes] = await Promise.all([
        fetch('/api/products?limit=200'),
        fetch('/api/settings/heroImageUrl'),
        fetch('/api/featured'),
        fetch('/api/settings/featuredImageOverrides'),
      ]);
      if (prodsRes.ok) {
        const json = await prodsRes.json();
        // our /api/products returns { products, ... }
        setAllProducts(json.products || []);
      }
      if (heroRes.ok) {
        const json = await heroRes.json();
        setHeroUrl(json.value || '');
      }
      if (featRes.ok) {
        const items = await featRes.json();
        if (Array.isArray(items) && items.length) {
          setFeatured(
            items.map((it: any) => ({ position: it.position, productId: it.productId }))
          );
          const initial: Record<number, string> = {};
          items.forEach((it: any) => {
            if (it.overrideImageUrl) initial[it.position] = it.overrideImageUrl;
          });
          setImageOverrides(initial);
        }
      }
      if (overRes.ok) {
        const json = await overRes.json();
        const map = (json?.value || {}) as Record<string, string>;
        const initial: Record<number, string> = {};
        Object.entries(map).forEach(([k, v]) => { initial[Number(k)] = String(v); });
        setImageOverrides(initial);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allProducts.slice(0, 50);
    return allProducts
      .filter((p) =>
        [p.koleksiyonu, p.renk, p.olcusu, p.slug].some((f) => (f || '').toLowerCase().includes(q))
      )
      .slice(0, 50);
  }, [allProducts, query]);

  const setPosition = (pos: number, productId: string) => {
    setFeatured((prev) => prev.map((f) => (f.position === pos ? { ...f, productId } : f)));
  };

  const onSave = async () => {
    try {
      setSaving(true);
      await fetch('/api/settings/heroImageUrl', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: heroUrl }),
      });
      await fetch('/api/featured', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ positions: featured }),
      });
      await fetch('/api/settings/featuredImageOverrides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: imageOverrides }),
      });
      alert('Accueil mis à jour.');
    } catch (e) {
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-light text-gray-800">Gestion de la page d'accueil</h2>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Image Hero</h3>
        <input
          type="url"
          value={heroUrl}
          onChange={(e) => setHeroUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
          placeholder="https://..."
        />
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Produits mis en avant (6)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map(({ position, productId }) => (
            <div key={position} className="border border-gray-200 rounded p-4">
              <div className="text-sm text-gray-600 mb-2">Position #{position}</div>
              <button
                className="bg-gray-800 text-white px-3 py-2 rounded text-sm hover:bg-gray-700"
                onClick={() => setPickerOpen({ open: true, forPos: position })}
              >
                Sélectionner un produit
              </button>
              <div className="mt-3">
                <label className="block text-sm text-gray-700 mb-1">Image personnalisée (opsiyonel)</label>
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append('file', file);
                  const res = await fetch('/api/upload', { method: 'POST', body: fd });
                  if (res.ok) {
                    const json = await res.json();
                    setImageOverrides((prev) => ({ ...prev, [position]: json.url }));
                  } else {
                    alert('Téléversement échoué');
                  }
                }} className="w-full text-sm" />
                {imageOverrides[position] && (
                  <img src={imageOverrides[position]} alt="override" className="h-20 mt-2 rounded" />
                )}
              </div>
            </div>
          ))}
        </div>
        {pickerOpen.open && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setPickerOpen({ open: false, forPos: null })}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Sélectionner un produit</h3>
                <button onClick={() => setPickerOpen({ open: false, forPos: null })} className="text-gray-500 hover:text-gray-800">
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm mb-4"
                placeholder="Rechercher (nom, couleur, taille, slug)"
              />
              <div className="max-h-96 overflow-auto border border-gray-100 rounded">
                <ul>
                  {filtered.map((p) => (
                    <li key={p.id} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer" onClick={() => { setPosition(pickerOpen.forPos || 1, p.id); setPickerOpen({ open: false, forPos: null }); }}>
                      <img src={`/${p.imagePath}`} alt={p.koleksiyonu} className="w-12 h-12 object-cover rounded mr-3" />
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">{p.koleksiyonu} • {p.renk}</div>
                        <div className="text-gray-500">{p.olcusu}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
