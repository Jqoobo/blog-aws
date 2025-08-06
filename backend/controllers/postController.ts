import { Request, Response, NextFunction } from 'express';
import * as postService from '../services/postService';

export async function getAllPosts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await postService.listPosts({ page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getPostById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const post = await postService.getPost(req.params.id);
    res.json(post);
  } catch (err) {
    next(err);
  }
}

export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const post = await postService.createPost(req.body, (req as any).user.id);
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const post = await postService.updatePost(
      req.params.id,
      req.body,
      (req as any).user.id
    );
    res.json(post);
  } catch (err) {
    next(err);
  }
}

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await postService.deletePost(req.params.id, (req as any).user.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}
