import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRecruiter extends Document {
  userId: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId;
  designation: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecruiterSchema = new Schema<IRecruiter>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', index: true },
    designation: { type: String, default: 'Hiring Manager' },
    phone: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Recruiter: Model<IRecruiter> =
  mongoose.models.Recruiter || mongoose.model<IRecruiter>('Recruiter', RecruiterSchema);
