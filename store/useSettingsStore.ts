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

    loadSettings: () => Promise<void>;
    saveSettings: () => Promise<boolean>;
    resetSettings: () => void;
}


export const useSettingsStore = create(
    persist<SettingsState>(
        (set, get) => ({
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

            loadSettings: async () => {
                try {
                    const response = await fetch('/api/settings');
                    if (response.ok) {
                        const data = await response.json();
                        set({
                            language: data.language || "de",
                            faqCount: data.faqCount || 6,
                            tone: data.tone || "professional",
                            model: data.model || "gpt-4o-mini",
                            exportFormat: data.exportFormat || "json",
                        });
                    }
                } catch (error) {
                    console.error('Failed to load settings:', error);
                }
            },

            saveSettings: async () => {
                try {
                    const state = get();
                    const response = await fetch('/api/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            language: state.language,
                            faqCount: state.faqCount,
                            tone: state.tone,
                            model: state.model,
                            exportFormat: state.exportFormat,
                        })
                    });
                    return response.ok;
                } catch (error) {
                    console.error('Failed to save settings:', error);
                    return false;
                }
            },

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