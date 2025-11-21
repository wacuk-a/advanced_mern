import mongoose, { Document } from 'mongoose';
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
        distance?: number;
        estimatedTravelTime?: number;
    };
    approvedBy?: mongoose.Types.ObjectId;
    approvedAt?: Date;
    checkedInAt?: Date;
    checkedOutAt?: Date;
    checkedInBy?: mongoose.Types.ObjectId;
    notes?: string;
    workflowStep?: number;
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
export declare const SafehouseBooking: mongoose.Model<ISafehouseBooking, {}, {}, {}, mongoose.Document<unknown, {}, ISafehouseBooking, {}, {}> & ISafehouseBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=SafehouseBooking.d.ts.map