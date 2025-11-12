import { motion } from "framer-motion";

const HowItWorksSection = () => {
  return (
          <section className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-cyan-50 w-full text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">
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
              className="flex flex-col items-center text-center bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl p-8 shadow-md hover:shadow-lg transition-all"
            >
              <div className="text-indigo-500 font-bold text-3xl mb-2">
                {s.step}.
              </div>
              <h4 className="text-lg font-semibold mb-2">{s.title}</h4>
              <p className="text-slate-600">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
  )
}

export default HowItWorksSection