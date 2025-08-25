import { Request, Response, NextFunction } from 'express';
import {
  createCommentService,
  updateCommentService,
  deleteCommentService,
} from '..//services/commentService';

export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const comment = await createCommentService(
      req.body,
      (req as any).user.id
    );
    res.status(201).json(comment);
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
    const comment = await updateCommentService(
      req.params.id,
      req.body.content,
      (req as any).user.id
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
    await deleteCommentService(req.params.id, (req as any).user.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
}
