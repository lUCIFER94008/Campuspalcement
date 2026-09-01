import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IApplication extends Document {
  studentId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  recruiterId?: mongoose.Types.ObjectId | string;
  companyId?: mongoose.Types.ObjectId;
  resumeUrl?: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected' | 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'TEST' | 'INTERVIEW' | 'SELECTED' | 'REJECTED';
  appliedAt: Date;
  appliedDate?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema<IApplication> = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    recruiterId: { type: Schema.Types.Mixed, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    resumeUrl: { type: String, default: '' },
    status: {
      type: String,
      default: 'Applied',
    },
    appliedAt: { type: Date, default: Date.now },
    appliedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Unique compound index preventing duplicate applications for the same job by the same student
ApplicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

export const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
