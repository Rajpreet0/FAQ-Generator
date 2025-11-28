import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * FAQ Item Interface
 *
 * Represents a single FAQ entry with a question and answer pair.
 */
export interface FAQItem {
    question: string;
    answer: string;
}

/**
 * SEO Data Interface
 *
 * Represents the SEO analysis results for FAQ content.
 */
export interface SEOData {
  score: number;
  summary: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  estimatedImpact?: string;
}

/**
 * FAQ Store State Interface
 *
 * Defines the structure of the FAQ store with FAQs, SEO data, and management actions.
 */
interface FAQState {
    faqs: FAQItem[];
    seoData: SEOData | null;
    setFaqs: (faqs: FAQItem[]) => void;
    setSeoData: (data: SEOData) => void;
    clearFaqs: () => void;
}

/**
 * FAQ Store
 *
 * Zustand store for managing generated FAQs and their SEO analysis data.
 * Persists state to localStorage for session continuity.
 *
 * State:
 * - faqs: Array of generated FAQ items
 * - seoData: SEO analysis results for the current FAQ set
 *
 * Actions:
 * - setFaqs: Update the FAQ array
 * - setSeoData: Update SEO analysis data
 * - clearFaqs: Clear all FAQs, SEO data, and localStorage
 */
export const useFaqStore = create(
  persist<FAQState>(
    (set) => ({
      faqs: [],
      seoData: null,
      setFaqs: (faqs) => set({ faqs }),
      setSeoData: (data) => set({ seoData: data }),
        clearFaqs: () => {
        set({ faqs: [], seoData: null });
        if (typeof window !== "undefined") {
          localStorage.removeItem("faq-storage");
        }
      },
    }),
    { name: "faq-storage" } 
  )
);