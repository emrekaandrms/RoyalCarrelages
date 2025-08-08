
import type { Metadata } from 'next';
import FaucetsPage from './FaucetsPage';

export const metadata: Metadata = {
  title: 'Robinets Premium | Design Moderne et Élégant',
  description: 'Collection de robinets premium pour cuisine et salle de bain. Design moderne, qualité supérieure, finitions élégantes.',
  keywords: 'robinets, cuisine, salle de bain, premium, moderne, élégant',
  openGraph: {
    title: 'Robinets Premium | Design Moderne et Élégant',
    description: 'Collection de robinets premium pour cuisine et salle de bain.',
    type: 'website',
  },
};

export default function FaucetsPageRoute() {
  return <FaucetsPage />;
}
