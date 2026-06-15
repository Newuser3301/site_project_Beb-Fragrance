import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: 'Ism kamida 2 ta belgidan iborat bo‘lishi kerak.' },
        { status: 400 }
      );
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Yaroqli email kiriting.' }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email bilan foydalanuvchi allaqachon mavjud.' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('[AUTH_REGISTER_POST]', error);
    return NextResponse.json(
      { error: "Ro'yxatdan o'tishda xatolik yuz berdi." },
      { status: 500 }
    );
  }
}
