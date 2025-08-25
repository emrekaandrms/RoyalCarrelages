"use client";

import { useEffect, useState } from 'react';

interface SettingsPayload {
  heroImageUrl: string;
  featuredSlugs: string[];
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

  useEffect(() => {
    (async () => {
      setLoading(true);
      const heroImageUrl = (await fetchSetting<string>('heroImageUrl')) ?? '';
      const featuredSlugs = (await fetchSetting<string[]>('featuredSlugs')) ?? DEFAULTS.featuredSlugs;
      setSettings({ heroImageUrl, featuredSlugs });
      setLoading(false);
    })();
  }, []);

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
