import { create } from "zustand";
import { persist } from "zustand/middleware";


export interface FAQItem {
    question: string;
    answer: string;
}

interface FAQState {
    faqs: FAQItem[];
    setFaqs: (faqs: FAQItem[]) => void;
    clearFaqs: () => void;
}

export const useFaqStore = create(
  persist<FAQState>(
    (set) => ({
      faqs: [],
      setFaqs: (faqs) => set({ faqs }),
      clearFaqs: () => set({ faqs: [] }),
    }),
    { name: "faq-storage" } 
  )
);