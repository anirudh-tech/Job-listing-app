import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Job from '@/models/Job';

// Add subcategory to a category
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { subcategory } = await request.json();
    
    if (!subcategory || !subcategory.trim()) {
      return NextResponse.json({ error: 'Subcategory name is required' }, { status: 400 });
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if subcategory already exists
    if (category.subcategories.includes(subcategory.trim())) {
      return NextResponse.json({ error: 'Subcategory already exists' }, { status: 409 });
    }

    category.subcategories.push(subcategory.trim());
    await category.save();

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error adding subcategory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Remove subcategory from a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { subcategory } = await request.json();
    
    if (!subcategory || !subcategory.trim()) {
      return NextResponse.json({ error: 'Subcategory name is required' }, { status: 400 });
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    category.subcategories = category.subcategories.filter(sub => sub !== subcategory.trim());
    await category.save();

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error removing subcategory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Rename a subcategory within a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { oldSubcategory, newSubcategory } = await request.json();

    if (!oldSubcategory || !oldSubcategory.trim() || !newSubcategory || !newSubcategory.trim()) {
      return NextResponse.json({ error: 'Both old and new subcategory names are required' }, { status: 400 });
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const oldName = oldSubcategory.trim();
    const newName = newSubcategory.trim();

    const index = category.subcategories.indexOf(oldName);
    if (index === -1) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
    }

    // Prevent duplicates when renaming
    if (category.subcategories.includes(newName)) {
      return NextResponse.json({ error: 'A subcategory with this name already exists' }, { status: 409 });
    }

    category.subcategories[index] = newName;
    await category.save();

    // Propagate rename to jobs using this category + subcategory
    try {
      await Job.updateMany(
        { category: category.name, subcategory: oldName },
        { $set: { subcategory: newName } }
      );
    } catch {}

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error renaming subcategory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
