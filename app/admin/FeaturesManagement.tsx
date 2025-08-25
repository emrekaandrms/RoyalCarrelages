"use client";

import { useEffect, useState } from 'react';

interface FeatureItem {
  position: number;
  title: string;
  description: string;
  icon?: string;
  imageUrl?: string;
}

export default function FeaturesManagement() {
  const [items, setItems] = useState<FeatureItem[]>(
    Array.from({ length: 6 }, (_, i) => ({ position: i + 1, title: '', description: '', icon: '', imageUrl: '' }))
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/features');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data) && data.length) {
        setItems(
          Array.from({ length: 6 }, (_, i) => {
            const found = data.find((d: any) => d.position === i + 1);
            return {
              position: i + 1,
              title: found?.title || '',
              description: found?.description || '',
              icon: found?.icon || '',
            };
          })
        );
      }
    })();
  }, []);

  const onChange = (idx: number, field: keyof FeatureItem, value: string) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } as any : it)));
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: items }),
      });
      if (!res.ok) throw new Error('save failed');
      alert('Features enregistrés.');
    } catch (e) {
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-light text-gray-800">Gestion des Features (6 cartes)</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.position} className="border rounded p-4 bg-white">
            <div className="text-sm text-gray-500 mb-2">Aperçu</div>
            <div className="text-center">
              {it.imageUrl ? (
                <img src={it.imageUrl} alt={it.title} className="w-16 h-16 mx-auto mb-4 rounded object-cover" />
              ) : (
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <i className={`${it.icon || 'ri-star-line'} text-2xl text-gray-600`}></i>
                </div>
              )}
              <div className="font-medium text-gray-800 mb-1">{it.title || 'Titre'}</div>
              <div className="text-gray-600 text-sm">{it.description || 'Description'}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((it, idx) => (
          <div key={it.position} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Position #{it.position}</div>
            <div className="space-y-3">
              <input
                type="text"
                value={it.title}
                onChange={(e) => onChange(idx, 'title', e.target.value)}
                placeholder="Titre"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <textarea
                value={it.description}
                onChange={(e) => onChange(idx, 'description', e.target.value)}
                placeholder="Description"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm h-24"
              />
              <input
                type="text"
                value={it.icon || ''}
                onChange={(e) => onChange(idx, 'icon', e.target.value)}
                placeholder="Classe Icône (ex: ri-leaf-line)"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Image (opsiyonel)</label>
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append('file', file);
                  const res = await fetch('/api/upload', { method: 'POST', body: fd });
                  if (res.ok) {
                    const json = await res.json();
                    onChange(idx, 'imageUrl', json.url);
                  } else {
                    alert('Téléversement échoué');
                  }
                }} className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white" />
                {it.imageUrl && <img src={it.imageUrl} alt="preview" className="h-16 mt-2 rounded" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 disabled:opacity-60"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
