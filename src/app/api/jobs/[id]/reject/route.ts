import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { rejectedBy } = await request.json();
    const { id } = await params;
    
    const job = await Job.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        approvedBy: rejectedBy,
        approvedAt: new Date(),
      },
      { new: true }
    );

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Job rejected successfully',
      job,
    });
  } catch (error) {
    console.error('Error rejecting job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
