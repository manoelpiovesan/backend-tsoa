/**
 * Authentication service using ONLY Keycloak
 * Completely removes the local JWT system
 */

/**
 * Checks if a user has specific permissions in Keycloak
 * @param userScopes - User scopes from Keycloak
 * @param requiredScopes - Required scopes
 * @returns boolean
 */
export function hasRequiredScopes(userScopes: string[], requiredScopes: string[]): boolean {
    return requiredScopes.every(scope => userScopes.includes(scope));
}

/**
 * Logout from Keycloak
 * @param refreshToken - Refresh token to invalidate
 * @returns Promise with logout result
 */
export async function logoutFromKeycloak(refreshToken: string): Promise<{ success: boolean; message: string }> {
    const logoutUrl = `${process.env.KC_AUTH_URL}/realms/${process.env.KC_REALM}/protocol/openid-connect/logout`;

    const params = new URLSearchParams();
    params.append('client_id', process.env.KC_CLIENT_ID || 'backend_node');
    params.append('client_secret', process.env.KC_CLIENT_SECRET || '');
    params.append('refresh_token', refreshToken);

    try {
        const response = await fetch(logoutUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });

        if (response.ok) {
            return { success: true, message: 'Logout completed successfully' };
        } else {
            return { success: false, message: 'Keycloak logout error' };
        }
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, message: 'Internal logout error' };
    }
}

/**
 * Validates if a Keycloak token is still valid
 * @param accessToken - Access token
 * @returns Promise with validation result
 */
export async function validateKeycloakToken(accessToken: string): Promise<{ valid: boolean; userInfo?: any }> {
    const introspectUrl = `${process.env.KC_AUTH_URL}/realms/${process.env.KC_REALM}/protocol/openid-connect/token/introspect`;

    const params = new URLSearchParams();
    params.append('client_id', process.env.KC_CLIENT_ID || 'backend_node');
    params.append('client_secret', process.env.KC_CLIENT_SECRET || '');
    params.append('token', accessToken);

    try {
        const response = await fetch(introspectUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });

        const result = await response.json();

        if (result.active) {
            return {
                valid: true,
                userInfo: {
                    username: result.username,
                    email: result.email,
                    roles: result.realm_access?.roles || []
                }
            };
        } else {
            return { valid: false };
        }
    } catch (error) {
        console.error('Token validation error:', error);
        return { valid: false };
    }
}
