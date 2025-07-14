import { NextFunction, Request, Response } from 'express';

// Specific interface for Keycloak user
export interface KeycloakUser {
    id: string;
    username: string;
    email?: string;
    scopes?: string[];
    roles?: string[];
    firstName?: string;
    lastName?: string;
}

export interface KeycloakRequest extends Request {
    kauth?: {
        grant?: {
            access_token?: {
                token?: string;
                content?: any;
            };
        };
    };
    // Use a different name to avoid conflicts with Express
    keycloakUser?: KeycloakUser;
}

/**
 * Keycloak middleware that extracts token information and populates req.keycloakUser
 * Completely replaces the previous JWT system
 */
export function keycloakAuthMiddleware(req: KeycloakRequest, res: Response, next: NextFunction) {
    // Check if user is authenticated by Keycloak
    if (!req.kauth || !req.kauth.grant || !req.kauth.grant.access_token) {
        return res.status(401).json({
            message: 'Authentication token not found or invalid',
            error: 'UNAUTHORIZED'
        });
    }

    const token = req.kauth.grant.access_token.content;

    // Extract information from Keycloak token
    const realmRoles = token.realm_access?.roles || [];
    const clientRoles = token.resource_access?.[process.env.KC_CLIENT_ID || 'backend_node']?.roles || [];

    // Combine realm and client roles as scopes
    const allScopes = [...realmRoles, ...clientRoles];

    req.keycloakUser = {
        id: token.sub,
        username: token.preferred_username || token.email,
        email: token.email,
        firstName: token.given_name,
        lastName: token.family_name,
        scopes: allScopes,
        roles: realmRoles
    };

    // Also populate req.user for TSOA compatibility
    (req as any).user = req.keycloakUser;

    console.log('🔐 User authenticated via Keycloak:', {
        username: req.keycloakUser.username,
        scopes: req.keycloakUser.scopes
    });

    next();
}

/**
 * Function to check specific scopes
 * Maintains the same interface as the previous system
 */
export function requireScopes(requiredScopes: string[]) {
    return (req: KeycloakRequest, res: Response, next: NextFunction) => {
        if (!req.keycloakUser || !req.keycloakUser.scopes) {
            return res.status(401).json({
                message: 'User not authenticated',
                error: 'UNAUTHORIZED'
            });
        }

        const hasRequiredScopes = requiredScopes.every(scope =>
            req.keycloakUser!.scopes!.includes(scope)
        );

        if (!hasRequiredScopes) {
            return res.status(403).json({
                message: 'Access denied: insufficient permissions',
                error: 'FORBIDDEN',
                required: requiredScopes,
                current: req.keycloakUser.scopes
            });
        }

        next();
    };
}
