import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { register, login } from '../controllers/authController';

const router = Router();

const registerValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password'). notEmpty().withMessage('Password is required')
];

router.post(
  '/register',
  registerValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  register
);

const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password'). notEmpty().withMessage('Password is required')
];

router.post(
  '/login',
  loginValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  login
);

export default router;
