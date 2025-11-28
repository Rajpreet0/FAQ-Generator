"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Protected Route Component
 *
 * Higher-order component that protects routes requiring authentication.
 * Redirects unauthenticated users to the login page.
 *
 * Features:
 * - Checks authentication status from Zustand store
 * - Waits for auth hydration before checking user
 * - Redirects to /auth if user is not authenticated
 * - Returns null during loading states to prevent flash
 * - Automatically re-checks when auth state changes
 *
 * Usage:
 * Wrap protected pages/components:
 * ```tsx
 * <Protected>
 *   <SettingsView />
 * </Protected>
 * ```
 *
 * Redirect Behavior:
 * - User not authenticated → Redirect to /auth
 * - Auth not ready → Show nothing (loading)
 * - User authenticated → Render children
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to protect
 */
const Protected = ({children} : {children: React.ReactNode}) => {
    const user = useAuthStore((s) => s.user);
    const authReady = useAuthStore((s) => s.authReady);
    const router = useRouter();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (!authReady) return;
        if (!user) router.replace("/auth"); 
    }, [authReady, user]);

    if (!authReady) return null;
    if (!user) return null;
  return (
    <>
        {children}
    </>
  )
}

export default Protected