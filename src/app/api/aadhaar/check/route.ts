import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const number = (searchParams.get('number') || '').trim();

    if (!number) {
      return NextResponse.json(
        { error: 'number is required' },
        { status: 400 }
      );
    }

    const exists = await Job.exists({ aadharNumber: number });

    return NextResponse.json({ exists: Boolean(exists) });
  } catch (error) {
    console.error('Error checking aadhaar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


