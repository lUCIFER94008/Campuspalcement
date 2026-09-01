import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected } from '@/lib/mongodb';
import { Student } from '@/models/Student';
import { Company } from '@/models/Company';
import { Job } from '@/models/Job';
import { Application } from '@/models/Application';
import { Interview } from '@/models/Interview';
import { Placement } from '@/models/Placement';

export async function GET() {
  try {
    await connectMongoDB();

    if (!isMongoDBConnected()) {
      return NextResponse.json({
        success: true,
        data: {
          totalStudents: 0,
          totalCompanies: 0,
          totalJobs: 0,
          totalApplications: 0,
          totalInterviews: 0,
          totalPlacements: 0,
          placementRate: '0%',
          departmentPlacements: [],
          salaryDistribution: [],
          statusDistribution: [],
        },
      });
    }

    const totalStudents = await Student.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    const totalPlacements = await Placement.countDocuments();
    const placedStudents = await Student.countDocuments({ placementStatus: 'Placed' });

    const placementRate = totalStudents > 0 ? `${((placedStudents / totalStudents) * 100).toFixed(1)}%` : '0%';

    const departments = ['CSE', 'IT', 'ECE', 'MECH', 'EEE'];
    const departmentPlacements = [];

    for (const dept of departments) {
      const deptTotal = await Student.countDocuments({ department: dept });
      const deptPlaced = await Student.countDocuments({ department: dept, placementStatus: 'Placed' });
      departmentPlacements.push({
        department: dept,
        total: deptTotal,
        placed: deptPlaced,
        rate: deptTotal > 0 ? parseFloat(((deptPlaced / deptTotal) * 100).toFixed(1)) : 0,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalCompanies,
        totalJobs,
        totalApplications,
        totalInterviews,
        totalPlacements,
        placementRate,
        departmentPlacements,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Analytics fetch failed' }, { status: 500 });
  }
}
