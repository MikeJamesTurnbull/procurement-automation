import { HttpRequest } from '@azure/functions';
export interface TokenPayload {
    oid: string;
    email: string;
    name: string;
    roles?: string[];
}
export declare function verifyToken(request: HttpRequest): Promise<TokenPayload | null>;
export declare function generateDevToken(user: {
    oid: string;
    email: string;
    name: string;
}): string;
//# sourceMappingURL=auth.d.ts.map