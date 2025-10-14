import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JobSeeker from '@/models/JobSeeker';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, jobTitle } = await request.json();

    if (!name || !jobTitle) {
      return NextResponse.json(
        { error: 'Name and job title are required' },
        { status: 400 }
      );
    }

    const jobSeeker = new JobSeeker({
      name,
      jobTitle,
    });

    await jobSeeker.save();

    return NextResponse.json({
      message: 'Job seeker registered successfully',
      jobSeeker,
    });
  } catch (error) {
    console.error('Error creating job seeker:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
