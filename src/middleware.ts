import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define route permissions for different roles
const routePermissions = {
  // Admin-only routes (full access)
  adminOnly: [
    '/admin/settings',
    '/admin/users',
    '/admin/roles',
    '/admin/content',
    '/admin/analytics',
  ],
  
  // Staff-accessible routes (operational access)
  staffAccessible: [
    '/admin',
    '/admin/products',
    '/admin/categories', 
    '/admin/customers',
    '/admin/appointments',
    '/admin/testimonials',
  ],
  
  // Protected routes that require authentication
  protectedRoutes: [
    '/admin/products/new',
    '/admin/products/[id]/edit',
    '/admin/products/trash',
    '/admin/categories/new',
    '/admin/categories/[id]/edit',
    '/admin/customers/new',
    '/admin/customers/[id]/edit',
    '/admin/appointments/new',
    '/admin/appointments/[id]/edit',
    '/admin/testimonials/new',
    '/admin/testimonials/[id]/edit',
  ]
};

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