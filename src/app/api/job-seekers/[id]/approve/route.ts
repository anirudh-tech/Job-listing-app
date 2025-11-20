import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JobSeeker from '@/models/JobSeeker';
import nodemailer from 'nodemailer';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Try to get approvedBy from request body, but make it optional
    let approvedBy = 'admin';
    try {
      const body = await request.json();
      if (body && body.approvedBy) {
        approvedBy = body.approvedBy;
      }
    } catch (e) {
      // If body is empty or invalid, use default
      console.log('No approvedBy in request body, using default');
    }

    const jobSeeker = await JobSeeker.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'approved',
          approvedBy: approvedBy,
          approvedAt: new Date(),
        }
      },
      { new: true, runValidators: true }
    );

    if (!jobSeeker) {
      return NextResponse.json(
        { error: 'Job seeker not found' },
        { status: 404 }
      );
    }

    // Send email if email is present
    try {
      if (jobSeeker.email) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.MAIL_FROM || 'no-reply@example.com',
          to: jobSeeker.email,
          subject: 'Your job seeker registration has been approved',
          text: `Hi ${jobSeeker.name}, your job seeker registration has been approved.`,
          html: `<p>Hi ${jobSeeker.name},</p><p>Your job seeker registration has been approved. You will now be visible to employers.</p>`,
        });
      }
    } catch (emailErr) {
      console.error('Email send failed:', emailErr);
      // Do not fail the approval due to email issues
    }

    return NextResponse.json({
      message: 'Job seeker approved successfully',
      jobSeeker,
    });
  } catch (error) {
    console.error('Error approving job seeker:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

