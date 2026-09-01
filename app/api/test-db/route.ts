import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected, getSafeDiagnosticError } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectMongoDB();

    if (isMongoDBConnected()) {
      return NextResponse.json({
        success: true,
        message: 'MongoDB connected successfully',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'MongoDB connection failed',
          error: 'Database state disconnected',
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    const safeError = getSafeDiagnosticError(error);
    return NextResponse.json(
      {
        success: false,
        message: 'MongoDB connection failed',
        error: safeError,
      },
      { status: 500 }
    );
  }
}
