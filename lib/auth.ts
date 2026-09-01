import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { signJWT, verifyJWT, UserTokenPayload } from './jwt';

export { signJWT, verifyJWT, type UserTokenPayload };

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getSession(): Promise<UserTokenPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('campushire_token')?.value;
  if (!token) return null;
  return verifyJWT(token);
}
