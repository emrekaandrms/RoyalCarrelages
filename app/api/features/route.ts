import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const items = await prisma.feature.findMany({ orderBy: { position: 'asc' } });
  return NextResponse.json(items);
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.features)) {
    return NextResponse.json({ error: 'features required' }, { status: 400 });
  }
  // features: [{ position, title, description, icon?, imageUrl? }]
  await prisma.$transaction([
    prisma.feature.deleteMany({}),
    ...body.features.slice(0, 6).map((f: any, idx: number) =>
      prisma.feature.create({
        data: {
          position: f.position ?? idx + 1,
          title: f.title,
          description: f.description,
          icon: f.icon ?? null,
          imageUrl: f.imageUrl ?? null,
        },
      })
    ),
  ]);
  const items = await prisma.feature.findMany({ orderBy: { position: 'asc' } });
  return NextResponse.json(items);
}


