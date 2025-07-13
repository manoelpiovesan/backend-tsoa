import {JwtPayload} from 'jsonwebtoken';


export interface AuthenticatedUser extends JwtPayload {
    id: number;
    username: string;
}


/**
 * >>>> This interface is used to type the user object in the Express request. <<<<
 * It is typically populated after successful authentication, such as when a JWT token is verified.
 */
declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}

export {};
