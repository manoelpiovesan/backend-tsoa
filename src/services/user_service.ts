/**
 * UserService is now just a set of utilities to work with Keycloak data
 * Completely removes local user management
 */

import { KeycloakUser } from '../middlewares/keycloak_auth';

export class UserService {

    /**
     * Formats Keycloak user data for API response
     * @param keycloakUser - User data from Keycloak
     * @returns Formatted object for response
     */
    formatUserResponse(keycloakUser: KeycloakUser): Record<string, any> {
        return {
            id: keycloakUser.id,
            username: keycloakUser.username,
            email: keycloakUser.email,
            firstName: keycloakUser.firstName,
            lastName: keycloakUser.lastName,
            fullName: keycloakUser.firstName && keycloakUser.lastName
                ? `${keycloakUser.firstName} ${keycloakUser.lastName}`
                : keycloakUser.username,
            roles: keycloakUser.roles || [],
            permissions: keycloakUser.scopes || []
        };
    }

    /**
     * Checks if the user has a specific role
     * @param keycloakUser - User data
     * @param role - Role to check
     * @returns boolean
     */
    hasRole(keycloakUser: KeycloakUser, role: string): boolean {
        return keycloakUser.roles?.includes(role) || false;
    }

    /**
     * Checks if the user is an administrator
     * @param keycloakUser - User data
     * @returns boolean
     */
    isAdmin(keycloakUser: KeycloakUser): boolean {
        return this.hasRole(keycloakUser, 'admin') || this.hasRole(keycloakUser, 'administrator');
    }

    /**
     * Gets user permissions (scopes + roles)
     * @param keycloakUser - User data
     * @returns Array of permissions
     */
    getUserPermissions(keycloakUser: KeycloakUser): string[] {
        const roles = keycloakUser.roles || [];
        const scopes = keycloakUser.scopes || [];

        // Combine and remove duplicates
        return [...new Set([...roles, ...scopes])];
    }
}
