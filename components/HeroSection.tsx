
'use client';

import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const { t, language } = useLanguage();
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [slides, setSlides] = useState<Array<{ imageUrl: string; title: string; subtitle?: string; link?: string; buttonText?: string }>>([]);
  const [cmsHero, setCmsHero] = useState<{ title?: string; subtitle?: string; description?: string; exploreBtn?: string; consultBtn?: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [sres, hres, cms] = await Promise.all([
          fetch('/api/banners', { cache: 'no-store' }),
          fetch('/api/settings/heroImageUrl', { cache: 'no-store' }),
          fetch(`/api/settings/cms.hero.${language}`, { cache: 'no-store' })
        ]);
        if (sres.ok) {
          const all = await sres.json();
          const activeHero = (all || []).filter((b: any) => b.position === 'HERO' && b.status === 'ACTIVE').sort((a: any, b: any) => a.order - b.order);
          setSlides(activeHero.map((b: any) => ({ imageUrl: b.imageUrl, title: b.title, subtitle: b.subtitle, link: b.link, buttonText: b.buttonText })));
        }
        if (hres.ok) {
          const json = await hres.json();
          setHeroUrl(json.value || null);
        }
        if (cms.ok) {
          const json = await cms.json();
          setCmsHero(json.value || null);
        }
      } catch {
        // ignore network errors
      }
    })();
  }, [language]);

  return (
    <section className="relative h-screen">
      {slides.length > 0 ? (
        <div className="absolute inset-0">
          <div className="h-full w-full">
            {/* Geliştirilmiş slider: fade geçiş, manuel kontrol, süre artırıldı */}
            <HeroSlider slides={slides} />
          </div>
        </div>
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${heroUrl || "https://readdy.ai/api/search-image?query=Modern%20minimalist%20kitchen%20interior%20with%20natural%20lighting%2C%20clay-colored%20ceramic%20vases%20on%20clean%20countertops%2C%20warm%20beige%20and%20gray%20tones%2C%20concrete-effect%20ceramic%20tiles%20on%20walls%2C%20soft%20natural%20sunlight%20streaming%20through%20large%20windows%2C%20clean%20Japandi%20Mediterranean%20aesthetic%2C%20warm%20earth%20tones%2C%20elegant%20natural%20materials%2C%20sophisticated%20minimal%20design&width=1920&height=1080&seq=hero-kitchen&orientation=landscape"}')`
          }}
        />
      )}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
              {cmsHero?.title || t.hero.title}
              <br />
              <span className="text-4xl md:text-5xl">{cmsHero?.subtitle || t.hero.subtitle}</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              {cmsHero?.description || t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/carrelages" className="bg-white text-gray-800 px-8 py-4 hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap font-medium">
                {cmsHero?.exploreBtn || t.hero.exploreBtn}
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 hover:bg-white hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap font-medium">
                {cmsHero?.consultBtn || t.hero.consultBtn}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSlider({ slides }: { slides: Array<{ imageUrl: string; title: string; subtitle?: string; link?: string; buttonText?: string }> }) {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!isHovering) {
        setIndex((i) => (i + 1) % slides.length);
      }
    }, 7000);
    return () => clearInterval(id);
  }, [slides.length, isHovering]);

  const slide = slides[index];
  return (
    <div
      className="h-full w-full relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Slides */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${s.imageUrl}')`,
            }}
          />
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'} hover:bg-white transition-colors`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-10">
        <button
          aria-label="Previous slide"
          onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
          className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        >
          ‹
        </button>
        <button
          aria-label="Next slide"
          onClick={() => setIndex((index + 1) % slides.length)}
          className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
}
