import mongoose, { Document, Schema } from 'mongoose';

export interface IJobSeeker extends Document {
  name: string;
  jobTitle: string;
  createdAt: Date;
}

const JobSeekerSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.JobSeeker || mongoose.model<IJobSeeker>('JobSeeker', JobSeekerSchema);
