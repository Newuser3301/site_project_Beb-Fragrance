// src/app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

async function isAdmin() {
  const session = await auth();
  return (
    session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  );
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const contentType = req.headers.get('content-type') ?? '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Request must be multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed. Accepted: JPG, PNG, WEBP` },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File is too large. Maximum size is 5MB` },
        { status: 400 }
      );
    }

    // Try Supabase Storage upload
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      // Upload via Supabase Storage REST API
      const ext = file.name.split('.').pop() ?? 'jpg';
      const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const buffer = await file.arrayBuffer();

      const uploadResponse = await fetch(
        `${supabaseUrl}/storage/v1/object/product-images/${fileName}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': file.type,
          },
          body: buffer,
        }
      );

      if (!uploadResponse.ok) {
        const err = await uploadResponse.json().catch(() => ({}));
        throw new Error(err.message ?? 'Supabase upload failed');
      }

      // Get public URL
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${fileName}`;

      return NextResponse.json({
        url: publicUrl,
        message: 'File uploaded successfully',
      });
    }

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error:
            'Image storage is not configured. Add Supabase storage environment variables before uploading product images.',
        },
        { status: 503 }
      );
    }

    console.warn('[UPLOAD] Supabase not configured, using placeholder URL');

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      message: 'File uploaded (development preview only)',
    });
  } catch (error) {
    console.error('[POST /api/admin/upload]', error);
    const message =
      error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
