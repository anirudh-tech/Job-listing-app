import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JobSeeker from '@/models/JobSeeker';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const pageParam = parseInt(searchParams.get('page') || '0', 10);
    const limitParam = parseInt(searchParams.get('limit') || '0', 10);
    const usePaging = Number.isFinite(pageParam) && Number.isFinite(limitParam) && limitParam > 0 && pageParam >= 0;

    // Public endpoint: only show approved job seekers
    const query = { status: 'approved' };
    
    if (usePaging) {
      const total = await JobSeeker.countDocuments(query);
      const items = await JobSeeker.find(query).sort({ createdAt: -1 }).skip(pageParam * limitParam).limit(limitParam);
      return NextResponse.json({ items, total });
    }

    const jobSeekers = await JobSeeker.find(query).sort({ createdAt: -1 });
    return NextResponse.json(jobSeekers);
  } catch (error) {
    console.error('Error fetching job seekers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const {
      // Mandatory fields
      name,
      dateOfBirth,
      gender,
      contactNumber,
      email,
      qualification,
      preferredJobType,
      preferredCategory,
      preferredSubcategory,
      location,
      district,
      jobTitle,
      // Optional fields
      experience,
      skills,
      resumeUrl,
      expectedSalary,
      availability,
      languageProficiency,
      // Payment fields
      transactionId
    } = await request.json();

    // Validate mandatory fields
    const requiredFields = {
      name, dateOfBirth, gender, contactNumber, email, 
      qualification, preferredJobType, location, district, jobTitle, preferredCategory, preferredSubcategory
    };
    
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const jobSeeker = new JobSeeker({
      name,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      contactNumber,
      email,
      qualification,
      preferredJobType,
      preferredCategory,
      preferredSubcategory,
      location,
      district,
      jobTitle,
      experience: experience ? Number(experience) : undefined,
      skills,
      resumeUrl,
      expectedSalary,
      availability: availability ? new Date(availability) : undefined,
      languageProficiency,
      transactionId,
      status: 'pending',
    });

    // Explicitly save with validation to ensure status field is saved
    await jobSeeker.save({ validateBeforeSave: true });
    
    // Verify status was saved - reload to check
    const saved = await JobSeeker.findById(jobSeeker._id);
    if (!saved || !saved.status) {
      console.error('Warning: Status field not saved for job seeker:', jobSeeker._id);
      // Try to update it explicitly
      await JobSeeker.findByIdAndUpdate(jobSeeker._id, { $set: { status: 'pending' } }, { runValidators: true });
    }

    return NextResponse.json({
      message: 'Job seeker registered successfully',
      jobSeeker: saved || jobSeeker,
    });
  } catch (error) {
    console.error('Error creating job seeker:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
