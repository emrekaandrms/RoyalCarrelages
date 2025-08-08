
'use client';

import { useLanguage } from '@/lib/language-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function ProfessionalsPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    activity: '',
    siret: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const services = [
    {
      icon: 'ri-discount-percent-line',
      title: 'Tarifs Préférentiels',
      description: 'Bénéficiez de remises importantes sur l\'ensemble de notre gamme selon vos volumes d\'achat.'
    },
    {
      icon: 'ri-truck-line',
      title: 'Livraison Express',
      description: 'Livraison rapide sur chantier avec possibilité de programmation selon votre planning.'
    },
    {
      icon: 'ri-customer-service-2-line',
      title: 'Support Technique',
      description: 'Équipe dédiée pour vous conseiller sur le choix des produits et techniques de pose.'
    },
    {
      icon: 'ri-file-text-line',
      title: 'Devis Personnalisés',
      description: 'Établissement rapide de devis détaillés avec références techniques complètes.'
    },
    {
      icon: 'ri-calendar-check-line',
      title: 'Stock Réservé',
      description: 'Possibilité de réserver du stock pour vos projets avec paiement différé.'
    },
    {
      icon: 'ri-medal-line',
      title: 'Formations',
      description: 'Sessions de formation sur nos nouveaux produits et techniques de pose.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-24 pb-16">
        <div 
          className="relative h-96 bg-cover bg-center bg-no-repeat mb-16"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://readdy.ai/api/search-image?query=Professional%20construction%20site%20with%20architects%20and%20contractors%20working%2C%20modern%20building%20interior%20under%20construction%2C%20ceramic%20tiles%20being%20installed%2C%20professional%20team%20collaboration%2C%20construction%20equipment%20and%20materials&width=1920&height=600&seq=professionals-hero&orientation=landscape')`
          }}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-8">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
                  Espace Professionnels
                </h1>
                <p className="text-xl text-gray-200 leading-relaxed">
                  Des services dédiés aux architectes, décorateurs, entreprises du bâtiment et revendeurs pour accompagner vos projets.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-800 mb-4">
              Nos Services Professionnels
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nous comprenons les besoins spécifiques des professionnels et proposons des solutions adaptées à chaque métier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                  <i className={`${service.icon} w-8 h-8 flex items-center justify-center text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-8">Avantages Professionnels</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Remises Progressives</h4>
                    <p className="text-gray-600">Jusqu'à 30% de remise selon vos volumes d'achat annuels</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Échantillons Gratuits</h4>
                    <p className="text-gray-600">Service d'échantillonnage complet pour vos présentations clients</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Documentation Technique</h4>
                    <p className="text-gray-600">Fiches produits détaillées, guides de pose, certifications</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Accompagnement Projet</h4>
                    <p className="text-gray-600">Conseil personnalisé et suivi de projet par nos experts</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium text-gray-800 mb-4">Contact Dédié</h3>
                <p className="text-gray-600 mb-4">
                  Notre équipe commerciale B2B est à votre disposition pour étudier vos besoins spécifiques.
                </p>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Email:</strong> pro@ceramiquedesign.fr</p>
                  <p><strong>Téléphone:</strong> +33 1 23 45 67 88</p>
                  <p><strong>Horaires:</strong> Lun-Ven 8h-19h</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-8">Inscription Professionnelle</h2>
              
              {isSubmitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  Votre demande d'inscription a été envoyée! Nous vous contacterons sous 24h.
                </div>
              )}

              <form id="professional-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du contact *
                  </label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-2">
                    Secteur d'activité *
                  </label>
                  <select
                    id="activity"
                    name="activity"
                    value={formData.activity}
                    onChange={handleChange}
                    required
                    className="w-full pr-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  >
                    <option value="">Sélectionnez votre activité</option>
                    <option value="architecte">Architecte</option>
                    <option value="decorateur">Décorateur d'intérieur</option>
                    <option value="carreleur">Entreprise de carrelage</option>
                    <option value="batiment">Entreprise du bâtiment</option>
                    <option value="revendeur">Revendeur</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro SIRET
                  </label>
                  <input
                    type="text"
                    id="siret"
                    name="siret"
                    value={formData.siret}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Votre projet / Besoins
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm resize-none"
                    placeholder="Décrivez brièvement vos besoins..."
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.message.length}/500 caractères
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap font-medium"
                >
                  Envoyer la Demande
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
