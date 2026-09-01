import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected } from '@/lib/mongodb';
import { Resume } from '@/models/Resume';
import { Student } from '@/models/Student';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();

    if (!isMongoDBConnected()) {
      return NextResponse.json({ success: true, resume: null });
    }

    const student = await Student.findOne({ userId: session.id });
    if (!student) {
      return NextResponse.json({ success: true, resume: null });
    }

    // Filter STRICTLY by current authenticated student's ID
    const resume = await Resume.findOne({ studentId: student._id });

    return NextResponse.json({
      success: true,
      resume: resume || null,
      studentName: student.name,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error fetching resume' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileUrl, fileSize, strengthScore, suggestions, skills } = body;

    await connectMongoDB();

    const student = await Student.findOne({ userId: session.id });
    if (!student) {
      return NextResponse.json({ success: false, message: 'Student profile not found' }, { status: 404 });
    }

    const resume = await Resume.findOneAndUpdate(
      { studentId: student._id },
      {
        studentId: student._id,
        fileName: fileName || `${student.name.replace(/\s+/g, '_')}_Resume.pdf`,
        fileUrl: fileUrl || '/resumes/sample.pdf',
        fileSize: fileSize || '1.2 MB',
        strengthScore: strengthScore || 85,
        suggestions: suggestions || ['Include quantifiable metric achievements in project descriptions.'],
        skills: skills || student.skills || [],
      },
      { upsert: true, new: true }
    );

    // Update student model resumeUrl property
    student.resumeUrl = resume.fileUrl;
    await student.save();

    return NextResponse.json({
      success: true,
      message: 'Resume saved successfully',
      resume,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error saving resume' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();

    const student = await Student.findOne({ userId: session.id });
    if (student) {
      await Resume.deleteOne({ studentId: student._id });
      student.resumeUrl = '';
      await student.save();
    }

    return NextResponse.json({ success: true, message: 'Resume removed' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error removing resume' }, { status: 500 });
  }
}
