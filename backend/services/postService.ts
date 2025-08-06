import Post, { IPost } from '../models/Post';
import Comment from '../models/Comment';

interface ListOptions { page?: number; limit?: number; }

export async function listPosts({
  page = 1,
  limit = 10,
}: ListOptions): Promise<{ posts: IPost[]; total: number }> {
  const skip = (page - 1) * limit;
  const posts = await Post.find()
    .populate('author', 'username')
    .populate('tags', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const total = await Post.countDocuments();
  return { posts, total };
}

export async function getPost(id: string): Promise<IPost> {
  const post = await Post.findById(id)
    .populate('author', 'username')
    .populate('tags', 'name slug');
  if (!post) {
    const err = new Error('Post not found');
    (err as any).statusCode = 404;
    throw err;
  }
  return post;
}

export async function createPost(
  data: Partial<IPost>,
  userId: string
): Promise<IPost> {
  const post = new Post({ ...data, author: userId });
  return post.save();
}

export async function updatePost(
  id: string,
  data: Partial<IPost>,
  userId: string
): Promise<IPost> {
  const post = await Post.findById(id) as (IPost & { author: any, save: () => Promise<IPost> }) | null;
  if (!post || post.author?.toString() !== userId) {
    const err = new Error('Not authorized');
    (err as any).statusCode = 403;
    throw err;
  }
  Object.assign(post, data);
  return post.save();
}

export async function deletePost(
  id: string,
  userId: string
): Promise<void> {
  const post = await Post.findById(id) as (IPost & { author: any, deleteOne: () => Promise<void> }) | null;
  if (!post || post.author?.toString() !== userId) {
    const err = new Error('Not authorized');
    (err as any).statusCode = 403;
    throw err;
  }
  await Comment.deleteMany({ post: id });
  await post.deleteOne();
}
