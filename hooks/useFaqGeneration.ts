"use client";

import { useFaqStore } from "@/store/faq-store";
import { useEffect, useRef, useState } from "react";

export const useFaqGeneration = (url: string | null) => {
    const { faqs: storedFaqs, seoData: storedSeo, setFaqs,  setSeoData ,clearFaqs } = useFaqStore();
    const [faq, setFaq] = useState(storedFaqs || []);
    const [loading, setLoading] = useState(faq.length === 0);
    const [seoData, setLocalSeoData] = useState(storedSeo || null);
    const [seoLoading, setSeoLoading] = useState(!storedSeo);
    const [hydrated, setHydrated] = useState(false);

    const hasGeneratedRef = useRef(false);
    const hasAnalyzedRef = useRef(false);

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
                const extractRes = await fetch("/api/extract", {
                    method: "POST",
                    body: JSON.stringify({ url }),
                });
                const { content } = await extractRes.json();

                const genRes = await fetch("/api/generate", {
                    method: "POST",
                    body: JSON.stringify({ content }),
                });

                const data = await genRes.json();
                const faqs = data.faqs || [];
                setFaq(faqs);
                setFaqs(faqs);

                // Store URL for later SEO score update
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('current_faq_url', url);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        generate();
    }, [hydrated, storedSeo, url, setFaqs, storedFaqs]);

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

                // Auto-save FAQs with SEO score to database
                if (typeof window !== 'undefined') {
                    const savedUrl = sessionStorage.getItem('current_faq_url');
                    if (savedUrl) {
                        try {
                            await fetch('/api/faqs', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    title: `FAQs from ${new URL(savedUrl).hostname}`,
                                    sourceUrl: savedUrl,
                                    seoScore: data.score,
                                    faqs: faq
                                })
                            });
                            sessionStorage.removeItem('current_faq_url');
                        } catch {
                            console.log('Could not auto-save FAQs (user may not be logged in)');
                        }
                    }
                }
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