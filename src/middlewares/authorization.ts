import express from "express";

export async function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<void> {
    const token = request.headers['authorization'];
    if (!token || token !== 'valid-token') {
        throw new Error('Unauthorized');
    }
}

