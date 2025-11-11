"use client";
import { motion } from "framer-motion";

const LoadingView = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_70%)]"></div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
      />
      <p className="mt-8 text-lg text-slate-500 animate-pulse">
        Generating your FAQ...
      </p>
    </main>
  );
};

export default LoadingView;
