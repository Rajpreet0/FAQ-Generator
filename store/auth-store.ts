import { supabase } from "@/lib/supabase";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * User Database Synchronization Helper
 *
 * Synchronizes authenticated user data from Supabase to the application database.
 * Called after login, registration, or session initialization to ensure data consistency.
 *
 * @param {any} user - Supabase user object with id, email, and metadata
 */
async function syncUserToDb(user: any) {
    if (!user) return;

    try {
        const response = await fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name,
                avatarUrl: user.user_metadata?.avatar_url
            })
        });

        if (!response.ok) {
            console.error('Failed to sync user to database');
        }
    } catch (error) {
        console.error('Error syncing user:', error);
    }
}

/**
 * Authentication Store State Interface
 *
 * Defines the structure of the authentication store with user data and auth methods.
 */
interface AuthState {
    user: any;
    loading: boolean;
    authReady: boolean;

    setUser: (u: any) => void;
    initAuth: () => Promise<void>;
    login: (email: string, password: string) => Promise<any>;
    register: (name: string, email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
}

/**
 * Authentication Store
 *
 * Zustand store for managing user authentication state using Supabase.
 * Handles login, registration, logout, and session initialization.
 * Automatically syncs user data to the application database.
 *
 * State:
 * - user: Current authenticated user object or null
 * - loading: Boolean indicating ongoing auth operations
 * - authReady: Boolean indicating auth initialization completion
 *
 * Actions:
 * - setUser: Manually set the current user
 * - initAuth: Initialize authentication by checking existing session
 * - login: Authenticate user with email and password
 * - register: Create new user account with name, email, and password
 * - logout: Sign out current user and clear session
 */
export const useAuthStore = create(
    persist<AuthState>(
        (set) => ({
            user: null,
            loading: false,
            authReady: false,

            setUser: (u) => set({ user: u }),

            initAuth: async () => {
                const { data } = await supabase.auth.getUser();
                const user = data?.user ?? null;

                if (user) {
                    await syncUserToDb(user);
                }

                set({ user, authReady: true });
            },

            login: async (email: string, password: string) => {
                set({ loading: true });
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (!error && data.user) {
                    await syncUserToDb(data.user);
                    set({ user: data.user });
                }
                set({ loading: false });

                return { data, error };
            },

            register: async (name: string, email: string, password: string) => {
                set({ loading: true });
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { name } }
                });

                if (!error && data.user) {
                    await syncUserToDb(data.user);
                    set({ user: data.user });
                }
                set({ loading: false });

                return { data, error }
            },

            logout: async () => {
                await supabase.auth.signOut();
                set({ user: null });
            },
        }),
        { name: "auth-storage" }
    )   
);

