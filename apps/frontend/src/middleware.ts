import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/register');

  // If trying to access a protected route without being logged in
  if (!token && !isAuthPage && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access login/register while logged in
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Check if the route is protected
function isProtectedRoute(pathname: string): boolean {
  // Public routes that should not be protected
  const publicRoutes = [
    '/questionnaires/respond',
    '/responses/complete',
    '/responses/view',
    '/scan'
  ];

  // Check if the path is a public route
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return false;
  }

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/questionnaires',
    '/responses',
    '/organizations',
    '/users',
    '/analytics',
    '/ai-analysis',
    '/settings',
    '/email',
    '/google-forms'
  ];

  return protectedRoutes.some(route => pathname.startsWith(route));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/questionnaires/:path*',
    '/responses/:path*',
    '/organizations/:path*',
    '/users/:path*',
    '/analytics/:path*',
    '/ai-analysis/:path*',
    '/settings/:path*',
    '/email/:path*',
    '/login',
    '/register',
    '/scan',
  ],
};
