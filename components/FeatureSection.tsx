
'use client';

import { useLanguage } from '@/lib/language-context';

export default function FeatureSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: 'ri-leaf-line',
      title: t.features.natural.title,
      description: t.features.natural.desc
    },
    {
      icon: 'ri-shield-check-line',
      title: t.features.durable.title,
      description: t.features.durable.desc
    },
    {
      icon: 'ri-palette-line',
      title: t.features.versatile.title,
      description: t.features.versatile.desc
    },
    {
      icon: 'ri-tools-line',
      title: t.features.installation.title,
      description: t.features.installation.desc
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-gray-800 mb-4">
            {t.features.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.features.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-800 transition-colors duration-300">
                <i className={`${feature.icon} w-8 h-8 flex items-center justify-center text-2xl text-gray-600 group-hover:text-white transition-colors duration-300`}></i>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
