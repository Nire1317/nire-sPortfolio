import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { GitHubIcon } from "../../components/BrandIcons";
import { profile } from "../../data/profile";
import { HeroScene } from "./HeroScene";
import "./Hero.css";

const ease = [0.22, 1, 0.36, 1] as const;
const enter = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

// Hero copy and actions over HeroScene, the 3D world that fills the hero's background.
export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <motion.div className="hero__bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 }}>
        <HeroScene layout="background" />
      </motion.div>
      <div className="container hero__grid">
        <div className="hero__copy">
          <motion.p className="hero__intro mono" {...enter(0.05)}>
            <span className="hero__dot" aria-hidden="true" />
            {profile.name} · {profile.role}
          </motion.p>

          <motion.h1 id="hero-title" className="hero__title" {...enter(0.15)}>
            A New Era
            <br />
            of <span className="gradient-text">Coding.</span>
          </motion.h1>

          <motion.p className="hero__sub" {...enter(0.28)}>
            I build, break, learn, and ship software faster with AI, without losing the engineering behind it.
          </motion.p>

          <motion.p className="hero__about" {...enter(0.36)}>
            I'm {profile.shortName}, a full-stack developer from the {profile.location}. I work on real logistics systems by
            day and ship my own products on the side, with React, Node.js and SQL.
          </motion.p>

          <motion.div className="hero__actions" {...enter(0.46)}>
            <a href="#projects" className="btn btn-primary">
              View My Projects <ArrowRight className="arrow" />
            </a>
            <a href="#about" className="btn">
              About Me / Resume
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="btn">
              <GitHubIcon /> GitHub
            </a>
          </motion.div>

          <motion.ul className="hero__tags" aria-label="At a glance" {...enter(0.56)}>
            {["Developer", "Builder", "AI-assisted workflow", "Real projects"].map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
