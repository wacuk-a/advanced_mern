import mongoose, { Schema, Document } from 'mongoose';

export interface ISafehouse extends Document {
  name: string;
  ngoId: mongoose.Types.ObjectId;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    emergencyPhone?: string;
  };
  capacity: {
    totalBeds: number;
    availableBeds: number;
    reservedBeds: number;
    occupiedBeds: number;
  };
  resources: {
    food: {
      available: boolean;
      capacity: number;
      currentStock: number;
    };
    medical: {
      available: boolean;
      staffOnSite: boolean;
      equipment: string[];
    };
    legal: {
      available: boolean;
      services: string[];
    };
    counseling: {
      available: boolean;
      services: string[];
    };
    transportation: {
      available: boolean;
      vehicles: number;
    };
  };
  amenities: string[];
  securityLevel: 'standard' | 'high' | 'maximum';
  accessibility: {
    wheelchairAccessible: boolean;
    petFriendly: boolean;
    childrenFriendly: boolean;
    lgbtqFriendly: boolean;
  };
  availability: {
    isAvailable: boolean;
    lastUpdated: Date;
    nextAvailableDate?: Date;
  };
  staff: Array<{
    userId: mongoose.Types.ObjectId;
    role: string;
    shift: string;
  }>;
  bookings: Array<{
    bookingId: mongoose.Types.ObjectId;
    checkInDate: Date;
    checkOutDate?: Date;
    status: 'pending' | 'approved' | 'checked_in' | 'checked_out' | 'cancelled';
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const SafehouseSchema = new Schema<ISafehouse>({
  name: {
    type: String,
    required: true
  },
  ngoId: {
    type: Schema.Types.ObjectId,
    ref: 'NGO',
    required: true,
    index: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: String,
    country: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    emergencyPhone: String
  },
  capacity: {
    totalBeds: { type: Number, required: true, min: 0 },
    availableBeds: { type: Number, default: 0, min: 0 },
    reservedBeds: { type: Number, default: 0, min: 0 },
    occupiedBeds: { type: Number, default: 0, min: 0 }
  },
  resources: {
    food: {
      available: { type: Boolean, default: true },
      capacity: { type: Number, default: 0 },
      currentStock: { type: Number, default: 0 }
    },
    medical: {
      available: { type: Boolean, default: false },
      staffOnSite: { type: Boolean, default: false },
      equipment: [String]
    },
    legal: {
      available: { type: Boolean, default: false },
      services: [String]
    },
    counseling: {
      available: { type: Boolean, default: true },
      services: [String]
    },
    transportation: {
      available: { type: Boolean, default: false },
      vehicles: { type: Number, default: 0 }
    }
  },
  amenities: [String],
  securityLevel: {
    type: String,
    enum: ['standard', 'high', 'maximum'],
    default: 'standard'
  },
  accessibility: {
    wheelchairAccessible: { type: Boolean, default: false },
    petFriendly: { type: Boolean, default: false },
    childrenFriendly: { type: Boolean, default: true },
    lgbtqFriendly: { type: Boolean, default: true }
  },
  availability: {
    isAvailable: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },
    nextAvailableDate: Date
  },
  staff: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    role: String,
    shift: String
  }],
  bookings: [{
    bookingId: { type: Schema.Types.ObjectId, ref: 'SafehouseBooking' },
    checkInDate: Date,
    checkOutDate: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'checked_in', 'checked_out', 'cancelled'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true
});

// Indexes
SafehouseSchema.index({ ngoId: 1, 'availability.isAvailable': 1 });
SafehouseSchema.index({ 'address.coordinates.latitude': 1, 'address.coordinates.longitude': 1 });
SafehouseSchema.index({ 'capacity.availableBeds': 1 });

export const Safehouse = mongoose.model<ISafehouse>('Safehouse', SafehouseSchema);

