import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Application } from '@/models/Application';
import { Student } from '@/models/Student';
import { Job } from '@/models/Job';
import { Notification } from '@/models/Notification';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
      await connectDB();
      let query: any = {};

      if (session.role === 'STUDENT') {
        const student = await Student.findOne({ userId: session.id });
        if (student) {
          query.studentId = student._id;
        } else {
          return NextResponse.json({ success: true, applications: [] });
        }
      } else if (session.role === 'RECRUITER') {
        // Find all jobs owned by this recruiter / company
        const recruiterJobs = await Job.find({
          $or: [
            { recruiterId: session.id },
            { companyId: session.companyId || session.id },
          ],
        }).select('_id');

        const jobIds = recruiterJobs.map((j) => j._id);

        // Auto-heal existing applications missing recruiterId
        if (jobIds.length > 0) {
          await Application.updateMany(
            { jobId: { $in: jobIds }, recruiterId: { $exists: false } },
            { $set: { recruiterId: session.id } }
          );
        }

        query.$or = [
          { recruiterId: session.id },
          { companyId: session.companyId || session.id },
          { jobId: { $in: jobIds } },
        ];
      }

      const applications = await Application.find(query)
        .populate('jobId')
        .populate('studentId')
        .populate('companyId')
        .sort({ createdAt: -1 });

      return NextResponse.json({ success: true, applications });
    } catch (e) {
      console.warn('DB query failed for applications GET', e);
      return NextResponse.json(
        { success: false, message: 'Database connection error' },
        { status: 503 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'RECRUITER' && session.role !== 'ADMIN')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { applicationId, status, notes } = body;

    if (!applicationId || !status) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    await connectDB();

    const application = await Application.findById(applicationId).populate('jobId');
    if (application) {
      application.status = status;
      if (notes) application.notes = notes;
      await application.save();

      const student = await Student.findById(application.studentId);
      if (student) {
        if (status === 'SELECTED' || status === 'PLACED') {
          student.placementStatus = 'Placed';
          await student.save();
        }

        const jobTitle = (application.jobId as any)?.title || 'Position';
        const companyName = (application.jobId as any)?.companyName || 'Corporate Recruiter';

        let notifTitle = `Application Status Updated: ${status}`;
        let notifMsg = `Your application status for ${jobTitle} has been updated to ${status}.`;

        if (status === 'SHORTLISTED') {
          notifTitle = 'Application Shortlisted!';
          notifMsg = `Congratulations! Your application for ${jobTitle} at ${companyName} has been shortlisted for upcoming interview rounds.`;
        } else if (status === 'SELECTED' || status === 'PLACED') {
          notifTitle = 'Congratulations! You are Selected!';
          notifMsg = `Great news! You have been officially selected for the position of ${jobTitle} at ${companyName}.`;
        }

        await Notification.create({
          userId: student.userId,
          title: notifTitle,
          message: notifMsg,
          type: status === 'SELECTED' ? 'RESULT' : 'APPLICATION',
          read: false,
          relatedId: application._id.toString(),
        });
      }

      return NextResponse.json({ success: true, message: `Candidate ${status.toLowerCase()} successfully`, application });
    }

    return NextResponse.json({ success: false, message: 'Application record not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Update failed' }, { status: 500 });
  }
}
