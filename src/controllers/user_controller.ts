import {Controller, Tags, Get, Security, Request, Route} from 'tsoa';
import { KeycloakRequest } from '../middlewares/keycloak_auth';

@Tags('User')
@Route('/users')
export class UserController extends Controller {

    /**
     * Gets current authenticated user information
     * Data comes directly from Keycloak
     * @param request - Request object with Keycloak authentication
     */
    @Get('/me')
    @Security('keycloak')
    public async getCurrentUser(@Request() request: KeycloakRequest): Promise<Record<string, any>> {
        const user = request.keycloakUser;

        console.log('👤 Keycloak user data:', user?.username);

        return {
            id: user?.id,
            username: user?.username,
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName,
            roles: user?.roles,
            scopes: user?.scopes
        };
    }

    /**
     * Endpoint for administrators to view their own profile information
     * Example of how to use specific roles
     */
    @Get('/admin/profile')
    @Security('keycloak', ['admin'])
    public async getAdminProfile(@Request() request: KeycloakRequest): Promise<Record<string, any>> {
        const user = request.keycloakUser;

        return {
            message: 'Administrator profile',
            user: {
                id: user?.id,
                username: user?.username,
                email: user?.email,
                roles: user?.roles,
                scopes: user?.scopes,
                adminLevel: 'full' // Example of admin-specific data
            },
            timestamp: new Date().toISOString()
        };
    }
}
