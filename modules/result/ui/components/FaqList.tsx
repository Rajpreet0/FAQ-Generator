"use client";
import { motion } from "framer-motion";
import { CircleQuestionMark } from "lucide-react";

/**
 * FAQ List Component
 *
 * Displays a list of FAQ items with animated cards and hover effects.
 * Each FAQ card shows a question with an icon and its corresponding answer.
 *
 * Features:
 * - Animated card entrance with framer-motion
 * - Hover effects with gradient glow
 * - Responsive design with backdrop blur
 * - Dark mode support
 * - Question icon for visual clarity
 *
 * @param {Object} props - Component props
 * @param {Array} props.faq - Array of FAQ objects with question and answer properties
 */
const FaqList = ({ faq }: {faq: { question: string; answer: string }[] }) => {
  return (
    <div className="space-y-6">
      {faq.map((item) => (
        <motion.div
          key={item.question}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="
            group relative p-6 rounded-2xl border shadow-md backdrop-blur-md
            bg-white/70 border-slate-200
            dark:bg-slate-900/60 dark:border-slate-700
            transition-all
            hover:shadow-[0_8px_40px_rgba(99,102,241,0.15)]
          "
        >
          <div
            className="
              absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all
              bg-gradient-to-r from-indigo-500/10 via-cyan-400/10 to-purple-500/10
            "
          />

          <h3 className="text-lg flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400 relative z-10">
            <CircleQuestionMark /> {item.question}
          </h3>

          <p className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed relative z-10">
            {item.answer}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

export default FaqList