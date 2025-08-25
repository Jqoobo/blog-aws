import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
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

/**
 * @openapi
 * /posts:
 *   get:
 *     summary: Pobierz wszystkie posty
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: Lista postów
 */
router.get('/', getAllPosts);

/**
 * @openapi
 * /posts/{id}:
 *   get:
 *     summary: Pobierz post po ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID posta
 *     responses:
 *       200:
 *         description: Szczegóły posta
 *       400:
 *         description: Błąd walidacji
 */
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid ID'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  getPostById
);

/**
 * @openapi
 * /posts:
 *   post:
 *     summary: Utwórz nowy post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post utworzony
 *       400:
 *         description: Błąd walidacji
 */
router.post(
  '/',
  auth,
  writeLimiter,
  postValidation,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  createPost
);

/**
 * @openapi
 * /posts/{id}:
 *   put:
 *     summary: Zaktualizuj post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID posta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post zaktualizowany
 *       400:
 *         description: Błąd walidacji
 */
router.put(
  '/:id',
  auth,
  writeLimiter,
  param('id').isMongoId().withMessage('Invalid ID'),
  ...postValidation,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  updatePost
);

/**
 * @openapi
 * /posts/{id}:
 *   delete:
 *     summary: Usuń post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID posta
 *     responses:
 *       200:
 *         description: Post usunięty
 *       400:
 *         description: Błąd walidacji
 */
router.delete(
  '/:id',
  auth,
  writeLimiter,
  param('id').isMongoId().withMessage('Invalid ID'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  deletePost
);

export default router;
