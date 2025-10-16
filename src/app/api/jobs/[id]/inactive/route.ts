import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function PUT(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    job.status = 'inactive';
    await job.save();
    return NextResponse.json({ message: 'Job marked as inactive' });
  } catch (error) {
    console.error('Error marking job inactive:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


