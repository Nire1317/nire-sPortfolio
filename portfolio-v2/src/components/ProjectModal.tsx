import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { GitHubIcon } from "./BrandIcons";
import { ProjectMedia } from "./ProjectMedia";
import type { Project } from "../data/profile";
import "./ProjectModal.css";

type Props = { project: Project; onClose: () => void };

export function ProjectModal({ project, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Keep Tab inside the dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const story: { label: string; text?: string }[] = [
    { label: "The problem", text: project.problem },
    { label: "What I built", text: project.built },
    { label: "What was challenging", text: project.challenge },
    { label: "What I learned", text: project.learned },
    { label: "My contribution", text: project.contribution },
  ];

  return (
    <motion.div
      className="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="modal__panel"
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close project details">
          <X size={18} />
        </button>

        <ProjectMedia project={project} />

        <div className="modal__content">
          <p className="mono modal__kind">
            {project.kind} · {project.year}
          </p>
          <h3 id="modal-title" className="modal__title">
            {project.title}
          </h3>
          <p className="modal__summary">{project.summary}</p>

          <div className="modal__links">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                Live demo <ArrowUpRight className="arrow" />
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn">
                <GitHubIcon /> Repository
              </a>
            )}
          </div>

          <div className="modal__grid">
            <div className="modal__story">
              {story.map((s) =>
                s.text ? (
                  <section key={s.label}>
                    <h4>{s.label}</h4>
                    <p>{s.text}</p>
                  </section>
                ) : import.meta.env.DEV ? (
                  <section key={s.label}>
                    <h4>{s.label}</h4>
                    <p className="todo-note">To fill in: add this in src/data/profile.ts (hidden in production)</p>
                  </section>
                ) : null,
              )}
            </div>
            <aside className="modal__aside">
              <h4>Key features</h4>
              <ul className="modal__features">
                {project.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <h4>Stack</h4>
              <ul className="modal__stack">
                {project.stack.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
