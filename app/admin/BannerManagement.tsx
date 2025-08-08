'use client';

import { useState } from 'react';

export default function BannerManagement() {
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: 'Nouvelle Collection Printemps',
      subtitle: 'Découvrez nos derniers carreaux',
      image: 'https://readdy.ai/api/search-image?query=Modern%20ceramic%20tiles%20display%20in%20showroom%2C%20spring%20collection%2C%20natural%20lighting%2C%20elegant%20presentation&width=800&height=400&seq=banner-spring&orientation=landscape',
      link: '/tiles',
      status: 'active',
      position: 'hero'
    },
    {
      id: 2,
      title: 'Promotion Robinets -20%',
      subtitle: 'Offre limitée',
      image: 'https://readdy.ai/api/search-image?query=Premium%20bathroom%20faucets%20promotion%20display%2C%20modern%20fixtures%2C%20promotional%20banner%20design&width=800&height=400&seq=banner-promo&orientation=landscape',
      link: '/faucets',
      status: 'active',
      position: 'secondary'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    position: 'hero',
    buttonText: 'Découvrir'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBanner) {
      setBanners(banners.map(b => b.id === editingBanner.id 
        ? { ...b, ...formData, id: editingBanner.id, status: 'active' }
        : b
      ));
      setEditingBanner(null);
    } else {
      const newBanner = {
        id: Date.now(),
        ...formData,
        status: 'active'
      };
      setBanners([...banners, newBanner]);
    }

    setFormData({ title: '', subtitle: '', image: '', link: '', position: 'hero', buttonText: 'Découvrir' });
    setShowAddForm(false);
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      link: banner.link,
      position: banner.position,
      buttonText: banner.buttonText || 'Découvrir'
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) {
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  const toggleStatus = (id: number) => {
    setBanners(banners.map(b => b.id === id 
      ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' }
      : b
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light text-gray-800">Gestion des Bannières</h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingBanner(null);
            setFormData({ title: '', subtitle: '', image: '', link: '', position: 'hero', buttonText: 'Découvrir' });
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
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'image *
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lien de destination
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  placeholder="/tiles, /faucets, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full pr-8 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                >
                  <option value="hero">Hero (principal)</option>
                  <option value="secondary">Secondaire</option>
                  <option value="footer">Pied de page</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texte du bouton
                </label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
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
                  src={banner.image} 
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
                        banner.position === 'hero' ? 'bg-blue-100 text-blue-800' :
                        banner.position === 'secondary' ? 'bg-green-100 text-green-800' :
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
                      onClick={() => toggleStatus(banner.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap ${
                        banner.status === 'active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {banner.status === 'active' ? 'Actif' : 'Inactif'}
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
