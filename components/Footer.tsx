'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Footer() {
  const { t, language } = useLanguage();
  const [cmsFooter, setCmsFooter] = useState<{ description?: string; addressLines?: string[]; phone?: string; email?: string; companyName?: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/settings/cms.footer.${language}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setCmsFooter(json.value || null);
        }
      } catch {
        // ignore
      }
    })();
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
              <li><Link href="/professionals" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.for_professionals}</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.design_consultation}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">{t.footer.contact}</h4>
            <ul className="space-y-2 text-gray-300">
              {(cmsFooter?.addressLines && cmsFooter.addressLines.length ? cmsFooter.addressLines : ['1234 Design Street', 'New York, NY 10001']).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
              <li>{cmsFooter?.phone || '+1 (555) 123-4567'}</li>
              <li>{cmsFooter?.email || 'hello@tilebrand.com'}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 {cmsFooter?.companyName || 'Tile Brand'}. {t.footer.rights}
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
