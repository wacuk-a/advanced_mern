import mongoose, { Schema, Document } from 'mongoose';

export interface ISafehouseBooking extends Document {
  userId?: mongoose.Types.ObjectId;
  anonymousSessionId?: string;
  safehouseId: mongoose.Types.ObjectId;
  requestedCheckIn: Date;
  requestedCheckOut?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'checked_in' | 'checked_out' | 'cancelled';
  numberOfGuests: number;
  specialNeeds?: string[];
  transportationRequired: boolean;
  transportationDetails?: {
    pickupLocation?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    scheduledTime?: Date;
    status: 'pending' | 'scheduled' | 'in_transit' | 'completed' | 'cancelled';
    distance?: number; // in kilometers
    estimatedTravelTime?: number; // in minutes
  };
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  checkedInAt?: Date;
  checkedOutAt?: Date;
  checkedInBy?: mongoose.Types.ObjectId;
  notes?: string;
  workflowStep?: number; // Track workflow progress (1-6)
  needsAssessment?: {
    medicalNeeds?: string[];
    legalNeeds?: string[];
    counselingNeeds?: string[];
    foodAssistance?: boolean;
    clothingAssistance?: boolean;
    documentationHelp?: boolean;
    safetyConcerns?: string[];
  };
  supportServices?: {
    medical: boolean;
    legal: boolean;
    counseling: boolean;
    food: boolean;
    transportation: boolean;
    assignedServices: Array<{
      serviceType: string;
      providerId?: string;
      scheduledDate?: Date;
      status: 'pending' | 'active' | 'completed';
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SafehouseBookingSchema = new Schema<ISafehouseBooking>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  anonymousSessionId: {
    type: String,
    index: true
  },
  safehouseId: {
    type: Schema.Types.ObjectId,
    ref: 'Safehouse',
    required: true,
    index: true
  },
  requestedCheckIn: {
    type: Date,
    required: true
  },
  requestedCheckOut: Date,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'checked_in', 'checked_out', 'cancelled'],
    default: 'pending',
    index: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  specialNeeds: [String],
  transportationRequired: {
    type: Boolean,
    default: false
  },
  transportationDetails: {
    pickupLocation: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    scheduledTime: Date,
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'in_transit', 'completed', 'cancelled'],
      default: 'pending'
    },
    distance: Number, // in kilometers
    estimatedTravelTime: Number // in minutes
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  checkedInAt: Date,
  checkedOutAt: Date,
  checkedInBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  workflowStep: {
    type: Number,
    min: 1,
    max: 6
  },
  needsAssessment: {
    medicalNeeds: [String],
    legalNeeds: [String],
    counselingNeeds: [String],
    foodAssistance: Boolean,
    clothingAssistance: Boolean,
    documentationHelp: Boolean,
    safetyConcerns: [String]
  },
  supportServices: {
    medical: Boolean,
    legal: Boolean,
    counseling: Boolean,
    food: Boolean,
    transportation: Boolean,
    assignedServices: [{
      serviceType: String,
      providerId: { type: Schema.Types.ObjectId, ref: 'User' },
      scheduledDate: Date,
      status: {
        type: String,
        enum: ['pending', 'active', 'completed'],
        default: 'pending'
      }
    }]
  }
}, {
  timestamps: true
});

// Indexes
SafehouseBookingSchema.index({ status: 1, createdAt: -1 });
SafehouseBookingSchema.index({ safehouseId: 1, status: 1 });

export const SafehouseBooking = mongoose.model<ISafehouseBooking>('SafehouseBooking', SafehouseBookingSchema);

