import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import auth from '../middleware/authMiddleware';
import {
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController';

const router = Router();

const commentValidation = [
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('post').isMongoId().withMessage('Invalid Post ID'),
];

router.post(
  '/',
  auth,
  commentValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  createComment
);

router.put(
  '/:id',
  auth,
  param('id').isMongoId().withMessage('Invalid Comment ID'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  updateComment
);

router.delete(
  '/:id',
  auth,
  param('id').isMongoId().withMessage('Invalid Comment ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  deleteComment
);

export default router;
