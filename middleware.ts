import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isStudentRoute = pathname.startsWith('/student');
  const isRecruiterRoute = pathname.startsWith('/recruiter');
  const isAdminRoute = pathname.startsWith('/admin');

  if (!isStudentRoute && !isRecruiterRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get('campushire_token')?.value;

  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  if (isStudentRoute && payload.role !== 'STUDENT' && payload.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isRecruiterRoute && payload.role !== 'RECRUITER' && payload.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminRoute && payload.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/recruiter/:path*', '/admin/:path*'],
};
