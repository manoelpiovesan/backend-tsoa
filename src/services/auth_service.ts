import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'my_secret_key';
const JWT_EXPIRES_IN = '1h';
const invalidCredentialsError = {
    status_code: 400,
    message: 'Username or password is invalid',
}
const passwordNotMatchError = {
    status_code: 400,
    message: 'Password does not match',
}

/**
 * Authenticates a user with username and password.
 * @param username
 * @param password
 * @returns {Promise<{token: string}>}
 * @throws {Error} If user not found or password is invalid.
 */
export async function authenticate(username: string, password: string): Promise<{ token: string; }> {
    const user = await User.findOne({where: {username: username}});
    if (!user) {
        throw invalidCredentialsError;
    }
    const valid = bcrypt.compare(password, user.password);
    if (!valid) {
        throw passwordNotMatchError;
    }
    const token = jwt.sign({id: user.id, username: user.username, scopes: user.scopes}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
    return {token};
}
