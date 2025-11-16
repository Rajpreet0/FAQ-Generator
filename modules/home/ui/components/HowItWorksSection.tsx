import { motion } from "framer-motion";

const HowItWorksSection = () => {
  return (
    <section
      className="
        py-20 px-6 w-full text-center
        bg-gradient-to-br from-indigo-50 to-cyan-50
        dark:bg-gradient-to-br dark:from-[#0f1018] dark:via-[#0c0d14] dark:to-[#0f1018]
        transition-all
      "
    >
      <h2
        className="
          text-3xl font-bold mb-8
          text-slate-800 dark:text-slate-200
        "
      >
        So funktioniert’s
      </h2>

      <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {[
          {
            step: "1",
            title: "Website-Link einfügen",
            desc: "Füge die URL deiner Website ein, damit unser Tool den Text analysieren kann.",
          },
          {
            step: "2",
            title: "KI analysiert Inhalte",
            desc: "Die künstliche Intelligenz erkennt automatisch relevante Fragen und Antworten.",
          },
          {
            step: "3",
            title: "FAQ fertig!",
            desc: "Erhalte eine sofort einsatzbereite FAQ-Sektion – zum Export als HTML oder Markdown.",
          },
        ].map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="
              flex flex-col items-center text-center p-8
              rounded-2xl backdrop-blur-md shadow-md hover:shadow-lg transition-all
              bg-white/70 border border-slate-200
              dark:bg-slate-900/50 dark:border-slate-700 dark:shadow-xl
            "
          >
            <div className="text-indigo-500 dark:text-indigo-400 font-bold text-3xl mb-2">
              {s.step}.
            </div>
            <h4 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
              {s.title}
            </h4>
            <p className="text-slate-600 dark:text-slate-400">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorksSection