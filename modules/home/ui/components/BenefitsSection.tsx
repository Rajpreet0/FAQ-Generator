import { Brain, Globe2, Zap } from "lucide-react";
import { motion } from "framer-motion";

const BenefitsSection = () => {
  return (
    <section className="py-20 px-6 max-w-5xl text-center mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-200">
        Warum FAQGen?
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: (
              <Brain className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
            ),
            title: "KI-gesteuerte Inhalte",
            desc: "Erhalte hochwertige FAQs, die deinen Website-Text verstehen und präzise Antworten liefern.",
          },
          {
            icon: <Zap className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />,
            title: "Sekundenschnell",
            desc: "Ein Klick – und dein kompletter FAQ-Bereich ist generiert. Kein Schreiben, kein Nachdenken.",
          },
          {
            icon: (
              <Globe2 className="w-8 h-8 text-purple-500 dark:text-purple-400" />
            ),
            title: "SEO-optimiert",
            desc: "Erhöhe deine Sichtbarkeit bei Google mit automatisch optimierten Fragen & Antworten.",
          },
        ].map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="
              p-8 rounded-2xl transition-all backdrop-blur-lg
              bg-white/70 border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.05)]
              hover:shadow-[0_8px_40px_rgba(99,102,241,0.15)]
              dark:bg-slate-900/50 dark:border-slate-700
              dark:shadow-[0_8px_25px_rgba(0,0,0,0.35)]
              dark:hover:shadow-[0_8px_45px_rgba(99,102,241,0.15)]
            "
          >
            <div className="mb-4 flex justify-center">{b.icon}</div>

            <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">
              {b.title}
            </h3>

            <p className="text-slate-600 dark:text-slate-400">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default BenefitsSection