import { HttpRequest } from '@azure/functions';
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  oid: string; // Entra ID object ID
  email: string;
  name: string;
  roles?: string[];
}

export async function verifyToken(request: HttpRequest): Promise<TokenPayload | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // In development, we'll use a simple JWT verification
    // In production, this should validate against Azure AD
    const jwtSecret = process.env.JWT_SECRET || 'your-development-jwt-secret-key';
    
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function generateDevToken(user: { oid: string; email: string; name: string }): string {
  const jwtSecret = process.env.JWT_SECRET || 'your-development-jwt-secret-key';
  
  return jwt.sign(
    {
      oid: user.oid,
      email: user.email,
      name: user.name,
      roles: ['User']
    },
    jwtSecret,
    { expiresIn: '24h' }
  );
}
