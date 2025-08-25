import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const items = await prisma.collectionMeta.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(items);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  // body: { name: string, coverImageUrl?: string, description?: string }
  const saved = await prisma.collectionMeta.upsert({
    where: { name: body.name },
    update: { coverImageUrl: body.coverImageUrl, description: body.description },
    create: { name: body.name, coverImageUrl: body.coverImageUrl, description: body.description },
  });
  return NextResponse.json(saved);
}


