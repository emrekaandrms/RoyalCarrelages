import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { key: string } }
) {
  const { key } = params;
  const setting = await prisma.setting.findUnique({ where: { key } }).catch(() => null);
  if (!setting) {
    return NextResponse.json({ value: null }, { status: 200 });
  }
  return NextResponse.json({ value: setting.value }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: { key: string } }) {
  const { key } = params;
  const body = await request.json().catch(() => ({}));
  if (typeof body.value === 'undefined') {
    return NextResponse.json({ error: 'Missing value' }, { status: 400 });
  }
  const saved = await prisma.setting.upsert({
    where: { key },
    update: { value: body.value },
    create: { key, value: body.value },
  });
  return NextResponse.json({ value: saved.value }, { status: 200 });
}
