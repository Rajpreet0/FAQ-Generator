"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, Loader2 } from "lucide-react";
import LoadingView from "@/components/LoadingView";
import { useFaqGeneration } from "@/hooks/useFaqGeneration";
import FaqList from "../components/FaqList";
import { SeoScoreCard } from "../components/SeoScoreCard";

const ResultsView = () => {
  const params = useSearchParams();
  const url = params.get("url");
  const { faq, seoData, loading, clearFaqs, seoLoading } = useFaqGeneration(url);
  const router = useRouter();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(faq, null, 2));
  };

  if (loading) return <LoadingView />;

  return (
    <main
      className="
        min-h-screen px-6 py-12 flex flex-col items-center relative overflow-hidden
        bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800
        dark:bg-gradient-to-br dark:from-[#0c0c14] dark:via-[#0b0b13] dark:to-[#0c0c17] dark:text-slate-200
        transition-all
      "
    >
      <div className="w-full max-w-7xl">

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-transparent bg-clip-text">
            ✨ Generierte FAQ
          </h1>

          <div className="flex w-full md:w-auto gap-3">
            <Button
              onClick={() => {
                clearFaqs();
                setTimeout(() => router.push("/"), 50);
              }}
              className="
                flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl
                dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200
              "
            >
              Neu generieren
            </Button>

            <Button
              onClick={handleCopy}
              className="
                flex-1 flex items-center justify-center gap-2 py-3 rounded-xl 
                bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 text-white
              "
            >
              <ClipboardCopy size={18} />
              Exportieren
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          <FaqList faq={faq} />

          <section className="w-full max-w-3xl">
            {seoLoading && (
              <div
                className="
                  flex flex-col items-center justify-center py-12 rounded-2xl border shadow-md
                  bg-white/70 backdrop-blur-md border-slate-200
                  dark:bg-slate-900/60 dark:border-slate-700
                "
              >
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  SEO-Analyse läuft...
                </p>
              </div>
            )}

            {!seoLoading && seoData && <SeoScoreCard seoData={seoData} />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ResultsView;
