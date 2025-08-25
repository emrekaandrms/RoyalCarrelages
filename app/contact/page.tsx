
import type { Metadata } from 'next';
import ContactPage from './ContactPage';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez notre équipe d\'experts pour vos projets de carrelage. Consultation gratuite et conseils personnalisés.',
  keywords: 'contact, consultation, carrelage, experts, conseils',
  openGraph: {
    title: 'Contact',
    description: 'Contactez notre équipe pour vos projets.',
    type: 'website',
  },
};

export default function ContactPageRoute() {
  return <ContactPage />;
}
