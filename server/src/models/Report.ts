import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  userId?: mongoose.Types.ObjectId;
  anonymousSessionId?: string;
  reportType: 'incident' | 'threat' | 'harassment' | 'abuse' | 'other';
  content: {
    text?: string;
    images?: string[];
    audio?: string;
    video?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    timestamp: Date;
  };
  incidentDate?: Date;
  aiAnalysis?: {
    riskScore: number; // 0-100
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    keywords: string[];
    sentiment: 'positive' | 'neutral' | 'negative' | 'distressed';
    explanation: string;
    analyzedAt: Date;
  };
  status: 'submitted' | 'under_review' | 'assigned' | 'in_progress' | 'resolved' | 'archived';
  assignedTo?: mongoose.Types.ObjectId;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  followUpRequired: boolean;
  followUpDate?: Date;
  notes: Array<{
    addedBy: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  anonymousSessionId: {
    type: String,
    index: true
  },
  reportType: {
    type: String,
    enum: ['incident', 'threat', 'harassment', 'abuse', 'other'],
    required: true
  },
  content: {
    text: String,
    images: [String],
    audio: String,
    video: String
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    timestamp: { type: Date, default: Date.now }
  },
  incidentDate: Date,
  aiAnalysis: {
    riskScore: { type: Number, min: 0, max: 100 },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    keywords: [String],
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative', 'distressed']
    },
    explanation: String,
    analyzedAt: { type: Date, default: Date.now }
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'archived'],
    default: 'submitted',
    index: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  tags: [String],
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  notes: [{
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes
ReportSchema.index({ status: 1, priority: 1, createdAt: -1 });
ReportSchema.index({ assignedTo: 1, status: 1 });
ReportSchema.index({ 'aiAnalysis.riskLevel': 1, status: 1 });

export const Report = mongoose.model<IReport>('Report', ReportSchema);

