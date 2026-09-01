import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  studentId?: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  course?: string;
  batch?: string;
  cgpa?: number;
  tenthPercentage?: number;
  twelfthPercentage?: number;
  backlogs?: number;
  skills: string[];
  projects: { title: string; description: string; technologies: string[]; githubUrl?: string; liveUrl?: string }[];
  certifications: { title: string; issuer: string; date?: string }[];
  socials?: { github?: string; linkedin?: string; portfolio?: string };
  resumeUrl?: string;
  profilePhoto?: string;
  placementStatus: 'Not Placed' | 'Placed' | 'Opted Out' | 'SELECTED';
  profileCompletion: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema<IStudent> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    studentId: { type: String, trim: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    department: { type: String, default: '' },
    course: { type: String, default: 'B.Tech' },
    batch: { type: String, default: '' },
    cgpa: { type: Number, default: 0 },
    tenthPercentage: { type: Number, default: 0 },
    twelfthPercentage: { type: Number, default: 0 },
    backlogs: { type: Number, default: 0 },
    skills: [{ type: String }],
    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
        githubUrl: String,
        liveUrl: String,
      },
    ],
    certifications: [
      {
        title: String,
        issuer: String,
        date: String,
      },
    ],
    socials: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    resumeUrl: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
    placementStatus: {
      type: String,
      enum: ['Not Placed', 'Placed', 'Opted Out', 'SELECTED'],
      default: 'Not Placed',
    },
    profileCompletion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
