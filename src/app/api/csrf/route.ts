import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';


export async function GET(request: NextRequest) {
  try {
    // Lazy import Prisma / services
    const { env } = await import('@/lib/env');
    const token = randomBytes(32).toString('hex');
    
    const response = NextResponse.json({ token });
    
    // Determine if we're in a secure environment (HTTPS)
    const isSecure = request.nextUrl.protocol === 'https:' || process.env.NODE_ENV === 'production';
    
    console.log('CSRF API: Protocol:', request.nextUrl.protocol);
    console.log('CSRF API: NODE_ENV:', process.env.NODE_ENV);
    console.log('CSRF API: isSecure:', isSecure);
    console.log('CSRF API: Setting cookie with secure:', isSecure);
    
    // Set CSRF token in non-httpOnly cookie so client can read it
    response.cookies.set('csrf_token', token, {
      httpOnly: false, // client-side JS must read it for headers
      secure: isSecure, // Only secure in HTTPS/production
      sameSite: 'strict', // stronger CSRF protection than lax
      path: '/', // make it accessible everywhere
      maxAge: 60 * 60 * 24, // 24 hours
    });

    console.log('CSRF API: Cookie set successfully');
    return response;
  } catch (error) {
    console.error('CSRF API: Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
} 
