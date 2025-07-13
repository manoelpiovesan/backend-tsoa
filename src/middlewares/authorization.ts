import express from "express";
import {jwtAuthMiddleware} from "./jwt_auth";


/**
 * Middleware to authenticate requests using JWT.
 * This function checks if the securityName is 'jwt' and uses the jwtAuthMiddleware to authenticate the request.
 * If authentication is successful, it resolves with the user information.
 * If authentication fails, it rejects with an error message.
 *
 * @param request - The Express request object.
 * @param securityName - The name of the security scheme to use (e.g., 'jwt').
 * @param scopes - Optional scopes for the security scheme (not used in this implementation).
 * @returns A promise that resolves with user information or rejects with an error message.
 */
export async function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {

    /*
        Verifies if the securityName is 'jwt'.
        If it is, it uses the jwtAuthMiddleware to authenticate the request.
     */
    if (securityName === "jwt") {
        return new Promise((resolve, reject) => {
            jwtAuthMiddleware(request, {
                status: () => ({json: (msg: any) => reject(msg)})
            } as any, () => resolve((request as any).user));
        });
    }


    return Promise.resolve();
}
