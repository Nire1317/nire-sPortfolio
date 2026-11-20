import { ArrowUpRight, FileText } from "lucide-react";
import { motion } from "motion/react";
import { ProfileCard } from "../components/ProfileCard";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { about, profile } from "../data/profile";

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionHeader id="about-title" eyebrow="About me" title="Who I am, what I build, how I work." />

        <div className="about">
          <Reveal className="about__portrait">
            <ProfileCard />
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
            <Reveal>
              <blockquote className="about__motto">
                <p className="about__quote">
                  <span aria-hidden="true">“</span>
                  {about.motto.quote}
                  <span aria-hidden="true">”</span>
                </p>
                <footer className="about__quote-sub">{about.motto.sub}</footer>
              </blockquote>
            </Reveal>

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

        <div className="pillars">
          <Reveal>
            <p className="pillars__label mono">// three things I live by</p>
          </Reveal>
          <ol className="pillars__grid">
            {about.pillars.map((p, i) => (
              <motion.li
                key={p.title}
                className="pillar"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="pillar__num mono">0{i + 1}</span>
                <h3 className="pillar__title">{p.title}</h3>
                <p className="pillar__desc">{p.desc}</p>
              </motion.li>
            ))}
          </ol>
          <Reveal delay={0.1} className="pillars__outro">
            <p>{about.pillarsLine}</p>
            <p className="pillars__closing">{about.closing}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
