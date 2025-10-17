import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Job from '@/models/Job';

// Update category name and propagate change to jobs.category strings
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Await params here
    const { name } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    const oldName = category.name;
    category.name = name.trim();
    await category.save();

    // Update jobs referencing the old category name
    if (oldName && oldName !== category.name) {
      await Job.updateMany({ category: oldName }, { $set: { category: category.name } });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete category and cascade delete jobs using that category
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Await params here
    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    const name = category.name;
    await Category.findByIdAndDelete(id);
    // Delete jobs with this category name
    await Job.deleteMany({ category: name });

    return NextResponse.json({ message: 'Category and related jobs deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}