import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  from: mongoose.Types.ObjectId | string; // userId or anonymousSessionId
  to: mongoose.Types.ObjectId | string;
  conversationId: string;
  content: string;
  encrypted: boolean;
  messageType: 'text' | 'image' | 'file' | 'location' | 'audio' | 'video';
  attachments?: Array<{
    type: string;
    url: string;
    filename: string;
    size: number;
  }>;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  read: boolean;
  readAt?: Date;
  delivered: boolean;
  deliveredAt?: Date;
  deleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  from: {
    type: Schema.Types.Mixed,
    required: true,
    index: true
  },
  to: {
    type: Schema.Types.Mixed,
    required: true,
    index: true
  },
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  encrypted: {
    type: Boolean,
    default: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'location', 'audio', 'video'],
    default: 'text'
  },
  attachments: [{
    type: String,
    url: String,
    filename: String,
    size: Number
  }],
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  delivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

// Indexes
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ from: 1, to: 1 });
MessageSchema.index({ read: 1, delivered: 1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);

