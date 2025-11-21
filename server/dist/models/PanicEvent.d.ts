import mongoose, { Document } from 'mongoose';
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
        audio?: string;
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
export declare const PanicEvent: mongoose.Model<IPanicEvent, {}, {}, {}, mongoose.Document<unknown, {}, IPanicEvent, {}, {}> & IPanicEvent & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=PanicEvent.d.ts.map