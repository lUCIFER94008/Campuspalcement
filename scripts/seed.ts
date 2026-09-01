import mongoose from 'mongoose';
import { User } from '../models/User';
import { Student } from '../models/Student';
import { Company } from '../models/Company';
import { Job } from '../models/Job';
import { hashPassword } from '../lib/auth';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campushire';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas for manual seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});

    console.log('Cleared existing collections.');

    // Seed Placement Officer / Admin User
    const adminPassword = await hashPassword('Admin@123456');
    const adminUser = await User.create({
      name: 'Dr. Rajesh Sharma (Placement Officer)',
      email: 'admin@campushire.demo',
      passwordHash: adminPassword,
      role: 'PLACEMENT_OFFICER',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    });

    // Seed Recruiter User & Company
    const recruiterPassword = await hashPassword('Recruiter@123456');
    const recruiterUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@campushire.demo',
      passwordHash: recruiterPassword,
      role: 'RECRUITER',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Recruiter',
    });

    const company = await Company.create({
      userId: recruiterUser._id,
      companyName: 'Microsoft',
      name: 'Microsoft',
      logo: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=150',
      description: 'Global technology company empowering every person and organization.',
      website: 'https://microsoft.com',
      industry: 'Software & Technology',
      location: 'Hyderabad / Bangalore',
      companySize: '10,000+',
      contactPerson: 'Sarah Jenkins',
      contactEmail: 'recruiter@campushire.demo',
      verified: true,
      status: 'APPROVED',
    });

    // Seed Student User & Profile
    const studentPassword = await hashPassword('Student@123456');
    const studentUser = await User.create({
      name: 'John Doe',
      email: 'student@campushire.demo',
      passwordHash: studentPassword,
      role: 'STUDENT',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student',
    });

    await Student.create({
      userId: studentUser._id,
      studentId: 'CS2026001',
      name: 'John Doe',
      email: 'student@campushire.demo',
      phone: '+91 98765 43210',
      department: 'CSE',
      course: 'B.Tech',
      batch: '2026',
      cgpa: 8.7,
      backlogs: 0,
      skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'Python'],
      projects: [
        {
          title: 'Campus Placement System',
          description: 'Full stack recruitment platform with Next.js & Mongoose',
          technologies: ['Next.js', 'TypeScript', 'MongoDB'],
        },
      ],
      certifications: [{ title: 'AWS Cloud Practitioner', issuer: 'AWS' }],
      placementStatus: 'Not Placed',
      profileCompletion: 90,
    });

    // Seed Job
    await Job.create({
      companyId: company._id,
      companyName: 'Microsoft',
      title: 'Software Development Engineer - I',
      description: 'Design and implement scalable distributed cloud architectures using C# & TypeScript.',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Bangalore / Hyderabad',
      salary: '18 - 24 LPA',
      salaryMin: 18,
      salaryMax: 24,
      minCgpa: 7.5,
      maxBacklogs: 0,
      eligibleDepartments: ['CSE', 'IT', 'ECE'],
      eligibleCourses: ['B.Tech'],
      requiredSkills: ['Data Structures', 'Algorithms', 'TypeScript', 'Distributed Systems'],
      skills: ['Data Structures', 'Algorithms', 'TypeScript', 'Distributed Systems'],
      deadline: '2026-10-30',
      status: 'Open',
    });

    console.log('Database seeded successfully with initial dev accounts:');
    console.log(' - Admin: admin@campushire.demo / Admin@123456');
    console.log(' - Recruiter: recruiter@campushire.demo / Recruiter@123456');
    console.log(' - Student: student@campushire.demo / Student@123456');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
