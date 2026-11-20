import { motion } from "motion/react";

const lines = [
  { text: "AI changed how quickly we can build.", tone: "muted" },
  { text: "It didn't remove the need to think.", tone: "strong" },
  {
    text: "It raised the importance of knowing what to build, why it works, and how to make it reliable.",
    tone: "body",
  },
] as const;

export function NewEra() {
  return (
    <section className="section new-era" aria-labelledby="era-title">
      <div className="new-era__line" aria-hidden="true" />
      <div className="container new-era__inner">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          The new era of coding
        </motion.p>
        <h2 id="era-title" className="sr-only">
          The New Era of Coding
        </h2>
        {lines.map((l, i) => (
          <motion.p
            key={l.text}
            className={`new-era__text is-${l.tone}`}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.25 }}
          >
            {l.text}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
