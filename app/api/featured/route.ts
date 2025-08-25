import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const items = await prisma.featuredProduct.findMany({
    orderBy: { position: 'asc' },
    include: { product: true },
  });
  return NextResponse.json(items);
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
  const items = await prisma.featuredProduct.findMany({ orderBy: { position: 'asc' }, include: { product: true } });
  return NextResponse.json(items);
}


