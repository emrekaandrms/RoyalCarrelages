import { getCollectionsWithSample } from '@/app/actions/products';
import CollectionsClient from './CollectionsClient';

export default async function CollectionsPage() {
  const collections = await getCollectionsWithSample();

  return <CollectionsClient collections={collections} />;
} 