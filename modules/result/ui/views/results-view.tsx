"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CircleQuestionMark, ClipboardCopy } from "lucide-react";
import LoadingView from "@/components/LoadingView";


interface FAQItem {
  question: string;
  answer: string;
}

const ResultsView = () => {

    const params = useSearchParams();
    const url = params.get("url");
    const [faq, setFaq] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!url) return;

        const generateFAQ = async () => {
            try {
                const extractRes = await fetch("/api/extract", {
                    method: "POST",
                    body: JSON.stringify({ url }),
                });
                
                const { content } = await extractRes.json();

                const generateRes = await fetch("/api/generate", {
                    method: "POST",
                    body: JSON.stringify({ content }),
                });


                const data = await generateRes.json();
                console.log(data);
                setFaq(data.faqs || []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        generateFAQ();
    }, [url]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(JSON.stringify(faq, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    if (loading) {
        return <LoadingView/>
    }


  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800 px-6 py-16 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-[-150px] right-[-100px] w-[400px] h-[400px] bg-purple-300/30 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-150px] left-[-100px] w-[400px] h-[400px] bg-cyan-300/30 rounded-full blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full z-10"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-transparent bg-clip-text mb-8 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]">
          ✨ Generierte FAQ
        </h1>

        <div className="space-y-6">
          {faq.map((item) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.15)] transition-all overflow-hidden"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-r from-indigo-500/10 via-cyan-400/10 to-purple-500/10 blur-xl"></div>

              <h3 className="text-lg flex items-center gap-2 font-semibold text-indigo-600 relative z-10">
                <CircleQuestionMark/> {item.question}
              </h3>
              <p className="mt-2   text-slate-700 leading-relaxed relative z-10">
                {item.answer}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 text-white font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <ClipboardCopy size={18} />
            {copied ? "Kopiert!" : "FAQ exportieren"}
          </Button>
        </div>
      </motion.div>
    </main>
  )
}

export default ResultsView
