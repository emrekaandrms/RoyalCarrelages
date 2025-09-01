import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const [items, overridesSetting, titleOverridesSetting] = await Promise.all([
    prisma.featuredProduct.findMany({
      orderBy: { position: 'asc' },
      include: { product: true },
    }),
    prisma.setting.findUnique({ where: { key: 'featuredImageOverrides' } }).catch(() => null),
    prisma.setting.findUnique({ where: { key: 'featuredTitleOverrides' } }).catch(() => null),
  ]);
  const overrides: Record<string, string> = (overridesSetting?.value as any) || {};
  const titleOverrides: Record<string, string> = (titleOverridesSetting?.value as any) || {};
  const withOverrides = items.map((it: any) => ({
    ...it,
    overrideImageUrl: overrides[String(it.position)] || null,
    overrideTitle: titleOverrides[String(it.position)] || null,
  }));
  return NextResponse.json(withOverrides);
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.positions)) {
    return NextResponse.json({ error: 'positions required' }, { status: 400 });
  }
  // Expect positions: Array<{ position:number, productId:string }>
  await prisma.$transaction([
    prisma.featuredProduct.deleteMany({}),
    ...body.positions.slice(0, 6).map((p: any) =>
      prisma.featuredProduct.create({ data: { position: p.position, productId: p.productId } })
    ),
  ]);
  const [items, overridesSetting, titleOverridesSetting] = await Promise.all([
    prisma.featuredProduct.findMany({ orderBy: { position: 'asc' }, include: { product: true } }),
    prisma.setting.findUnique({ where: { key: 'featuredImageOverrides' } }).catch(() => null),
    prisma.setting.findUnique({ where: { key: 'featuredTitleOverrides' } }).catch(() => null),
  ]);
  const overrides: Record<string, string> = (overridesSetting?.value as any) || {};
  const titleOverrides: Record<string, string> = (titleOverridesSetting?.value as any) || {};
  const withOverrides = items.map((it: any) => ({
    ...it,
    overrideImageUrl: overrides[String(it.position)] || null,
    overrideTitle: titleOverrides[String(it.position)] || null,
  }));
  return NextResponse.json(withOverrides);
}


