import mongoose, { Document } from 'mongoose';
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
export declare const Safehouse: mongoose.Model<ISafehouse, {}, {}, {}, mongoose.Document<unknown, {}, ISafehouse, {}, {}> & ISafehouse & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Safehouse.d.ts.map