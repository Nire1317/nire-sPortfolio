import { Code2, Database, Server, Sparkles, Wrench } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { aiSkills, skillGroups } from "../data/profile";

const icons = { frontend: Code2, backend: Server, database: Database, tools: Wrench } as const;

export function Skills() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeader
          id="skills-title"
          eyebrow="Skills"
          title="The stack I build with."
          lead="Grouped by where it sits in the system. These are tools I've used on real projects, not a wishlist."
        />

        <div className="skills">
          {skillGroups.map((g, i) => {
            const Icon = icons[g.id as keyof typeof icons] ?? Code2;
            return (
              <Reveal key={g.id} delay={i * 0.06} className="skill-card card">
                <div className="skill-card__head">
                  <span className="skill-card__icon">
                    <Icon size={18} />
                  </span>
                  <h3>{g.title}</h3>
                </div>
                <p className="skill-card__blurb">{g.blurb}</p>
                <ul className="skill-card__list">
                  {g.items.map((s) => (
                    <li key={s} className="chip">
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}

          <Reveal delay={0.1} className="skill-card skill-card--ai card">
            <div className="skill-card__head">
              <span className="skill-card__icon">
                <Sparkles size={18} />
              </span>
              <h3>{aiSkills.title}</h3>
            </div>
            <p className="skill-card__blurb skill-card__blurb--strong">{aiSkills.blurb}</p>
            <div className="skill-card__ai">
              <ul className="skill-card__uses">
                {aiSkills.uses.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
              <ul className="skill-card__list">
                {aiSkills.tools.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
