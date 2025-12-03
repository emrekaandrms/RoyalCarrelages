
'use client';

import { useLanguage } from '@/lib/language-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';

export default function ProfessionalsPage() {
  const { t, language } = useLanguage();
  const [cms, setCms] = useState<{ title?: string; description?: string } | null>(null);
  const [b2b, setB2b] = useState<{ contactTitle?: string; contactDescription?: string; emailLabel?: string; email?: string; phoneLabel?: string; phone?: string; hoursLabel?: string; hours?: string } | null>(null);
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
  const services = t.professionalsPage.services.list;
  const advantages = t.professionalsPage.advantages.list;
  const activityOptions = t.professionalsPage.form.activityOptions;
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/settings/cms.professionals.${language}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setCms(json.value || null);
        }
        const b2bres = await fetch(`/api/settings/cms.professionals.b2b.${language}`, { cache: 'no-store' });
        if (b2bres.ok) {
          const json = await b2bres.json();
          setB2b(json.value || null);
        }
      } catch {
        // ignore
      }
    })();
  }, [language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/professionals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSubmitted(true);
        setFormData({ company: '', contact: '', email: '', phone: '', activity: '', siret: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        alert(t.common.error);
      }
    } catch {
      alert(t.common.networkError);
    }
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
                  {cms?.title || t.professionalsPage.hero.title}
                </h1>
                <p className="text-xl text-gray-200 leading-relaxed">
                  {cms?.description || t.professionalsPage.hero.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-800 mb-4">
              {t.professionalsPage.services.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t.professionalsPage.services.description}
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
              <h2 className="text-2xl font-light text-gray-800 mb-8">{t.professionalsPage.advantages.title}</h2>

              <div className="space-y-6">
                {advantages.map((advantage, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">{advantage.title}</h4>
                      <p className="text-gray-600">{advantage.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium text-gray-800 mb-4">{b2b?.contactTitle || t.professionalsPage.contactBox.title}</h3>
                <p className="text-gray-600 mb-4">
                  {b2b?.contactDescription || t.professionalsPage.contactBox.description}
                </p>
                <div className="space-y-2 text-gray-600">
                  <p><strong>{b2b?.emailLabel || t.professionalsPage.contactBox.emailLabel}</strong> {b2b?.email || 'pro@ceramiquedesign.fr'}</p>
                  <p><strong>{b2b?.phoneLabel || t.professionalsPage.contactBox.phoneLabel}</strong> {b2b?.phone || '+33757471726'}</p>
                  <p><strong>{b2b?.hoursLabel || t.professionalsPage.contactBox.hoursLabel}</strong> {b2b?.hours || 'Lun-Ven 8h-19h'}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-8">{t.professionalsPage.form.title}</h2>
              
              {isSubmitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  {t.professionalsPage.form.successMessage}
                </div>
              )}

              <form id="professional-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.professionalsPage.form.companyLabel}
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
                    {t.professionalsPage.form.contactLabel}
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
                      {t.professionalsPage.form.emailLabel}
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
                      {t.professionalsPage.form.phoneLabel}
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
                    {t.professionalsPage.form.activityLabel}
                  </label>
                  <select
                    id="activity"
                    name="activity"
                    value={formData.activity}
                    onChange={handleChange}
                    required
                    className="w-full pr-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  >
                    <option value="">{t.professionalsPage.form.activityPlaceholder}</option>
                    <option value="architecte">{activityOptions.architect}</option>
                    <option value="decorateur">{activityOptions.decorator}</option>
                    <option value="carreleur">{activityOptions.tiler}</option>
                    <option value="batiment">{activityOptions.construction}</option>
                    <option value="revendeur">{activityOptions.reseller}</option>
                    <option value="autre">{activityOptions.other}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.professionalsPage.form.siretLabel}
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
                    {t.professionalsPage.form.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm resize-none"
                    placeholder={t.professionalsPage.form.messagePlaceholder}
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.message.length}/500 {t.common.characters}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap font-medium"
                >
                  {t.professionalsPage.form.submit}
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
