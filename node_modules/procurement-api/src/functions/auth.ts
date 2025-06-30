import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../utils/auth';

const prisma = new PrismaClient();

export async function getMe(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return {
        status: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    const userData = await prisma.user.findUnique({
      where: { entraId: user.oid },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        role: true
      }
    });

    if (!userData) {
      return {
        status: 404,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    };
  } catch (error) {
    context.error('Error in getMe:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}

app.http('auth-me', {
  methods: ['GET'],
  route: 'auth/me',
  authLevel: 'anonymous',
  handler: getMe
});
