"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
exports.generateDevToken = generateDevToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function verifyToken(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        const token = authHeader.substring(7);
        // In development, we'll use a simple JWT verification
        // In production, this should validate against Azure AD
        const jwtSecret = process.env.JWT_SECRET || 'your-development-jwt-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        return decoded;
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}
function generateDevToken(user) {
    const jwtSecret = process.env.JWT_SECRET || 'your-development-jwt-secret-key';
    return jsonwebtoken_1.default.sign({
        oid: user.oid,
        email: user.email,
        name: user.name,
        roles: ['User']
    }, jwtSecret, { expiresIn: '24h' });
}
//# sourceMappingURL=auth.js.map