import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JobSeeker from '@/models/JobSeeker';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get all pending job seekers (including those without status field)
    const pendingJobSeekers = await JobSeeker.find({ 
      $or: [
        { status: 'pending' },
        { status: { $exists: false } },
        { status: null }
      ]
    })
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json(pendingJobSeekers);
  } catch (error) {
    console.error('Error fetching pending job seekers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

