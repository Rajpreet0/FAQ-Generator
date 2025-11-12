"use client";
import { motion } from "framer-motion";
import { Check, Lightbulb, Target, TriangleAlert } from "lucide-react";

export const SeoScoreCard = ({ seoData }: { seoData: any }) => {
  const score = seoData?.score || 0;
  const sections = [
    { title: " Strengths", icon: Check, data: seoData.strengths, color: "border-green-200 bg-green-50" },
    { title: ` Weaknesses`, icon: TriangleAlert, data: seoData.weaknesses, color: "border-yellow-200 bg-yellow-50" },
    { title: " Recommendations", icon:  Lightbulb, data: seoData.recommendations, color: "border-cyan-200 bg-cyan-50" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200 shadow-lg p-8"
    >
      {/* Score Ring */}
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <div className="relative w-40 h-40 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <title>SEO Score Progress Ring</title>
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgb(226,232,240)"
              strokeWidth="10"
              fill="transparent"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke={`url(#grad)`}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * score) / 100}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={score > 80 ? "#22c55e" : score > 60 ? "#eab308" : "#ef4444"}
                />
                <stop
                  offset="100%"
                  stopColor={score > 80 ? "#16a34a" : score > 60 ? "#d97706" : "#dc2626"}
                />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-800">{score}</span>
            <span className="text-xs text-slate-500 mt-1">SEO Score</span>
          </div>
        </div>

        <p className="text-slate-700 mb-2">{seoData.summary}</p>
        <p className="flex items-center text-sm text-slate-500">
          <Target/> <span className="ml-2">Impact: {" "}</span>
          <span className="ml-1 font-semibold text-indigo-600">
            {seoData.estimatedImpact.toUpperCase()}
          </span>
        </p>
      </div>

      {/* Detail Sections */}
      <div className="space-y-4">
        {sections.map(
          (section) =>
            section.data &&
            section.data.length > 0 && (
              <div
                key={section.title}
                className={`rounded-xl p-4 border ${section.color} shadow-sm`}
              >
                {/* 🔹 Icon-Komponente hier */}
                <div className="flex items-center gap-2 mb-2">
                  <section.icon className="text-slate-700 w-5 h-5" />
                  <h3 className="font-semibold text-slate-800">{section.title}</h3>
                </div>

                <ul className="list-disc pl-5 text-slate-700 text-sm space-y-1">
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
