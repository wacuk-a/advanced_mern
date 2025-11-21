import mongoose, { Document, Schema } from 'mongoose';

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

const FileSchema: Schema = new Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    },
    tags: [{
      type: String,
      trim: true
    }],
    isPublic: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

// Index for better query performance
FileSchema.index({ uploadedBy: 1, createdAt: -1 });
FileSchema.index({ mimeType: 1 });
FileSchema.index({ tags: 1 });

export const File = mongoose.model<IFile>('File', FileSchema);
