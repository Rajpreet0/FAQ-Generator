"use client";

import { createBrowserClient } from "@supabase/ssr"

/**
 * Supabase Browser Client
 *
 * Client-side Supabase instance for authentication and data operations.
 * Uses the SSR-compatible browser client for proper session handling.
 *
 * Configuration:
 * - URL: From NEXT_PUBLIC_SUPABASE_URL environment variable
 * - Key: From NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable
 *
 * Usage:
 * - User authentication (login, register, logout)
 * - Client-side auth state management
 * - Session retrieval
 *
 * Features:
 * - Automatic session refresh
 * - Cookie-based session storage
 * - SSR-compatible for Next.js App Router
 *
 * Note: Use this client in client components only.
 * For server-side operations, use getSupabaseServerClient from supabase-server.ts
 */
export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

