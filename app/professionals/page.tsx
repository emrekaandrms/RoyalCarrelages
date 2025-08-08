
import type { Metadata } from 'next';
import ProfessionalsPage from './ProfessionalsPage';

export const metadata: Metadata = {
  title: 'Espace Professionnels | Services B2B et Tarifs Préférentiels',
  description: 'Services dédiés aux professionnels du bâtiment. Tarifs préférentiels, support technique, livraison rapide pour vos chantiers.',
  keywords: 'professionnels, B2B, architectes, décorateurs, tarifs préférentiels, chantier',
  openGraph: {
    title: 'Espace Professionnels | Services B2B',
    description: 'Services dédiés aux professionnels du bâtiment.',
    type: 'website',
  },
};

export default function ProfessionalsPageRoute() {
  return <ProfessionalsPage />;
}
