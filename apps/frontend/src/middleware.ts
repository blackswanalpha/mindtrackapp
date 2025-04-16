import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(_request: NextRequest) {
  // AUTHENTICATION DISABLED - All routes are public
  return NextResponse.next();
}

// This function is no longer used but kept for reference
// All routes are now public
/*
function isProtectedRoute(pathname: string): boolean {
  return false;
}
*/

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
