import bcrypt from 'bcryptjs';
import {User} from '../models/user';

export class UserService {
    /**
     * Creates a new user with a hashed password.
     * @param username - The username of the user.
     * @param password - The password of the user.
     * @return {Promise<User>} - A promise that resolves to the created user.
     */
    async createUser(username: string, password: string): Promise<User> {

        // Check if the user already exists
        await this.userExists(username).then(exists => {
            if (exists) {
                throw new Error('User already exists');
            }
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        return await User.create({username, password: hashedPassword});
    }


    /**
     * Verifies if a user exists by username.
     * @param username - The username to check.
     * @return {Promise<boolean>} - A promise that resolves to true if the user exists, false otherwise.
     */
    async userExists(username: string): Promise<boolean> {
        const user = await User.findOne({where: {username}});
        return !!user;
    }

}

