import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'campushire_super_secret_jwt_key_2026_production_ready'
);

export interface UserTokenPayload {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STUDENT' | 'RECRUITER' | 'PLACEMENT_OFFICER';
  studentId?: string;
  recruiterId?: string;
  companyId?: string;
}

export async function signJWT(payload: UserTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<UserTokenPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as UserTokenPayload;
  } catch {
    return null;
  }
}
