import Tag, { ITag } from '../models/Tag';

export async function listTagsService(): Promise<ITag[]> {
  return Tag.find().sort('name');
}

export async function createTagService(name: string): Promise<ITag> {
  if (!name.trim()) {
    const err = new Error('Tag name cannot be empty');
    (err as any).statusCode = 400;
    throw err;
  }
  const tag = new Tag({ name });
  try {
    return await tag.save();
  } catch (e: any) {
    if (e.code === 11000) {
      const dup = new Error('Tag already exists');
      (dup as any).statusCode = 409;
      throw dup;
    }
    throw e;
  }
}
