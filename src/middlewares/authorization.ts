import express from "express";
import { keycloakAuthMiddleware, KeycloakRequest } from "./keycloak_auth";


/**
 * Authentication system using ONLY Keycloak
 * Completely removes the previous JWT system
 *
 * @param request - The Express request object.
 * @param securityName - The security scheme name ('keycloak').
 * @param scopes - Scopes/roles required to access the endpoint.
 * @returns A promise that resolves with user information or rejects with error.
 */
export async function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {

    if (securityName === "keycloak") {
        return new Promise((resolve, reject) => {
            keycloakAuthMiddleware(request as KeycloakRequest, {
                status: (code: number) => ({
                    json: (msg: any) => reject({
                        status: code,
                        message: msg.message || 'Authentication error'
                    })
                })
            } as any, () => {
                const user = (request as any).user;

                console.log('🔐 Verifying Keycloak authentication:', {
                    username: user?.username,
                    requiredScopes: scopes,
                    userScopes: user?.scopes
                });

                // Check scopes if provided
                if (scopes && scopes.length > 0) {
                    if (!user || !user.scopes || !scopes.every(scope => user.scopes.includes(scope))) {
                        return reject({
                            status: 403,
                            message: 'Access denied: insufficient permissions',
                            required: scopes,
                            current: user?.scopes || []
                        });
                    }
                }

                resolve(user);
            });
        });
    }

    return Promise.reject({
        status: 401,
        message: `Security scheme '${securityName}' not supported. Use 'keycloak'.`
    });
}
