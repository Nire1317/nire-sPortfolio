import { motion } from "motion/react";
import { SectionHeader } from "../components/SectionHeader";
import { journey } from "../data/profile";

const stages = ["Learning", "Building", "Working", "Shipping", "Improving"] as const;

export function Journey() {
  return (
    <section id="journey" className="section" aria-labelledby="journey-title">
      <div className="container">
        <SectionHeader
          id="journey-title"
          eyebrow="Journey"
          title="From classroom to production."
          lead={
            <span className="stages mono">
              {stages.map((s, i) => (
                <span key={s}>
                  {s}
                  {i < stages.length - 1 && <span className="stages__sep">→</span>}
                </span>
              ))}
            </span>
          }
        />

        <ol className="timeline">
          {journey.map((j, i) => (
            <motion.li
              key={j.title}
              className={`timeline__item ${j.stage === "Improving" ? "is-next" : ""}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
            >
              <span className="timeline__dot" aria-hidden="true" />
              <div className="timeline__meta mono">
                <span className="timeline__stage">{j.stage}</span>
                <span>{j.period}</span>
              </div>
              <div className="timeline__card">
                <h3>{j.title}</h3>
                <p className="timeline__place">{j.place}</p>
                <p className="timeline__detail">{j.detail}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
