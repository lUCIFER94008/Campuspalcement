import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlacement extends Document {
  studentId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  package: string;
  packageNum?: number;
  joiningDate?: Date | string;
  placementDate?: Date | string;
  status: 'ACCEPTED' | 'PENDING' | 'DECLINED';
  createdAt: Date;
}

const PlacementSchema: Schema<IPlacement> = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    package: { type: String, required: true },
    packageNum: { type: Number, default: 0 },
    joiningDate: { type: Schema.Types.Mixed },
    placementDate: { type: Schema.Types.Mixed, default: Date.now },
    status: {
      type: String,
      enum: ['ACCEPTED', 'PENDING', 'DECLINED'],
      default: 'ACCEPTED',
    },
  },
  { timestamps: true }
);

export const Placement: Model<IPlacement> =
  mongoose.models.Placement || mongoose.model<IPlacement>('Placement', PlacementSchema);
