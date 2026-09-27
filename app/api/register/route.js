import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 });
  }

  const name = String(body?.name || '').trim();
  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');

  if (!name) return NextResponse.json({ error: 'กรุณากรอกชื่อ' }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'รูปแบบอีเมลไม่ถูกต้อง' }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const hint = existing.passwordHash ? '' : ' (บัญชีนี้สมัครผ่าน Google — ลองเข้าสู่ระบบด้วย Google)';
    return NextResponse.json({ error: 'อีเมลนี้ถูกใช้แล้ว' + hint }, { status: 409 });
  }

  // Role is never taken from the request — everyone registers as USER.
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, passwordHash } });

  return NextResponse.json({ ok: true }, { status: 201 });
}
