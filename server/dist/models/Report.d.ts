import mongoose, { Document } from 'mongoose';
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
        riskScore: number;
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
export declare const Report: mongoose.Model<IReport, {}, {}, {}, mongoose.Document<unknown, {}, IReport, {}, {}> & IReport & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Report.d.ts.map