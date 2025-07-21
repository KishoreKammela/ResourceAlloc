
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('firebase-session');
  const { pathname } = request.nextUrl;

  const authRoutes = ['/login', '/signup'];
  const publicRoutes = ['/', ...authRoutes];

  // If user is trying to access auth pages but is already logged in, redirect to dashboard
  if (sessionToken && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is trying to access a protected page and is not logged in, redirect to login
  if (!sessionToken && !publicRoutes.includes(pathname) && !pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Allow unauthenticated access to onboarding
  if (!sessionToken && pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
