import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected } from '@/lib/mongodb';
import { PlacementDrive } from '@/models/PlacementDrive';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await connectMongoDB();

    if (!isMongoDBConnected()) {
      return NextResponse.json({ success: true, drives: [] });
    }

    const drives = await PlacementDrive.find().sort({ driveDate: 1 });
    return NextResponse.json({ success: true, drives });
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
    const { title, companyId, jobId, driveDate, registrationDeadline, venue, description, eligibilityCriteria } = body;

    if (!title || !companyId || !driveDate || !description) {
      return NextResponse.json({ success: false, message: 'Missing required placement drive fields' }, { status: 400 });
    }

    await connectMongoDB();

    const drive = await PlacementDrive.create({
      title,
      companyId,
      jobId,
      driveDate,
      registrationDeadline,
      venue: venue || 'Main Auditorium',
      description,
      eligibilityCriteria: eligibilityCriteria || '',
      status: 'UPCOMING',
      createdBy: session.id,
    });

    return NextResponse.json({ success: true, message: 'Placement drive scheduled successfully', drive });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Drive creation failed' }, { status: 500 });
  }
}
