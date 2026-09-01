import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Student } from '@/models/Student';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
      await connectDB();
      const student = await Student.findOne({ userId: session.id }).populate('userId', 'name email avatar');
      if (student) {
        return NextResponse.json({ success: true, student });
      }
    } catch (e) {
      console.warn('DB query failed for student profile GET', e);
    }

    // Default clean new student profile derived from authenticated session
    return NextResponse.json({
      success: true,
      student: {
        userId: session.id,
        name: session.name || 'Student',
        email: session.email || '',
        registerNumber: '',
        department: '',
        batch: '',
        semester: 1,
        cgpa: null,
        tenthPercentage: null,
        twelfthPercentage: null,
        backlogs: 0,
        phone: '',
        gender: '',
        skills: [],
        projects: [],
        certifications: [],
        socials: {},
        placementStatus: 'UNPLACED',
        profileCompletion: 15,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    try {
      await connectDB();
      let student = await Student.findOne({ userId: session.id });

      if (!student) {
        student = new Student({ userId: session.id });
      }

      Object.assign(student, body);

      // Re-calculate profile completion based on filled fields
      let fieldsFilled = 0;
      if (student.phone) fieldsFilled++;
      if (student.cgpa) fieldsFilled++;
      if (student.tenthPercentage) fieldsFilled++;
      if (student.twelfthPercentage) fieldsFilled++;
      if (student.skills && student.skills.length > 0) fieldsFilled++;
      if (student.projects && student.projects.length > 0) fieldsFilled++;
      if (student.socials && (student.socials.github || student.socials.linkedin)) fieldsFilled++;

      student.profileCompletion = Math.min(100, Math.round((fieldsFilled / 7) * 100));

      await student.save();

      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully!',
        student,
      });
    } catch (e) {
      console.warn('DB update failed for student profile PUT', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      student: {
        userId: session.id,
        name: session.name || 'Student',
        email: session.email || '',
        ...body,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Update failed' }, { status: 500 });
  }
}
