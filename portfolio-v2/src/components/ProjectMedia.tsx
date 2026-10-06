import type { Project } from "../data/profile";

export function ProjectMedia({ project }: { project: Project }) {
  if (project.image) {
    return (
      <div className="project-media">
        <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" width={1600} height={1000} />
      </div>
    );
  }
  if (!project.diagram) return null;
  // No screenshot (private work): show the system's shape instead of a fake image.
  return (
    <div className="project-media project-media--diagram" aria-hidden="true">
      <div className="diagram">
        {project.diagram.nodes.map((n, i) => (
          <span key={n} className="diagram__node mono" style={{ animationDelay: `${i * 0.12}s` }}>
            {n}
          </span>
        ))}
      </div>
      <p className="mono diagram__caption">{project.diagram.caption}</p>
    </div>
  );
}
