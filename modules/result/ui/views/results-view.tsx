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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800 px-6 py-12 flex flex-col items-center relative overflow-hidden">
      <div className="w-full max-w-8xl">
        {/* Header + Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-transparent bg-clip-text">
            ✨ Generierte FAQ
          </h1>
          <div className="flex w-full md:w-auto gap-3">
            <Button
              onClick={() => {
                clearFaqs();
                setTimeout(() => {
                  router.push("/");
                }, 100);
              }}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl"
            >
              Neu generieren
            </Button>
            <Button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 text-white py-3 rounded-xl"
            >
              <ClipboardCopy size={18} /> Exportieren
            </Button>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: FAQ */}
          <FaqList faq={faq} />
          
          {/* Right: SEO */}
          <section className="w-full max-w-3xl">
            {seoLoading && (
              <div className="flex flex-col items-center justify-center py-12 bg-white/70 rounded-2xl shadow-md border border-slate-200 backdrop-blur-md">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin"/>
                <p className="text-slate-600 mt-3 text-sm">SEO-Analyse läuft...</p>
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
