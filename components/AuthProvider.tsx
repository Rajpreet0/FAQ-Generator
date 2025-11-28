"use client";

import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";

/**
 * Authentication Provider Component
 *
 * Initializes authentication state on application mount.
 * Should be placed at the root level of the application.
 *
 * Features:
 * - Calls initAuth() on mount to check for existing session
 * - Retrieves user from Supabase and syncs to database
 * - Sets authReady flag when initialization completes
 * - Runs only once per application load
 *
 * Authentication Flow:
 * 1. Component mounts
 * 2. initAuth() is called
 * 3. Supabase session is checked
 * 4. If user exists, sync to database
 * 5. Update store with user data
 * 6. Set authReady to true
 *
 * Note: Placed in root layout to ensure auth is initialized
 * before any components that depend on user state
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const initAuth = useAuthStore((s) => s.initAuth);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        initAuth();
    }, []);
  return (
    <>
        {children}
    </>
  )
}

export default AuthProvider