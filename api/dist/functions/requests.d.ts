import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
export declare function getRequests(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>;
export declare function createRequest(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>;
export declare function getRequest(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>;
//# sourceMappingURL=requests.d.ts.map