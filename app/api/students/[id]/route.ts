import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected } from '@/lib/mongodb';
import { Student } from '@/models/Student';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();

    if (!isMongoDBConnected()) {
      return NextResponse.json({ success: false, message: 'DB Disconnected' }, { status: 503 });
    }

    const student = await Student.findById(params.id).populate('userId', 'name email avatar');
    if (!student) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, student });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    await connectMongoDB();

    const student = await Student.findByIdAndUpdate(params.id, body, { new: true });
    if (!student) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Student updated successfully', student });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error updating student' }, { status: 500 });
  }
}
