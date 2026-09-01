import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJob extends Document {
  recruiterId?: mongoose.Types.ObjectId | string;
  companyId: mongoose.Types.ObjectId | string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  jobType: 'FULL_TIME' | 'INTERNSHIP' | 'CONVERTIBLE';
  workMode: 'ON_SITE' | 'HYBRID' | 'REMOTE';
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salary: string; // package string e.g. "12 LPA"
  minCgpa: number;
  maxBacklogs: number;
  eligibleDepartments: string[];
  eligibleCourses: string[];
  requiredSkills: string[];
  skills: string[]; // alias
  applicationDeadline: Date | string;
  deadline: string; // alias
  status: 'Draft' | 'Open' | 'Closed' | 'ACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema<IJob> = new Schema(
  {
    recruiterId: { type: Schema.Types.Mixed, index: true },
    companyId: { type: Schema.Types.Mixed, required: true, index: true },
    companyName: { type: String, required: true },
    companyLogo: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    jobType: {
      type: String,
      enum: ['FULL_TIME', 'INTERNSHIP', 'CONVERTIBLE'],
      default: 'FULL_TIME',
    },
    workMode: {
      type: String,
      enum: ['ON_SITE', 'HYBRID', 'REMOTE'],
      default: 'ON_SITE',
    },
    location: { type: String, required: true },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    salary: { type: String, required: true },
    minCgpa: { type: Number, default: 6.0 },
    maxBacklogs: { type: Number, default: 0 },
    eligibleDepartments: [{ type: String }],
    eligibleCourses: [{ type: String, default: 'B.Tech' }],
    requiredSkills: [{ type: String }],
    skills: [{ type: String }],
    applicationDeadline: { type: Schema.Types.Mixed },
    deadline: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Draft', 'Open', 'Closed', 'ACTIVE'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

export const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
