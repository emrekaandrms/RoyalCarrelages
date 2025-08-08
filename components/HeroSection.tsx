
'use client';

import { useLanguage } from '@/lib/language-context';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section 
      className="relative h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://readdy.ai/api/search-image?query=Modern%20minimalist%20kitchen%20interior%20with%20natural%20lighting%2C%20clay-colored%20ceramic%20vases%20on%20clean%20countertops%2C%20warm%20beige%20and%20gray%20tones%2C%20concrete-effect%20ceramic%20tiles%20on%20walls%2C%20soft%20natural%20sunlight%20streaming%20through%20large%20windows%2C%20clean%20Japandi%20Mediterranean%20aesthetic%2C%20warm%20earth%20tones%2C%20elegant%20natural%20materials%2C%20sophisticated%20minimal%20design&width=1920&height=1080&seq=hero-kitchen&orientation=landscape')`
      }}
    >
      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
              {t.hero.title}
              <br />
              <span className="text-4xl md:text-5xl">{t.hero.subtitle}</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-gray-800 px-8 py-4 hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap font-medium">
                {t.hero.exploreBtn}
              </button>
              <button className="border-2 border-white text-white px-8 py-4 hover:bg-white hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap font-medium">
                {t.hero.consultBtn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
