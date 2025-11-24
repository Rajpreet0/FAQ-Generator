import { supabase } from "@/lib/supabase";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Helper function to sync user to database
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

