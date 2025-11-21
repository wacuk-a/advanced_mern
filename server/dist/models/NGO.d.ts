import mongoose, { Document } from 'mongoose';
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
export declare const NGO: mongoose.Model<INGO, {}, {}, {}, mongoose.Document<unknown, {}, INGO, {}, {}> & INGO & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=NGO.d.ts.map