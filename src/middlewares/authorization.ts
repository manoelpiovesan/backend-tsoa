import express from "express";

export async function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<void> {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
        throw new Error('Unauthorized');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new Error('Unauthorized');
    }
    const token = parts[1];
    if (token !== 'valid-token') {
        throw new Error('Unauthorized');
    }
}
