import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

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
    console.error('POST /api/products error:', err);
    // Prisma unique constraint violation (slug)
    const message = (err as any)?.message || 'Internal Server Error';
    if (typeof (err as any)?.code === 'string' && (err as any).code === 'P2002') {
      return NextResponse.json({ error: 'Slug déjà utilisé' }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
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

    // Her dosyayı yerelde kaydet ve yolları topla (upload API'ye ihtiyaç yok)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const uploaded: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Type de fichier invalide' }, { status: 400 });
      }
      if (file.size > maxSize) {
        return NextResponse.json({ error: 'Taille du fichier dépasse 10MB' }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileExtension = path.extname(file.name) || '.jpg';
      const uniqueFilename = `${Date.now()}_${crypto.randomBytes(8).toString('hex')}${fileExtension}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      await writeFile(filePath, buffer);
      uploaded.push(path.posix.join('uploads', uniqueFilename));
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
  } catch (err: any) {
    console.error('POST /api/products error:', err);
    if (typeof err?.code === 'string' && err.code === 'P2002') {
      return NextResponse.json({ error: 'Slug déjà utilisé' }, { status: 409 });
    }
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
} 