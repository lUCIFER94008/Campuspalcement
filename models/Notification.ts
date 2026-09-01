import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'APPLICATION' | 'INTERVIEW' | 'JOB' | 'RESULT' | 'SYSTEM';
  read: boolean;
  relatedId?: string;
  createdAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['APPLICATION', 'INTERVIEW', 'JOB', 'RESULT', 'SYSTEM'],
      default: 'SYSTEM',
    },
    read: { type: Boolean, default: false },
    relatedId: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
