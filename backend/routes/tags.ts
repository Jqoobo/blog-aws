import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import auth from "../middleware/authMiddleware";
import { getAllTags, createTag, deleteTag } from "../controllers/tagController";

const router = Router();

/**
 * @openapi
 * /api/tags:
 *   get:
 *     summary: Pobierz wszystkie tagi
 *     tags:
 *       - Tags
 *     responses:
 *       200:
 *         description: Lista tagów
 */
router.get("/", getAllTags);

/**
 * @openapi
 * /api/tags:
 *   post:
 *     summary: Utwórz nowy tag
 *     tags:
 *       - Tags
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tag utworzony
 *       400:
 *         description: Błąd walidacji
 */
router.post(
  "/",
  auth,
  body("name").trim().notEmpty().withMessage("Name is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  createTag
);

/**
 * @openapi
 * /api/tags/{id}:
 *   delete:
 *     summary: Usuń tag
 *     tags:
 *       - Tags
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag usunięty
 *       404:
 *         description: Tag nie znaleziony
 */
router.delete("/:id", auth, deleteTag);

export default router;
