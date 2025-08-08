
'use client';

import { useState } from 'react';

export default function CollectionManagement() {
  const [collections, setCollections] = useState([
    {
      id: 1,
      name: 'Collection Méditerranéenne',
      description: 'Inspiration terre cuite et argile',
      products: 12,
      status: 'active'
    },
    {
      id: 2,
      name: 'Collection Japandi',
      description: 'Minimalisme et naturel',
      products: 8,
      status: 'active'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    featured: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCollection) {
      setCollections(collections.map(c => c.id === editingCollection.id 
        ? { ...c, ...formData, id: editingCollection.id, products: c.products, status: 'active' }
        : c
      ));
      setEditingCollection(null);
    } else {
      const newCollection = {
        id: Date.now(),
        ...formData,
        products: 0,
        status: 'active'
      };
      setCollections([...collections, newCollection]);
    }
    
    setFormData({ name: '', description: '', image: '', featured: false });
    setShowAddForm(false);
  };

  const handleEdit = (collection: any) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description,
      image: collection.image || '',
      featured: collection.featured || false
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette collection ?')) {
      setCollections(collections.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light text-gray-800">Gestion des Collections</h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingCollection(null);
            setFormData({ name: '', description: '', image: '', featured: false });
          }}
          className="flex items-center bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>
          Ajouter une collection
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {editingCollection ? 'Modifier la collection' : 'Ajouter une nouvelle collection'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la collection *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de couverture
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm resize-none"
                placeholder="Description de la collection..."
              ></textarea>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="featured" className="text-sm text-gray-700">
                Collection mise en avant
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                {editingCollection ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingCollection(null);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <div key={collection.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              {collection.image ? (
                <img 
                  src={collection.image} 
                  alt={collection.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="ri-image-line w-12 h-12 flex items-center justify-center text-4xl text-gray-400"></i>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800">{collection.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  collection.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {collection.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{collection.description}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>{collection.products} produits</span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(collection)}
                  className="flex items-center flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap text-sm"
                >
                  <i className="ri-edit-line mr-1"></i>
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(collection.id)}
                  className="flex items-center bg-red-100 text-red-700 py-2 px-4 rounded hover:bg-red-200 transition-colors cursor-pointer"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
