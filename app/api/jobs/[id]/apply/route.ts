import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected } from '@/lib/mongodb';
import { Job } from '@/models/Job';
import { Student } from '@/models/Student';
import { Application } from '@/models/Application';
import { Notification } from '@/models/Notification';
import { getSession } from '@/lib/auth';
import { checkEligibility } from '@/lib/eligibility';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || (session.role !== 'STUDENT' && session.role !== 'ADMIN' && session.role !== 'PLACEMENT_OFFICER')) {
      return NextResponse.json(
        { success: false, message: 'You must be logged in as a student to apply for jobs.' },
        { status: 401 }
      );
    }

    const jobId = params.id;
    await connectMongoDB();

    if (!isMongoDBConnected()) {
      return NextResponse.json(
        { success: false, message: 'Database is currently offline. Please try again later.' },
        { status: 503 }
      );
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job posting not found' }, { status: 404 });
    }

    const student = await Student.findOne({ userId: session.id });
    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Please complete your student profile before applying for drives.' },
        { status: 400 }
      );
    }

    // SERVER-SIDE ELIGIBILITY ENFORCEMENT
    const eligibility = checkEligibility(
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

    if (!eligibility.isEligible) {
      return NextResponse.json(
        {
          success: false,
          message: 'Server Validation: You are not eligible for this job drive.',
          reasons: eligibility.reasons,
        },
        { status: 403 }
      );
    }

    // Check Duplicate Application via Unique Mongo Index
    const existingApp = await Application.findOne({
      jobId: job._id,
      studentId: student._id,
    });

    if (existingApp) {
      return NextResponse.json(
        { success: false, message: 'You have already applied for this job.' },
        { status: 400 }
      );
    }

    // Determine Recruiter Owner from Job Record
    const recruiterOwnerId = job.recruiterId || job.companyId || (job as any).createdBy;

    // Create Application Document linked to Job & Recruiter Owner
    const application = await Application.create({
      jobId: job._id,
      studentId: student._id,
      recruiterId: recruiterOwnerId,
      companyId: job.companyId,
      resumeUrl: student.resumeUrl || '',
      appliedAt: new Date(),
      status: 'Applied',
      notes: 'Application submitted successfully via CampusHire student portal.',
    });

    // Create Notification Document for Student
    await Notification.create({
      userId: session.id,
      title: 'Application Submitted',
      message: `Your application for ${job.title} at ${job.companyName} was submitted successfully.`,
      type: 'APPLICATION',
      read: false,
      relatedId: application._id.toString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'You have already applied for this job.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || 'Application submission failed' },
      { status: 500 }
    );
  }
}
