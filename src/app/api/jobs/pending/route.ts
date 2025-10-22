import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
  try {
    await connectDB();
    
    const pendingJobs = await Job.find({ status: 'pending' }).sort({ createdAt: -1 });
    
    return NextResponse.json(pendingJobs);
  } catch (error) {
    console.error('Error fetching pending jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
