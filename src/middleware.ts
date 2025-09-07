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
  
  // For admin routes, we need to check user roles
  // This requires a more complex check that we'll handle in the layout
  // For now, we'll let authenticated users access admin routes
  // and handle role-based access in the components
  
  // If user is logged in and tries to access login/register, redirect to admin dashboard
  if (sessionToken && (pathname === '/auth/login' || pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/admin', request.url));
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