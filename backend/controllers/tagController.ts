import { Request, Response, NextFunction } from "express";
import Tag from "../models/Tag";
import slugify from "slugify";

export async function getAllTags(req: Request, res: Response, next: NextFunction) {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (err) {
    next(err);
  }
}

export async function createTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ status: "error", message: "Name is required" });
    }
    const slug = slugify(name, { lower: true, strict: true });

    const exists = await Tag.findOne({ slug });
    if (exists) {
      return res.status(400).json({ status: "error", message: "Tag already exists" });
    }

    const tag = new Tag({ name, slug });
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
}

export async function deleteTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) {
      return res.status(404).json({ status: "error", message: "Tag not found" });
    }
    res.status(200).json({ status: "success", message: "Tag deleted" });
  } catch (err) {
    next(err);
  }
}