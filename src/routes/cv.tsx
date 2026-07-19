import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Download, Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Sun, Moon } from "lucide-react";
import { experience } from "../data/experience";
import { education } from "../data/education";
import { skillCategories } from "../data/skills";

export const Route = createFileRoute("/cv")({
  component: CVPage,
});

type Theme = "white" | "cream" | "dark" | "red-black";

function CVPage() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Sync theme with local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Update root HTML element class list when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("white", "cream", "dark", "red-black");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes: Theme[] = ["white", "cream", "dark", "red-black"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };



  const isDark = theme === "dark" || theme === "red-black";

  return (
    <div className="min-h-screen transition-colors duration-300 font-sans p-6 sm:p-12 bg-background text-foreground">
      {/* High-fidelity print styles override */}
      <style>{`
        @media print {
          /* Hide navigation toolbar and back button */
          .no-print {
            display: none !important;
          }
          
          /* Page size and layout margins */
          @page {
            size: letter;
            margin: 0.5in;
          }
          
          /* Reset root background to pure white and text to black */
          html, body, #root {
            background-color: white !important;
            color: black !important;
            background-image: none !important;
          }
          
          /* Container adjustments */
          .print-container {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          
          /* Text colors high contrast */
          h1, h2, h3, h4, h5, h6, strong {
            color: black !important;
          }
          
          p, span, li, td, th {
            color: #222222 !important;
          }
          
          a {
            color: black !important;
            text-decoration: underline !important;
          }
          
          /* Badges and tags */
          .skill-badge {
            border: 1px solid #d6d3d1 !important;
            background-color: #f5f5f4 !important;
            color: #444443 !important;
          }
          
          /* Borders */
          hr, .border-l {
            border-color: #e7e5e4 !important;
          }
          
          .section-block {
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="mx-auto max-w-4xl">
        {/* Navigation Toolbar (Hidden on Print) */}
        <div className="no-print flex items-center justify-between mb-8 pb-4 border-b border-border/40">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border border-border bg-card/45 hover:border-foreground/30 hover:bg-card/85 text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft size={14} /> Back to Portfolio
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground active:scale-95 transition"
              title="Cycle theme (White / Cream / Dark / Cyberpunk)"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a
              href="/resume.pdf"
              download="Christian_Erin_Tuzon_Resume.pdf"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:opacity-90 shadow-md transition"
            >
              <Download size={14} /> Download PDF
            </a>
          </div>
        </div>

        {/* CV Document Container */}
        <div className="print-container rounded-3xl border border-border bg-card/25 p-8 sm:p-12 shadow-xl backdrop-blur-sm">
          {/* Header Section */}
          <header className="mb-10 text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              CHRISTIAN ERIN J. TUZON
            </h1>
            <p className="text-primary text-sm font-semibold tracking-wider uppercase mt-1">
              Associate Software Engineer / Full-Stack Developer
            </p>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-6 text-xs text-muted-foreground font-mono">
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-primary shrink-0" />
                <span>09060418827</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-primary shrink-0" />
                <a href="mailto:Erintuzon01@gmail.com" className="hover:underline hover:text-foreground">
                  Erintuzon01@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-primary shrink-0" />
                <span>Raniag Burgos, Isabela</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Github size={14} className="text-primary shrink-0" />
                <a href="https://github.com/Nire1317" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-foreground inline-flex items-center gap-1">
                  github.com/Nire1317 <ExternalLink size={10} className="no-print" />
                </a>
              </div>
              <div className="flex items-center gap-2.5 sm:col-span-2">
                <Linkedin size={14} className="text-primary shrink-0" />
                <a href="https://www.linkedin.com/in/erin-tuzon-541038343" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-foreground inline-flex items-center gap-1">
                  linkedin.com/in/erin-tuzon-541038343 <ExternalLink size={10} className="no-print" />
                </a>
              </div>
            </div>
          </header>

          <hr className="border-border/20 mb-8" />

          {/* Personal Statement */}
          <section className="section-block mb-10 text-left">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-3">
              Personal Statement
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Junior Full-Stack Developer with professional experience developing web and mobile applications using React, React Native, Node.js, Express, and SQL databases. Experienced in building RESTful APIs, implementing real-time logistics solutions, and enhancing large-scale logistics platforms. Passionate about building scalable software, solving complex problems, and continuously learning modern technologies while contributing to collaborative development teams.
            </p>
          </section>

          {/* Experience Section */}
          <section className="section-block mb-10 text-left">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-6 border-b border-border/10 pb-2">
              Experience
            </h2>
            <div className="flex flex-col gap-8">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l border-primary/20">
                  {/* Decorative bullet point */}
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary border-4 border-background" />
                  
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 mb-1">
                    <h3 className="text-base font-bold text-foreground">
                      {exp.role}
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                    {exp.company} | {exp.location}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3 italic">
                    {exp.description}
                  </p>
                  
                  <ul className="list-disc pl-4 text-xs text-muted-foreground flex flex-col gap-1.5 mb-3">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx} className="leading-relaxed">{resp}</li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.techStack.map((tech) => (
                      <span 
                        key={tech} 
                        className="tech-badge skill-badge text-[9px] font-mono px-2 py-0.5 rounded-md border border-border bg-card/50 text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section className="section-block mb-10 text-left">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-6 border-b border-border/10 pb-2">
              Education Background
            </h2>
            <div className="flex flex-col gap-6">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-6 border-l border-primary/20">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary border-4 border-background" />
                  
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 mb-1">
                    <h3 className="text-base font-bold text-foreground">
                      {edu.degree} in {edu.field}
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground">
                      {edu.startDate} — {edu.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    {edu.institution}
                  </div>
                  <ul className="list-disc pl-4 text-xs text-muted-foreground flex flex-col gap-1">
                    {edu.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className="section-block text-left">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-6 border-b border-border/10 pb-2">
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {skillCategories.map((cat) => (
                <div key={cat.id}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
                    <span>{cat.icon}</span> {cat.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className="skill-badge text-xs px-3 py-1 rounded-full border border-border bg-card/50 text-foreground select-none transition hover:border-primary/50"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
