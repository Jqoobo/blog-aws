import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import auth from "../middleware/authMiddleware";
import { createComment, updateComment, deleteComment } from "../controllers/commentController";

const router = Router();

const commentValidation = [
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("post").isMongoId().withMessage("Invalid Post ID"),
];

/**
 * @openapi
 * /api/comments:
 *   post:
 *     summary: Dodaj komentarz do posta
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               post:
 *                 type: string
 *                 description: ID posta
 *     responses:
 *       201:
 *         description: Komentarz utworzony
 *       400:
 *         description: Błąd walidacji
 */
router.post(
  "/",
  auth,
  commentValidation,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  createComment
);

/**
 * @openapi
 * /api/comments/{id}:
 *   put:
 *     summary: Edytuj komentarz
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID komentarza
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Komentarz zaktualizowany
 *       400:
 *         description: Błąd walidacji
 */
router.put(
  "/:id",
  auth,
  param("id").isMongoId().withMessage("Invalid Comment ID"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  updateComment
);

/**
 * @openapi
 * /api/comments/{id}:
 *   delete:
 *     summary: Usuń komentarz
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID komentarza
 *     responses:
 *       200:
 *         description: Komentarz usunięty
 *       400:
 *         description: Błąd walidacji
 */
router.delete(
  "/:id",
  auth,
  param("id").isMongoId().withMessage("Invalid Comment ID"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  deleteComment
);

export default router;
