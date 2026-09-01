import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected } from '@/lib/mongodb';
import { Job } from '@/models/Job';
import { Student } from '@/models/Student';
import { Application } from '@/models/Application';
import { getSession } from '@/lib/auth';
import { checkEligibility } from '@/lib/eligibility';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    const session = await getSession();

    await connectMongoDB();

    if (!isMongoDBConnected()) {
      return NextResponse.json({ success: false, message: 'DB Disconnected' }, { status: 503 });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job opportunity not found' }, { status: 404 });
    }

    let eligibility = null;
    let hasApplied = false;
    let applicationStatus = null;

    if (session && session.role === 'STUDENT') {
      const student = await Student.findOne({ userId: session.id });
      if (student) {
        const app = await Application.findOne({ jobId: job._id, studentId: student._id });
        if (app) {
          hasApplied = true;
          applicationStatus = app.status;
        }

        eligibility = checkEligibility(
          {
            cgpa: student.cgpa || 0,
            backlogs: student.backlogs || 0,
            department: student.department || '',
            batch: student.batch || '',
          },
          {
            minCgpa: job.minCgpa,
            maxBacklogs: job.maxBacklogs,
            eligibleDepartments: job.eligibleDepartments || [],
            eligibleBatches: (job as any).eligibleBatches || [],
          }
        );
      }
    }

    return NextResponse.json({
      success: true,
      job,
      eligibility,
      hasApplied,
      applicationStatus,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error fetching job' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'RECRUITER' && session.role !== 'ADMIN' && session.role !== 'PLACEMENT_OFFICER')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();

    await connectMongoDB();

    const updatedJob = await Job.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedJob) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Job updated successfully', job: updatedJob });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'RECRUITER' && session.role !== 'ADMIN' && session.role !== 'PLACEMENT_OFFICER')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    await connectMongoDB();

    await Job.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Delete failed' }, { status: 500 });
  }
}
