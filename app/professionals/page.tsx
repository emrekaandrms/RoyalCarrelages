
import type { Metadata } from 'next';
import ProfessionalsPage from './ProfessionalsPage';

export const metadata: Metadata = {
  title: 'Espace Professionnels',
  description: 'Solutions carrelage pour architectes et professionnels du bâtiment.',
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
