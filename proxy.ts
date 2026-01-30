import { decode } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const protectedRoutes = ['/users'];
const publicRoutes = ['/login'];

type Permission = 'USER_CREATE' | 'USER_UPDATE' | 'USER_DELETE' | 'USER_READ';

interface RedisUser {
  role: 'admin' | 'user' | 'super_admin';
  permissions: Permission[];
  isActive: boolean;
}

const redis = Redis.fromEnv();

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isHome = pathname === '/';

  const isProtectedRoute =
    isHome ||
    protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + '/'),
    );

  const isPublicRoute = publicRoutes.includes(pathname);
  const sessionToken = req.cookies.get('next-auth.session-token')?.value;

  if (isPublicRoute && sessionToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isProtectedRoute) {
    const decoded = sessionToken
      ? await decode({
          token: sessionToken,
          secret: process.env.NEXTAUTH_SECRET as string,
        })
      : null;

    if (!decoded) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const userData = await redis.get<RedisUser>(`user:${decoded.user.id}`);

    if (userData && !userData.isActive) {
      return NextResponse.redirect(new URL('/logout', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
