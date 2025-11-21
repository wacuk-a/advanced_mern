import mongoose, { Document } from 'mongoose';
export interface IFile extends Document {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    url: string;
    uploadedBy: mongoose.Types.ObjectId;
    metadata: {
        width?: number;
        height?: number;
        duration?: number;
        thumbnail?: string;
        [key: string]: any;
    };
    tags: string[];
    isPublic: boolean;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const File: mongoose.Model<IFile, {}, {}, {}, mongoose.Document<unknown, {}, IFile, {}, {}> & IFile & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=File.d.ts.map