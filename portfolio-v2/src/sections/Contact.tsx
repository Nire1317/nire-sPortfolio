import { ArrowUpRight, FileText, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "../components/BrandIcons";
import { Reveal } from "../components/Reveal";
import { profile } from "../data/profile";

export function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal className="contact__card card">
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title" className="section-title">
            Building something? <span className="gradient-text">Let's talk.</span>
          </h2>
          <p className="section-lead">
            Have a role, a project or a question? Email is the fastest way to reach me.
          </p>
          <div className="contact__actions">
            <a href={`mailto:${profile.email}`} className="btn btn-primary">
              <Mail /> {profile.email}
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="btn">
              <GitHubIcon /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn">
              <LinkedInIcon /> LinkedIn
            </a>
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn">
              <FileText /> Resume <ArrowUpRight className="arrow" />
            </a>
          </div>
        </Reveal>
      </div>
      <footer className="container footer mono">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Built with React, TypeScript and Vite. AI-assisted, human-reviewed.</span>
      </footer>
    </section>
  );
}
