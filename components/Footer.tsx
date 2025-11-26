'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type FooterCMS = {
  description?: string;
  addressLines?: string[];
  phone?: string;
  email?: string;
  companyName?: string;
};

type ContactLocation = {
  title?: string;
  addressLines?: string[];
};

export default function Footer() {
  const { t, language } = useLanguage();
  const [cmsFooter, setCmsFooter] = useState<FooterCMS | null>(null);
  const [contactLocations, setContactLocations] = useState<ContactLocation[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [footerRes, contactRes] = await Promise.all([
          fetch(`/api/settings/cms.footer.${language}`, { cache: 'no-store' }),
          fetch(`/api/settings/cms.contact.${language}`, { cache: 'no-store' }),
        ]);

        if (!cancelled && footerRes.ok) {
          const footerJson = await footerRes.json();
          setCmsFooter(footerJson.value || null);
        }

        if (!cancelled) {
          if (contactRes.ok) {
            const contactJson = await contactRes.json();
            setContactLocations(
              Array.isArray(contactJson.value?.locations) ? contactJson.value.locations : []
            );
          } else {
            setContactLocations([]);
          }
        }
      } catch {
        if (!cancelled) {
          setContactLocations([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [language]);

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

  const normalizeLines = (lines?: string[]) =>
    Array.isArray(lines) ? lines.map((line) => (line ?? '').trim()).filter(Boolean) : [];

  const normalizedContactLocations = contactLocations
    .map((location, index) => {
      const lines = normalizeLines(location?.addressLines);
      if (!lines.length) return null;
      const title =
        (location?.title ?? '').trim() ||
        t.contactPage.locationFallback.replace('{index}', String(index + 1));
      return { title, lines };
    })
    .filter(
      (section): section is { title: string; lines: string[] } =>
        section !== null
    );

  const fallbackContactBlocks = [
    {
      title: language === 'fr' ? 'Showroom Paris' : 'Paris Showroom',
      lines: ['123 Rue de la Ceramique', '75001 Paris, France'],
    },
    {
      title: language === 'fr' ? 'Showroom Lyon' : 'Lyon Showroom',
      lines: ['45 Rue des Arts', '69002 Lyon, France'],
    },
  ];

  let addressBlocks = normalizedContactLocations.length
    ? normalizedContactLocations
    : fallbackContactBlocks;

  if (addressBlocks.length < 2) {
    const needed = 2 - addressBlocks.length;
    for (let i = 0; i < needed; i++) {
      addressBlocks = [...addressBlocks, fallbackContactBlocks[i % fallbackContactBlocks.length]];
    }
  }

  addressBlocks = addressBlocks.slice(0, 2);

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
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">{t.footer.services}</h4>
            <ul className="space-y-2">
              <li><Link href="/professionals" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.for_professionals}</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.design_consultation}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">{t.footer.contact}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
              {addressBlocks.map((block, blockIndex) => (
                <div key={`${block.title}-${blockIndex}`} className="space-y-1">
                  <p className="text-sm font-semibold text-white/90">{block.title}</p>
                  {block.lines.map((line, lineIndex) => (
                    <p key={lineIndex} className="text-sm leading-6">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; 2026 {cmsFooter?.companyName || 'Tile Brand'}. {t.footer.rights}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-200 hover:bg-white hover:text-gray-900 transition-colors"
                aria-label={link.label}
                title={link.label}
              >
                <i className={`${link.icon} text-xl`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
