import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
  try {
    await connectDB();
    
    const jobs = await Job.find({ status: 'approved' }).sort({ createdAt: -1 });
    
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { title, description, company, aadharNumber, aadharFileUrl, transactionId, contactEmail, postedBy } = await request.json();

    if (!title || !description || !company || !aadharNumber || !aadharFileUrl || !postedBy) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Optional duplicate enforcement can be added here, but we will allow posting
    // and rely on pre-check via /api/aadhaar/check

    const job = new Job({
      title,
      description,
      company,
      aadharNumber,
      aadharFileUrl,
      transactionId,
      contactEmail,
      postedBy,
      status: 'pending',
    });

    await job.save();

    return NextResponse.json({
      message: 'Job posted successfully',
      job,
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
