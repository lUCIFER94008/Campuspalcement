import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected } from '@/lib/mongodb';
import { Notification } from '@/models/Notification';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();

    const notif = await Notification.findOneAndUpdate(
      { _id: params.id, userId: session.id },
      { read: true },
      { new: true }
    );

    return NextResponse.json({ success: true, notification: notif });
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

    await Notification.deleteOne({ _id: params.id, userId: session.id });
    return NextResponse.json({ success: true, message: 'Notification deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error' }, { status: 500 });
  }
}
