import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { Company } from '@/models/Company';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const department = searchParams.get('department') || '';
    const jobType = searchParams.get('jobType') || '';
    const workMode = searchParams.get('workMode') || '';

    try {
      await connectDB();
      let query: any = { status: 'ACTIVE' };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { skills: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      if (department && department !== 'ALL') {
        query.eligibleDepartments = { $in: [department, 'ALL'] };
      }

      if (jobType) query.jobType = jobType;
      if (workMode) query.workMode = workMode;

      const jobs = await Job.find(query).sort({ createdAt: -1 });

      return NextResponse.json({ success: true, jobs });
    } catch (e) {
      console.warn('DB query failed for jobs GET', e);
    }

    return NextResponse.json({ success: true, jobs: [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'RECRUITER' && session.role !== 'ADMIN')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      responsibilities,
      skills,
      salary,
      location,
      jobType,
      workMode,
      minCgpa,
      maxBacklogs,
      eligibleDepartments,
      eligibleBatches,
      deadline,
    } = body;

    if (!title || !description || !salary || !location) {
      return NextResponse.json({ success: false, message: 'Please fill in all mandatory fields' }, { status: 400 });
    }

    await connectDB();

    let companyName = 'Corporate Partner';
    let companyLogo = '';
    let companyId = session.companyId;

    if (companyId) {
      const company = await Company.findById(companyId);
      if (company) {
        companyName = company.name;
        companyLogo = company.logo || '';
      }
    }

    const newJob = await Job.create({
      title,
      recruiterId: session.id,
      companyId: companyId || session.id,
      companyName,
      companyLogo,
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [responsibilities],
      skills: Array.isArray(skills) ? skills : [skills],
      salary,
      salaryNum: parseFloat(salary) || 10.0,
      location,
      jobType: jobType || 'FULL_TIME',
      workMode: workMode || 'ON_SITE',
      minCgpa: Number(minCgpa) || 6.0,
      maxBacklogs: Number(maxBacklogs) || 0,
      eligibleDepartments: eligibleDepartments || ['CSE', 'IT', 'ECE'],
      eligibleBatches: eligibleBatches || ['2026'],
      deadline: deadline || '2026-10-30',
      status: 'ACTIVE',
    });

    return NextResponse.json({
      success: true,
      message: 'Job posted successfully!',
      job: newJob,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Job creation failed' }, { status: 500 });
  }
}
