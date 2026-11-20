import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { aiUses, responsibilities, workflow } from "../data/profile";

export function HowIBuild() {
  return (
    <section id="how-i-build" className="section" aria-labelledby="build-title">
      <div className="container">
        <SectionHeader
          id="build-title"
          eyebrow="How I build"
          title={
            <>
              I don't just ask AI to write code.
              <br />
              <span className="muted-title">I use it inside an engineering workflow.</span>
            </>
          }
        />

        <ol className="flow" aria-label="My workflow">
          {workflow.map((w, i) => (
            <motion.li
              key={w.step}
              className={`flow__step ${w.step.startsWith("AI") ? "is-ai" : ""}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
            >
              <span className="flow__index mono">{String(i + 1).padStart(2, "0")}</span>
              <strong>{w.step}</strong>
              <span className="flow__note">{w.note}</span>
            </motion.li>
          ))}
        </ol>

        <div className="build-split">
          <Reveal className="build-card card">
            <p className="mono build-card__label">Where AI helps</p>
            <ul className="build-card__list">
              {aiUses.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
            <p className="build-card__foot">It makes me faster at the parts that don't need my judgment.</p>
          </Reveal>

          <Reveal delay={0.08} className="build-card build-card--owned card">
            <p className="mono build-card__label">What stays my responsibility</p>
            <ul className="owned">
              {responsibilities.map((r) => (
                <li key={r.title}>
                  <Check size={16} />
                  <div>
                    <strong>{r.title}</strong>
                    <span>{r.note}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
