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
    const q = (searchParams.get('q') || '').trim();
    
    const skip = (page - 1) * limit;
    
    const where = q
      ? {
          OR: [
            { koleksiyonu: { contains: q, mode: 'insensitive' } },
            { renk: { contains: q, mode: 'insensitive' } },
            { olcusu: { contains: q, mode: 'insensitive' } },
            { slug: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { koleksiyonu: 'asc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
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
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      // JSON body desteği (geri uyumluluk)
      const data = await request.json();
      const { koleksiyonu, olcusu, renk, finish, imagePath, slug } = data;
      if (!koleksiyonu || !olcusu || !renk || !imagePath || !slug) {
        return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
      }
      const product = await prisma.product.create({
        data: { koleksiyonu, olcusu, renk, finish: finish ?? null, imagePath, slug },
      });
      return NextResponse.json(product, { status: 201 });
    }

    // multipart/form-data ile çoklu dosya yükleme
    const form = await request.formData();
    const koleksiyonu = String(form.get('koleksiyonu') || '');
    const olcusu = String(form.get('olcusu') || '');
    const renk = String(form.get('renk') || '');
    const finish = form.get('finish') ? String(form.get('finish')) : null;
    const slug = String(form.get('slug') || '');

    if (!koleksiyonu || !olcusu || !renk || !slug) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    // files[] alanını topla
    const files: File[] = [];
    const maybeFiles = form.getAll('files');
    for (const f of maybeFiles) {
      if (f instanceof File) files.push(f);
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Her dosyayı /api/upload ile kaydet ve yolları topla
    const uploaded: string[] = [];
    for (const f of files) {
      const fd = new FormData();
      fd.append('file', f);
      const res = await fetch(new URL('/api/upload', request.url), {
        method: 'POST',
        body: fd,
        headers: { authorization: request.headers.get('authorization') || '' },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({} as any));
        return NextResponse.json({ error: j?.error || 'Erreur de téléchargement' }, { status: 500 });
      }
      const { url } = await res.json();
      uploaded.push(url.startsWith('/') ? url.slice(1) : url);
    }

    // Ana görsel olarak ilkini imagePath’e yaz, diğerlerini ProductImage olarak kaydet
    const product = await prisma.product.create({
      data: {
        koleksiyonu,
        olcusu,
        renk,
        finish,
        imagePath: uploaded[0],
        slug,
        images: {
          create: uploaded.map((p, idx) => ({ imagePath: p, order: idx })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 