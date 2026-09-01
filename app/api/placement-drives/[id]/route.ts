import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected } from '@/lib/mongodb';
import { PlacementDrive } from '@/models/PlacementDrive';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongoDB();

    if (!isMongoDBConnected()) {
      return NextResponse.json({ success: false, message: 'DB Disconnected' }, { status: 503 });
    }

    const drive = await PlacementDrive.findById(params.id);
    if (!drive) {
      return NextResponse.json({ success: false, message: 'Drive not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, drive });
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

    const drive = await PlacementDrive.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ success: true, message: 'Drive updated', drive });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();

    await PlacementDrive.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Drive deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error' }, { status: 500 });
  }
}
