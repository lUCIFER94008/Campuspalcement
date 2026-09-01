import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResume extends Document {
  studentId: mongoose.Types.ObjectId;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  strengthScore: number;
  suggestions: string[];
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, unique: true, index: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: String, required: true, default: '1.2 MB' },
    strengthScore: { type: Number, default: 85 },
    suggestions: [{ type: String }],
    skills: [{ type: String }],
  },
  { timestamps: true }
);

export const Resume: Model<IResume> =
  mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);
