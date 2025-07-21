// src/app/api/auth/session/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase/admin-config';

// Init the Firebase SDK every time the server comes up
initAdmin();

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('firebase-session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }

  try {
    const decodedToken = await getAuth().verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ isAuthenticated: true, isEmailVerified: decodedToken.email_verified }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }
}
