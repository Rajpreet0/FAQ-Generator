"use client";
import { motion } from "framer-motion";
import { useLottie } from "lottie-react";
import iAnimation from "@/public/iA_Animation.json";

const LoadingView = () => {
  const options = {
    animationData: iAnimation,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, { width: 180, height: 180 }); 

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_70%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="drop-shadow-[0_0_25px_rgba(99,102,241,0.3)]"
      >
        {View}
      </motion.div>

      <p className="mt-8 text-lg text-slate-500 animate-pulse text-center">
        Generating your FAQ...
      </p>
    </main>
  );
};

export default LoadingView;