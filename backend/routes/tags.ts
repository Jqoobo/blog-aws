import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/authMiddleware';
import { getAllTags, createTag } from '../controllers/tagController';

const router = Router();

router.get('/', getAllTags);

router.post(
  '/',
  auth,
  body('name').trim().notEmpty().withMessage('Name is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  createTag
);

export default router;
