import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import auth from "../middleware/authMiddleware";
import { getAllTags, createTag } from "../controllers/tagController";

const router = Router();

/**
 * @openapi
 * /tags:
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
 * /tags:
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
 *       201:
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

export default router;
