import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ruxsat etilmagan.' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error('[API_USER_ADDRESSES_GET]', error);
    return NextResponse.json({ error: 'Manzillarni yuklashda xatolik.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ruxsat etilmagan.' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, street, city, state, postalCode, country, label, isDefault } = body;

    if (!firstName || !lastName || !phone || !street || !city || !postalCode) {
      return NextResponse.json({ error: 'Majburiy maydonlarni to‘ldiring.' }, { status: 400 });
    }

    // If this address is set as default, unset previous default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        state: state ? state.trim() : null,
        postalCode: postalCode.trim(),
        country: country ? country.trim() : 'UZ',
        label: label ? label.trim() : null,
        isDefault: !!isDefault,
      },
    });

    return NextResponse.json({ address });
  } catch (error) {
    console.error('[API_USER_ADDRESSES_POST]', error);
    return NextResponse.json({ error: 'Manzil yaratishda xatolik yuz berdi.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ruxsat etilmagan.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID talab qilinadi.' }, { status: 400 });
    }

    // Verify address belongs to the user
    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address || address.userId !== session.user.id) {
      return NextResponse.json({ error: 'Manzil topilmadi.' }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API_USER_ADDRESSES_DELETE]', error);
    return NextResponse.json({ error: 'Manzilni o‘chirishda xatolik yuz berdi.' }, { status: 500 });
  }
}
