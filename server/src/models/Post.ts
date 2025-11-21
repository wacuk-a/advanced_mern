import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IPost extends Document {
  title: string;
  content: string;
  author: IUser['_id'];
  tags: string[];
  isPublished: boolean;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required']
    },
    tags: [{
      type: String,
      trim: true
    }],
    isPublished: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for better search performance
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

export const Post = mongoose.model<IPost>('Post', postSchema);
export default Post;
