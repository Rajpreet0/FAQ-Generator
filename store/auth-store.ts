import { supabase } from "@/lib/supabase";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
                set({ user: data?.user ?? null, authReady: true });
            },

            login: async (email: string, password: string) => {
                set({ loading: true });
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (!error) set({ user: data.user });
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

                if (!error) set({ user: data.user });
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

