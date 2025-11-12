"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import BackgroundGlow from "../components/BackgroundGlow";
import BenefitsSection from "../components/BenefitsSection";
import HowItWorksSection from "../components/HowItWorksSection";

const HomeView = () => {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleGenerate = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url) return;
    router.push(`/result?url=${encodeURIComponent(url)}`);
  };

  return (
    <main className="min-h-screen flex flex-col justify-start items-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800">
      {/* Background Glow */}
      <BackgroundGlow/>

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center py-28 px-6 max-w-4xl z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]"
        >
          Automatische FAQs in Sekunden ⚡
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 text-lg text-slate-600 max-w-2xl"
        >
          Spare Stunden an Copywriting und Kundenfragen. <br />
          Unser KI-Tool erstellt dir sofort eine professionelle FAQ-Sektion
          — perfekt für SEO & Conversion.
        </motion.p>

        {/* URL Input */}
        <motion.form
          onSubmit={handleGenerate}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 w-full"
        >
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full sm:w-96 p-3 rounded-xl border border-slate-300/60 bg-white/70 backdrop-blur-md text-slate-900 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />
          <Button
            onClick={() => handleGenerate()}
            className="bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-400/40 hover:shadow-cyan-400/50 transition-all cursor-pointer"
          >
            <Sparkles size={18} />
            Kostenlos testen
          </Button>
        </motion.form>
        <p className="mt-4 text-sm text-slate-500">
          Keine Anmeldung erforderlich – sofort starten.
        </p>
      </section>

      {/* Benefits Section */}
      <BenefitsSection/>

      {/* How It Works Section */}
      <HowItWorksSection/>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center relative z-10">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-cyan-400 text-transparent bg-clip-text">
          Bereit, dein FAQ zu erstellen?
        </h2>
        <p className="text-slate-600 mb-8">
          Gib einfach deine Website ein und sieh, wie dein FAQ in Sekunden entsteht.
        </p>
        <form
          onSubmit={handleGenerate}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full sm:w-96 p-3 rounded-xl border border-slate-300/60 bg-white/70 backdrop-blur-md text-slate-900 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />
          <Button
            onClick={() => handleGenerate()}
            className="bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-400/40 hover:shadow-cyan-400/50 transition-all"
          >
            <Sparkles size={18} />
            Jetzt generieren
          </Button>
        </form>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-200 w-full">
        <div className="flex justify-center items-center gap-2">
          <CheckCircle size={14} /> Keine Anmeldung nötig
          <span className="mx-2">•</span> © 2025 FAQGen
          <span className="mx-2">•</span> Made with ⚡ & ❤️
        </div>
      </footer>
    </main>
  );
};

export default HomeView;
