import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase Server Utilities
 *
 * Server-side Supabase client and helper functions for Next.js Server Components and API Routes.
 * Handles cookie-based session management for SSR compatibility.
 */

/**
 * Get Supabase Server Client
 *
 * Creates a server-side Supabase client with cookie handling.
 * Use this in Server Components, API Routes, and Server Actions.
 *
 * @returns {Promise<SupabaseClient>} Server-side Supabase client instance
 *
 * Features:
 * - Cookie-based session management
 * - Automatic cookie reading and writing
 * - SSR-compatible for Next.js App Router
 * - Handles cookie updates for session refresh
 *
 * Cookie Handling:
 * - getAll(): Retrieves all cookies for auth
 * - setAll(): Updates cookies (with error handling for Server Components)
 *
 * Note: Cookie setting may fail in Server Components without middleware,
 * but this is safely handled with try-catch
 */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Get Supabase User (Server-side)
 *
 * Retrieves the authenticated user from the server-side Supabase client.
 * Commonly used in API routes to verify authentication and get user data.
 *
 * @returns {Promise<User | null>} The authenticated user object or null if not authenticated
 *
 * Usage in API Routes:
 * ```typescript
 * const user = await getSupabaseUser();
 * if (!user) {
 *   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 * }
 * ```
 *
 * User Object Contains:
 * - id: User ID (UUID)
 * - email: User email address
 * - user_metadata: Custom user data (name, avatar_url, etc.)
 * - created_at: Account creation timestamp
 */
export async function getSupabaseUser() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
