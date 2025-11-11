"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const HomeView = () => {

    const [url, setUrl] = useState("");
    const router = useRouter();


    const handleGenerate = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!url) return;
      router.push(`/result?url=${encodeURIComponent(url)}`);
    }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800 px-6">
      {/* Glow Circles */}
      <div className="absolute top-[-200px] left-[-150px] w-[400px] h-[400px] bg-cyan-300/30 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-200px] right-[-150px] w-[400px] h-[400px] bg-indigo-400/30 rounded-full blur-[120px]"></div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]">
          FAQ Generator
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Paste your website URL — we’ll analyze it and generate a custom FAQ section with AI ⚡
        </p>

        <form
          onSubmit={handleGenerate}
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
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
            className="bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-400/40 hover:shadow-cyan-400/50 transition-all cursor-pointer "
          >
            <Sparkles size={18} />
            Generieren
          </Button>
        </form>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-slate-500 text-sm z-10">
        © 2025 FAQGen — Built with ⚡ by You
      </footer>
    </main>
  )
}

export default HomeView