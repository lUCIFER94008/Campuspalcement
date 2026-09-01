import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlacementDrive extends Document {
  title: string;
  companyId: mongoose.Types.ObjectId | string;
  jobId?: mongoose.Types.ObjectId | string;
  driveDate: Date | string;
  registrationDeadline: Date | string;
  venue: string;
  description: string;
  eligibilityCriteria?: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PlacementDriveSchema: Schema<IPlacementDrive> = new Schema(
  {
    title: { type: String, required: true },
    companyId: { type: Schema.Types.Mixed, required: true },
    jobId: { type: Schema.Types.Mixed },
    driveDate: { type: Schema.Types.Mixed, required: true },
    registrationDeadline: { type: Schema.Types.Mixed },
    venue: { type: String, default: 'Campus Auditorium / Online' },
    description: { type: String, required: true },
    eligibilityCriteria: { type: String, default: '' },
    status: {
      type: String,
      enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
      default: 'UPCOMING',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const PlacementDrive: Model<IPlacementDrive> =
  mongoose.models.PlacementDrive || mongoose.model<IPlacementDrive>('PlacementDrive', PlacementDriveSchema);
