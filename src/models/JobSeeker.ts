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

  createdAt: Date;
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.JobSeeker || mongoose.model<IJobSeeker>('JobSeeker', JobSeekerSchema);
