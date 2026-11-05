import mongoose, { Schema, model, models, type Model } from 'mongoose';
import type { ConsultationState } from './consultation';

// Reuse one connection across serverless invocations (and dev hot reloads)
const cached = globalThis as unknown as { mongooseConn?: Promise<typeof mongoose> };

export function connectDb(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return Promise.reject(new Error('MONGODB_URI is not set'));
  cached.mongooseConn ??= mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 }).catch((err) => {
    cached.mongooseConn = undefined; // let the next request retry
    throw err;
  });
  return cached.mongooseConn;
}

type ConversationDoc = {
  messages: { role: 'user' | 'bot'; text: string; timestamp?: Date }[];
  createdAt?: Date;
  consultation?: ConsultationState;
};

const ConversationSchema = new Schema<ConversationDoc>({
  messages: [
    {
      role: { type: String, enum: ['user', 'bot'], required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  consultation: {
    name: String, contact: String, messenger: String, details: String, date: String, time: String,
    status: { type: String, enum: ['collecting', 'awaiting_confirmation', 'booked'] },
    confirmedSummary: String,
  },
});

type BookingDoc = {
  name: string;
  contact: string;
  messenger: string;
  projectDetails: string;
  status: 'pending' | 'scheduled' | 'completed';
  scheduledAt?: Date;
  createdAt?: Date;
  bookingKey?: string;
};

const BookingSchema = new Schema<BookingDoc>({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  messenger: { type: String, required: true },
  projectDetails: { type: String, required: true },
  bookingKey: { type: String, unique: true, sparse: true },
  status: { type: String, enum: ['pending', 'scheduled', 'completed'], default: 'pending' },
  scheduledAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const Conversation =
  (models.Conversation as Model<ConversationDoc>) || model<ConversationDoc>('Conversation', ConversationSchema);
export const Booking = (models.Booking as Model<BookingDoc>) || model<BookingDoc>('Booking', BookingSchema);
