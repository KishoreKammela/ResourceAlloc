// src/app/api/auth/login/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase/admin-config';

// Init the Firebase SDK every time the server comes up
initAdmin();

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
  }

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });
    const options = {
      name: 'firebase-session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    };

    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set(options);

    return response;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ error: 'Failed to create session cookie' }, { status: 401 });
  }
}
