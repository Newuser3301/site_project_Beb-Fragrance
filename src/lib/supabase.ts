import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables');
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment variables');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

const supabaseAdmin: SupabaseClient = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export class SupabaseStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SupabaseStorageError';
  }
}

function validateImageFile(
  buffer: Buffer,
  path: string,
  contentType?: string
): void {
  if (buffer.length > MAX_FILE_SIZE) {
    throw new SupabaseStorageError(
      `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    );
  }

  const extension = path.substring(path.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
    throw new SupabaseStorageError(
      `Invalid file extension. Allowed: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`
    );
  }

  if (contentType && !ALLOWED_IMAGE_TYPES.includes(contentType)) {
    throw new SupabaseStorageError(
      `Invalid content type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`
    );
  }
}

export async function uploadImage(
  fileBuffer: Buffer,
  bucketName: string,
  path: string,
  contentType?: string
): Promise<string> {
  try {
    validateImageFile(fileBuffer, path, contentType);

    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(path, fileBuffer, {
        contentType: contentType || 'image/jpeg',
        upsert: true,
        cacheControl: '3600',
      });

    if (error) {
      throw new SupabaseStorageError(`Failed to upload image: ${error.message}`);
    }

    if (!data?.path) {
      throw new SupabaseStorageError('Upload succeeded but no path was returned');
    }

    return getPublicUrl(bucketName, data.path);
  } catch (error) {
    if (error instanceof SupabaseStorageError) {
      throw error;
    }
    throw new SupabaseStorageError(
      `Unexpected error during image upload: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function deleteImage(
  bucketName: string,
  path: string
): Promise<void> {
  try {
    const { error } = await supabaseAdmin.storage.from(bucketName).remove([path]);

    if (error) {
      throw new SupabaseStorageError(`Failed to delete image: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof SupabaseStorageError) {
      throw error;
    }
    throw new SupabaseStorageError(
      `Unexpected error during image deletion: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export function getPublicUrl(bucketName: string, path: string): string {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);

  if (!data?.publicUrl) {
    throw new SupabaseStorageError('Failed to generate public URL');
  }

  return data.publicUrl;
}
