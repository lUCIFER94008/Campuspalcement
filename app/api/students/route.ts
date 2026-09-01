import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected } from '@/lib/mongodb';
import { Student } from '@/models/Student';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const batch = searchParams.get('batch');

    await connectMongoDB();

    if (!isMongoDBConnected()) {
      return NextResponse.json({ success: true, students: [] });
    }

    const query: any = {};
    if (department && department !== 'ALL') query.department = department;
    if (batch) query.batch = batch;

    const students = await Student.find(query).populate('userId', 'name email avatar').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, students });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error fetching students' }, { status: 500 });
  }
}
