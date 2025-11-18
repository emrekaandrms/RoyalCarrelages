
'use client';

import { useLanguage } from '@/lib/language-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const DEFAULT_CONTACT_LOCATIONS = [
  {
    titles: { fr: 'Showroom Paris', en: 'Paris Showroom' },
    addressLines: ['123 Rue de la Céramique', '75001 Paris, France'],
    mapEmbedUrl: 'https://maps.google.com/maps?q=123%20Rue%20de%20la%20C%C3%A9ramique%2075001%20Paris%20France&output=embed',
  },
  {
    titles: { fr: 'Showroom Lyon', en: 'Lyon Showroom' },
    addressLines: ['45 Rue des Arts', '69002 Lyon, France'],
    mapEmbedUrl: 'https://maps.google.com/maps?q=45%20Rue%20des%20Arts%2069002%20Lyon%20France&output=embed',
  },
];

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [cms, setCms] = useState<{
    title?: string;
    description?: string;
    addressLines?: string[];
    phone?: string;
    email?: string;
    hoursLines?: string[];
    showroomTitle?: string;
    locations?: Array<{ title?: string; addressLines?: string[]; mapEmbedUrl?: string }>;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const socialLinks = [
    {
      href: 'https://www.instagram.com/royalcarrelages',
      icon: 'ri-instagram-line',
      label: t.contactPage.social.instagram,
    },
    {
      href: 'https://www.facebook.com/royalcarrelages',
      icon: 'ri-facebook-fill',
      label: t.contactPage.social.facebook,
    },
  ];
  const defaultLocations = DEFAULT_CONTACT_LOCATIONS.map((loc) => ({
    title: loc.titles[language as 'fr' | 'en'] ?? loc.titles.fr,
    addressLines: [...loc.addressLines],
    mapEmbedUrl: loc.mapEmbedUrl,
  }));
  const rawLocations = Array.isArray(cms?.locations) && cms.locations.length ? cms.locations : defaultLocations;
  const normalizedLocations = rawLocations.map((loc, index) => {
    const fallback = defaultLocations[index] ?? defaultLocations[0];
    const cleanedAddressLines = Array.isArray(loc?.addressLines)
      ? loc.addressLines.map((line) => (line ?? '').trim()).filter((line) => line.length > 0)
      : [];
    const addressLines = cleanedAddressLines.length ? cleanedAddressLines : [...fallback.addressLines];
    const fallbackTitle = fallback.title || t.contactPage.locationFallback.replace('{index}', String(index + 1));
    const title = (loc?.title ?? '').trim() || fallbackTitle;
    const mapEmbedUrl = (loc?.mapEmbedUrl ?? '').trim() || fallback.mapEmbedUrl;
    return {
      title,
      addressLines,
      mapEmbedUrl,
    };
  });
  while (normalizedLocations.length < 2) {
    const fallback = defaultLocations[normalizedLocations.length % defaultLocations.length] ?? defaultLocations[0];
    normalizedLocations.push({
      title: fallback.title || t.contactPage.locationFallback.replace('{index}', String(normalizedLocations.length + 1)),
      addressLines: [...fallback.addressLines],
      mapEmbedUrl: fallback.mapEmbedUrl,
    });
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/settings/cms.contact.${language}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setCms(json.value || null);
        }
      } catch {
        // ignore
      }
    })();
  }, [language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        alert(t.common.error);
      }
    } catch (err) {
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
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
              {cms?.title || t.contactPage.defaultTitle}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {cms?.description || t.contactPage.defaultDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-8">{t.contactPage.infoTitle}</h2>
              
              <div className="space-y-6">
                {normalizedLocations.map((location, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-map-pin-line w-6 h-6 flex items-center justify-center text-xl text-gray-600"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">
                        {location.title || t.contactPage.locationFallback.replace('{index}', String(index + 1))}
                      </h3>
                      <p className="text-gray-600">
                        {location.addressLines.map((line, lineIndex) => (
                          <span key={lineIndex}>
                            {line}
                            {lineIndex === location.addressLines.length - 1 ? '' : <br />}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-phone-line w-6 h-6 flex items-center justify-center text-xl text-gray-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">{t.contactPage.phoneLabel}</h3>
                    <p className="text-gray-600">{cms?.phone || '+33 1 23 45 67 89'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-mail-line w-6 h-6 flex items-center justify-center text-xl text-gray-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">{t.contactPage.emailLabel}</h3>
                    <p className="text-gray-600">{cms?.email || 'contact@ceramiquedesign.fr'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-time-line w-6 h-6 flex items-center justify-center text-xl text-gray-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">{t.contactPage.hoursLabel}</h3>
                    <p className="text-gray-600">
                      {(cms?.hoursLines && cms.hoursLines.length ? cms.hoursLines : ['Lun - Ven: 9h00 - 18h00', 'Sam: 10h00 - 16h00']).map((l, i) => (
                        <span key={i}>
                          {l}{i === (cms?.hoursLines?.length || 2) - 1 ? '' : <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-light text-gray-800 mb-4">{t.contactPage.followUsTitle}</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
                      aria-label={social.label}
                      title={social.label}
                    >
                      <i className={`${social.icon} w-6 h-6 flex items-center justify-center text-xl`}></i>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-8">{t.contactPage.formTitle}</h2>
              
              {isSubmitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  {t.contactPage.successMessage}
                </div>
              )}

              <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contactPage.form.nameLabel}
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
                    {t.contactPage.form.emailLabel}
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
                    {t.contactPage.form.phoneLabel}
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
                    {t.contactPage.form.subjectLabel}
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full pr-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  >
                    <option value="">{t.contactPage.form.subjectPlaceholder}</option>
                    <option value="devis">{t.contactPage.form.options.quote}</option>
                    <option value="conseil">{t.contactPage.form.options.advice}</option>
                    <option value="installation">{t.contactPage.form.options.installation}</option>
                    <option value="professionnel">{t.contactPage.form.options.professional}</option>
                    <option value="autre">{t.contactPage.form.options.other}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contactPage.form.messageLabel}
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
                    placeholder={t.contactPage.form.messagePlaceholder}
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.message.length}/500 {t.common.characters}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap font-medium"
                >
                  {t.contactPage.form.submit}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-light text-gray-800 mb-8 text-center">
              {cms?.showroomTitle || t.contactPage.showroomTitleFallback}
            </h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {normalizedLocations.map((location, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                      {location.title || t.contactPage.locationFallback.replace('{index}', String(index + 1))}
                    </h3>
                    <p className="text-gray-600">
                      {location.addressLines.map((line, lineIndex) => (
                        <span key={lineIndex}>
                          {line}
                          {lineIndex === location.addressLines.length - 1 ? '' : <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                  <div className="aspect-video">
                    <iframe
                      src={location.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${location.title || t.contactPage.locationFallback.replace('{index}', String(index + 1))} map`}
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
