'use client';

import { useEffect, useState } from 'react';

type Banner = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
  buttonText?: string;
  status: 'ACTIVE' | 'INACTIVE';
  position: 'HERO' | 'SECONDARY' | 'FOOTER';
  order: number;
};

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    link: '',
    position: 'HERO',
    buttonText: 'Découvrir',
    order: 0,
  });

  const load = async () => {
    const res = await fetch('/api/banners');
    if (res.ok) {
      const data = await res.json();
      setBanners(data);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData } as any;
    const endpoint = '/api/banners';
    const method = editingBanner ? 'PUT' : 'POST';
    const body = editingBanner ? JSON.stringify({ id: editingBanner.id, ...payload }) : JSON.stringify(payload);
    const res = await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body });
    if (res.ok) {
      setShowAddForm(false);
      setEditingBanner(null);
      setFormData({ title: '', subtitle: '', imageUrl: '', link: '', position: 'HERO', buttonText: 'Découvrir', order: 0 });
      await load();
    } else {
      alert('Échec de sauvegarde');
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl,
      link: banner.link || '',
      position: banner.position,
      buttonText: banner.buttonText || 'Découvrir',
      order: banner.order || 0,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette bannière ?')) return;
    const res = await fetch('/api/banners', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (res.ok) await load();
  };

  const toggleStatus = async (b: Banner) => {
    const res = await fetch('/api/banners', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: b.id, status: b.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }) });
    if (res.ok) await load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light text-gray-800">Gestion des Bannières</h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingBanner(null);
            setFormData({ title: '', subtitle: '', imageUrl: '', link: '', position: 'HERO', buttonText: 'Découvrir', order: 0 });
          }}
          className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap flex items-center"
        >
          <i className="ri-add-line mr-2"></i>
          Ajouter une bannière
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {editingBanner ? 'Modifier la bannière' : 'Ajouter une nouvelle bannière'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre principal *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sous-titre
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append('file', file);
                  const res = await fetch('/api/upload', { method: 'POST', body: fd });
                  if (res.ok) {
                    const json = await res.json();
                    setFormData((prev) => ({ ...prev, imageUrl: json.url }));
                  } else {
                    alert('Échec du téléversement');
                  }
                }} className="w-full px-4 py-2 border border-gray-300 rounded text-sm bg-white" />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img src={formData.imageUrl} alt="preview" className="h-24 rounded" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordre</label>
                <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lien de destination
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus-border-transparent text-sm"
                  placeholder="/tiles, /contact, http..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                  className="w-full pr-8 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                >
                  <option value="HERO">Hero (principal)</option>
                  <option value="SECONDARY">Secondaire</option>
                  <option value="FOOTER">Pied de page</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texte du bouton
                </label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                {editingBanner ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingBanner(null);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              <div className="lg:col-span-1">
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title}
                  className="w-full h-48 lg:h-full object-cover"
                />
              </div>

              <div className="lg:col-span-2 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-medium text-gray-800">{banner.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        banner.position === 'HERO' ? 'bg-blue-100 text-blue-800' :
                        banner.position === 'SECONDARY' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {banner.position}
                      </span>
                    </div>
                    {banner.subtitle && (
                      <p className="text-gray-600 mb-2">{banner.subtitle}</p>
                    )}
                    {banner.link && (
                      <p className="text-sm text-gray-500">Lien: {banner.link}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleStatus(banner)}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap ${
                        banner.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {banner.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap text-sm flex items-center"
                  >
                    <i className="ri-edit-line mr-1"></i>
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="bg-red-100 text-red-700 py-2 px-4 rounded hover:bg-red-200 transition-colors cursor-pointer whitespace-nowrap text-sm flex items-center"
                  >
                    <i className="ri-delete-bin-line mr-1"></i>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
