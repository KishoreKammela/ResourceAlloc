import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get('firebase-session')?.value;

  // Create an absolute URL for the API endpoint
  const sessionApiUrl = new URL('/api/auth/session', request.url);

  // Use fetch to check session status from our API route
  const response = await fetch(sessionApiUrl, {
    headers: {
      Cookie: `firebase-session=${sessionCookie || ''}`,
    },
  });

  const { isAuthenticated } = await response.json();

  const authRoutes = ['/login', '/signup'];
  const publicRoutes = ['/', ...authRoutes];
  const onboardingRoute = '/onboarding/create-profile';

  // If user is authenticated
  if (isAuthenticated) {
    // Redirect away from auth pages if logged in
    if (authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow access to onboarding
    if (pathname === onboardingRoute) {
      return NextResponse.next();
    }
  }
  // If user is not authenticated
  else {
    // Protect all routes except public ones and API routes
    if (!publicRoutes.includes(pathname) && !pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
