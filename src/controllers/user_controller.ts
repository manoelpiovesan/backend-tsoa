import {Controller, Post, Route, Body, Tags} from 'tsoa';
import {UserService} from '../services/user_service';

@Tags('User')
@Route('/users')
export class UserController extends Controller {
    private userService = new UserService();

    /**
     * Creates a new user.
     * @param body - The request body containing username and password.
     * @return {Promise<Record<string,any>>} - A promise that resolves to the created user.
     */
    @Post()
    public async createUser(@Body() body: { username: string; password: string }): Promise<Record<string, any>> {
        const user = await this.userService.createUser(body.username, body.password);
        return {id: user.id, username: user.username, created_at: user.createdAt};
    }

}
