import mongoose, { Document, Model } from 'mongoose';
import { IUser } from './User';
import { IPost } from './Post';

export interface IComment extends Document {
  content: string;
  author: IUser['_id'];
  post: IPost['_id'];
  createdAt: Date;
}

const commentSchema = new mongoose.Schema<IComment>({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment: Model<IComment> = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
