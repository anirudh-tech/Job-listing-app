import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const pageParam = parseInt(searchParams.get('page') || '0', 10);
    const limitParam = parseInt(searchParams.get('limit') || '0', 10);
    const usePaging = Number.isFinite(pageParam) && Number.isFinite(limitParam) && limitParam > 0 && pageParam >= 0;

    if (usePaging) {
      const total = await ContactMessage.countDocuments({});
      const items = await ContactMessage.find().sort({ createdAt: -1 }).skip(pageParam * limitParam).limit(limitParam);
      return NextResponse.json({ items, total });
    }

    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }
    const doc = new ContactMessage({ name, email, subject, message });
    await doc.save();
    return NextResponse.json({ message: 'Message received', id: doc._id }, { status: 201 });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


