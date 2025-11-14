import mongoose, { Schema, Document } from 'mongoose';

export interface IPanicEvent extends Document {
  userId?: mongoose.Types.ObjectId;
  anonymousSessionId?: string;
  status: 'active' | 'resolved' | 'false_alarm' | 'aborted';
  triggerType: 'button' | 'shake' | 'voice' | 'power_button' | 'manual';
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: Date;
  };
  locationHistory: Array<{
    latitude: number;
    longitude: number;
    timestamp: Date;
  }>;
  emergencyContactsNotified: Array<{
    contactId: string;
    method: 'sms' | 'email' | 'push';
    status: 'sent' | 'delivered' | 'failed';
    timestamp: Date;
  }>;
  evidence: {
    audio?: string; // URL or path to audio file
    video?: string;
    photos?: string[];
    notes?: string;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  countdownSeconds?: number;
  abortedAt?: Date;
  resolvedAt?: Date;
  resolvedBy?: mongoose.Types.ObjectId;
  emergencyServicesContacted: boolean;
  emergencyServicesResponse?: {
    contactedAt: Date;
    serviceType: string;
    responseId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PanicEventSchema = new Schema<IPanicEvent>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  anonymousSessionId: {
    type: String,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'false_alarm', 'aborted'],
    default: 'active',
    index: true
  },
  triggerType: {
    type: String,
    enum: ['button', 'shake', 'voice', 'power_button', 'manual'],
    required: true
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: Number,
    timestamp: { type: Date, default: Date.now }
  },
  locationHistory: [{
    latitude: Number,
    longitude: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  emergencyContactsNotified: [{
    contactId: String,
    method: { type: String, enum: ['sms', 'email', 'push'] },
    status: { type: String, enum: ['sent', 'delivered', 'failed'] },
    timestamp: { type: Date, default: Date.now }
  }],
  evidence: {
    audio: String,
    video: String,
    photos: [String],
    notes: String
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  countdownSeconds: Number,
  abortedAt: Date,
  resolvedAt: Date,
  resolvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  emergencyServicesContacted: {
    type: Boolean,
    default: false
  },
  emergencyServicesResponse: {
    contactedAt: Date,
    serviceType: String,
    responseId: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
PanicEventSchema.index({ status: 1, createdAt: -1 });
PanicEventSchema.index({ userId: 1, createdAt: -1 });
PanicEventSchema.index({ anonymousSessionId: 1, createdAt: -1 });
PanicEventSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

export const PanicEvent = mongoose.model<IPanicEvent>('PanicEvent', PanicEventSchema);

