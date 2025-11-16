"use client";
import { motion } from "framer-motion";
import { Check, Lightbulb, Target, TriangleAlert } from "lucide-react";

export const SeoScoreCard = ({ seoData }: { seoData: any }) => {
  const score = seoData?.score || 0;
  
  const sections = [
    { title: "Stärken", icon: Check, data: seoData.strengths, color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700" },
    { title: "Schwächen", icon: TriangleAlert, data: seoData.weaknesses, color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700" },
    { title: "Empfehlungen", icon: Lightbulb, data: seoData.recommendations, color: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-700" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
        rounded-2xl p-8 border shadow-lg backdrop-blur-md
        bg-white/70 border-slate-200
        dark:bg-slate-900/60 dark:border-slate-700
      "
    >
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative w-40 h-40 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <title>SEO Score Progress Ring</title>
            <circle cx="50" cy="50" r="45" stroke="rgb(226,232,240)" strokeWidth="10" fill="transparent" />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#grad)"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * score) / 100}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor={score > 80 ? "#22c55e" : score > 60 ? "#eab308" : "#ef4444"} />
                <stop offset="100%" stopColor={score > 80 ? "#16a34a" : score > 60 ? "#d97706" : "#dc2626"} />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-800 dark:text-slate-200">{score}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">SEO Score</span>
          </div>
        </div>

        <p className="text-slate-700 dark:text-slate-300 mb-2">{seoData.summary}</p>

        <p className="flex items-center text-sm text-slate-600 dark:text-slate-400">
          <Target className="w-4 h-4" />
          <span className="ml-2">Impact:</span>
          <span className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400">
            {seoData.estimatedImpact.toUpperCase()}
          </span>
        </p>
      </div>

      <div className="space-y-4">
        {sections.map(
          (section) =>
            section.data?.length > 0 && (
              <div
                key={section.title}
                className={`rounded-xl p-4 border shadow-sm ${section.color}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <section.icon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                    {section.title}
                  </h3>
                </div>

                <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 text-sm space-y-1">
                  {section.data.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )
        )}
      </div>
    </motion.div>
  );
};
