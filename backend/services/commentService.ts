import Comment, { IComment } from "../models/Comment";

interface CreateCommentDTO {
  content: string;
  post: string;
}

export async function createCommentService({ content, post }: CreateCommentDTO, userId: string): Promise<IComment> {
  const comment = new Comment({ content, post, author: userId });
  return comment.save();
}

export async function updateCommentService(commentId: string, content: string, userId: string): Promise<IComment> {
  const comment = (await Comment.findById(commentId)) as IComment & {
    author: any;
    content: string;
    save: () => Promise<IComment>;
  };
  if (!comment || comment.author.toString() !== userId) {
    const err = new Error("Not authorized");
    (err as any).statusCode = 403;
    throw err;
  }
  comment.content = content;
  return comment.save();
}

export async function deleteCommentService(commentId: string, userId: string): Promise<void> {
  const comment = (await Comment.findById(commentId)) as IComment & { author: any };
  if (!comment || comment.author.toString() !== userId) {
    const err = new Error("Not authorized");
    (err as any).statusCode = 403;
    throw err;
  }
  await Comment.findByIdAndDelete(commentId);
}
