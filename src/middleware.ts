
import { NextResponse, type NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase/admin-config';

async function verifySessionCookie(sessionCookie: string | undefined) {
  if (!sessionCookie) return null;
  
  try {
    await initAdmin();
    return await getAuth().verifySessionCookie(sessionCookie, true);
  } catch (error) {
    // Session cookie is invalid.
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('firebase-session')?.value;
  const decodedToken = await verifySessionCookie(sessionCookie);
  const isAuthenticated = !!decodedToken;
  const isEmailVerified = decodedToken?.email_verified || false;

  const { pathname } = request.nextUrl;

  const authRoutes = ['/login', '/signup'];
  const publicRoutes = ['/', ...authRoutes];
  const verificationRoute = '/verify-email';
  const onboardingRoute = '/onboarding/create-profile';
  
  // If user is authenticated
  if (isAuthenticated) {
    // Redirect away from auth pages if logged in
    if (authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If email is not verified, redirect to verification page
    // Allow access to verification page itself
    if (!isEmailVerified && pathname !== verificationRoute) {
      return NextResponse.redirect(new URL(verificationRoute, request.url));
    }
    
    // If email is verified, but user is on verification page, redirect to dashboard
    if (isEmailVerified && pathname === verificationRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow access to onboarding if email is verified
    if (isEmailVerified && pathname === onboardingRoute) {
        return NextResponse.next();
    }
  } 
  // If user is not authenticated
  else {
    // Protect all routes except public ones
    if (!publicRoutes.includes(pathname)) {
       return NextResponse.redirect(new URL('/login', request.url));
    }
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
