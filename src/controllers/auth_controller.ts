import {Controller, Post, Route, Body, Tags, Get, Request, Security} from 'tsoa';
import { KeycloakRequest } from '../middlewares/keycloak_auth';

@Tags('Auth')
@Route('/auth')
export class AuthController extends Controller {

    constructor() {
        super();
    }

    /**
     * Direct Keycloak login using username and password
     * This endpoint allows login without accessing Keycloak's login screen
     * @param body - User credentials (username and password)
     * @returns Keycloak access token and user information
     */
    @Post('/login')
    public async login(@Body() body: {
        username: string;
        password: string;
    }): Promise<any> {
        const tokenUrl = `${process.env.KC_AUTH_URL}/realms/${process.env.KC_REALM}/protocol/openid-connect/token`;

        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('client_id', process.env.KC_CLIENT_ID || 'backend_node');
        params.append('client_secret', process.env.KC_CLIENT_SECRET || '');
        params.append('username', body.username);
        params.append('password', body.password);

        try {
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params
            });

            console.log(params);

            if (!response.ok) {
                const errorData = await response.json();
                this.setStatus(401);
                return {
                    success: false,
                    error: 'Invalid credentials',
                    details: errorData.error_description || 'Incorrect username or password'
                };
            }

            const tokenData = await response.json();

            console.log('✅ Keycloak login successful:', body.username);

            return {
                success: true,
                message: 'Login successful via Keycloak',
                data: {
                    access_token: tokenData.access_token,
                    refresh_token: tokenData.refresh_token,
                    expires_in: tokenData.expires_in,
                    token_type: tokenData.token_type || 'Bearer'
                }
            };
        } catch (error) {
            console.error('❌ Keycloak login error:', error);
            this.setStatus(500);
            return {
                success: false,
                error: 'Internal server error',
                details: 'Failed to communicate with Keycloak server'
            };
        }
    }

    /**
     * Get authenticated user profile information
     * @param request - Request object with Keycloak authentication
     * @returns User profile data from Keycloak token
     */
    @Get('/profile')
    @Security('keycloak')
    public async getProfile(@Request() request: KeycloakRequest): Promise<any> {
        const user = request.keycloakUser;

        if (!user) {
            this.setStatus(401);
            return {
                success: false,
                error: 'User not found'
            };
        }

        console.log('👤 Profile accessed via Keycloak:', user.username);

        return {
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles,
                scopes: user.scopes
            }
        };
    }

    /**
     * Refresh Keycloak access token using refresh token
     * @param body - Refresh token
     * @returns New access token
     */
    @Post('/refresh')
    public async refreshToken(@Body() body: { refresh_token: string }): Promise<any> {
        const tokenUrl = `${process.env.KC_AUTH_URL}/realms/${process.env.KC_REALM}/protocol/openid-connect/token`;

        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('client_id', process.env.KC_CLIENT_ID || 'backend_node');
        params.append('client_secret', process.env.KC_CLIENT_SECRET || '');
        params.append('refresh_token', body.refresh_token);

        try {
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params
            });

            if (!response.ok) {
                this.setStatus(401);
                return {
                    success: false,
                    error: 'Invalid refresh token'
                };
            }

            const tokenData = await response.json();

            return {
                success: true,
                data: {
                    access_token: tokenData.access_token,
                    refresh_token: tokenData.refresh_token,
                    expires_in: tokenData.expires_in
                }
            };
        } catch (error) {
            this.setStatus(500);
            return {
                success: false,
                error: 'Internal server error'
            };
        }
    }

    /**
     * Logout from Keycloak
     * @param request - Request object with Keycloak authentication
     * @param body - Refresh token to invalidate
     * @returns Logout confirmation
     */
    @Post('/logout')
    @Security('keycloak')
    public async logout(@Request() request: KeycloakRequest, @Body() body: { refresh_token: string }): Promise<any> {
        const logoutUrl = `${process.env.KC_AUTH_URL}/realms/${process.env.KC_REALM}/protocol/openid-connect/logout`;

        const params = new URLSearchParams();
        params.append('client_id', process.env.KC_CLIENT_ID || 'backend_node');
        params.append('client_secret', process.env.KC_CLIENT_SECRET || '');
        params.append('refresh_token', body.refresh_token);

        try {
            await fetch(logoutUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params
            });

            console.log('👋 Logout successful:', request.keycloakUser?.username);

            return {
                success: true,
                message: 'Logout completed successfully'
            };
        } catch (error) {
            console.error('❌ Logout error:', error);
            return {
                success: true,
                message: 'Logout completed (server error ignored)'
            };
        }
    }
}
