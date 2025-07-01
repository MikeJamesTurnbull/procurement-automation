"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequests = getRequests;
exports.createRequest = createRequest;
exports.getRequest = getRequest;
const functions_1 = require("@azure/functions");
const client_1 = require("@prisma/client");
const auth_1 = require("../utils/auth");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schemas
const createRequestSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    amount: zod_1.z.number().positive(),
    categoryId: zod_1.z.string()
});
const updateRequestSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().min(1).optional(),
    amount: zod_1.z.number().positive().optional(),
    categoryId: zod_1.z.string().optional(),
    status: zod_1.z.enum(['DRAFT', 'SUBMITTED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'CANCELLED']).optional()
});
async function getRequests(request, context) {
    try {
        const user = await (0, auth_1.verifyToken)(request);
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
    }
    catch (error) {
        context.error('Error in getRequests:', error);
        return { status: 500, body: JSON.stringify({ error: 'Internal server error' }) };
    }
}
async function createRequest(request, context) {
    try {
        const user = await (0, auth_1.verifyToken)(request);
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
    }
    catch (error) {
        context.error('Error in createRequest:', error);
        return { status: 500, body: JSON.stringify({ error: 'Internal server error' }) };
    }
}
async function getRequest(request, context) {
    try {
        const user = await (0, auth_1.verifyToken)(request);
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
    }
    catch (error) {
        context.error('Error in getRequest:', error);
        return { status: 500, body: JSON.stringify({ error: 'Internal server error' }) };
    }
}
// Register HTTP functions
functions_1.app.http('requests-get', {
    methods: ['GET'],
    route: 'requests',
    authLevel: 'anonymous',
    handler: getRequests
});
functions_1.app.http('requests-post', {
    methods: ['POST'],
    route: 'requests',
    authLevel: 'anonymous',
    handler: createRequest
});
functions_1.app.http('requests-get-by-id', {
    methods: ['GET'],
    route: 'requests/{id}',
    authLevel: 'anonymous',
    handler: getRequest
});
//# sourceMappingURL=requests.js.map