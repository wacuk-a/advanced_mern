import mongoose, { Schema, Document } from 'mongoose';

export interface INGO extends Document {
  name: string;
  registrationNumber: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  safehouses: mongoose.Types.ObjectId[];
  staff: mongoose.Types.ObjectId[];
  settings: {
    autoApproveBookings: boolean;
    emergencyResponseEnabled: boolean;
    aiAnalysisEnabled: boolean;
  };
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'suspended' | 'cancelled';
    expiresAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const NGOSchema = new Schema<INGO>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  safehouses: [{
    type: Schema.Types.ObjectId,
    ref: 'Safehouse'
  }],
  staff: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  settings: {
    autoApproveBookings: { type: Boolean, default: false },
    emergencyResponseEnabled: { type: Boolean, default: true },
    aiAnalysisEnabled: { type: Boolean, default: true }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'cancelled'],
      default: 'active'
    },
    expiresAt: Date
  }
}, {
  timestamps: true
});

export const NGO = mongoose.model<INGO>('NGO', NGOSchema);

