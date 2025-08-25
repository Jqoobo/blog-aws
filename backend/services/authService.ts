import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthDTO { username: string; password: string; }

export async function registerUser({
  username,
  password,
}: AuthDTO): Promise<{ id: string; username: string }> {
  const user = new User({ username, password });
  await user.save();
  return { id: (user._id as unknown as { toString(): string }).toString(), username: user.username };
}

export async function loginUser(
  { username, password }: AuthDTO,
  jwtSecret: string
): Promise<{ token: string; user: { id: string; username: string } }> {
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Invalid credentials');
    (err as any).statusCode = 401;
    throw err;
  }
  const userId = (user._id as unknown as { toString(): string }).toString();
  const token = jwt.sign({ id: userId }, jwtSecret, {
    expiresIn: '1h',
  });
  return { token, user: { id: userId, username: user.username } };
}
