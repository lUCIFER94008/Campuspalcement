import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlacementResult extends Document {
  studentId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  role: string;
  packageOffered: string; // e.g. "12 LPA"
  packageNum: number; // e.g. 12.0
  joiningDate: string;
  department: string;
  batch: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlacementResultSchema = new Schema<IPlacementResult>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    role: { type: String, required: true },
    packageOffered: { type: String, required: true },
    packageNum: { type: Number, required: true, default: 0 },
    joiningDate: { type: String, required: true },
    department: { type: String, required: true, index: true },
    batch: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const PlacementResult: Model<IPlacementResult> =
  mongoose.models.PlacementResult || mongoose.model<IPlacementResult>('PlacementResult', PlacementResultSchema);
