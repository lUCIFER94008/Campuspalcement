import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected } from '@/lib/mongodb';
import { Notification } from '@/models/Notification';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();

    if (!isMongoDBConnected()) {
      return NextResponse.json({ success: true, notifications: [] });
    }

    const notifications = await Notification.find({ userId: session.id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, notifications });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error' }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();

    await Notification.updateMany({ userId: session.id, read: false }, { read: true });
    return NextResponse.json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error' }, { status: 500 });
  }
}
