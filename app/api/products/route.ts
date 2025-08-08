import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const preferredRegion = 'cdg1';

export const dynamic = 'force-dynamic';

// GET /api/products – tüm ürünler (pagination ile)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 10);
    
    const skip = (page - 1) * limit;
    
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        orderBy: { koleksiyonu: 'asc' },
        skip,
        take: limit,
      }),
      prisma.product.count(),
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      products,
      totalPages,
      currentPage: page,
      totalCount,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/products – yeni ürün ekle
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { koleksiyonu, olcusu, renk, finish, imagePath, slug } = data;
    if (!koleksiyonu || !olcusu || !renk || !imagePath || !slug) {
      return NextResponse.json({ error: 'Eksik alan' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        koleksiyonu,
        olcusu,
        renk,
        finish: finish ?? null,
        imagePath,
        slug,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 