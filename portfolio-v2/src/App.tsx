import { MotionConfig } from "motion/react";
import { Nav } from "./components/Nav";
import { Hero } from "./sections/hero/Hero";
import { About } from "./sections/About";
import { Skills } from "./sections/Skills";
import { Projects } from "./sections/Projects";
import { HowIBuild } from "./sections/HowIBuild";
import { NewEra } from "./sections/NewEra";
import { Journey } from "./sections/Journey";
import { Contact } from "./sections/Contact";

export default function App() {
  return (
    // reducedMotion="user" drops transform animations for visitors who ask for less motion
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="page-glow" aria-hidden="true" />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <HowIBuild />
        <NewEra />
        <Journey />
        <Contact />
      </main>
    </MotionConfig>
  );
}
