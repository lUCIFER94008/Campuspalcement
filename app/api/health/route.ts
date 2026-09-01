import { NextResponse } from 'next/server';
import { connectMongoDB, isMongoDBConnected, getSafeDiagnosticError } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectMongoDB();

    if (isMongoDBConnected()) {
      return NextResponse.json({
        success: true,
        server: 'online',
        database: 'connected',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          server: 'online',
          database: 'disconnected',
          error: 'Database connection inactive',
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    const safeError = getSafeDiagnosticError(error);
    return NextResponse.json(
      {
        success: false,
        server: 'online',
        database: 'disconnected',
        error: safeError,
      },
      { status: 500 }
    );
  }
}
