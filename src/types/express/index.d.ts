import {JwtPayload} from 'jsonwebtoken';

/**
 * Interface representing the authenticated user.
 * It extends JwtPayload to include the user's ID and username.
 * * @interface AuthenticatedUser
 * * @property {number} id - The unique identifier of the user.
 * * @property {string} username - The username of the user.
 *
 * >>>> This interface is used to type the user object in the Express request. <<<<
 * It is typically populated after successful authentication, such as when a JWT token is verified.
 */
export interface AuthenticatedUser extends JwtPayload {
    id: number;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}

export {};
