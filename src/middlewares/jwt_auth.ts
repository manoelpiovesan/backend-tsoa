import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

/**
 * Middleware to authenticate requests using JWT.
 * This middleware checks for the presence of a JWT in the Authorization header,
 * verifies it, and attaches the decoded user information to the request object.
 * @param req
 * @param res
 * @param next
 */
export function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Authorization header missing or malformed'});
    }
    const token = authHeader.split(' ')[1];
    try {
        (req as any).user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({message: 'Invalid or expired token'});
    }
}

