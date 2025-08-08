import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const preferredRegion = 'cdg1';

export async function GET() {
  return NextResponse.json({ ok: true });
}


