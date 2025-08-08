import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const preferredRegion = 'cdg1';

export const dynamic = 'force-dynamic';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_: Request, { params }: Params) {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const data = await request.json();
    const product = await prisma.product.update({ where: { id: params.id }, data });
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 