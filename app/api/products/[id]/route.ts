import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const preferredRegion = 'cdg1';

export const dynamic = 'force-dynamic';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } },
    });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const product = await prisma.product.update({ where: { id }, data });
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
