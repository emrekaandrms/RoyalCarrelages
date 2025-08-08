'use client';

import { useLanguage } from '@/lib/language-context';

type Variant = 'light' | 'dark';

interface Props {
  variant?: Variant; // 'light' = beyaz yazı & saydam arka plan, 'dark' = koyu yazı & açık arka plan
}

export default function LanguageSwitcher({ variant = 'dark' }: Props) {
  const { language, setLanguage } = useLanguage();

  const isLight = variant === 'light';

  const containerClasses = `flex items-center space-x-1 rounded-full p-1 transition-colors duration-300 ${
    isLight ? 'bg-white/20 backdrop-blur-md' : 'bg-stone-200'
  }`;

  const activeClasses = isLight
    ? 'bg-white/80 text-gray-900'
    : 'bg-stone-600 text-white';

  const inactiveClasses = isLight
    ? 'text-white hover:text-gray-200'
    : 'text-stone-800 hover:text-stone-900';

  const buttonBase = 'px-3 py-1 text-sm rounded-full transition-all cursor-pointer whitespace-nowrap';

  return (
    <div className={containerClasses}>
      <button
        onClick={() => setLanguage('fr')}
        className={`${buttonBase} ${
          language === 'fr' ? activeClasses : inactiveClasses
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`${buttonBase} ${
          language === 'en' ? activeClasses : inactiveClasses
        }`}
      >
        EN
      </button>
    </div>
  );
}
