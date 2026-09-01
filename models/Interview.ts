import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInterview extends Document {
  applicationId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  round?: string;
  roundName: string;
  interviewType?: 'Technical' | 'HR' | 'Coding' | 'Managerial';
  scheduledDate?: string;
  date: string;
  time: string;
  startTime?: string;
  endTime?: string;
  meetingLink?: string;
  venueOrLink: string;
  venue?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema: Schema<IInterview> = new Schema(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    round: { type: String, default: 'Round 1' },
    roundName: { type: String, required: true },
    interviewType: { type: String, default: 'Technical' },
    scheduledDate: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    startTime: { type: String, default: '10:00 AM' },
    endTime: { type: String, default: '11:00 AM' },
    meetingLink: { type: String, default: '' },
    venueOrLink: { type: String, required: true },
    venue: { type: String, default: '' },
    status: {
      type: String,
      default: 'Scheduled',
    },
    feedback: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Interview: Model<IInterview> =
  mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);
