import mongoose, { Document, Model } from 'mongoose';
import { IUser } from './User';
import { ITag } from './Tag';

export interface IPost extends Document {
  title: string;
  content: string;
  tags: ITag['_id'][];
  author: IUser['_id'];
  createdAt: Date;
}

const postSchema = new mongoose.Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema);
export default Post;
