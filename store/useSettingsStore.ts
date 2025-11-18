import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {

    email: string;
    name: string;

    language: string;
    faqCount: number;
    tone: string;
    model: string;
    exportFormat: string;
    
    setEmail: (v: string) => void;
    setName: (v: string) => void;

    setLanguage: (v: string) => void;
    setFaqCount: (v: number) => void;
    setTone: (v: string) => void;
    setModel: (v: string) => void;
    setExportFormat: (v: string) => void;

    resetSettings: () => void;
}


export const useSettingsStore = create(
    persist<SettingsState>(
        (set) => ({
            // DEFAULT VALUES
            email: "",
            name: "",
            language: "de",
            faqCount: 6,
            tone: "professional",
            model: "gpt-4o-mini",
            exportFormat: "json",

            // ACTIONS
            setEmail: (v) => set({ email: v }),
            setName: (v) => set({ name: v }),
            setLanguage: (v) => set({ language: v }),
            setFaqCount: (v) => set({ faqCount: v }),
            setTone: (v) => set({ tone: v }),
            setModel: (v) => set({ model: v }),
            setExportFormat: (v) => set({ exportFormat: v }),

            resetSettings: () => 
                set({
                    language: "de",
                    faqCount: 6,
                    tone: "professional",
                    model: "gpt-4o-mini",
                    exportFormat: "json",
                }),
        }),
        {
            name: "settings-store"
        }
    )
)