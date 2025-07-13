import {Controller, Post, Route, Body, Tags} from 'tsoa';
import {authenticate} from '../services/auth_service';

@Tags('Auth')
@Route('/auth')
export class AuthController extends Controller {

    constructor() {
        super();
    }

    /**
     * Logs in a user and returns a JWT token.
     * @param body - The request body containing username and password.
     * @returns {Promise<{ token: string }>} - A promise that resolves to an object containing the JWT token.
     */
    @Post('/login')
    public async login(@Body() body: { username: string; password: string }): Promise<{ token: string }> {
        return authenticate(body.username, body.password);
    }
}

