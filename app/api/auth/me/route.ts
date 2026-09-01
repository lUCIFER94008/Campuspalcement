import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectMongoDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Student } from '@/models/Student';
import { Company } from '@/models/Company';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    let extraData: any = {};

    try {
      await connectMongoDB();
      const user = await User.findById(session.id).select('-passwordHash');
      
      if (user) {
        if (user.role === 'STUDENT') {
          const student = await Student.findOne({ userId: user._id });
          if (student) extraData.studentId = student._id;
        } else if (user.role === 'RECRUITER') {
          const company = await Company.findOne({ userId: user._id });
          if (company) extraData.companyId = company._id;
        }

        return NextResponse.json({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            ...extraData,
          },
        });
      }
    } catch (e) {
      console.warn('DB query failed for auth/me GET', e);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Auth check error' }, { status: 500 });
  }
}
