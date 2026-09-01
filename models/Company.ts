import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompany extends Document {
  userId?: mongoose.Types.ObjectId;
  companyId?: string;
  companyName: string;
  name: string; // compatibility alias
  logo?: string;
  description?: string;
  website?: string;
  industry?: string;
  location?: string;
  companySize?: string;
  contactPerson?: string;
  contactEmail?: string;
  verified: boolean;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema<ICompany> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    companyId: { type: String, trim: true },
    companyName: { type: String, required: true },
    name: { type: String, required: true },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
    website: { type: String, default: '' },
    industry: { type: String, default: '' },
    location: { type: String, default: '' },
    companySize: { type: String, default: '50-200' },
    contactPerson: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
      default: 'APPROVED',
    },
  },
  { timestamps: true }
);

export const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
