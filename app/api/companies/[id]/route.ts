import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected } from '@/lib/mongodb';
import { Company } from '@/models/Company';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongoDB();

    if (!isMongoDBConnected()) {
      return NextResponse.json({ success: false, message: 'DB Disconnected' }, { status: 503 });
    }

    const company = await Company.findById(params.id);
    if (!company) {
      return NextResponse.json({ success: false, message: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, company });
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

    const company = await Company.findByIdAndUpdate(params.id, body, { new: true });
    if (!company) {
      return NextResponse.json({ success: false, message: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Company details updated', company });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error updating company' }, { status: 500 });
  }
}
