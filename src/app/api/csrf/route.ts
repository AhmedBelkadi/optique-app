import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';


export async function GET(request: NextRequest) {
  try {
    // Lazy import Prisma / services
    const { env } = await import('@/lib/env');
    const token = randomBytes(32).toString('hex');
    
    const response = NextResponse.json({ token });
    
    // Set CSRF token in non-httpOnly cookie so client can read it
	    response.cookies.set('csrf_token', token, {
  httpOnly: false, // client-side JS must read it for headers
  secure: true,    // 🔴 force this on since you now have HTTPS
  sameSite: 'strict', // stronger CSRF protection than lax
	path: '/', // make it accessible everywhere
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
