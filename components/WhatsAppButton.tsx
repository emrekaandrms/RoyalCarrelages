'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

export default function WhatsAppButton() {
  const { t } = useLanguage();
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33786033509';
  const sanitizedNumber = rawNumber.replace(/\D/g, '') || '33786033509';
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || `https://wa.me/${sanitizedNumber}`;
  const label = t.common.whatsappTooltip;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      prefetch={false}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
      aria-label={label}
      title={label}
    >
      <i className="ri-whatsapp-line text-2xl"></i>
    </Link>
  );
}

