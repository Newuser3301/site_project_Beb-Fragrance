import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { reviewSchema } from '@/lib/validations';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(20, Math.max(1, Number(searchParams.get('limit') ?? 5)));
    const skip = (page - 1) * limit;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
        isActive: true,
      },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Mahsulot topilmadi' },
        { status: 404 }
      );
    }

    const where = {
      productId: product.id,
      isApproved: true,
    };

    const [reviews, total, aggregate] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    const ratingDistribution = await Promise.all(
      [5, 4, 3, 2, 1].map(async (rating) => {
        const count = await prisma.review.count({
          where: { ...where, rating },
        });
        return { rating, count };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      items: reviews,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
      averageRating: aggregate._avg.rating
        ? Math.round(aggregate._avg.rating * 10) / 10
        : 0,
      reviewCount: aggregate._count.rating,
      distribution: ratingDistribution.map((item) => ({
        rating: item.rating,
        count: item.count,
        percentage:
          total > 0 ? Math.round((item.count / total) * 100) : 0,
      })),
    });
  } catch (error) {
    console.error(`GET /api/products/${params.id}/reviews error:`, error);
    return NextResponse.json(
      { error: 'Sharhlarni yuklashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Avtorizatsiya talab qilinadi' },
        { status: 401 }
      );
    }

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
        isActive: true,
      },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Mahsulot topilmadi' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parseResult = reviewSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validatsiya xatosi',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product.id,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'Siz allaqachon sharh qoldirgansiz' },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        rating: parseResult.data.rating,
        comment: parseResult.data.comment,
        title:
          parseResult.data.rating >= 4
            ? 'Great fragrance!'
            : 'Good product',
        isVerified: true,
        isApproved: true,
        userId: session.user.id,
        productId: product.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error(`POST /api/products/${params.id}/reviews error:`, error);
    return NextResponse.json(
      { error: 'Sharh yuborishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
