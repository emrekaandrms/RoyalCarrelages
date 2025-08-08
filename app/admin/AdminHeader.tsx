'use client';

import Link from 'next/link';
import Image from 'next/image';
import LogoImg from '@/Anka-Photoroom.png';

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <nav className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center space-x-4">
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
          <span className="text-sm text-gray-500">/ Administration</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-external-link-line w-4 h-4 flex items-center justify-center text-base mr-2 inline"></i>
            Voir le site
          </Link>
          <button 
            onClick={onLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-logout-box-line w-4 h-4 flex items-center justify-center text-base mr-2 inline"></i>
            Déconnexion
          </button>
        </div>
      </nav>
    </header>
  );
}
