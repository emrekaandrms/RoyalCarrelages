'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Footer() {
  const { t, language } = useLanguage();
  const [cmsFooter, setCmsFooter] = useState<{ description?: string; addressLines?: string[]; phone?: string; email?: string; companyName?: string } | null>(null);
  const [locations, setLocations] = useState<Array<{ name?: string; addressLines?: string[]; phone?: string; email?: string }> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/settings/cms.footer.${language}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setCmsFooter(json.value || null);
        }
        const lres = await fetch(`/api/settings/cms.locations.${language}`, { cache: 'no-store' });
        if (lres.ok) {
          const json = await lres.json();
          setLocations(Array.isArray(json.value) ? json.value : null);
        }
      } catch {
        // ignore
      }
    })();
  }, [language]);

  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <Image
                src="/RoyalCarrelagesLogo.png"
                alt="Royal Carrelages Logo"
                width={180}
                height={144}
                className="h-14 w-auto"
                priority
              />
            </div>
            <p className="text-gray-300 leading-relaxed">
              {cmsFooter?.description || t.footer.description}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">{t.footer.products}</h4>
            <ul className="space-y-2">
              <li><Link href="/carrelages" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.ceramic_tiles}</Link></li>
              {/* Kullanılmayan veya 404 olan bağlantıları kaldırdık */}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">{t.footer.services}</h4>
            <ul className="space-y-2">
              <li><Link href="/professionnels" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.for_professionals}</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.design_consultation}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">{t.footer.contact}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              {(locations && locations.length ? locations : [
                { name: 'Showroom 1', addressLines: ['123 Rue de la Céramique', '75001 Paris, France'], phone: '+33 1 23 45 67 89', email: 'paris@royalcarrelages.fr' },
                { name: 'Showroom 2', addressLines: ['45 Avenue du Design', '69002 Lyon, France'], phone: '+33 4 12 34 56 78', email: 'lyon@royalcarrelages.fr' },
              ]).slice(0,2).map((loc, idx) => {
                const addressLines = (loc.addressLines && loc.addressLines.length ? loc.addressLines : ['Adresse ligne 1','Adresse ligne 2']);
                const addressJoined = addressLines.join(' ');
                const phoneRaw = (loc.phone || cmsFooter?.phone || '+33 1 23 45 67 89');
                const telHref = phoneRaw.replace(/\s|\(|\)|-/g, '');
                const emailVal = (loc.email || cmsFooter?.email || 'contact@ceramiquedesign.fr');
                return (
                  <div key={idx} className="border-t border-gray-700 md:border-t-0 md:border-l md:pl-6 first:md:border-l-0 first:md:pl-0 pt-4 md:pt-0">
                    {loc.name ? <div className="text-white text-base font-medium mb-2">{loc.name}</div> : null}
                    <address className="not-italic text-sm space-y-1" itemScope itemType="https://schema.org/PostalAddress">
                      {addressLines.map((line, i) => (
                        <div key={i} itemProp="streetAddress">{line}</div>
                      ))}
                      <div>
                        <a href={`tel:${telHref}`} className="hover:text-white transition-colors" aria-label="Appeler">
                          {phoneRaw}
                        </a>
                      </div>
                      <div>
                        <a href={`mailto:${emailVal}`} className="hover:text-white transition-colors" aria-label="Envoyer un email">
                          {emailVal}
                        </a>
                      </div>
                    </address>
                    <div className="mt-3 flex items-center gap-3">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressJoined)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 rounded border border-gray-600 text-gray-300 hover:text-white hover:border-white transition-colors cursor-pointer"
                      >
                        Itinéraire
                      </a>
                      <a
                        href={`tel:${telHref}`}
                        className="inline-flex items-center px-3 py-1.5 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors cursor-pointer"
                      >
                        Appeler
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 {cmsFooter?.companyName || 'Tile Brand'}. {t.footer.rights}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {/* Gizlilik/şartlar sayfaları yoksa devre dışı bıraktık */}
          </div>
        </div>
      </div>
    </footer>
  );
}
