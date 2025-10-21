import { NextResponse } from 'next/server';
import { setupAdmin } from '@/lib/setup-admin';

export async function POST() {
  try {
    await setupAdmin();
    return NextResponse.json({ message: 'Admin setup completed' });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup admin' },
      { status: 500 }
    );
  }
}
