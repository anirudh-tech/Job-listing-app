import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  company: string;
  category?: string;
  district?: string;
  aadharNumber: string; // 12-digit number
  aadharFileUrl: string; // uploaded file URL
  transactionId?: string; // required if duplicate Aadhaar
  contactEmail?: string; // required if duplicate Aadhaar
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  postedBy: string;
  approvedBy?: string;
  createdAt: Date;
  approvedAt?: Date;
}

const JobSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    index: true,
  },
  district: {
    type: String,
    index: true,
  },
  aadharNumber: {
    type: String,
    required: true,
    index: true,
  },
  aadharFileUrl: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
  },
  contactEmail: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'inactive'],
    default: 'pending',
  },
  postedBy: {
    type: String,
    required: true,
  },
  approvedBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: {
    type: Date,
  },
});

// During dev, Next.js can hot-reload and keep the old compiled model with the old schema.
// Ensure we drop the cached model so the updated schema is applied.
if (mongoose.models.Job) {
  delete mongoose.models.Job;
}

export default mongoose.model<IJob>('Job', JobSchema);
