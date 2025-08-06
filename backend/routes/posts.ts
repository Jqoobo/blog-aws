import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import auth from '../middleware/authMiddleware';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController';

const router = Router();
const writeLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

const postValidation = [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('content').trim().notEmpty().withMessage('Content required'),
];

router.get('/', getAllPosts);

router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  getPostById
);

router.post(
  '/',
  auth,
  writeLimiter,
  postValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  createPost
);

router.put(
  '/:id',
  auth,
  writeLimiter,
  param('id').isMongoId().withMessage('Invalid ID'),
  ...postValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  updatePost
);

router.delete(
  '/:id',
  auth,
  writeLimiter,
  param('id').isMongoId().withMessage('Invalid ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  deletePost
);

export default router;
