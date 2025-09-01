"use client";

import { useEffect, useState } from 'react';
import { translations } from '@/lib/translations';

type Language = 'fr' | 'en';

interface SettingsPayload {
  heroImageUrl: string;
  featuredSlugs: string[];
}

interface CMSHero {
  title: string;
  subtitle: string;
  description: string;
  exploreBtn: string;
  consultBtn: string;
}

interface CMSFooter {
  description: string;
  addressLines: string[];
  phone: string;
  email: string;
  companyName: string;
}

interface CMSContact {
  title: string;
  description: string;
  addressLines: string[];
  phone: string;
  email: string;
  hoursLines: string[];
  showroomTitle: string;
}

interface CMSProfessionals {
  title: string;
  description: string;
}

interface CMSProfessionalsB2B {
  contactTitle: string;
  contactDescription: string;
  emailLabel: string;
  email: string;
  phoneLabel: string;
  phone: string;
  hoursLabel: string;
  hours: string;
}

const DEFAULTS: SettingsPayload = {
  heroImageUrl: '',
  featuredSlugs: ['', '', '', '', '', ''],
};

async function fetchSetting<T = any>(key: string): Promise<T | null> {
  const res = await fetch(`/api/settings/${key}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  return json.value ?? null;
}

async function saveSetting(key: string, value: any) {
  const res = await fetch(`/api/settings/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error('Save failed');
}

export default function SettingsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsPayload>(DEFAULTS);
  const [activeLang, setActiveLang] = useState<Language>('fr');

  const [heroCMS, setHeroCMS] = useState<Record<Language, CMSHero>>({
    fr: { title: '', subtitle: '', description: '', exploreBtn: '', consultBtn: '' },
    en: { title: '', subtitle: '', description: '', exploreBtn: '', consultBtn: '' },
  });
  const [footerCMS, setFooterCMS] = useState<Record<Language, CMSFooter>>({
    fr: { description: '', addressLines: ['', ''], phone: '', email: '', companyName: 'Royal Carrelages' },
    en: { description: '', addressLines: ['', ''], phone: '', email: '', companyName: 'Royal Carrelages' },
  });
  const [contactCMS, setContactCMS] = useState<Record<Language, CMSContact>>({
    fr: { title: '', description: '', addressLines: ['', ''], phone: '', email: '', hoursLines: [''], showroomTitle: '' },
    en: { title: '', description: '', addressLines: ['', ''], phone: '', email: '', hoursLines: [''], showroomTitle: '' },
  });
  const [professionalsCMS, setProfessionalsCMS] = useState<Record<Language, CMSProfessionals>>({
    fr: { title: '', description: '' },
    en: { title: '', description: '' },
  });
  const [professionalsB2B, setProfessionalsB2B] = useState<Record<Language, CMSProfessionalsB2B>>({
    fr: { contactTitle: '', contactDescription: '', emailLabel: 'Email:', email: '', phoneLabel: 'Téléphone:', phone: '', hoursLabel: 'Horaires:', hours: '' },
    en: { contactTitle: '', contactDescription: '', emailLabel: 'Email:', email: '', phoneLabel: 'Phone:', phone: '', hoursLabel: 'Hours:', hours: '' },
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const heroImageUrl = (await fetchSetting<string>('heroImageUrl')) ?? '';
      const featuredSlugs = (await fetchSetting<string[]>('featuredSlugs')) ?? DEFAULTS.featuredSlugs;

      const [heroFr, heroEn] = await Promise.all([
        fetchSetting<CMSHero>('cms.hero.fr'),
        fetchSetting<CMSHero>('cms.hero.en'),
      ]);
      const [footerFr, footerEn] = await Promise.all([
        fetchSetting<CMSFooter>('cms.footer.fr'),
        fetchSetting<CMSFooter>('cms.footer.en'),
      ]);
      const [contactFr, contactEn] = await Promise.all([
        fetchSetting<CMSContact>('cms.contact.fr'),
        fetchSetting<CMSContact>('cms.contact.en'),
      ]);
      const [proFr, proEn] = await Promise.all([
        fetchSetting<CMSProfessionals>('cms.professionals.fr'),
        fetchSetting<CMSProfessionals>('cms.professionals.en'),
      ]);
      const [proB2BFr, proB2BEn] = await Promise.all([
        fetchSetting<CMSProfessionalsB2B>('cms.professionals.b2b.fr'),
        fetchSetting<CMSProfessionalsB2B>('cms.professionals.b2b.en'),
      ]);

      // Fallbacks to current site content so the admin sees existing texts
      const heroFallbackFr: CMSHero = {
        title: translations.fr.hero.title,
        subtitle: translations.fr.hero.subtitle,
        description: translations.fr.hero.description,
        exploreBtn: translations.fr.hero.exploreBtn,
        consultBtn: translations.fr.hero.consultBtn,
      };
      const heroFallbackEn: CMSHero = {
        title: translations.en.hero.title,
        subtitle: translations.en.hero.subtitle,
        description: translations.en.hero.description,
        exploreBtn: translations.en.hero.exploreBtn,
        consultBtn: translations.en.hero.consultBtn,
      };
      const footerFallbackFr: CMSFooter = {
        description: translations.fr.footer.description,
        addressLines: ['1234 Design Street', 'New York, NY 10001'],
        phone: '+1 (555) 123-4567',
        email: 'hello@tilebrand.com',
        companyName: 'Royal Carrelages',
      };
      const footerFallbackEn: CMSFooter = {
        description: translations.en.footer.description,
        addressLines: ['1234 Design Street', 'New York, NY 10001'],
        phone: '+1 (555) 123-4567',
        email: 'hello@tilebrand.com',
        companyName: 'Royal Carrelages',
      };
      const contactFallbackFr: CMSContact = {
        title: 'Contactez-nous',
        description: `Notre équipe d'experts est là pour vous accompagner dans tous vos projets. N'hésitez pas à nous contacter pour une consultation personnalisée.`,
        addressLines: ['123 Rue de la Céramique', '75001 Paris, France'],
        phone: '+33 1 23 45 67 89',
        email: 'contact@ceramiquedesign.fr',
        hoursLines: ['Lun - Ven: 9h00 - 18h00', 'Sam: 10h00 - 16h00'],
        showroomTitle: 'Notre Showroom',
      };
      const contactFallbackEn: CMSContact = {
        // If you want different EN defaults, edit here; mirroring FR for now
        ...contactFallbackFr,
      };
      const proFallbackFr: CMSProfessionals = {
        title: 'Espace Professionnels',
        description: `Des services dédiés aux architectes, décorateurs, entreprises du bâtiment et revendeurs pour accompagner vos projets.`,
      };
      const proFallbackEn: CMSProfessionals = {
        // If you want different EN defaults, edit here; mirroring FR for now
        ...proFallbackFr,
      };
      const proB2BFallbackFr: CMSProfessionalsB2B = {
        contactTitle: 'Contact Dédié',
        contactDescription: `Notre équipe commerciale B2B est à votre disposition pour étudier vos besoins spécifiques.`,
        emailLabel: 'Email:',
        email: 'pro@ceramiquedesign.fr',
        phoneLabel: 'Téléphone:',
        phone: '+33 1 23 45 67 88',
        hoursLabel: 'Horaires:',
        hours: 'Lun-Ven 8h-19h',
      };
      const proB2BFallbackEn: CMSProfessionalsB2B = {
        contactTitle: 'Dedicated Contact',
        contactDescription: `Our B2B sales team is available to understand your specific needs.`,
        emailLabel: 'Email:',
        email: 'pro@ceramiquedesign.fr',
        phoneLabel: 'Phone:',
        phone: '+33 1 23 45 67 88',
        hoursLabel: 'Hours:',
        hours: 'Mon-Fri 8am-7pm',
      };

      setSettings({ heroImageUrl, featuredSlugs });
      setHeroCMS((prev) => ({
        fr: heroFr ?? heroFallbackFr,
        en: heroEn ?? heroFallbackEn,
      }));
      setFooterCMS((prev) => ({
        fr: sanitizeFooter(footerFr) ?? footerFallbackFr,
        en: sanitizeFooter(footerEn) ?? footerFallbackEn,
      }));
      setContactCMS((prev) => ({
        fr: sanitizeContact(contactFr) ?? contactFallbackFr,
        en: sanitizeContact(contactEn) ?? contactFallbackEn,
      }));
      setProfessionalsCMS((prev) => ({
        fr: proFr ?? proFallbackFr,
        en: proEn ?? proFallbackEn,
      }));
      setProfessionalsB2B((prev) => ({
        fr: proB2BFr ?? proB2BFallbackFr,
        en: proB2BEn ?? proB2BFallbackEn,
      }));
      setLoading(false);
    })();
  }, []);

  function sanitizeFooter(val: CMSFooter | null | undefined): CMSFooter | undefined {
    if (!val) return undefined;
    return {
      description: val.description ?? '',
      addressLines: Array.isArray(val.addressLines) && val.addressLines.length ? val.addressLines : ['', ''],
      phone: val.phone ?? '',
      email: val.email ?? '',
      companyName: val.companyName ?? 'Royal Carrelages',
    };
  }

  function sanitizeContact(val: CMSContact | null | undefined): CMSContact | undefined {
    if (!val) return undefined;
    return {
      title: val.title ?? '',
      description: val.description ?? '',
      addressLines: Array.isArray(val.addressLines) && val.addressLines.length ? val.addressLines : ['', ''],
      phone: val.phone ?? '',
      email: val.email ?? '',
      hoursLines: Array.isArray(val.hoursLines) && val.hoursLines.length ? val.hoursLines : [''],
      showroomTitle: val.showroomTitle ?? '',
    };
  }

  const updateFeatured = (idx: number, value: string) => {
    setSettings((prev) => {
      const next = [...prev.featuredSlugs];
      next[idx] = value;
      return { ...prev, featuredSlugs: next };
    });
  };

  const onSave = async () => {
    try {
      setSaving(true);
      await saveSetting('heroImageUrl', settings.heroImageUrl);
      await saveSetting('featuredSlugs', settings.featuredSlugs);
      await saveSetting('cms.hero.fr', heroCMS.fr);
      await saveSetting('cms.hero.en', heroCMS.en);
      await saveSetting('cms.footer.fr', footerCMS.fr);
      await saveSetting('cms.footer.en', footerCMS.en);
      await saveSetting('cms.contact.fr', contactCMS.fr);
      await saveSetting('cms.contact.en', contactCMS.en);
      await saveSetting('cms.professionals.fr', professionalsCMS.fr);
      await saveSetting('cms.professionals.en', professionalsCMS.en);
      await saveSetting('cms.professionals.b2b.fr', professionalsB2B.fr);
      await saveSetting('cms.professionals.b2b.en', professionalsB2B.en);
      alert('Paramètres enregistrés.');
    } catch (e) {
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-light text-gray-800">Paramètres de la page d'accueil</h2>

      <div className="bg-white p-2 rounded-lg inline-flex items-center space-x-2 border">
        <button
          className={`px-4 py-2 rounded ${activeLang === 'fr' ? 'bg-gray-800 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setActiveLang('fr')}
        >FR</button>
        <button
          className={`px-4 py-2 rounded ${activeLang === 'en' ? 'bg-gray-800 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setActiveLang('en')}
        >EN</button>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Image Hero</h3>
        <input
          type="url"
          value={settings.heroImageUrl}
          onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
          placeholder="https://..."
        />
        <p className="text-xs text-gray-500 mt-2">URL d'image utilisée comme arrière-plan de la section Hero.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Textes Hero Accueil ({activeLang.toUpperCase()})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={heroCMS[activeLang].title}
            onChange={(e) => setHeroCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], title: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            placeholder="Titre principal"
          />
          <input
            type="text"
            value={heroCMS[activeLang].subtitle}
            onChange={(e) => setHeroCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], subtitle: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            placeholder="Sous-titre"
          />
        </div>
        <textarea
          value={heroCMS[activeLang].description}
          onChange={(e) => setHeroCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], description: e.target.value } }))}
          className="w-full px-4 py-2 border border-gray-300 rounded text-sm mt-4 h-24"
          placeholder="Description"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={heroCMS[activeLang].exploreBtn}
              onChange={(e) => setHeroCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], exploreBtn: e.target.value } }))}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
              placeholder="Texte bouton Explorer"
            />
            <button className="bg-white text-gray-800 px-4 py-2 border rounded shadow-sm">
              {heroCMS[activeLang].exploreBtn || 'Explorer'}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={heroCMS[activeLang].consultBtn}
              onChange={(e) => setHeroCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], consultBtn: e.target.value } }))}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
              placeholder="Texte bouton Consultation"
            />
            <button className="border-2 border-gray-800 text-gray-800 px-4 py-2 rounded">
              {heroCMS[activeLang].consultBtn || 'Consultation'}
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm text-gray-600 mb-2">Aperçu</div>
          <div
            className="relative rounded-lg overflow-hidden h-48 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url('${settings.heroImageUrl || 'https://readdy.ai/api/search-image?query=modern%20interior&width=1200&height=600'}')`
            }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="px-6">
                <div className="text-white text-2xl font-light">{heroCMS[activeLang].title || 'Titre'}</div>
                <div className="text-white/90">{heroCMS[activeLang].subtitle || 'Sous-titre'}</div>
                <div className="mt-3 flex gap-3">
                  <button className="bg-white text-gray-800 px-4 py-2 rounded">
                    {heroCMS[activeLang].exploreBtn || 'Explorer'}
                  </button>
                  <button className="border-2 border-white text-white px-4 py-2 rounded">
                    {heroCMS[activeLang].consultBtn || 'Consultation'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Produits mis en avant (6 slugs)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settings.featuredSlugs.map((slug, idx) => (
            <input
              key={idx}
              type="text"
              value={slug}
              onChange={(e) => updateFeatured(idx, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
              placeholder={`slug produit #${idx + 1}`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Entrez les slugs de produits existants (ex: adel-beyaz-kristal-120x120).</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Pied de page ({activeLang.toUpperCase()})</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={footerCMS[activeLang].companyName}
            onChange={(e) => setFooterCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], companyName: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            placeholder="Nom de l'entreprise"
          />
          <textarea
            value={footerCMS[activeLang].description}
            onChange={(e) => setFooterCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], description: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm h-24"
            placeholder="Description sous le logo"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(footerCMS[activeLang].addressLines || []).map((line, i) => (
              <input
                key={i}
                type="text"
                value={line}
                onChange={(e) => setFooterCMS((prev) => {
                  const next = { ...prev };
                  const lines = [...next[activeLang].addressLines];
                  lines[i] = e.target.value;
                  next[activeLang] = { ...next[activeLang], addressLines: lines };
                  return next;
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
                placeholder={`Adresse ligne ${i + 1}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={footerCMS[activeLang].phone}
              onChange={(e) => setFooterCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], phone: e.target.value } }))}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
              placeholder="Téléphone"
            />
            <input
              type="email"
              value={footerCMS[activeLang].email}
              onChange={(e) => setFooterCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], email: e.target.value } }))}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
              placeholder="Email"
            />
          </div>

          <div className="mt-6">
            <div className="text-sm text-gray-600 mb-2">Aperçu</div>
            <div className="border rounded-lg p-4 bg-white">
              <div className="text-gray-900 font-medium mb-2">{footerCMS[activeLang].companyName || 'Royal Carrelages'}</div>
              <div className="text-gray-600 text-sm mb-3">{footerCMS[activeLang].description || 'Description'}</div>
              <ul className="text-gray-700 text-sm space-y-1">
                {(footerCMS[activeLang].addressLines || []).map((l, i) => (
                  <li key={i}>{l || 'Adresse'}</li>
                ))}
                <li>{footerCMS[activeLang].phone || 'Téléphone'}</li>
                <li>{footerCMS[activeLang].email || 'Email'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Page Contact ({activeLang.toUpperCase()})</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={contactCMS[activeLang].title}
              onChange={(e) => setContactCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], title: e.target.value } }))}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
              placeholder="Titre de page"
            />
            <input
              type="text"
              value={contactCMS[activeLang].showroomTitle}
              onChange={(e) => setContactCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], showroomTitle: e.target.value } }))}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
              placeholder="Titre Showroom"
            />
          </div>
          <textarea
            value={contactCMS[activeLang].description}
            onChange={(e) => setContactCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], description: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm h-24"
            placeholder="Description héro/contact"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(contactCMS[activeLang].addressLines || []).map((line, i) => (
              <input
                key={i}
                type="text"
                value={line}
                onChange={(e) => setContactCMS((prev) => {
                  const next = { ...prev } as any;
                  const lines = [...next[activeLang].addressLines];
                  lines[i] = e.target.value;
                  next[activeLang] = { ...next[activeLang], addressLines: lines };
                  return next;
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
                placeholder={`Adresse ligne ${i + 1}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={contactCMS[activeLang].phone}
              onChange={(e) => setContactCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], phone: e.target.value } }))}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
              placeholder="Téléphone"
            />
            <input
              type="email"
              value={contactCMS[activeLang].email}
              onChange={(e) => setContactCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], email: e.target.value } }))}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
              placeholder="Email"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(contactCMS[activeLang].hoursLines || []).map((line, i) => (
              <input
                key={i}
                type="text"
                value={line}
                onChange={(e) => setContactCMS((prev) => {
                  const next = { ...prev } as any;
                  const lines = [...next[activeLang].hoursLines];
                  lines[i] = e.target.value;
                  next[activeLang] = { ...next[activeLang], hoursLines: lines };
                  return next;
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
                placeholder={`Horaires ligne ${i + 1}`}
              />
            ))}
          </div>

          <div className="mt-6">
            <div className="text-sm text-gray-600 mb-2">Aperçu</div>
            <div className="border rounded-lg p-4 bg-white">
              <div className="text-2xl font-light text-gray-800 mb-2">{contactCMS[activeLang].title || 'Contact'}</div>
              <div className="text-gray-600 mb-3">{contactCMS[activeLang].description || 'Description'}</div>
              <ul className="text-gray-700 text-sm space-y-1">
                {(contactCMS[activeLang].addressLines || []).map((l, i) => (
                  <li key={i}>{l || 'Adresse'}</li>
                ))}
                <li>{contactCMS[activeLang].phone || 'Téléphone'}</li>
                <li>{contactCMS[activeLang].email || 'Email'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Page Professionnels ({activeLang.toUpperCase()})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={professionalsCMS[activeLang].title}
            onChange={(e) => setProfessionalsCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], title: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            placeholder="Titre Héro"
          />
          <input
            type="text"
            value={professionalsCMS[activeLang].description}
            onChange={(e) => setProfessionalsCMS((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], description: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            placeholder="Description Héro"
          />
        </div>

        <div className="mt-6">
          <div className="text-sm text-gray-600 mb-2">Aperçu</div>
          <div className="border rounded-lg p-4 bg-white">
            <div className="text-2xl font-light text-gray-800">{professionalsCMS[activeLang].title || 'Espace Professionnels'}</div>
            <div className="text-gray-600">{professionalsCMS[activeLang].description || 'Description'}</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Professionnels - Contact B2B ({activeLang.toUpperCase()})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={professionalsB2B[activeLang].contactTitle}
            onChange={(e) => setProfessionalsB2B((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], contactTitle: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            placeholder="Titre bloc (ex: Contact Dédié)"
          />
          <input
            type="text"
            value={professionalsB2B[activeLang].contactDescription}
            onChange={(e) => setProfessionalsB2B((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], contactDescription: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            placeholder="Description"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            type="text"
            value={professionalsB2B[activeLang].emailLabel}
            onChange={(e) => setProfessionalsB2B((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], emailLabel: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            placeholder="Label Email"
          />
          <input
            type="email"
            value={professionalsB2B[activeLang].email}
            onChange={(e) => setProfessionalsB2B((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], email: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            placeholder="Email"
          />
          <input
            type="text"
            value={professionalsB2B[activeLang].phoneLabel}
            onChange={(e) => setProfessionalsB2B((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], phoneLabel: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            placeholder="Label Téléphone"
          />
          <input
            type="text"
            value={professionalsB2B[activeLang].phone}
            onChange={(e) => setProfessionalsB2B((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], phone: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            placeholder="Téléphone"
          />
          <input
            type="text"
            value={professionalsB2B[activeLang].hoursLabel}
            onChange={(e) => setProfessionalsB2B((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], hoursLabel: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            placeholder="Label Horaires"
          />
          <input
            type="text"
            value={professionalsB2B[activeLang].hours}
            onChange={(e) => setProfessionalsB2B((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], hours: e.target.value } }))}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            placeholder="Horaires"
          />
        </div>

        <div className="mt-6">
          <div className="text-sm text-gray-600 mb-2">Aperçu</div>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-2xl font-light text-gray-800 mb-4">{professionalsB2B[activeLang].contactTitle || 'Contact'}</div>
            <div className="text-gray-600 mb-4">{professionalsB2B[activeLang].contactDescription || 'Description'}</div>
            <div className="space-y-2 text-gray-700">
              <div><strong>{professionalsB2B[activeLang].emailLabel || 'Email:'}</strong> {professionalsB2B[activeLang].email || 'example@domain.com'}</div>
              <div><strong>{professionalsB2B[activeLang].phoneLabel || 'Téléphone:'}</strong> {professionalsB2B[activeLang].phone || '+33 ...'}</div>
              <div><strong>{professionalsB2B[activeLang].hoursLabel || 'Horaires:'}</strong> {professionalsB2B[activeLang].hours || 'Lun-Ven ...'}</div>
            </div>
          </div>
        </div>
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
