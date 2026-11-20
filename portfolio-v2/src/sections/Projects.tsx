import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { SectionHeader } from "../components/SectionHeader";
import { ProjectModal } from "../components/ProjectModal";
import { ProjectMedia } from "../components/ProjectMedia";
import { projects, type Project } from "../data/profile";

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeader
          id="projects-title"
          eyebrow="Projects"
          title="Things I've built and shipped."
          lead="Each one started with a real problem. Open a project for the story: what I built, what was hard and what I owned."
        />

        <ul className="projects">
          {projects.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -28 : 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.08 }}
              className={i === 0 ? "projects__item projects__item--wide" : "projects__item"}
            >
              <button className="project-card card" onClick={() => setSelected(p)} aria-haspopup="dialog">
                <ProjectMedia project={p} />
                <div className="project-card__body">
                  <p className="project-card__kind mono">
                    {p.kind} · {p.year}
                  </p>
                  <h3 className="project-card__title">{p.title}</h3>
                  <p className="project-card__summary">{p.summary}</p>
                  <p className="project-card__problem">
                    <span className="mono">Problem</span> {p.problem}
                  </p>
                  <ul className="project-card__stack">
                    {p.stack.slice(0, 5).map((s) => (
                      <li key={s} className="chip">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <span className="project-card__more">
                    Read the story <Plus size={16} />
                  </span>
                </div>
              </button>
              {p.liveUrl && (
                <a className="project-card__live" href={p.liveUrl} target="_blank" rel="noreferrer" aria-label={`${p.title} live demo`}>
                  Live <ArrowUpRight size={14} />
                </a>
              )}
            </motion.li>
          ))}
        </ul>
      </div>

      <AnimatePresence>{selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </section>
  );
}
