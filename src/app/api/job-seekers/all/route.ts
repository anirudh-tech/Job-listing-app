import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JobSeeker from '@/models/JobSeeker';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const pageParam = parseInt(searchParams.get('page') || '0', 10);
    const limitParam = parseInt(searchParams.get('limit') || '0', 10);
    const statusParam = (searchParams.get('status') || '').trim().toLowerCase();
    const usePaging = Number.isFinite(pageParam) && Number.isFinite(limitParam) && limitParam > 0 && pageParam >= 0;

    // Admin endpoint: filter by status if provided
    const allowedStatuses = ['approved', 'inactive', 'pending', 'rejected'] as const;
    const hasValidStatus = allowedStatuses.includes(statusParam as any);
    const query: Record<string, unknown> = hasValidStatus ? { status: statusParam } : {};
    
    if (usePaging) {
      const total = await JobSeeker.countDocuments(query);
      const items = await JobSeeker.find(query).sort({ createdAt: -1 }).skip(pageParam * limitParam).limit(limitParam);
      return NextResponse.json({ items, total });
    }

    const jobSeekers = await JobSeeker.find(query).sort({ createdAt: -1 });
    return NextResponse.json(jobSeekers);
  } catch (error) {
    console.error('Error fetching all job seekers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

