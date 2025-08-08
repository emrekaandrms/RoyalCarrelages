'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/lib/language-context';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import LogoImg from '@/Anka-Photoroom.png';

export default function Header() {
  const { t } = useLanguage();

  const pathname = usePathname();
  const isHome = pathname === '/';

  // Track scroll position to switch header background
  const [isScrolled, setIsScrolled] = useState(false);
  // Track mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    handleScroll(); // run on mount in case page is already scrolled
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrolledOrOpaque = isScrolled || !isHome;

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
    scrolledOrOpaque
      ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200'
      : 'bg-transparent'
  }`;

  const navPadding = scrolledOrOpaque ? 'py-2' : 'py-4';

  return (
    <header className={headerClasses}>
      <nav className={`flex items-center justify-between max-w-7xl mx-auto px-6 lg:px-8 ${navPadding} transition-all duration-300`}>
        {/* Logo */}
        <Link href="/" className="block select-none">
          <Image
            src={LogoImg}
            alt="Anka Carrelage Logo"
            width={160}
            height={128}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { href: '/collections', label: t.nav.collections },
            { href: '/tiles', label: t.nav.tiles },
            { href: '/faucets', label: t.nav.faucets },
            { href: '/contact', label: t.nav.contact },
            { href: '/professionals', label: t.nav.professionals }
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative transition-colors duration-300 cursor-pointer whitespace-nowrap after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                scrolledOrOpaque
                  ? 'text-gray-900 hover:text-blue-600'
                  : 'text-white hover:text-gray-200'
              }`}
            >
              {label}
            </Link>
          ))}
          <LanguageSwitcher variant={scrolledOrOpaque ? 'dark' : 'light'} />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMenuOpen((open) => !open)}
          className={`md:hidden focus:outline-none transition-colors duration-300 ${
            scrolledOrOpaque ? 'text-gray-700' : 'text-white'
          }`}
          aria-label="Toggle menu"
        >
          <i
            className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-3xl`}
          ></i>
        </button>
      </nav>

      {/* Mobile overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile slide-out menu */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col p-8 space-y-6 pt-20">
          <Link
            href="/collections"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            {t.nav.collections}
          </Link>
          <Link
            href="/tiles"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            {t.nav.tiles}
          </Link>
          <Link
            href="/faucets"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            {t.nav.faucets}
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            {t.nav.contact}
          </Link>
          <Link
            href="/professionals"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            {t.nav.professionals}
          </Link>
          <LanguageSwitcher variant="dark" />
        </nav>
      </div>
    </header>
  );
}
