import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Settings Store State Interface
 *
 * Defines user preferences and FAQ generation configuration settings.
 */
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

/**
 * User Settings Store
 *
 * Zustand store for managing user preferences and FAQ generation settings.
 * Syncs with backend API and persists to localStorage.
 *
 * State:
 * - email: User email address
 * - name: User display name
 * - language: FAQ output language (default: "de")
 * - faqCount: Number of FAQs to generate (default: 6)
 * - tone: Writing style/tone (default: "professional")
 * - model: OpenAI model selection (default: "gpt-5-nano")
 * - exportFormat: Export file format preference (default: "json")
 *
 * Actions:
 * - setEmail, setName: Update user info
 * - setLanguage, setFaqCount, setTone, setModel, setExportFormat: Update FAQ settings
 * - loadSettings: Fetch settings from API and update store
 * - saveSettings: Persist current settings to API
 * - resetSettings: Restore default values
 */
export const useSettingsStore = create(
    persist<SettingsState>(
        (set, get) => ({
            // DEFAULT VALUES
            email: "",
            name: "",
            language: "de",
            faqCount: 6,
            tone: "professional",
            model: "gpt-5-nano",
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