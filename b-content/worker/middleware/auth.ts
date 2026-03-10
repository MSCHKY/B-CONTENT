// ============================================================
// B/CONTENT — Auth Middleware Stub
// Protects mutating API routes (POST/PUT/PATCH/DELETE).
// In production: requires CF Access authenticated user header.
// In development: allows all requests (passthrough).
// ============================================================

import type { Context, Next } from "hono";
import type { Env } from "../index";

/**
 * Auth middleware for mutating routes.
 *
 * Cloudflare Access injects `cf-access-authenticated-user-email` header
 * for all authenticated requests. This middleware checks for that header
 * on non-GET/HEAD/OPTIONS methods.
 *
 * In non-production environments, all requests are allowed to enable
 * local development and testing.
 */
export async function requireAuth(c: Context<{ Bindings: Env }>, next: Next) {
    // Allow safe methods (read-only) without auth
    const method = c.req.method.toUpperCase();
    if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
        return next();
    }

    // In dev/preview, skip auth check
    const env = c.env.ENVIRONMENT || "development";
    if (env !== "production") {
        return next();
    }

    // Check for CF Access authenticated user header
    const userEmail = c.req.header("cf-access-authenticated-user-email");

    if (!userEmail) {
        console.warn(`[Auth] Unauthenticated ${method} ${c.req.path}`);
        return c.json(
            { error: "Authentication required", code: "AUTH_REQUIRED" },
            401,
        );
    }

    // Log authenticated access for audit trail
    console.log(`[Auth] ${method} ${c.req.path} by ${userEmail}`);

    return next();
}
