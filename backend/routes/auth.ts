import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { register, login } from '../controllers/authController';

const router = Router();

const registerValidation = [
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Rejestracja nowego użytkownika
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Użytkownik zarejestrowany
 *       400:
 *         description: Błąd walidacji
 */
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password'). notEmpty().withMessage('Password is required')
];

router.post(
  '/register',
  registerValidation,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  register
);

const loginValidation = [
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Logowanie użytkownika
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Zalogowano pomyślnie
 *       400:
 *         description: Błąd walidacji
 *       401:
 *         description: Nieprawidłowe dane logowania
 */
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password'). notEmpty().withMessage('Password is required')
];

router.post(
  '/login',
  loginValidation,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  login
);

export default router;
