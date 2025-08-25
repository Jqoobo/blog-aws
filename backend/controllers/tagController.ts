import { Request, Response, NextFunction } from "express";
import { listTagsService, createTagService } from "../services/tagService";

export async function getAllTags(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tags = await listTagsService();
    res.json(tags);
  } catch (err) {
    next(err);
  }
}

export async function createTag(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tag = await createTagService(req.body.name);
    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
}
