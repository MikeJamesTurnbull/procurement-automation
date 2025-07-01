"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
const functions_1 = require("@azure/functions");
const client_1 = require("@prisma/client");
const auth_1 = require("../utils/auth");
const prisma = new client_1.PrismaClient();
async function getMe(request, context) {
    try {
        const user = await (0, auth_1.verifyToken)(request);
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
    }
    catch (error) {
        context.error('Error in getMe:', error);
        return {
            status: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}
functions_1.app.http('auth-me', {
    methods: ['GET'],
    route: 'auth/me',
    authLevel: 'anonymous',
    handler: getMe
});
//# sourceMappingURL=auth.js.map