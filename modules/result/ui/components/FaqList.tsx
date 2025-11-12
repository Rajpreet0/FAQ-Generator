"use client";
import { motion } from "framer-motion";
import { CircleQuestionMark } from "lucide-react";

const FaqList = ({ faq }: {faq: { question: string; answer: string }[] }) => {
  return (
    <div className="space-y-6">
        {faq.map((item) => (
            <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.15)] transition-all"
            >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-r from-indigo-500/10 via-cyan-400/10 to-purple-500/10 blur-xl"></div>
                <h3 className="text-lg flex items-center gap-2 font-semibold text-indigo-600 relative z-10">
                    <CircleQuestionMark/> {item.question}
                </h3>
                <p className="mt-2 text-slate-700 leading-relaxed relative z-10">{item.answer}</p>
            </motion.div>
        ))}
    </div>
  )
}

export default FaqList