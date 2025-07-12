import express from "express";

export async function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<void> {
    // JWT Strategy
}

