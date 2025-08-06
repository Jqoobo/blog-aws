import mongoose, { Document, Model } from 'mongoose';
import slugify from 'slugify';

export interface ITag extends Document {
  name: string;
  slug: string;
}

const tagSchema = new mongoose.Schema<ITag>({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true },
});

tagSchema.pre<ITag>('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

const Tag: Model<ITag> = mongoose.model<ITag>('Tag', tagSchema);
export default Tag;
