import mongoose, { Document } from 'mongoose';
export interface IMessage extends Document {
    from: mongoose.Types.ObjectId | string;
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
export declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, {}> & IMessage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Message.d.ts.map