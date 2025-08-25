import { getCollectionsWithSample } from '@/app/actions/products';
import CollectionsClient from './CollectionsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Découvrez nos collections de carrelages céramiques premium.',
};

export default async function CollectionsPage() {
  const collections = await getCollectionsWithSample();

  return <CollectionsClient collections={collections} />;
} 