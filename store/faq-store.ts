import { create } from "zustand";
import { persist } from "zustand/middleware";


export interface FAQItem {
    question: string;
    answer: string;
}

export interface SEOData {
  score: number;
  summary: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  estimatedImpact?: string;
}

interface FAQState {
    faqs: FAQItem[];
    seoData: SEOData | null;
    setFaqs: (faqs: FAQItem[]) => void;
    setSeoData: (data: SEOData) => void;
    clearFaqs: () => void;
}

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