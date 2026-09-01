import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Interview } from '@/models/Interview';
import { Application } from '@/models/Application';
import { Student } from '@/models/Student';
import { Job } from '@/models/Job';
import { Notification } from '@/models/Notification';
import { getSession } from '@/lib/auth';

export async function GET() {
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
          return NextResponse.json({ success: true, interviews: [] });
        }
      } else if (session.role === 'RECRUITER') {
        // Query jobs created by recruiter / company
        const recruiterJobs = await Job.find({ recruiterId: session.id }).select('_id');
        const jobIds = recruiterJobs.map((j) => j._id);
        query.jobId = { $in: jobIds };
      }

      const interviews = await Interview.find(query)
        .populate('jobId')
        .populate('studentId')
        .populate('companyId')
        .populate('applicationId')
        .sort({ date: 1, time: 1 });

      return NextResponse.json({ success: true, interviews });
    } catch (e) {
      console.warn('DB query failed for interviews GET', e);
    }

    return NextResponse.json({ success: true, interviews: [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'RECRUITER' && session.role !== 'ADMIN')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { applicationId, studentId, jobId, companyId, roundName, date, startTime, endTime, time, mode, venueOrLink } = body;

    if (!applicationId || !studentId || !jobId) {
      return NextResponse.json({ success: false, message: 'Missing required interview parameters' }, { status: 400 });
    }

    await connectDB();

    const formattedTime = time || (startTime && endTime ? `${startTime} - ${endTime}` : startTime || '10:00 AM IST');

    const interview = await Interview.create({
      applicationId,
      studentId,
      jobId,
      companyId,
      roundName: roundName || 'Technical Interview',
      date: date || new Date().toISOString().split('T')[0],
      time: formattedTime,
      startTime: startTime || '10:00 AM',
      endTime: endTime || '11:00 AM',
      mode: mode || 'ONLINE',
      venueOrLink: venueOrLink || '',
      status: 'SCHEDULED',
    });

    // Update Application status to INTERVIEW
    await Application.findByIdAndUpdate(applicationId, { status: 'INTERVIEW' });

    // Fetch Job & Student for notification message
    const [jobDoc, studentDoc] = await Promise.all([
      Job.findById(jobId),
      Student.findById(studentId),
    ]);

    if (studentDoc) {
      const companyTitle = jobDoc?.companyName || 'Corporate';
      const roleTitle = jobDoc?.title || 'Position';

      await Notification.create({
        userId: studentDoc.userId,
        title: 'Interview Scheduled!',
        message: `Your ${roundName || 'Technical'} interview for ${roleTitle} at ${companyTitle} has been scheduled for ${date} (${formattedTime}). Mode: ${mode || 'ONLINE'}.`,
        type: 'INTERVIEW',
        read: false,
        relatedId: interview._id.toString(),
      });
    }

    return NextResponse.json({ success: true, message: 'Interview scheduled successfully!', interview });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Scheduling failed' }, { status: 500 });
  }
}
