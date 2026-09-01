import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected, getSafeDiagnosticError } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Student } from '@/models/Student';
import { Company } from '@/models/Company';
import { verifyPassword, signJWT } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      await connectMongoDB();
    } catch (dbErr: any) {
      const safeDiagnostic = getSafeDiagnosticError(dbErr);
      return NextResponse.json(
        { success: false, message: safeDiagnostic },
        { status: 503 }
      );
    }

    if (isMongoDBConnected()) {
      const user = await User.findOne({ email: cleanEmail });

      if (user) {
        const hashToCompare = user.passwordHash || (user as any).password || '';
        const isMatch = await verifyPassword(password, hashToCompare);

        if (isMatch) {
          let studentId;
          let companyId;

          if (user.role === 'STUDENT') {
            const student = await Student.findOne({ userId: user._id });
            studentId = student?._id?.toString();
          } else if (user.role === 'RECRUITER') {
            const company = await Company.findOne({ userId: user._id });
            companyId = company?._id?.toString();
          }

          const token = await signJWT({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            studentId,
            companyId,
          });

          const response = NextResponse.json({
            success: true,
            message: 'Logged in successfully',
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              avatar: user.avatar,
            },
          });

          response.cookies.set('campushire_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
          });

          return response;
        }
      }
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
