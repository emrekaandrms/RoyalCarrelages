'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import Image from 'next/image';
import LogoImg from '@/Anka-Photoroom.png';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <Image
                src={LogoImg}
                alt="Anka Carrelage Logo"
                width={180}
                height={144}
                className="h-14 w-auto"
                priority
              />
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">{t.footer.products}</h4>
            <ul className="space-y-2">
              <li><Link href="/tiles" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.ceramic_tiles}</Link></li>
              <li><Link href="/faucets" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.faucets}</Link></li>
              <li><Link href="/accessories" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.accessories}</Link></li>
              <li><Link href="/collections" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.collections}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">{t.footer.services}</h4>
            <ul className="space-y-2">
              <li><Link href="/professionals" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.for_professionals}</Link></li>
              <li><Link href="/consultation" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.design_consultation}</Link></li>
              <li><Link href="/installation" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.installation}</Link></li>
              <li><Link href="/support" className="text-gray-300 hover:text-white transition-colors cursor-pointer">{t.footer.support}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">{t.footer.contact}</h4>
            <ul className="space-y-2 text-gray-300">
              <li>1234 Design Street</li>
              <li>New York, NY 10001</li>
              <li>+1 (555) 123-4567</li>
              <li>hello@tilebrand.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Tile Brand. {t.footer.rights}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">{t.footer.privacy}</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
