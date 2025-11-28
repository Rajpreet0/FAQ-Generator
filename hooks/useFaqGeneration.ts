"use client";

import { useFaqStore } from "@/store/faq-store";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/**
 * FAQ Generation Hook
 *
 * Custom React hook that manages the complete FAQ generation lifecycle including
 * content extraction, FAQ generation, SEO analysis, and state management.
 * Handles hydration, loading states, and prevents duplicate API calls.
 *
 * @param {string | null} url - The source URL to extract content from and generate FAQs
 *
 * @returns {Object} Hook state and actions:
 *   - faq: Array of generated FAQ items
 *   - seoData: SEO analysis results or null
 *   - loading: Boolean indicating FAQ generation status
 *   - seoLoading: Boolean indicating SEO analysis status
 *   - clearFaqs: Function to clear all FAQs and reset state
 *
 * Features:
 * - Automatic content extraction from URL
 * - FAQ generation using user settings (language, count, tone, model)
 * - SEO analysis of generated FAQs
 * - Persistent state with hydration handling
 * - Prevents duplicate generation and analysis
 */
export const useFaqGeneration = (url: string | null) => {
    const { faqs: storedFaqs, seoData: storedSeo, setFaqs,  setSeoData ,clearFaqs } = useFaqStore();
    const {language, faqCount, tone, model} = useSettingsStore();
    const [faq, setFaq] = useState(storedFaqs || []);
    const [loading, setLoading] = useState(faq.length === 0);
    const [seoData, setLocalSeoData] = useState(storedSeo || null);
    const [seoLoading, setSeoLoading] = useState(!storedSeo);
    const [hydrated, setHydrated] = useState(false);

    const router = useRouter();
    const hasGeneratedRef = useRef(false);
    const hasAnalyzedRef = useRef(false);

    // Reset refs when storedFaqs is empty (after clearFaqs)
    useEffect(() => {
        if (storedFaqs.length === 0) {
            hasGeneratedRef.current = false;
            hasAnalyzedRef.current = false;
        }
    }, [storedFaqs.length]);

    useEffect(() => {
        const unsub = useFaqStore.persist.onFinishHydration(() => {
            setHydrated(true);
        });

        if (useFaqStore.persist.hasHydrated()) setHydrated(true);
        return unsub;
    }, []);


    useEffect(() => {

        if (!hydrated) return;

        if (storedFaqs?.length > 0) {
            setFaq(storedFaqs);
            setLocalSeoData(storedSeo || null);
            setLoading(false);

            if (storedSeo) {
                setSeoLoading(false);
                hasAnalyzedRef.current = true;
            }

            return;
        }

        if (!url || hasGeneratedRef.current) return;
        hasGeneratedRef.current = true

        const generate = async () => {
            try {
                // Extract content from website
                const extractRes = await fetch("/api/extract", {
                    method: "POST",
                    body: JSON.stringify({ url }),
                });

                // Check if extraction was successful
                if (!extractRes.ok) {
                    const errorData = await extractRes.json();
                    toast.error(errorData.error || "Die Webseite konnte nicht extrahiert werden");

                    // Reset states to allow retry
                    setLoading(false);
                    hasGeneratedRef.current = false;

                    // Redirect back to home after 2 seconds
                    setTimeout(() => {
                        router.push("/");
                    }, 2000);
                    return;
                }

                const { content } = await extractRes.json();

                // Check if content is empty or too short
                if (!content || content.trim().length < 50) {
                    toast.error("Die Webseite konnte nicht extrahiert werden oder enthält zu wenig Text");

                    // Reset states to allow retry
                    setLoading(false);
                    hasGeneratedRef.current = false;

                    setTimeout(() => {
                        router.push("/");
                    }, 2000);
                    return;
                }

                // Generate FAQs from extracted content
                const genRes = await fetch("/api/generate", {
                    method: "POST",
                    body: JSON.stringify({
                        content,
                        language,
                        faqCount,
                        tone,
                        model
                    }),
                });

                if (!genRes.ok) {
                    toast.error("Fehler beim Generieren der FAQs");

                    // Reset states to allow retry
                    setLoading(false);
                    hasGeneratedRef.current = false;

                    setTimeout(() => {
                        router.push("/");
                    }, 2000);
                    return;
                }

                const data = await genRes.json();
                const faqs = data.faqs || [];
                setFaq(faqs);
                setFaqs(faqs);
            } catch (err) {
                console.error("FAQ Generation Error:", err);
                toast.error("Die Webseite konnte nicht extrahiert werden");

                // Reset states to allow retry
                setLoading(false);
                hasGeneratedRef.current = false;

                // Redirect back to home
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            } finally {
                // Ensure loading is always stopped
                setLoading(false);
            }
        };

        generate();
    }, [hydrated, storedSeo, url, setFaqs, storedFaqs, router, language, faqCount, tone, model]);

    useEffect(() => {
        if (!hydrated || faq.length === 0) return;

        if (storedSeo) {
            setLocalSeoData(storedSeo);
            setSeoLoading(false);
            return;
        }

        if (hasAnalyzedRef.current) return;
        hasAnalyzedRef.current = true; 
        setSeoLoading(true);   

        const analyzeSEO = async () => {
            try {
                const res = await fetch("/api/seo-score", {
                    method: "POST",
                    body: JSON.stringify({ faq }),
                });
                const data = await res.json();
                setLocalSeoData(data);
                setSeoData(data);
            } catch (err) {
                console.error("SEO Analysis failed:", err);
            } finally {
                setSeoLoading(false);
            }
        };

        if(!storedSeo) analyzeSEO();
    }, [hydrated, faq, storedSeo, setSeoData]);

    return { faq, seoData, loading, clearFaqs, seoLoading };
};