import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import nodemailer from 'nodemailer';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { approvedBy } = await request.json();
    const { id } = await params;

    const job = await Job.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        approvedBy,
        approvedAt: new Date(),
      },
      { new: true }
    );

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Send email if contactEmail is present
    try {
      if (job.contactEmail) {
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
          to: job.contactEmail,
          subject: 'Your job posting has been approved',
          text: `Hi ${job.postedBy}, your job "${job.title}" has been approved.`,
          html: `<p>Hi ${job.postedBy},</p><p>Your job <strong>${job.title}</strong> has been approved.</p>`,
        });
      }
    } catch (emailErr) {
      console.error('Email send failed:', emailErr);
      // Do not fail the approval due to email issues
    }

    return NextResponse.json({
      message: 'Job approved successfully',
      job,
    });
  } catch (error) {
    console.error('Error approving job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
