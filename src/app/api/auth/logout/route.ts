// src/app/api/auth/logout/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const options = {
    name: 'firebase-session',
    value: '',
    maxAge: -1,
  };

  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set(options);

  return response;
}
