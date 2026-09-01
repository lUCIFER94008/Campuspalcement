import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected } from '@/lib/mongodb';
import { Placement } from '@/models/Placement';
import { Student } from '@/models/Student';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await connectMongoDB();

    if (!isMongoDBConnected()) {
      return NextResponse.json({ success: true, placements: [] });
    }

    const placements = await Placement.find()
      .populate('studentId')
      .populate('companyId')
      .populate('jobId')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, placements });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'PLACEMENT_OFFICER' && session.role !== 'ADMIN' && session.role !== 'RECRUITER')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { studentId, companyId, jobId, package: pkg, joiningDate } = body;

    if (!studentId || !companyId || !jobId || !pkg) {
      return NextResponse.json({ success: false, message: 'Missing placement details' }, { status: 400 });
    }

    await connectMongoDB();

    const placement = await Placement.create({
      studentId,
      companyId,
      jobId,
      package: pkg,
      packageNum: parseFloat(pkg) || 10.0,
      joiningDate,
      status: 'ACCEPTED',
    });

    // Update student status to Placed
    await Student.findByIdAndUpdate(studentId, { placementStatus: 'Placed' });

    return NextResponse.json({ success: true, message: 'Placement recorded successfully', placement });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error' }, { status: 500 });
  }
}
