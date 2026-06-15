import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { auth } from '@/lib/auth';

const f = createUploadthing();

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'] as const;

export const uploadRouter = {
  adminImageUploader: f({
    image: {
      maxFileCount: 5,
      maxFileSize: '4MB',
    },
  })
    .middleware(async () => {
      const session = await auth();
      const role = session?.user?.role;

      if (!role || !ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) {
        throw new UploadThingError('Unauthorized');
      }

      return {
        uploadedBy: session.user.id,
        role,
      };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      return {
        uploadedBy: metadata.uploadedBy,
        role: metadata.role,
        name: file.name,
        url: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
