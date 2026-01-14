import { decode } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
// import { Redis } from '@upstash/redis';

const protectedRoutes = ['/users'];
const publicRoutes = ['/login'];

// Todo implement logic check user in-active

// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN,
// });

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isHome = pathname === '/';

  const isProtectedRoute =
    isHome ||
    protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
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

    // Todo implement logic check user in-active
    // const isBanned = await redis.get(`banned:${decoded.sub}`);
    // if (isBanned) {
    //   return NextResponse.redirect(new URL('/login', req.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
