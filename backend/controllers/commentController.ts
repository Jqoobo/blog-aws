import { Request, Response, NextFunction } from 'express';
import {
  createCommentService,
  updateCommentService,
  deleteCommentService,
} from '../services/commentService';

export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const comment = await createCommentService(
      req.body,
      userId
    );
    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
}

export async function updateComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const comment = await updateCommentService(
      req.params.id,
      req.body.content,
      userId
    );
    res.json(comment);
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    await deleteCommentService(req.params.id, userId);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
}