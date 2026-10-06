import { ArrowUpRight, FileText } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { about, profile } from "../data/profile";
import portrait from "../assets/profile.webp";

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionHeader id="about-title" eyebrow="About me" title="Who I am, what I build, how I work." />

        <div className="about">
          <Reveal className="about__portrait">
            <div className="about__frame">
              <img src={portrait} alt={`Portrait of ${profile.name}`} width={681} height={1024} loading="lazy" />
            </div>
            <dl className="about__facts">
              {about.facts.map((f) => (
                <div key={f.label}>
                  <dt className="mono">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="about__body">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className={i === 0 ? "about__lead" : "about__p"}>{p}</p>
              </Reveal>
            ))}

            <Reveal delay={0.1}>
              <h3 className="about__subhead">What I enjoy</h3>
              <ul className="about__enjoys">
                {about.enjoys.map((e) => (
                  <li key={e.title}>
                    <strong>{e.title}</strong>
                    <span>{e.note}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="about__learning card">
              <p className="mono about__learning-label">Currently learning</p>
              <p>{about.learning}</p>
            </Reveal>

            <Reveal delay={0.1} className="about__actions">
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                <FileText /> View Resume
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn">
                LinkedIn <ArrowUpRight className="arrow" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
