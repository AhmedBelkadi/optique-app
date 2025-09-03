import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { env } from '@/lib/env';

export async function GET(request: NextRequest) {
  try {
    const token = randomBytes(32).toString('hex');
    
    const response = NextResponse.json({ token });
    
    // Set CSRF token in non-httpOnly cookie so client can read it
    response.cookies.set('csrf_token', token, {
      httpOnly: false, // Allow client to read the token
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    
    return response;
  } catch (error) {
    console.error('CSRF API: Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
} 