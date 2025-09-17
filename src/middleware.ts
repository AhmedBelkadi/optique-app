import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session token from cookies
  const sessionToken = request.cookies.get('session_token');
  
  // Check if current path is an admin route
  const isAdminRoute = pathname.startsWith('/admin');
  
  // If it's not an admin route, continue
  if (!isAdminRoute) {
    return NextResponse.next();
  }
  
  // If no session token, redirect to login
  if (!sessionToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If user is logged in and tries to access login/register, redirect to admin dashboard
  if (sessionToken && (pathname === '/auth/login' || pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 