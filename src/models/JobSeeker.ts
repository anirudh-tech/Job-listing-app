import mongoose, { Document, Schema } from 'mongoose';

export interface IJobSeeker extends Document {
  // Mandatory fields
  name: string;
  dateOfBirth: Date;
  gender: string;
  contactNumber: string;
  email: string;
  qualification: string;
  preferredJobType: string;
  preferredCategory?: string;
  preferredSubcategory?: string;
  location: string;
  district: string;
  jobTitle: string;

  // Optional fields
  experience?: number;
  skills?: string;
  resumeUrl?: string;
  expectedSalary?: string;
  availability?: Date;
  languageProficiency?: string;

  // Payment and approval fields
  transactionId?: string; // required if duplicate phone number
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  approvedBy?: string;
  createdAt: Date;
  approvedAt?: Date;
}

const JobSeekerSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
  },
  contactNumber: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  preferredJobType: {
    type: String,
    required: true,
    enum: ['Full time', 'Part time', 'Internship', 'Freelance'],
  },
  preferredCategory: {
    type: String,
    required: true,
  },
  preferredSubcategory: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
  },
  skills: {
    type: String,
  },
  resumeUrl: {
    type: String,
  },
  expectedSalary: {
    type: String,
  },
  availability: {
    type: Date,
  },
  languageProficiency: {
    type: String,
  },
  transactionId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'inactive'],
    default: 'pending',
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
if (mongoose.models.JobSeeker) {
  delete mongoose.models.JobSeeker;
}

export default mongoose.model<IJobSeeker>('JobSeeker', JobSeekerSchema);
