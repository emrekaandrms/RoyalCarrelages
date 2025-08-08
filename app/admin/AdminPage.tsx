
'use client';

import { useState } from 'react';
import AdminHeader from './AdminHeader';
import ProductManagement from './ProductManagement';
import CollectionManagement from './CollectionManagement';
import BannerManagement from './BannerManagement';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Identifiants incorrects');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-light text-gray-800 mb-6 text-center">
            Connexion Administrateur
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              Se connecter
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Demo: admin / admin123
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'products', name: 'Produits', icon: 'ri-shopping-bag-line' },
    { id: 'collections', name: 'Collections', icon: 'ri-folder-line' },
    { id: 'banners', name: 'Bannières', icon: 'ri-image-line' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader onLogout={() => setIsAuthenticated(false)} />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <h1 className="text-3xl font-light text-gray-800 mb-8">
            Administration du Site
          </h1>

          <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <i className={`${tab.icon} w-5 h-5 flex items-center justify-center text-lg`}></i>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            {activeTab === 'products' && <ProductManagement />}
            {activeTab === 'collections' && <CollectionManagement />}
            {activeTab === 'banners' && <BannerManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}
