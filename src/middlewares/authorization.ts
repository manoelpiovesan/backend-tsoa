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
    if (securityName === "jwt") {
        return new Promise((resolve, reject) => {
            jwtAuthMiddleware(request, {
                status: () => ({json: (msg: any) => reject(msg)})
            } as any, () => {
                const user = (request as any).user;


                /*
                    If scopes are provided, check if the user has the required scopes.
                 */
                if (scopes && scopes.length > 0) {
                    if (!user || !user.scopes || !scopes.every(scope => user.scopes.includes(scope))) {
                        return reject({status: 403, message: 'Access denied: insufficient scopes'});
                    }
                }
                resolve(user);
            });
        });
    }
    return Promise.resolve();
}
