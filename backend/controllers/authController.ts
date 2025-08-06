import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';
import config from '../config';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const payload = await loginUser(req.body, config.jwtSecret);
    res.json(payload);
  } catch (err) {
    next(err);
  }
}
