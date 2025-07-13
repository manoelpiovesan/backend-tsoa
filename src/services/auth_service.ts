import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your_secret_key';
const JWT_EXPIRES_IN = '1h';

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
        throw new Error('User not found');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        throw new Error('Invalid password');
    }
    const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
    return {token};
}

/**
 * Verifies a JWT token.
 * @param token
 */
export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}

