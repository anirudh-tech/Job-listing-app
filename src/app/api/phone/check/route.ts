import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JobSeeker from '@/models/JobSeeker';

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

    // Find the most recent job seeker with this phone number
    const existing = await JobSeeker.findOne({ contactNumber: number })
      .sort({ createdAt: -1 })
      .exec();

    if (!existing) {
      return NextResponse.json({ 
        exists: false,
        expired: false,
        needsPayment: false 
      });
    }

    // Check if expired (7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const isExpired = existing.createdAt < sevenDaysAgo;

    // Needs payment if expired
    const needsPayment = isExpired;

    return NextResponse.json({ 
      exists: true,
      expired: isExpired,
      needsPayment: needsPayment,
      createdAt: existing.createdAt,
      status: existing.status
    });
  } catch (error) {
    console.error('Error checking phone:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

