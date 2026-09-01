import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  response.cookies.delete('campushire_token');
  return response;
}

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, user: null },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: session,
  });
}
