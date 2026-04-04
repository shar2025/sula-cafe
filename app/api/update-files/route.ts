import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export async function POST(req: NextRequest) {
  const { files } = await req.json();
  const base = process.cwd();
  for (const file of files) {
    const fullPath = join(base, file.path);
    const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
    mkdirSync(dir, { recursive: true });
    writeFileSync(fullPath, file.content, 'utf8');
  }
  return NextResponse.json({ ok: true });
}
