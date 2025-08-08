'use server';

import prisma from '@/lib/prisma';

export async function getProducts() {
  return prisma.product.findMany({ orderBy: { koleksiyonu: 'asc' } });
}

export async function getProduct(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export async function createProduct(data: {
  koleksiyonu: string;
  olcusu: string;
  renk: string;
  finish?: string | null;
  imagePath: string;
}) {
  return prisma.product.create({ data: { ...data, finish: data.finish ?? null } });
}

export async function updateProduct(id: string, data: Partial<{ koleksiyonu: string; olcusu: string; renk: string; finish: string | null; imagePath: string }>) {
  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export async function getCollections() {
  return prisma.product.findMany({
    distinct: ['koleksiyonu'],
    select: { koleksiyonu: true },
    orderBy: { koleksiyonu: 'asc' },
  });
}

export async function getCollectionsWithSample() {
  // Her koleksiyondan ilk örneği al
  const collections = await prisma.product.findMany({
    distinct: ['koleksiyonu'],
    select: { 
      koleksiyonu: true,
      imagePath: true,
      renk: true,
      olcusu: true 
    },
    orderBy: { koleksiyonu: 'asc' },
  });
  
  return collections;
}

export async function getSizes() {
  return prisma.product.findMany({
    distinct: ['olcusu'],
    select: { olcusu: true },
    orderBy: { olcusu: 'asc' },
  });
}

// @ts-ignore – slug alanı şemada mevcut ancak tip yeniden üretilmemiş olabilir
export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({ where: { slug } } as any);
}

export async function getProductsPaginated(page: number, perPage: number) {
  const skip = (page - 1) * perPage;
  const [items, total] = await Promise.all([
    prisma.product.findMany({ skip, take: perPage, orderBy: { koleksiyonu: 'asc' } }),
    prisma.product.count(),
  ]);
  return { items, total };
} 