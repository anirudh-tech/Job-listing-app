import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JobSeeker from '@/models/JobSeeker';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const jobSeeker = await JobSeeker.findByIdAndUpdate(
      id,
      {
        status: 'pending',
        approvedBy: undefined,
        approvedAt: undefined,
      },
      { new: true }
    );

    if (!jobSeeker) {
      return NextResponse.json(
        { error: 'Job seeker not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Job seeker moved back to pending successfully',
      jobSeeker,
    });
  } catch (error) {
    console.error('Error moving job seeker to pending:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

