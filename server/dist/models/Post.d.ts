import mongoose, { Document } from 'mongoose';
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
export declare const Post: mongoose.Model<IPost, {}, {}, {}, mongoose.Document<unknown, {}, IPost, {}, {}> & IPost & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Post;
//# sourceMappingURL=Post.d.ts.map