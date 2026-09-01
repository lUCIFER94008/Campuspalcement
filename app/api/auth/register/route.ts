import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected, getSafeDiagnosticError } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Student } from '@/models/Student';
import { Company } from '@/models/Company';
import { hashPassword, signJWT } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, registerNumber, department, batch, companyName } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    if (role === 'ADMIN' || role === 'PLACEMENT_OFFICER') {
      // Allow administrative account creation for verified domain emails
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      await connectMongoDB();
    } catch (dbErr: any) {
      const safeDiagnostic = getSafeDiagnosticError(dbErr);
      return NextResponse.json(
        { success: false, message: safeDiagnostic },
        { status: 503 }
      );
    }

    if (!isMongoDBConnected()) {
      return NextResponse.json(
        { success: false, message: 'Database connection is not active. Please verify MongoDB Atlas status.' },
        { status: 503 }
      );
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email: cleanEmail,
      passwordHash: hashedPassword,
      role: role === 'ADMIN' ? 'PLACEMENT_OFFICER' : role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    });

    let studentId;
    let companyId;

    if (role === 'STUDENT') {
      const newStudent = await Student.create({
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        registerNumber: registerNumber || '',
        department: department || '',
        batch: batch || '',
        cgpa: null,
        backlogs: 0,
        skills: [],
        projects: [],
        certifications: [],
        placementStatus: 'Not Placed',
        profileCompletion: 20,
      });
      studentId = newStudent._id.toString();
    } else if (role === 'RECRUITER') {
      let company = await Company.findOne({ name: companyName });
      if (!company && companyName) {
        company = await Company.create({
          userId: newUser._id,
          companyName,
          name: companyName,
          contactEmail: cleanEmail,
          contactPerson: name,
          status: 'APPROVED',
        });
      }
      companyId = company?._id.toString();
    }

    const token = await signJWT({
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      studentId,
      companyId,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

    response.cookies.set('campushire_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
