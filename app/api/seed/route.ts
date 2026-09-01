import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Student } from '@/models/Student';
import { Company } from '@/models/Company';
import { Job } from '@/models/Job';
import { Application } from '@/models/Application';
import { Interview } from '@/models/Interview';
import { PlacementResult } from '@/models/PlacementResult';
import { Notification } from '@/models/Notification';
import { hashPassword } from '@/lib/auth';
import {
  initialStudents,
  initialCompanies,
  initialJobs,
  initialApplications,
  initialInterviews,
  initialPlacements,
} from '@/lib/mockStore';

export async function POST() {
  try {
    await connectDB();

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@campushire.demo' });

    if (!adminExists) {
      const defaultPassword = await hashPassword('Admin@123456');
      const studentPassword = await hashPassword('Student@123456');
      const recruiterPassword = await hashPassword('Recruiter@123456');

      // Create Admin
      const adminUser = await User.create({
        name: 'Dr. Rajesh Sharma (Placement Officer)',
        email: 'admin@campushire.demo',
        password: defaultPassword,
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      });

      // Create Student
      const studentUser = await User.create({
        name: 'John Doe',
        email: 'student@campushire.demo',
        password: studentPassword,
        role: 'STUDENT',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      });

      // Create Recruiter
      const recruiterUser = await User.create({
        name: 'Sarah Jenkins',
        email: 'recruiter@campushire.demo',
        password: recruiterPassword,
        role: 'RECRUITER',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      });

      // Create Companies
      const createdCompanies = await Company.insertMany(
        initialCompanies.map((c) => ({
          name: c.name,
          logo: c.logo,
          industry: c.industry,
          website: c.website,
          description: c.description,
          location: c.location,
          companySize: c.companySize,
          contactPerson: c.contactPerson,
          contactEmail: c.contactEmail,
          status: c.status,
        }))
      );

      const msftCompany = createdCompanies.find((c) => c.name.includes('Microsoft')) || createdCompanies[0];

      // Create Student profile
      const studentProfile = await Student.create({
        userId: studentUser._id,
        registerNumber: 'CS2026001',
        department: 'CSE',
        batch: '2026',
        semester: 8,
        cgpa: 8.7,
        tenthPercentage: 92.5,
        twelfthPercentage: 91.0,
        backlogs: 0,
        phone: '+91 98765 43210',
        gender: 'Male',
        dob: '2004-05-14',
        skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'Tailwind CSS', 'Docker', 'Python'],
        projects: initialStudents[0].projects,
        certifications: initialStudents[0].certifications,
        socials: initialStudents[0].socials,
        placementStatus: 'SHORTLISTED',
        profileCompletion: 92,
      });

      // Create Jobs
      const createdJobs = await Job.insertMany(
        initialJobs.map((j) => ({
          title: j.title,
          companyId: msftCompany._id,
          companyName: j.companyName,
          companyLogo: j.companyLogo,
          description: j.description,
          responsibilities: j.responsibilities,
          skills: j.skills,
          salary: j.salary,
          salaryNum: j.salaryNum,
          location: j.location,
          jobType: j.jobType,
          workMode: j.workMode,
          minCgpa: j.minCgpa,
          maxBacklogs: j.maxBacklogs,
          eligibleDepartments: j.eligibleDepartments,
          eligibleBatches: j.eligibleBatches,
          deadline: j.deadline,
          status: j.status,
        }))
      );

      // Create Application
      if (createdJobs.length > 0 && studentProfile) {
        const app = await Application.create({
          jobId: createdJobs[0]._id,
          studentId: studentProfile._id,
          companyId: msftCompany._id,
          appliedDate: new Date(),
          status: 'INTERVIEW',
          notes: 'Shortlisted for Microsoft SDE-1 Technical Round 1.',
        });

        // Create Interview
        await Interview.create({
          applicationId: app._id,
          studentId: studentProfile._id,
          jobId: createdJobs[0]._id,
          companyId: msftCompany._id,
          roundName: 'Technical Interview Round 1 (Data Structures)',
          date: '2026-08-29',
          time: '11:00 AM IST',
          mode: 'ONLINE',
          venueOrLink: 'https://teams.microsoft.com/l/meetup-join/demo',
          status: 'SCHEDULED',
        });
      }

      // Create Notification
      await Notification.create({
        userId: studentUser._id,
        title: 'Welcome to CampusHire!',
        message: 'Your profile has been created successfully. Explore placement opportunities now.',
        type: 'SYSTEM',
        read: false,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with demo accounts & records.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Seeding error' },
      { status: 500 }
    );
  }
}
