import { NextRequest, NextResponse } from 'next/server';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    const bytes = await (file as unknown as File).arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    mkdirSync(uploadsDir, { recursive: true });
    const ext = (file as any).name?.split('.').pop() || 'bin';
    const base = (file as any).name?.replace(/[^a-zA-Z0-9_-]/g, '') || 'upload';
    const filename = `${Date.now()}_${base}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    writeFileSync(filepath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (e) {
    console.error('Upload error', e);
    return NextResponse.json({ error: 'upload failed' }, { status: 500 });
  }
}


