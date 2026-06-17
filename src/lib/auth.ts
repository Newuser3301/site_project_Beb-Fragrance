import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { UserRole } from '@prisma/client';
import { isMockModeEnabled, logFallbackOnce } from '@/lib/app-mode';
import { prisma } from '@/lib/prisma';

const authUsesDatabase = !isMockModeEnabled();
const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

if (process.env.NODE_ENV === 'production' && !authSecret) {
  throw new Error(
    'Missing auth secret. Set AUTH_SECRET or NEXTAUTH_SECRET in production.'
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: authUsesDatabase ? PrismaAdapter(prisma) : undefined,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!authUsesDatabase) {
          return null;
        }

        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString();

        if (!email || !password) {
          return null;
        }

        try {
          const { verifyPassword } = await import('@/lib/password');
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user?.password) {
            return null;
          }

          const isValidPassword = await verifyPassword(password, user.password);
          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          logFallbackOnce(
            'auth.credentials',
            'Credentials authorization failed.',
            error
          );
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: authSecret,
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = (user?.id ?? token.id ?? token.sub) as string;
        session.user.role =
          ((user?.role ?? token.role) as UserRole | undefined) ?? 'CUSTOMER';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user.role as UserRole | undefined) ?? 'CUSTOMER';
      }

      if (authUsesDatabase && (!token.id || !token.role)) {
        try {
          const dbUser = token.email
            ? await prisma.user.findUnique({
                where: { email: token.email },
                select: { id: true, role: true },
              })
            : token.sub
              ? await prisma.user.findUnique({
                  where: { id: token.sub },
                  select: { id: true, role: true },
                })
              : null;

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          }
        } catch (error) {
          logFallbackOnce(
            'auth.jwt',
            'Failed to enrich JWT token with database role.',
            error
          );
        }
      }

      return token;
    },
  },
  events: {
    async createUser({ user }) {
      if (!authUsesDatabase) {
        return;
      }

      if (user.email === 'admin@bebfragrance.com') {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: 'ADMIN' },
          });
        } catch (error) {
          logFallbackOnce(
            'auth.createUser',
            'Failed to assign admin role during user creation.',
            error
          );
        }
      }
    },
  },
});
