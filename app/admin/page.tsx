
import type { Metadata } from 'next';
import AdminPage from './AdminPage';

export const metadata: Metadata = {
  title: 'Administration | Gestion du Site',
  description: 'Interface d\'administration pour la gestion des produits, collections et bannières.',
  robots: 'noindex, nofollow',
};

export default function AdminPageRoute() {
  return <AdminPage />;
}
