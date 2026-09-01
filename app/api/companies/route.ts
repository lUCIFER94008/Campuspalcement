import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected } from '@/lib/mongodb';
import { Company } from '@/models/Company';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await connectMongoDB();

    if (!isMongoDBConnected()) {
      return NextResponse.json({ success: true, companies: [] });
    }

    const companies = await Company.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, companies });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'RECRUITER' && session.role !== 'PLACEMENT_OFFICER' && session.role !== 'ADMIN')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { companyName, logo, description, website, industry, location, companySize, contactPerson, contactEmail } = body;

    if (!companyName) {
      return NextResponse.json({ success: false, message: 'Company name is required' }, { status: 400 });
    }

    await connectMongoDB();

    const company = await Company.create({
      userId: session.id,
      companyName,
      name: companyName,
      logo: logo || '',
      description: description || '',
      website: website || '',
      industry: industry || '',
      location: location || '',
      companySize: companySize || '50-200',
      contactPerson: contactPerson || session.name,
      contactEmail: contactEmail || session.email,
      status: 'APPROVED',
      verified: true,
    });

    return NextResponse.json({ success: true, message: 'Company registered successfully', company });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to register company' }, { status: 500 });
  }
}
