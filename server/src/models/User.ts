import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email?: string;
  password?: string;
  phone?: string;
  role: 'user' | 'counselor' | 'admin' | 'safehouse_staff' | 'anonymous';
  anonymousSessionId?: string;
  isAnonymous: boolean;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    email?: string;
    relationship: string;
    priority: number;
  }>;
  safeModeEnabled: boolean;
  quickExitEnabled: boolean;
  locationSharingEnabled: boolean;
  ngoId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    select: false
  },
  phone: {
    type: String,
    sparse: true
  },
  role: {
    type: String,
    enum: ['user', 'counselor', 'admin', 'safehouse_staff', 'anonymous'],
    default: 'anonymous'
  },
  anonymousSessionId: {
    type: String,
    unique: true,
    sparse: true
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  emergencyContacts: [{
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    relationship: String,
    priority: { type: Number, default: 1 }
  }],
  safeModeEnabled: {
    type: Boolean,
    default: false
  },
  quickExitEnabled: {
    type: Boolean,
    default: true
  },
  locationSharingEnabled: {
    type: Boolean,
    default: false
  },
  ngoId: {
    type: Schema.Types.ObjectId,
    ref: 'NGO'
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);

