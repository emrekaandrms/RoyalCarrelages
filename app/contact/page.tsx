
import type { Metadata } from 'next';
import ContactPage from './ContactPage';

export const metadata: Metadata = {
  title: 'Contact | Nous Contacter pour Vos Projets',
  description: 'Contactez notre équipe d\'experts pour vos projets de carrelage et robinetterie. Consultation gratuite et conseils personnalisés.',
  keywords: 'contact, consultation, carrelage, robinetterie, experts, conseils',
  openGraph: {
    title: 'Contact | Nous Contacter pour Vos Projets',
    description: 'Contactez notre équipe d\'experts pour vos projets.',
    type: 'website',
  },
};

export default function ContactPageRoute() {
  return <ContactPage />;
}
