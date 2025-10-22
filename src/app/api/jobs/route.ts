import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const keyword = (searchParams.get('keyword') || '').trim();
    const category = (searchParams.get('category') || '').trim();
    const subcategory = (searchParams.get('subcategory') || '').trim();
    const district = (searchParams.get('district') || '').trim();
    const statusParam = (searchParams.get('status') || '').trim().toLowerCase();
    const pageParam = parseInt(searchParams.get('page') || '0', 10);
    const limitParam = parseInt(searchParams.get('limit') || '0', 10);
    const usePaging = Number.isFinite(pageParam) && Number.isFinite(limitParam) && limitParam > 0 && pageParam >= 0;

    const allowedStatuses = ['pending', 'approved', 'rejected', 'inactive'] as const;
    const hasValidStatus = allowedStatuses.includes(statusParam as any);

    const query: Record<string, unknown> = { status: hasValidStatus ? statusParam : 'approved' };

    const andClauses: any[] = [];

    if (keyword) {
      andClauses.push({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { company: { $regex: keyword, $options: 'i' } },
        ],
      });
    }

    // Category filter using explicit field
    if (category) {
      andClauses.push({ category: { $regex: category, $options: 'i' } });
    }

    // Subcategory filter
    if (subcategory) {
      andClauses.push({ subcategory: { $regex: subcategory, $options: 'i' } });
    }

    if (district) {
      andClauses.push({ $or: [ { district: { $regex: district, $options: 'i' } }, { description: { $regex: district, $options: 'i' } } ] });
    }

    // Auto-expire: exclude jobs older than 7 days by marking inactive on the fly and excluding from results
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const isApprovedView = query.status === 'approved';
    const baseWithExpiry = isApprovedView ? { ...query, createdAt: { $gte: sevenDaysAgo } } : query;
    const finalQuery = andClauses.length > 0 ? { $and: [baseWithExpiry, ...andClauses] } : baseWithExpiry;

    // Also proactively set outdated approved jobs to inactive in the background (non-blocking)
    try {
      // mark approved jobs older than 7 days as inactive
      await Job.updateMany({ status: 'approved', createdAt: { $lt: sevenDaysAgo } }, { $set: { status: 'inactive' } });
    } catch {}

    if (usePaging) {
      const total = await Job.countDocuments(finalQuery);
      const items = await Job.find(finalQuery)
        .sort({ createdAt: -1 })
        .skip(pageParam * limitParam)
        .limit(limitParam);
      return NextResponse.json({ items, total });
    } else {
      const jobs = await Job.find(finalQuery).sort({ createdAt: -1 });
      return NextResponse.json(jobs);
    }
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
    
    const { title, description, company, category, subcategory, district, aadharNumber, aadharFileUrl, transactionId, contactEmail, postedBy } = await request.json();

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
      category,
      subcategory,
      district,
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
