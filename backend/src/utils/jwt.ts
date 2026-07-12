import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const signToken = (payload: JwtPayload): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in environment variables.');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in environment variables.');
  }
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
