
'use client';

import { useLanguage } from '@/lib/language-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
              Contactez-nous
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Notre équipe d'experts est là pour vous accompagner dans tous vos projets. N'hésitez pas à nous contacter pour une consultation personnalisée.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-8">Informations de Contact</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-map-pin-line w-6 h-6 flex items-center justify-center text-xl text-gray-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Adresse</h3>
                    <p className="text-gray-600">
                      123 Rue de la Céramique<br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-phone-line w-6 h-6 flex items-center justify-center text-xl text-gray-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Téléphone</h3>
                    <p className="text-gray-600">+33 1 23 45 67 89</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-mail-line w-6 h-6 flex items-center justify-center text-xl text-gray-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">contact@ceramiquedesign.fr</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-time-line w-6 h-6 flex items-center justify-center text-xl text-gray-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Horaires</h3>
                    <p className="text-gray-600">
                      Lun - Ven: 9h00 - 18h00<br />
                      Sam: 10h00 - 16h00
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-light text-gray-800 mb-4">Suivez-nous</h3>
                <div className="flex space-x-4">
                  <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-800 hover:text-white transition-colors cursor-pointer">
                    <i className="ri-facebook-fill w-6 h-6 flex items-center justify-center text-xl"></i>
                  </button>
                  <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-800 hover:text-white transition-colors cursor-pointer">
                    <i className="ri-instagram-line w-6 h-6 flex items-center justify-center text-xl"></i>
                  </button>
                  <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-800 hover:text-white transition-colors cursor-pointer">
                    <i className="ri-linkedin-fill w-6 h-6 flex items-center justify-center text-xl"></i>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-8">Envoyez-nous un Message</h2>
              
              {isSubmitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  Votre message a été envoyé avec succès! Nous vous répondrons bientôt.
                </div>
              )}

              <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  />
                </div>

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
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full pr-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="devis">Demande de devis</option>
                    <option value="conseil">Conseil produit</option>
                    <option value="installation">Installation</option>
                    <option value="professionnel">Espace professionnel</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    maxLength={500}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm resize-none"
                    placeholder="Décrivez votre projet ou vos besoins..."
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.message.length}/500 caractères
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap font-medium"
                >
                  Envoyer le Message
                </button>
              </form>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-light text-gray-800 mb-8 text-center">Notre Showroom</h2>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.991441827!2d2.3422222160934!3d48.858372679287544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDUxJzMwLjEiTiAywrAyMCczMi4wIkU!5e0!3m2!1sen!2sfr!4v1639740000000!5m2!1sen!2sfr"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
