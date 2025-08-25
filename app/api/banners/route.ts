import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const banners = await prisma.banner.findMany({ orderBy: [{ position: 'asc' }, { order: 'asc' }] });
  return NextResponse.json(banners);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const created = await prisma.banner.create({ data });
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const { id, ...rest } = data;
  const updated = await prisma.banner.update({ where: { id }, data: rest });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.banner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


