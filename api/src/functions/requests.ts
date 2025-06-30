import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../utils/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  amount: z.number().positive(),
  categoryId: z.string()
});

const updateRequestSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  categoryId: z.string().optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'CANCELLED']).optional()
});

export async function getRequests(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return { status: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const userData = await prisma.user.findUnique({ where: { entraId: user.oid } });
    if (!userData) {
      return { status: 404, body: JSON.stringify({ error: 'User not found' }) };
    }

    const requests = await prisma.procurementRequest.findMany({
      where: userData.role === 'ADMINISTRATOR' ? {} : { userId: userData.id },
      include: {
        user: { select: { name: true, email: true, department: true } },
        category: { select: { name: true } },
        approvals: { 
          include: { approver: { select: { name: true } } },
          orderBy: { stepOrder: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requests)
    };
  } catch (error) {
    context.error('Error in getRequests:', error);
    return { status: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}

export async function createRequest(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return { status: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const userData = await prisma.user.findUnique({ where: { entraId: user.oid } });
    if (!userData) {
      return { status: 404, body: JSON.stringify({ error: 'User not found' }) };
    }

    const body = await request.json();
    const validation = createRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return { 
        status: 400, 
        body: JSON.stringify({ error: 'Invalid request data', details: validation.error.errors }) 
      };
    }

    const newRequest = await prisma.procurementRequest.create({
      data: {
        ...validation.data,
        userId: userData.id,
        status: 'DRAFT'
      },
      include: {
        user: { select: { name: true, email: true, department: true } },
        category: { select: { name: true } }
      }
    });

    return {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequest)
    };
  } catch (error) {
    context.error('Error in createRequest:', error);
    return { status: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}

export async function getRequest(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return { status: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const requestId = request.params.id;
    if (!requestId) {
      return { status: 400, body: JSON.stringify({ error: 'Request ID required' }) };
    }

    const userData = await prisma.user.findUnique({ where: { entraId: user.oid } });
    if (!userData) {
      return { status: 404, body: JSON.stringify({ error: 'User not found' }) };
    }

    const procurementRequest = await prisma.procurementRequest.findFirst({
      where: {
        id: requestId,
        ...(userData.role !== 'ADMINISTRATOR' && { userId: userData.id })
      },
      include: {
        user: { select: { name: true, email: true, department: true } },
        category: { select: { name: true } },
        approvals: { 
          include: { approver: { select: { name: true } } },
          orderBy: { stepOrder: 'asc' }
        },
        attachments: true,
        auditLogs: {
          include: { user: { select: { name: true } } },
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!procurementRequest) {
      return { status: 404, body: JSON.stringify({ error: 'Request not found' }) };
    }

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(procurementRequest)
    };
  } catch (error) {
    context.error('Error in getRequest:', error);
    return { status: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}

// Register HTTP functions
app.http('requests-get', {
  methods: ['GET'],
  route: 'requests',
  authLevel: 'anonymous',
  handler: getRequests
});

app.http('requests-post', {
  methods: ['POST'],
  route: 'requests',
  authLevel: 'anonymous',
  handler: createRequest
});

app.http('requests-get-by-id', {
  methods: ['GET'],
  route: 'requests/{id}',
  authLevel: 'anonymous',
  handler: getRequest
});
