import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { profile } from "../data/profile";
import "./Nav.css";

const links = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "how-i-build", label: "How I Build" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

// Tracks which section sits under the upper third of the viewport.
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

// "top" (the hero) is observed too, so no link is highlighted before About
const ids = ["top", ...links.map((l) => l.id)];

export function Nav() {
  const active = useActiveSection(ids);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav ${scrolled || open ? "nav--scrolled" : ""}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__brand" onClick={() => setOpen(false)}>
          <span className="nav__mark mono">{"</>"}</span>
          {profile.shortName} Tuzon
        </a>

        <nav aria-label="Primary" className="nav__links">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={`nav__link ${active === l.id ? "is-active" : ""}`}>
              {active === l.id && (
                <motion.span layoutId="nav-pill" className="nav__pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              )}
              <span className="nav__label">{l.label}</span>
            </a>
          ))}
        </nav>

        <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn nav__cta">
          Resume
        </a>

        <button
          className="nav__toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="nav__mobile container">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            Resume
          </a>
        </nav>
      )}
    </header>
  );
}
