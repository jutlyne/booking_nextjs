import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login'];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get('token')?.value;

  const isHome = path === '/';

  const isProtectedRoute =
    isHome ||
    protectedRoutes.some(
      (route) => path === route || path.startsWith(route + '/')
    );

  const isPublicRoute = publicRoutes.includes(path);

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
