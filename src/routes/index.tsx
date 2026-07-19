import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Sparkles, ArrowUpRight, SkipForward, SkipBack } from "lucide-react";
import { useSound } from "../hooks/useSound";
import profileCasual from "../assets/profile-casual.jpg";
import profileFormal from "../assets/profile-formal.jpg";
import universeBg from "../assets/universe-bg.jpg";
import projNebula from "../assets/project-nebula.jpg";
import projKinetic from "../assets/project-kinetic.jpg";
import projField from "../assets/project-field.jpg";
import projOrbit from "../assets/project-orbit.jpg";
import projLumen from "../assets/project-lumen.jpg";
import projPrism from "../assets/project-prism.jpg";
import projLeavely from "../assets/project-leavely.png";
import projBarangay from "../assets/project-barangay.png";



export const Route = createFileRoute("/")({
  component: Portfolio,
});

/* ---------- Profile toggle ---------- */

function ProfileCard() {
  const [formal, setFormal] = useState(false);
  return (
    <div className="relative rounded-3xl border border-border/60 bg-card p-6 w-full max-w-full shadow-2xl">
      <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-secondary">
        <AnimatePresence mode="wait">
          <motion.img
            key={formal ? "formal" : "casual"}
            src={formal ? profileFormal : profileCasual}
            alt={formal ? "Alex — formal portrait" : "Alex — casual portrait"}
            width={768}
            height={1024}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-background/70 backdrop-blur border border-border/60">
          {formal ? "Formal" : "Casual"}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="font-display font-semibold">Erin</p>
          <p className="text-xs text-muted-foreground">Software Engineer</p>
        </div>
        <button
          onClick={() => setFormal((v) => !v)}
          aria-label="Toggle profile picture"
          className={`relative h-7 w-12 rounded-full transition-colors ${formal ? "bg-accent" : "bg-primary"}`}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-background shadow ${formal ? "right-0.5" : "left-0.5"}`}
          />
        </button>
      </div>
    </div>
  );
}

/* ---------- Projects wheel ---------- */

const projects = [
  {
    title: "Leavely",
    tag: "Product · 2025",
    desc: "Automated leave and absence tracking for modern teams.",
    color: "from-[#4f46e5]/40 to-transparent",
    themeColor: "#4f46e5",
    image: projLeavely,
    role: "Full-Stack Developer",
    stack: ["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js"],
    year: "2025",
    details: "Leavely is a streamlined, user-friendly leave management system designed to eliminate manual spreadsheet tracking. It features automated request flows, real-time allowance calculations, team calendars, and comprehensive coverage checks to ensure smooth operations.",
    metrics: [{ k: "100%", v: "Automated" }, { k: "15+ Days", v: "Saved/Year" }, { k: "99.9%", v: "Uptime" }],
    liveUrl: "https://leavely-frontend.vercel.app/",
  },
  {
    title: "E-Barangay System",
    tag: "Web App · 2025",
    desc: "A digital governance platform for local community management.",
    color: "from-[#0ea5e9]/40 to-transparent",
    themeColor: "#0ea5e9",
    image: projBarangay,
    role: "Lead Full-Stack Developer",
    stack: ["React", "TypeScript", "Supabase", "Tailwind CSS", "Vite"],
    year: "2025",
    details: "A complete digital management platform for local barangays. Residents can request documents, submit complaints, and view community announcements online. Administrators benefit from automated resident profiling, digitised request processing, and SMS notifications.",
    metrics: [{ k: "5k+", v: "Residents" }, { k: "2 min", v: "Doc Issuance" }, { k: "85%", v: "Response Rate" }],
    liveUrl: "https://e-barangay-system.vercel.app/",
  },
  { title: "Nebula OS", tag: "Product · 2025", desc: "An AI-native OS with spatial windows.", color: "from-[#5cf0a6]/40 to-transparent", themeColor: "#5cf0a6", image: projNebula,
    role: "Lead Design Engineer", stack: ["React", "WebGPU", "Rust", "Motion"], year: "2025",
    details: "A speculative operating system exploring what personal computing looks like when AI is the primary interface. Spatial window management, voice-first workflows, and a shader-driven compositor.",
    metrics: [{ k: "12k", v: "Beta users" }, { k: "4.9", v: "TestFlight" }, { k: "60fps", v: "Compositor" }],
    liveUrl: "",
  },
  { title: "Kinetic Type", tag: "WebGL · 2024", desc: "Generative typeface reacting to sound.", color: "from-[#ff5a3c]/40 to-transparent", themeColor: "#ff5a3c", image: projKinetic,
    role: "Creative Developer", stack: ["Three.js", "GLSL", "Tone.js"], year: "2024",
    details: "A live typographic instrument. Letterforms bend, fracture, and re-form in response to microphone input — used in live performances at Sónar and MUTEK.",
    metrics: [{ k: "SOTD", v: "Awwwards" }, { k: "3", v: "Live shows" }, { k: "180k", v: "Plays" }],
    liveUrl: "",
  },
  { title: "Lumen", tag: "App · 2023", desc: "A quiet meditation app built for focus.", color: "from-[#ff5a3c]/40 to-transparent", themeColor: "#ff5a3c", image: projLumen,
    role: "Product Designer", stack: ["Swift", "SwiftUI", "Metal"], year: "2023",
    details: "An iOS meditation app centered on ambient soundscapes and gentle breath pacing. Built around a single principle: nothing on screen should demand attention.",
    metrics: [{ k: "#3", v: "App Store" }, { k: "220k", v: "Downloads" }, { k: "4.8", v: "Rating" }],
    liveUrl: "",
  },
  { title: "Prism", tag: "Tool · 2022", desc: "A color system generator for designers.", color: "from-[#a78bfa]/40 to-transparent", themeColor: "#a78bfa", image: projPrism,
    role: "Solo Maker", stack: ["React", "OKLCH", "Vite"], year: "2022",
    details: "A perceptually-uniform color system generator. Input a brand color, get a token-ready palette with accessible pairings across every surface, mode, and state.",
    metrics: [{ k: "50k", v: "MAU" }, { k: "Open", v: "Source" }, { k: "2.1k", v: "Stars" }],
    liveUrl: "",
  },
];

type Project = (typeof projects)[number];



function ProjectsWheel({ onSelectProject }: { onSelectProject: (p: Project) => void }) {
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(2);
  const progressRef = useRef(2);

  // Live-responsive sizing from the container's own width via ResizeObserver.
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState({ spacing: 150, cardW: 220, cardH: 275, containerH: 420 });

  const count = projects.length;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = (w: number) => {
      // Derive card width and make it a bit larger (max 320px on desktop)
      const cardW = Math.max(160, Math.min(320, Math.round(w * 0.22)));
      const cardH = Math.round(cardW * 1.25);
      // Spacing between cards in the row (overlapping slightly for Coverflow look)
      const spacing = Math.round(cardW * 0.65);
      // Thinner container height
      const containerH = Math.max(380, cardH + 110);
      setDims({ spacing, cardW, cardH, containerH });
    };

    compute(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) compute(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { spacing, cardW, cardH, containerH } = dims;

  // Continuous loop scroll animation (moves cards right to left like a wheel)
  useEffect(() => {
    if (paused) return;
    let frameId: number;
    let lastTime = performance.now();

    const update = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      // Speed in progress units per millisecond (approx 6.6 seconds for full loop)
      const speed = 0.00015;
      progressRef.current = (progressRef.current + speed * delta) % count;
      setProgress(progressRef.current);

      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [paused, count]);

  const activeIndex = Math.round(progress) % count;

  const wrapDiff = (diff: number, max: number) => {
    const half = max / 2;
    return ((diff + half) % max + max) % max - half;
  };

  const stars = Array.from({ length: 90 }, (_, i) => {
    const r1 = ((i * 9301 + 49297) % 233280) / 233280;
    const r2 = (((i + 7) * 4931 + 12345) % 233280) / 233280;
    const r3 = (((i + 13) * 7817 + 6151) % 233280) / 233280;
    return {
      top: `${r1 * 100}%`,
      left: `${r2 * 100}%`,
      size: 1 + r3 * 2,
      delay: r1 * 4,
      duration: 2 + r2 * 3,
      opacity: 0.4 + r3 * 0.6,
    };
  });

  return (
    <div className="w-full" ref={containerRef}>
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Selected work · hover to slide · click to focus
        </p>
        <p className="text-xs text-muted-foreground">
          {projects[activeIndex] ? projects[activeIndex].title : paused ? "Paused" : "Scrolling"}
        </p>
      </div>

      <div
        className="relative w-full flex items-center justify-center select-none overflow-hidden border-y border-border/40"
        style={{ perspective: "1400px", height: containerH }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
        }}
      >
        {/* Real universe background image */}
        <img
          src={universeBg}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-background/40" />

        {/* Twinkling star overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {stars.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                opacity: s.opacity,
                boxShadow: `0 0 ${s.size * 3}px rgba(255,255,255,${s.opacity})`,
                animation: `star-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* soft ground glow */}
        <div className="absolute bottom-6 h-24 w-[80%] rounded-[100%] bg-primary/10 blur-3xl" />



        <div
          className="relative flex items-center justify-center"
          style={{
            width: cardW,
            height: cardH,
            transformStyle: "preserve-3d",
          }}
        >
          {projects.map((p, i) => {
            const diff = wrapDiff(i - progress, count);
            const isActive = Math.abs(diff) < 0.5;

            // Calculate Coverflow transformations dynamically
            const xOffset = diff * spacing;
            const rotateY = diff * -24;
            const zOffset = -Math.abs(diff) * 110 + (isActive ? 50 : 0);
            const scale = isActive ? 1.1 - Math.abs(diff) * 0.15 : 0.86;
            const opacity = Math.abs(diff) > 2 ? 0.3 : 1.0 - Math.abs(diff) * 0.25;

            return (
              <div
                key={p.title}
                className="absolute"
                style={{
                  width: cardW,
                  height: cardH,
                  transformStyle: "preserve-3d",
                  zIndex: Math.round(50 - Math.abs(diff) * 10),
                }}
              >
                <motion.button
                  type="button"
                  onMouseEnter={() => {
                    setPaused(true);
                    setProgress(i);
                    progressRef.current = i;
                  }}
                  onClick={() => {
                    setPaused(true);
                    setProgress(i);
                    progressRef.current = i;
                    onSelectProject(p);
                  }}
                  animate={{
                    x: xOffset,
                    rotateY: rotateY,
                    z: zOffset,
                    scale: scale,
                    opacity: opacity,
                  }}
                  whileHover={{
                    scale: isActive ? 1.16 : 0.92,
                    z: isActive ? 90 : zOffset + 20,
                  }}
                  transition={{ type: "spring", stiffness: 110, damping: 22, mass: 0.75 }}
                  className={`group w-full h-full rounded-3xl border bg-card flex flex-col text-left overflow-hidden`}
                  style={{
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                    borderColor: isActive ? p.themeColor : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isActive 
                      ? `0 0 80px ${p.themeColor}73, 0 20px 50px rgba(0,0,0,0.7)` 
                      : '0 15px 35px rgba(0,0,0,0.55)',
                  }}
                >
                  {/* Project preview image */}
                  <div className="relative flex-1 overflow-hidden">
                    <img
                      src={p.image}
                      alt={`${p.title} preview`}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${p.color} to-transparent mix-blend-overlay`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur border border-border/60">
                      <p className="text-[10px] uppercase tracking-widest text-foreground/80 font-mono">{p.tag}</p>
                    </div>
                  </div>
                  {/* Meta bar */}
                  <div className="relative p-4 flex items-end justify-between gap-3 bg-card/80 backdrop-blur-sm border-t border-border/50">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg md:text-xl font-semibold truncate">{p.title}</h3>
                      <p className="text-xs text-muted-foreground truncate">{p.desc}</p>
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] hover:underline font-mono mt-1 block truncate"
                          style={{ color: p.themeColor }}
                        >
                          {p.liveUrl.replace('https://', '')} ↗
                        </a>
                      )}
                    </div>
                    <span 
                      className="text-xl shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      style={{ color: p.themeColor }}
                    >
                      ↗
                    </span>
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>
        {/* Left and Right edge fade overlays */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-36 lg:w-52 bg-gradient-to-r from-background via-background/70 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-36 lg:w-52 bg-gradient-to-l from-background via-background/70 to-transparent pointer-events-none z-10" />
      </div>


      {/* orbit dots */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {projects.map((p, i) => (
          <button
            key={p.title}
            aria-label={`Focus ${p.title}`}
            onMouseEnter={() => {
              setPaused(true);
              setProgress(i);
              progressRef.current = i;
            }}
            onClick={() => {
              setPaused(true);
              setProgress(i);
              progressRef.current = i;
            }}
            className={`h-1.5 rounded-full transition-all ${
              activeIndex === i ? "w-8 bg-primary" : "w-3 bg-border hover:bg-foreground/40"
            }`}
          />
        ))}
      </div>

    </div>
  );
}


/* ---------- Section header ---------- */

function SectionHeader({ eyebrow, title, kicker }: { eyebrow: string; title: string | React.ReactNode; kicker?: string }) {
  return (
    <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3">{eyebrow}</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl">
          {title}
        </h2>
      </div>
      {kicker && <p className="text-sm text-muted-foreground">{kicker}</p>}
    </div>
  );
}

/* ---------- Data ---------- */

const experience = [
  {
    role: "Freelance Frontend & Backend Engineer",
    company: "Independent",
    years: "Jan 2025 — Present",
    impact: "Philippines (Remote) · Building custom web applications, REST APIs, and database integrations for various clients nationwide."
  },
  {
    role: "Software Engineer",
    company: "Inoverse Company · Full-time",
    years: "Nov 2025 — Present",
    impact: "Manila, Philippines (Hybrid) · Designing, building, and scaling robust systems. Collaborating across teams to deliver high-quality, high-performance features."
  },
  {
    role: "Operations Assistant",
    company: "Universal Leaf Tobacco Company · Seasonal",
    years: "Jul 2025 — Nov 2025 (5 mos)",
    impact: "Reina Mercedes, Cagayan Valley, Philippines (On-site) · Managed seasonal operational logs, inventory, and logistics coordination."
  },
  {
    role: "Software Engineer Intern",
    company: "Frontend & Backend Development · Internship",
    years: "Feb 2025 — May 2025 (4 mos)",
    impact: "Philippines (Remote) · Gained hands-on experience developing responsive user interfaces and building backend database operations."
  }
];

const achievements = [
  { title: "Awwwards SOTD × 12", year: "2020 — 2025" },
  { title: "FWA of the Day × 5", year: "2021 — 2024" },
  { title: "CSS Design Awards Winner", year: "2023" },
  { title: "Fast Company Innovation", year: "2024" },
  { title: "Speaker · Config, SmashingConf", year: "2024" },
  { title: "Featured · Sidebar, Codrops", year: "2022" },
];

const skills = [
  {
    group: "Languages & Frontend",
    items: ["JavaScript", "TypeScript", "HTML5", "CSS3", "React", "Vite", "Tailwind CSS", "Bootstrap", "Chart.js", "CanvasJS"]
  },
  {
    group: "Backend & Database",
    items: ["Node.js", "Express.js", "Supabase", "MySQL", "Firebase", "Sequelize", "Redis", "Socket.IO", "JWT", "REST API", "Resend API"]
  },
  {
    group: "Mobile Development",
    items: ["React Native", "Expo", "Android Studio"]
  },
  {
    group: "DevOps & Tools",
    items: ["Git", "GitHub", "Docker Desktop", "Postman", "MySQL Workbench", "Vercel", "Netlify", "GitHub Pages", "OSRM"]
  },
  {
    group: "AI Tools",
    items: ["Claude Code", "ChatGPT", "Gemini API"]
  }
];

const hobbies = [
  {
    id: "movies-series",
    icon: "movies",
    label: "Movies & Series",
    desc: "Enjoying captivating stories across K-Dramas, Anime, and Western cinema",
    sub: "Favorite Genres",
    val: "Romance, Sci-Fi, Adventure",
    borderClass: "border-indigo-500/20 hover:border-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.12)]",
    iconClass: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
    subClass: "text-indigo-400/80",
    rotate: -2,
    yOffset: -6
  },
  {
    id: "running",
    icon: "running",
    label: "Running",
    desc: "Clearing my mind and staying fit",
    sub: "Frequency",
    val: "3x / week",
    borderClass: "border-emerald-500/20 hover:border-emerald-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]",
    iconClass: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    subClass: "text-emerald-400/80",
    rotate: 3,
    yOffset: 8
  },
  {
    id: "cycling",
    icon: "cycling",
    label: "Cycling",
    desc: "Enjoying the ride and the outdoors",
    sub: "Frequency",
    val: "Weekend rides",
    borderClass: "border-cyan-500/20 hover:border-cyan-500 hover:shadow-[0_0_25px_rgba(6,182,212,0.12)]",
    iconClass: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    subClass: "text-cyan-400/80",
    rotate: -1.5,
    yOffset: -10
  },
  {
    id: "taekwondo",
    icon: "taekwondo",
    label: "Taekwondo",
    desc: "Discipline, focus and self-defense",
    sub: "Belt Level",
    val: "Blue Belt",
    borderClass: "border-red-500/20 hover:border-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.12)]",
    iconClass: "text-red-400 border-red-500/20 bg-red-500/5",
    subClass: "text-red-400/80",
    rotate: 2.5,
    yOffset: 4
  },
  {
    id: "working-out",
    icon: "workout",
    label: "Working Out",
    desc: "Building strength, consistency & punch routines",
    sub: "Frequency",
    val: "4x / week",
    borderClass: "border-blue-500/20 hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.12)]",
    iconClass: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    subClass: "text-blue-400/80",
    rotate: -3,
    yOffset: 12
  },
  {
    id: "lifting-weights",
    icon: "lifting",
    label: "Lifting Weights",
    desc: "Progressive overload and strength gains",
    sub: "Focus",
    val: "Strength",
    borderClass: "border-yellow-500/20 hover:border-yellow-500 hover:shadow-[0_0_25px_rgba(234,179,8,0.12)]",
    iconClass: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
    subClass: "text-yellow-400/80",
    rotate: 1.5,
    yOffset: -8
  },
  {
    id: "chess",
    icon: "chess",
    label: "Playing Chess",
    desc: "Strategy, tactics and mental focus",
    sub: "Platform",
    val: "Chess.com",
    borderClass: "border-amber-700/20 hover:border-amber-700 hover:shadow-[0_0_25px_rgba(180,83,9,0.12)]",
    iconClass: "text-amber-500 border-amber-700/20 bg-amber-700/5",
    subClass: "text-amber-500/80",
    rotate: -2,
    yOffset: 6
  },
  {
    id: "cooking",
    icon: "cooking",
    label: "Cooking",
    desc: "Exploring flavors and new recipes",
    sub: "Signature Dish",
    val: "Filipino Adobo",
    borderClass: "border-teal-500/20 hover:border-teal-500 hover:shadow-[0_0_25px_rgba(20,184,166,0.12)]",
    iconClass: "text-teal-400 border-teal-500/20 bg-teal-500/5",
    subClass: "text-teal-400/80",
    rotate: 2.5,
    yOffset: -4
  },
  {
    id: "music",
    icon: "music",
    label: "Listening to Music",
    desc: "Vibing to rock classics, metal, 2000s pop, and old-school hits",
    sub: "Favs & Genres",
    val: "Nirvana, Metal, 2000s Pop, Oldies",
    borderClass: "border-pink-500/20 hover:border-pink-500 hover:shadow-[0_0_25px_rgba(244,63,94,0.12)]",
    iconClass: "text-pink-400 border-pink-500/20 bg-pink-500/5",
    subClass: "text-pink-400/80",
    rotate: 1,
    yOffset: -6
  }
];

const musicProfile = [
  {
    category: "Rock & Alternative Rock",
    icon: "🤘",
    artists: ["Daughtry", "Oasis", "Nirvana", "The Cranberries", "Red Hot Chili Peppers", "Queen", "The 1975", "Mr. Big", "America"],
    desc: "A mix of heavy guitar riffs and emotional alt-rock anthems.",
    track: "Smells Like Teen Spirit",
    artist: "Nirvana",
    album: "Nevermind",
    deezerId: "1109731",
    color: "from-purple-500/10 to-indigo-500/10 border-purple-500/20 text-purple-400 bg-purple-500/5 hover:border-purple-500"
  },
  {
    category: "Hard Rock & Metal",
    icon: "🎸",
    artists: ["Metallica", "Black Sabbath", "Iron Maiden", "Judas Priest", "Dio", "Accept", "Saxon", "Motörhead", "AC/DC", "Led Zeppelin", "Deep Purple", "Aerosmith", "Van Halen", "Scorpions", "Guns N' Roses", "Def Leppard", "Queensrÿche", "Savatage", "Helloween"],
    desc: "A directory of classic heavy metal, hard rock legends, traditional NWOBHM, and melodic vocal metal.",
    track: "Enter Sandman",
    artist: "Metallica",
    album: "Metallica (The Black Album)",
    deezerId: "14634839",
    color: "from-red-500/10 to-orange-500/10 border-red-500/20 text-red-400 bg-red-500/5 hover:border-red-500"
  },
  {
    category: "90s & 2000s Pop Rock",
    icon: "🎤",
    artists: ["Goo Goo Dolls", "Lifehouse", "Matchbox Twenty", "3 Doors Down", "Nickelback", "Creed", "Hoobastank"],
    desc: "Post-grunge nostalgic melodies and timeless stadium anthems.",
    track: "Iris",
    artist: "Goo Goo Dolls",
    album: "Dizzy Up the Girl",
    deezerId: "1066442",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-400 bg-blue-500/5 hover:border-blue-500"
  },
  {
    category: "OPM Jams",
    icon: "🇵🇭",
    artists: ["Eraserheads", "Parokya ni Edgar", "MYMP", "90s OPM classics", "Tunog Kalye"],
    desc: "Timeless local rock classics and acoustic jam sessions.",
    track: "Ang Huling El Bimbo",
    artist: "Eraserheads",
    album: "Cutterpillow",
    deezerId: "10685934",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:border-emerald-500"
  },
  {
    category: "Soft Rock & Classics",
    icon: "❤️",
    artists: ["Air Supply", "Engelbert Humperdinck", "Tom Jones", "America", "Mr. Big"],
    desc: "Timeless crooners, slow-dance ballads, and vocal legends.",
    track: "Making Love Out of Nothing at All",
    artist: "Air Supply",
    album: "Lost in Love",
    deezerId: "62261765",
    color: "from-pink-500/10 to-rose-500/10 border-pink-500/20 text-pink-400 bg-pink-500/5 hover:border-pink-500"
  },
  {
    category: "Modern Pop & R&B",
    icon: "🎧",
    artists: ["LANY", "Russ", "Khalid", "Lauv", "Chillout Vibes"],
    desc: "Late-night synth-pop, slow R&B, and relaxing roadtrip jams.",
    track: "ILYSB",
    artist: "LANY",
    album: "LANY",
    deezerId: "115201112",
    color: "from-amber-500/10 to-yellow-500/10 border-amber-500/20 text-amber-400 bg-amber-500/5 hover:border-amber-500"
  }
];

const goals = [
  "Ship a self-directed product that reaches 10k weekly users.",
  "Publish a book on the craft of interactive design.",
  "Mentor 20 designers moving into engineering by end of 2027.",
  "Give a talk at every conference I once dreamed of attending.",
];

/* ---------- Contact form ---------- */

function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const target = e.currentTarget;
    const formData = new FormData(target);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          subject: `Portfolio Message from ${name}`,
        }),
      });

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        // If the server returned HTML (like a 404 or index.html fallback), read it as text
        const text = await response.text();
        throw new Error(
          `Server returned a non-JSON response (Status ${response.status}). If you are running locally, make sure to start the project using 'vercel dev' instead of 'npm run dev' so that the serverless functions are active.`
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to send message.");
      }

      setSuccess(true);
      target.reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          required
          name="name"
          placeholder="Your name"
          className="w-full rounded-xl bg-secondary/60 border border-border px-4 py-3 text-sm outline-none focus:border-primary transition"
          disabled={loading}
        />
        <input
          required
          type="email"
          name="email"
          placeholder="Email"
          className="w-full rounded-xl bg-secondary/60 border border-border px-4 py-3 text-sm outline-none focus:border-primary transition"
          disabled={loading}
        />
      </div>
      <textarea
        required
        name="message"
        rows={5}
        placeholder="Tell me what you're working on…"
        className="w-full rounded-xl bg-secondary/60 border border-border px-4 py-3 text-sm outline-none focus:border-primary transition resize-none"
        disabled={loading}
      />
      {error && (
        <p className="text-sm text-red-500 font-medium">
          ❌ {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-500 font-medium">
          ✅ Message sent successfully!
        </p>
      )}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-muted-foreground">
          Replies within 24 hours · booking Q3 2026
        </p>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : success ? "Message sent ✓" : "Send message"}
        </button>
      </div>
    </form>
  );
}

/* ---------- Philosophy Data ---------- */

const philosophyNotes = [
  {
    title: "GROWTH",
    quote: "Obsessed with Growth, Addicted to Progress.",
    borderClass: "border-primary/40",
    hoverColor: "group-hover:text-primary",
    rotate: -1.5,
  },
  {
    title: "FAILURE",
    quote: "The Only Consequence Is Failure.",
    borderClass: "border-red-500/30",
    hoverColor: "group-hover:text-red-400",
    rotate: 1.5,
  },
  {
    title: "GOALS",
    quote: "I live by goals, not dreams.",
    borderClass: "border-cyan-400/40",
    hoverColor: "group-hover:text-cyan-400",
    rotate: -0.8,
  },
  {
    title: "RESOLVE",
    quote: "Aut viam inveniam aut faciam",
    isLatin: true,
    translation: "I will either find a way or make one.",
    borderClass: "border-yellow-400/40",
    hoverColor: "group-hover:text-yellow-400",
    rotate: 1.2,
  },
  {
    title: "RISK",
    quote: "There is no growth without taking a step forward. Every risk you take is an opportunity to learn, improve, and become better.",
    borderClass: "border-purple-500/40",
    hoverColor: "group-hover:text-purple-400",
    rotate: 0.6,
  },
  {
    title: "WISDOM",
    quote: "Mistakes are the mother of success.",
    borderClass: "border-orange-500/40",
    hoverColor: "group-hover:text-orange-400",
    rotate: -1.2,
  },
  {
    title: "STORY",
    quote: "Life is just a book. So write the damn story.",
    borderClass: "border-pink-500/40",
    hoverColor: "group-hover:text-pink-400",
    rotate: 0.5,
  },
  {
    title: "MOMENT",
    quote: "Carpe Diem.",
    isLatin: true,
    translation: "Seize the day.",
    borderClass: "border-emerald-400/40",
    hoverColor: "group-hover:text-emerald-400",
    rotate: -0.6,
  },
  {
    title: "REALITY",
    quote: "Turning Ideas Into Reality. The future is yours to build, but history is what makes you who you are.",
    borderClass: "border-indigo-500/40",
    hoverColor: "group-hover:text-indigo-400",
    rotate: 0.8,
  },
  {
    title: "YOUR TURN",
    quote: "",
    isInteractive: true,
    borderClass: "border-zinc-500/30",
    hoverColor: "group-hover:border-zinc-400",
    rotate: -0.5,
  },
];

const notebookTabs = [
  { label: "MINDSET", index: 0, color: "bg-primary text-black" },
  { label: "RESOLVE", index: 1, color: "bg-cyan-500 text-black" },
  { label: "ACTION", index: 2, color: "bg-purple-500 text-white" },
  { label: "STORY", index: 3, color: "bg-pink-500 text-black" },
  { label: "FUTURE", index: 4, color: "bg-indigo-500 text-white" },
];

/* ---------- SkillIcon component for Tech stack Logos ---------- */
function SkillIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  
  if (n === "javascript") {
    return (
      <svg className="w-3.5 h-3.5 fill-[#F7DF1E]" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M1.5 0h21A1.5 1.5 0 0 1 24 1.5v21a1.5 1.5 0 0 1-1.5 1.5H1.5A1.5 1.5 0 0 1 0 22.5V1.5A1.5 1.5 0 0 1 1.5 0zm19.38 17.8c-.83-.48-1.5-.83-1.95-1.1-.47-.28-.7-.6-.7-1 0-.3.12-.5.37-.62.24-.13.62-.2 1.15-.2.53 0 .97.08 1.3.26.34.17.65.43.92.8l1.32-1.02c-.52-.78-1.12-1.32-1.8-1.63-.68-.32-1.53-.48-2.54-.48-1.1 0-1.98.27-2.65.8a2.5 2.5 0 0 0-1 2.05c0 .73.2 1.33.6 1.8.4.47 1.14.86 2.22 1.18 1.08.3 1.7.53 1.9.67.2.14.3.36.3.67 0 .37-.15.65-.45.83-.3.18-.75.27-1.36.27-.75 0-1.37-.17-1.87-.5-.5-.35-.87-.93-1.12-1.74l-1.5 1.02c.38 1.15 1.03 2 1.95 2.55s2.1.8 3.52.8c1.33 0 2.4-.3 3.2-.9.8-.6 1.2-1.46 1.2-2.58 0-.9-.35-1.6-1.05-2.08zM9.54 18.06c0 .77-.16 1.38-.5 1.83-.33.45-.82.68-1.46.68-.45 0-.8-.12-1.03-.38-.24-.25-.36-.63-.36-1.14V11.8H4.5v6.52c0 1.2.33 2.13 1 2.76.67.63 1.62.94 2.85.94 1.15 0 2.05-.33 2.7-1a4 4 0 0 0 .96-2.92v-6.3h-1.68l.01 6.26z"/>
      </svg>
    );
  }
  if (n === "typescript") {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#3178C6"/>
        <text x="3" y="18" fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="sans-serif">TS</text>
      </svg>
    );
  }
  if (n === "react" || n === "react native") {
    return (
      <svg className="w-3.5 h-3.5 text-[#61DAFB] animate-[spin_15s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(150 12 12)" />
      </svg>
    );
  }
  if (n === "node.js" || n === "express.js") {
    return (
      <svg className="w-3.5 h-3.5 text-[#339933] fill-current" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5c1.54 0 2.9.78 3.72 1.97L13.1 11.6c-.46-.66-1.22-1.1-2.1-1.1-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5c.88 0 1.64-.44 2.1-1.1l1.62 1.13c-.82 1.19-2.18 1.97-3.72 1.97z"/>
      </svg>
    );
  }
  if (n === "tailwind css") {
    return (
      <svg className="w-3.5 h-3.5 text-[#38BDF8] fill-current" viewBox="0 0 24 24">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C10.337,13.382,8.976,12,6.001,12z"/>
      </svg>
    );
  }
  if (n === "supabase") {
    return (
      <svg className="w-3.5 h-3.5 text-[#3ECF8E] fill-current" viewBox="0 0 24 24">
        <path d="M21.362 9.362H12V3L2.638 14.638H12v6.362z"/>
      </svg>
    );
  }
  if (n === "firebase" || n === "firebase auth" || n === "firebase storage") {
    return (
      <svg className="w-3.5 h-3.5 text-[#FFCA28] fill-current" viewBox="0 0 24 24">
        <path d="M20.005 18.012l-2.07-12.242c-.084-.492-.475-.87-.972-.942-.49-.072-.976.195-1.2.662l-2.9 6.068-4.225-8.082a1.002 1.002 0 0 0-1.517-.267c-.208.188-.328.455-.328.736v.058l1.927 12.23-7.512 4.195c-.328.183-.5.545-.434.912.067.368.337.66.696.75l7.56 1.892a.998.998 0 0 0 .49 0l7.56-1.892a.999.999 0 0 0 .696-.75c.066-.367-.106-.73-.434-.912l-7.512-4.195z"/>
      </svg>
    );
  }
  if (n === "redis") {
    return (
      <svg className="w-3.5 h-3.5 text-[#DC382D] fill-current" viewBox="0 0 24 24">
        <path d="M12 0L1.6 5.8v12.4L12 24l10.4-5.8V5.8L12 0zm8.3 16.7l-8.3 4.6-8.3-4.6V7.3l8.3-4.6 8.3 4.6v9.4z"/>
      </svg>
    );
  }
  if (n === "git" || n === "github") {
    return (
      <svg className="w-3.5 h-3.5 text-[#F05032] dark:text-white fill-current" viewBox="0 0 24 24">
        <path d="M23.546 10.93L13.07.45c-.6-.6-1.58-.6-2.18 0L8.7 2.62l2.9 2.9c.64-.22 1.37-.07 1.88.44.52.52.67 1.25.46 1.89l2.9 2.9c.64-.21 1.37-.06 1.88.46.78.78.78 2.03 0 2.8-.78.78-2.03.78-2.8 0-.52-.52-.67-1.25-.46-1.89l-2.9-2.9c-.21.21-.06.94-.46 1.46-.52.52-1.25.67-1.89.46l-2.9 2.9c.21.64.06 1.37-.46 1.88-.78.78-2.03.78-2.8 0-.78-.78-.78-2.03 0-2.8.52-.52 1.25-.67 1.89-.46l2.9-2.9c-.21-.64-.06-1.37.46-1.88.52-.52 1.25-.67 1.89-.46l2.9-2.9C7.8.46 6.82.46 6.22 1.06L.454 10.83c-.6.6-.6 1.58 0 2.18l10.48 10.48c.6.6 1.58.6 2.18 0l10.48-10.48c.6-.6.6-1.58 0-2.18z"/>
      </svg>
    );
  }
  if (n === "docker desktop") {
    return (
      <svg className="w-3.5 h-3.5 text-[#2496ED] fill-current" viewBox="0 0 24 24">
        <path d="M13.983 11.078h2.119c.102 0 .186-.084.186-.186V9.034c0-.102-.084-.186-.186-.186h-2.119c-.102 0-.186.084-.186.186v1.858c0 .102.084.186.186.186m-2.95 0h2.118c.102 0 .186-.084.186-.186V9.034c0-.102-.084-.186-.186-.186h-2.118c-.102 0-.186.084-.186.186v1.858c0 .102.084.186.186.186m-2.935 0h2.119c.102 0 .186-.084.186-.186V9.034c0-.102-.084-.186-.186-.186H8.098c-.102 0-.186.084-.186.186v1.858c0 .102.084.186.186.186m-2.939 0h2.119c.102 0 .186-.084.186-.186V9.034c0-.102-.084-.186-.186-.186H5.159c-.102 0-.186.084-.186.186v1.858c0 .102.084.186.186.186m2.939-2.943h2.119c.102 0 .186-.084.186-.186V6.091c0-.102-.084-.186-.186-.186H8.098c-.102 0-.186.084-.186.186v1.858c0 .102.084.186.186.186m-2.939 0h2.119c.102 0 .186-.084.186-.186V6.091c0-.102-.084-.186-.186-.186H5.159c-.102 0-.186.084-.186.186v1.858c0 .102.084.186.186.186m-2.941 2.943h2.119c.102 0 .186-.084.186-.186V9.034c0-.102-.084-.186-.186-.186H2.218c-.102 0-.186.084-.186.186v1.858c0 .102.084.186.186.186m5.88 2.944h2.119c.102 0 .186-.084.186-.186v-1.858c0-.102-.084-.186-.186-.186H8.098c-.102 0-.186.084-.186.186v1.858c0 .102.084.186.186.186m-2.939 0h2.119c.102 0 .186-.084.186-.186v-1.858c0-.102-.084-.186-.186-.186H5.159c-.102 0-.186.084-.186.186v1.858c0 .102.084.186.186.186m15.014-5.888c-.304-.886-.968-1.59-1.917-2.013-.301-.134-.619-.231-.951-.29-.153-.027-.311-.044-.471-.051-.061-.002-.122-.006-.184-.006-2.527 0-4.662 1.584-5.508 3.822h6.147c.102 0 .186.084.186.186v1.858c0 .102-.084.186-.186.186h-6.84c-.006.126-.006.252 0 .378h7.525c.101 0 .185.084.185.186v1.858c0 .102-.084.186-.185.186h-7.794c.261 1.7 1.4 3.125 3.013 3.754 1.62.633 3.47.452 4.935-.472.145-.092.285-.196.417-.31.118-.1.229-.21.332-.327l.117-.117c.563-.615.938-1.381 1.056-2.224.084-.602.084-1.222 0-1.824a7.99 7.99 0 0 0-.616-2.224z"/>
      </svg>
    );
  }
  if (n === "vercel") {
    return (
      <svg className="w-3.5 h-3.5 text-foreground fill-current" viewBox="0 0 24 24">
        <path d="M24 22.525H0L12 1.475L24 22.525Z"/>
      </svg>
    );
  }
  if (n === "expo") {
    return (
      <svg className="w-3.5 h-3.5 text-foreground fill-current" viewBox="0 0 24 24">
        <path d="M2.5 0h19A2.5 2.5 0 0 1 24 2.5v19a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 0 21.5v-19A2.5 2.5 0 0 1 2.5 0zm9.36 17.5l4.32-6.5h-8.64l4.32 6.5zm-5.04-7.5l1.44 2.16L9.7 10h-2.88zm7.36 0l1.44 2.16 1.44-2.16h-2.88z"/>
      </svg>
    );
  }
  if (n === "mysql" || n === "mysql workbench") {
    return (
      <svg className="w-3.5 h-3.5 text-[#4479A1] fill-current" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.6 15.2c-.4.2-.8.3-1.3.3-1.6 0-2.8-1-2.8-2.6 0-1.6 1.2-2.6 2.8-2.6.5 0 .9.1 1.3.3l-.4.9c-.3-.1-.6-.2-.9-.2-1 0-1.7.6-1.7 1.6s.7 1.6 1.7 1.6c.3 0 .6-.1.9-.2l.4.9zm.4-6.2H13V9h1V8h-2v1h1v2h-1.5c-.8 0-1.5.7-1.5 1.5v1c0 .8.7 1.5 1.5 1.5H13v1h1v-1.5c0-.8-.7-1.5-1.5-1.5H11v-1h2.5c.3 0 .5-.2.5-.5v-1c0-.3-.2-.5-.5-.5H11V9.5h3z"/>
      </svg>
    );
  }
  if (n === "gemini api" || n === "chatgpt" || n === "claude code") {
    return (
      <Sparkles size={14} className="text-amber-500 animate-pulse" />
    );
  }
  
  return (
    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
  );
}

const brandColors: Record<string, string> = {
  javascript: "hover:border-[#F7DF1E]/60 hover:bg-[#F7DF1E]/5 hover:shadow-[0_0_12px_rgba(247,223,30,0.15)] hover:text-[#F7DF1E]",
  typescript: "hover:border-[#3178C6]/60 hover:bg-[#3178C6]/5 hover:shadow-[0_0_12px_rgba(49,120,198,0.15)] hover:text-[#3178C6]",
  react: "hover:border-[#61DAFB]/60 hover:bg-[#61DAFB]/5 hover:shadow-[0_0_12px_rgba(97,218,251,0.15)] hover:text-[#61DAFB]",
  "react native": "hover:border-[#61DAFB]/60 hover:bg-[#61DAFB]/5 hover:shadow-[0_0_12px_rgba(97,218,251,0.15)] hover:text-[#61DAFB]",
  "node.js": "hover:border-[#339933]/60 hover:bg-[#339933]/5 hover:shadow-[0_0_12px_rgba(51,153,51,0.15)] hover:text-[#339933]",
  "express.js": "hover:border-[#339933]/60 hover:bg-[#339933]/5 hover:shadow-[0_0_12px_rgba(51,153,51,0.15)] hover:text-[#339933]",
  "tailwind css": "hover:border-[#38BDF8]/60 hover:bg-[#38BDF8]/5 hover:shadow-[0_0_12px_rgba(56,189,248,0.15)] hover:text-[#38BDF8]",
  supabase: "hover:border-[#3ECF8E]/60 hover:bg-[#3ECF8E]/5 hover:shadow-[0_0_12px_rgba(62,207,142,0.15)] hover:text-[#3ECF8E]",
  firebase: "hover:border-[#FFCA28]/60 hover:bg-[#FFCA28]/5 hover:shadow-[0_0_12px_rgba(255,202,40,0.15)] hover:text-[#FFCA28]",
  redis: "hover:border-[#DC382D]/60 hover:bg-[#DC382D]/5 hover:shadow-[0_0_12px_rgba(220,56,45,0.15)] hover:text-[#DC382D]",
  git: "hover:border-[#F05032]/60 hover:bg-[#F05032]/5 hover:shadow-[0_0_12px_rgba(240,80,50,0.15)] hover:text-[#F05032]",
  github: "hover:border-foreground/40 hover:bg-foreground/5 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]",
  "docker desktop": "hover:border-[#2496ED]/60 hover:bg-[#2496ED]/5 hover:shadow-[0_0_12px_rgba(36,150,237,0.15)] hover:text-[#2496ED]",
  vercel: "hover:border-foreground hover:bg-foreground/5 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]",
  expo: "hover:border-foreground hover:bg-foreground/5 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]",
  mysql: "hover:border-[#4479A1]/60 hover:bg-[#4479A1]/5 hover:shadow-[0_0_12px_rgba(68,121,161,0.15)] hover:text-[#4479A1]",
  "mysql workbench": "hover:border-[#4479A1]/60 hover:bg-[#4479A1]/5 hover:shadow-[0_0_12px_rgba(68,121,161,0.15)] hover:text-[#4479A1]",
  "gemini api": "hover:border-amber-500/60 hover:bg-amber-500/5 hover:shadow-[0_0_12px_rgba(245,158,11,0.15)] hover:text-amber-500",
  chatgpt: "hover:border-emerald-500/60 hover:bg-emerald-500/5 hover:shadow-[0_0_12px_rgba(16,185,129,0.15)] hover:text-emerald-500",
  "claude code": "hover:border-orange-500/60 hover:bg-orange-500/5 hover:shadow-[0_0_12px_rgba(249,115,22,0.15)] hover:text-orange-500",
};

const getBrandHoverClass = (name: string) => {
  return brandColors[name.toLowerCase()] || "hover:border-primary/60 hover:bg-primary/5 hover:shadow-[0_0_12px_rgba(var(--color-primary),0.15)] hover:text-primary";
};

/* ---------- HobbyIcon component for customized SVGs ---------- */
function HobbyIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  
  if (n === "tv") {
    return (
      <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="13" rx="2" ry="2" />
        <path d="m17 2-5 5-5-5" />
      </svg>
    );
  }
  if (n === "anime") {
    return (
      <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <path d="M16 8 2 16" />
        <path d="m14.5 12.5-3 2v-4z" fill="currentColor" />
      </svg>
    );
  }
  if (n === "movies") {
    return (
      <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Z" />
        <path d="m4 11 2-3h14" />
        <path d="m9 8 2 3" />
        <path d="m14 8 2 3" />
        <path d="M4 8V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3H4Z" />
      </svg>
    );
  }
  if (n === "running") {
    return (
      <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        <path d="M14 9.5 12 8.5 9 10l-2-2-1 3" />
        <path d="m10.5 12.5-1.5 4-3 1.5" />
        <path d="m13.5 13.5 2 3.5h2.5" />
        <path d="m14 18 1-3.5 3-2.5" />
      </svg>
    );
  }
  if (n === "cycling") {
    return (
      <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M15 13.5 9 17.5" />
        <path d="M12 9.5h3.5L18.5 14" />
        <path d="M12 9.5 9 17.5" />
        <path d="M5.5 14h6.5" />
        <path d="m12 6.5 1 3" />
      </svg>
    );
  }
  if (n === "taekwondo") {
    return (
      <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12v15H6z" />
        <path d="M6 8h12" />
        <path d="M12 3v15" />
        <path d="M12 8 8 13.5" />
        <path d="m12 8 4 5.5" />
        <path d="M5 18h14v3H5z" />
      </svg>
    );
  }
  if (n === "workout") {
    return (
      <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6.5 6.5 11 11" />
        <path d="m21 21-1-1" />
        <path d="m3 3 1 1" />
        <path d="m18 22 4-4-4-4-4 4z" />
        <path d="m2 10 4-4 4 4-4 4z" />
      </svg>
    );
  }
  if (n === "lifting") {
    return (
      <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="2" />
        <path d="M6 10h12" />
        <path d="M6 7v6" />
        <path d="M18 7v6" />
        <path d="M12 9v4" />
        <path d="m9 17 3-4 3 4" />
        <path d="M8 21h8" />
      </svg>
    );
  }
  if (n === "chess") {
    return (
      <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22h8" />
        <path d="M9 18h6" />
        <path d="M12 18V9" />
        <path d="M10 9h4" />
        <path d="M12 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M7 18c0-5 2-9 5-9s5 4 5 9" />
      </svg>
    );
  }
  if (n === "cooking") {
    return (
      <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a5 5 0 0 0-5 5c0 1.5.5 3 1.5 4a3 3 0 0 1 .5 1.5v2.5a3 3 0 0 0 6 0v-2.5a3 3 0 0 1 .5-1.5 5 5 0 0 0 1.5-4 5 5 0 0 0-5-5Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M6 18h12" />
        <path d="M18 15v3" />
        <path d="M6 15v3" />
      </svg>
    );
  }
  if (n === "music") {
    return (
      <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.1" />
        <circle cx="18" cy="16" r="3" fill="currentColor" fillOpacity="0.1" />
      </svg>
    );
  }
  return null;
}

/* ---------- Page ---------- */

type Theme = "white" | "cream" | "dark" | "red-black";

function Portfolio() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as Theme;
      if (saved === "white" || saved === "cream" || saved === "dark" || saved === "red-black") {
        return saved;
      }
      return "dark"; // Default to dark mode
    }
    return "dark";
  });

  const { playClick } = useSound();
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [activeDashboardTab, setActiveDashboardTab] = useState<"music" | "personality">("music");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("cream", "dark", "red-black");
    
    if (theme !== "white") {
      root.classList.add(theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (newTheme: Theme) => {
    const pitches: Record<Theme, 'high' | 'medium' | 'low' | 'deep'> = {
      white: 'high',
      cream: 'medium',
      dark: 'low',
      'red-black': 'deep'
    };
    playClick(pitches[newTheme]);
    setTheme(newTheme);
  };

  const isDark = theme === "dark" || theme === "red-black";

  // Notebook styling config based on active theme
  const currentNotebook = {
    white: {
      cover: "bg-[#f0f0f5] border-zinc-200 shadow-[0_30px_60px_rgba(0,0,0,0.06)]",
      pageBg: "#ffffff",
      lines: "repeating-linear-gradient(transparent, transparent 27px, rgba(59, 130, 246, 0.08) 27px, rgba(59, 130, 246, 0.08) 28px)",
      margin: "bg-red-500/20",
      holeBg: "bg-[#f0f0f5]",
      wire: "bg-gradient-to-b from-zinc-200 via-zinc-400 to-zinc-600",
      shadow: "rgba(0,0,0,0.06)",
    },
    cream: {
      cover: "bg-[#e6dfd5] border-[#d4cbbd] shadow-[0_30px_60px_rgba(0,0,0,0.08)]",
      pageBg: "#faf8f5",
      lines: "repeating-linear-gradient(transparent, transparent 27px, rgba(180, 83, 9, 0.06) 27px, rgba(180, 83, 9, 0.06) 28px)",
      margin: "bg-red-500/30",
      holeBg: "bg-[#e6dfd5]",
      wire: "bg-gradient-to-b from-yellow-100 via-amber-600 to-amber-900",
      shadow: "rgba(0,0,0,0.08)",
    },
    dark: {
      cover: "bg-[#0d0d11] border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)]",
      pageBg: "#08080b",
      lines: "repeating-linear-gradient(transparent, transparent 27px, rgba(255, 255, 255, 0.015) 27px, rgba(255, 255, 255, 0.015) 28px)",
      margin: "bg-red-500/15",
      holeBg: "bg-[#0d0d11]",
      wire: "bg-gradient-to-b from-zinc-400 via-zinc-600 to-zinc-800",
      shadow: "rgba(0,0,0,0.8)",
    },
    "red-black": {
      cover: "bg-[#150a0a] border-red-950/40 shadow-[0_30px_60px_rgba(0,0,0,0.85)]",
      pageBg: "#050505",
      lines: "repeating-linear-gradient(transparent, transparent 27px, rgba(239, 68, 68, 0.06) 27px, rgba(239, 68, 68, 0.06) 28px)",
      margin: "bg-red-500/30",
      holeBg: "bg-[#150a0a]",
      wire: "bg-gradient-to-b from-red-500 via-red-800 to-black",
      shadow: "rgba(0,0,0,0.95)",
    },
  }[theme] || {
    cover: "bg-[#0d0d11] border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)]",
    pageBg: "#08080b",
    lines: "repeating-linear-gradient(transparent, transparent 27px, rgba(255, 255, 255, 0.015) 27px, rgba(255, 255, 255, 0.015) 28px)",
    margin: "bg-red-500/15",
    holeBg: "bg-[#0d0d11]",
    wire: "bg-gradient-to-b from-zinc-400 via-zinc-600 to-zinc-800",
    shadow: "rgba(0,0,0,0.8)",
  };

  const [currentSpread, setCurrentSpread] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);
  const [customMantra, setCustomMantra] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("customMantra") || "";
    }
    return "";
  });

  useEffect(() => {
    localStorage.setItem("customMantra", customMantra);
  }, [customMantra]);

  const [modal, setModal] = useState<Project | null>(null);

  const renderNoteCard = (note: typeof philosophyNotes[0]) => {
    if (note.isInteractive) {
      return (
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.25}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 18 }}
          whileHover={{ scale: 1.03, rotate: 0, y: -5, boxShadow: isDark ? "0 15px 30px rgba(0,0,0,0.6)" : "0 15px 30px rgba(0,0,0,0.1)" }}
          whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: isDark ? "0 30px 60px rgba(0,0,0,0.8)" : "0 30px 60px rgba(0,0,0,0.2)" }}
          initial={{ scale: 0.95, opacity: 0, rotate: note.rotate, boxShadow: isDark ? "0 8px 16px rgba(0,0,0,0.4)" : "0 8px 16px rgba(0,0,0,0.06)" }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative rounded-2xl border border-black/5 dark:border-white/5 p-8 overflow-hidden cursor-grab active:cursor-grabbing group select-none max-w-[340px] mx-auto w-full"
          style={{
            background: `${currentNotebook.lines}, ${currentNotebook.pageBg}`,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 backdrop-blur-sm rotate-1 origin-center shadow-sm pointer-events-none" />
          <div className={`pl-6 border-l-2 ${note.borderClass} relative`}>
            <span className="font-mono text-xs uppercase tracking-widest text-primary/80 font-semibold">{note.title}</span>
            <div className="mt-4 relative">
              <textarea
                value={customMantra}
                onChange={(e) => setCustomMantra(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                placeholder="Type your own philosophy here..."
                className="w-full bg-transparent border-none outline-none font-mono text-sm text-foreground resize-none h-[110px] focus:ring-0 placeholder:text-muted-foreground/30 placeholder:italic select-text cursor-text"
              />
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.25}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 18 }}
        whileHover={{ scale: 1.03, rotate: 0, y: -5, boxShadow: isDark ? "0 15px 30px rgba(0,0,0,0.6)" : "0 15px 30px rgba(0,0,0,0.1)" }}
        whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: isDark ? "0 30px 60px rgba(0,0,0,0.8)" : "0 30px 60px rgba(0,0,0,0.2)" }}
        initial={{ scale: 0.95, opacity: 0, rotate: note.rotate, boxShadow: isDark ? "0 8px 16px rgba(0,0,0,0.4)" : "0 8px 16px rgba(0,0,0,0.06)" }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative rounded-2xl border border-black/5 dark:border-white/5 p-8 overflow-hidden cursor-grab active:cursor-grabbing group select-none max-w-[340px] mx-auto w-full"
        style={{
          background: `${currentNotebook.lines}, ${currentNotebook.pageBg}`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 backdrop-blur-sm -rotate-1 origin-center shadow-sm pointer-events-none" />
        <div className={`pl-6 border-l-2 ${note.borderClass} relative`}>
          <span className="font-mono text-xs uppercase tracking-widest text-primary/80 font-semibold">{note.title}</span>
          {note.isLatin ? (
            <>
              <blockquote style={{ fontFamily: "'Caveat', cursive" }} className={`mt-2 text-3xl text-foreground ${note.hoverColor} transition-colors duration-300`}>
                "{note.quote}"
              </blockquote>
              <p className="mt-4 font-mono text-xs text-muted-foreground uppercase tracking-widest">means:</p>
              <p className="mt-1 font-mono text-sm text-muted-foreground">"{note.translation}"</p>
            </>
          ) : (
            <blockquote className={`mt-4 font-mono text-base font-semibold leading-relaxed text-foreground ${note.hoverColor} transition-colors duration-300`}>
              "{note.quote}"
            </blockquote>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/40"
      >
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <a href="#home" className="font-display text-lg font-semibold tracking-tight">
            nire<span className="text-primary">.</span>
          </a>
          <div className="hidden lg:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#philosophy" className="hover:text-foreground transition">Philosophy</a>
            <a href="#about" className="hover:text-foreground transition">About</a>
            <a href="#experience" className="hover:text-foreground transition">Experience</a>
            <a href="#achievements" className="hover:text-foreground transition">Achievements</a>
            <a href="#skills" className="hover:text-foreground transition">Skills</a>
            <a href="#hobbies" className="hover:text-foreground transition">Hobbies</a>
            <a href="#goals" className="hover:text-foreground transition">Goals</a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSelector theme={theme} onChange={toggleTheme} />
            <a
              href="#connect"
              className="text-sm px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
            >
              Let's talk
            </a>
          </div>
        </div>
      </motion.nav>

      {/* 1. Landing / Hero */}
      <section id="home" className="min-h-screen pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-sm uppercase tracking-[0.3em] text-primary mb-6"
            >
              Portfolio — 2026
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="font-display text-5xl md:text-7xl font-bold uppercase leading-[1.05] tracking-tight grid grid-cols-[auto_1fr] gap-x-4 md:gap-x-6 gap-y-1"
            >
              <div className="text-primary font-black whitespace-nowrap">E —</div>
              <div className="text-foreground">Evolve</div>
              
              <div className="text-primary font-black whitespace-nowrap">R —</div>
              <div className="text-foreground">Relentlessly</div>
              
              <div className="text-primary font-black whitespace-nowrap">I —</div>
              <div className="text-foreground">Innovate</div>
              
              <div className="text-primary font-black whitespace-nowrap">N —</div>
              <div className="text-foreground">Never Settle</div>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed"
            >
              I'm <span className="text-foreground font-semibold">Erin</span> — a Frontend & Backend Engineer building <span className="italic text-primary">modern</span> web and mobile applications. I believe great software comes from clean code, continuous learning, and never settling for yesterday's best.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="justify-self-center lg:justify-self-end w-full max-w-[400px]"
          >
            <ProfileCard />
          </motion.div>
        </div>

        {/* Projects wheel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="relative w-screen left-1/2 -translate-x-1/2 px-0 mt-20 overflow-x-hidden"
        >
          <ProjectsWheel onSelectProject={setModal} />
        </motion.div>
      </section>

      {/* 2. Philosophy */}
      <section id="philosophy" className="py-32 border-t border-border/40 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader eyebrow="02 — Philosophy" title={<span>Personal <span className="text-primary italic">Philosophy</span></span>} />
          {/* Notebook Container - Desktop (Side-by-Side Pages) */}
          <div className="hidden md:flex justify-center mt-12 select-none relative max-w-4xl mx-auto">
            {/* Index Tabs sticking out the right side */}
            <div className="absolute right-[-45px] top-12 flex flex-col gap-2 z-0">
              {notebookTabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setCurrentSpread(tab.index)}
                  className={`px-2.5 py-4 text-[10px] font-mono font-bold tracking-widest rounded-r-md transition-all duration-300 origin-left shadow-md ${tab.color} ${
                    currentSpread === tab.index ? "translate-x-2 pl-4" : "hover:translate-x-1"
                  }`}
                  style={{ writingMode: "vertical-lr" }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* The Notebook itself */}
            <div className={`w-full aspect-[16/10] rounded-3xl border p-6 relative z-10 flex gap-6 overflow-hidden transition-all duration-300 ${currentNotebook.cover}`}>
              
              {/* Spiral Ring Binder down the center */}
              <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-4 flex flex-col justify-between py-6 pointer-events-none z-30">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="relative w-full h-3 flex items-center justify-center">
                    {/* Metallic Wire Loop */}
                    <div className={`absolute w-8 h-2.5 rounded-full border border-zinc-400/50 shadow-md ${currentNotebook.wire}`} />
                    {/* Hole Left */}
                    <div className={`absolute left-[2px] w-1.5 h-1.5 rounded-full transition-colors duration-300 ${currentNotebook.holeBg}`} />
                    {/* Hole Right */}
                    <div className={`absolute right-[2px] w-1.5 h-1.5 rounded-full transition-colors duration-300 ${currentNotebook.holeBg}`} />
                  </div>
                ))}
              </div>

              {/* AnimatePresence for Spread Flipping */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSpread}
                  initial={{ rotateY: -10, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 10, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  style={{ perspective: 1000 }}
                  className="w-full h-full grid grid-cols-2 gap-8"
                >
                  {/* Left Page */}
                  <div 
                    className="relative w-full h-full rounded-2xl border border-black/5 dark:border-white/5 p-8 flex flex-col justify-center overflow-hidden transition-colors duration-300"
                    style={{
                      background: `${currentNotebook.lines}, ${currentNotebook.pageBg}`,
                    }}
                  >
                    {/* Left Margin Line */}
                    <div className={`absolute left-8 top-0 bottom-0 w-[1px] ${currentNotebook.margin}`} />
                    
                    {/* Render Note A of Spread */}
                    {renderNoteCard(philosophyNotes[currentSpread * 2])}
                  </div>

                  {/* Right Page */}
                  <div 
                    className="relative w-full h-full rounded-2xl border border-black/5 dark:border-white/5 p-8 flex flex-col justify-center overflow-hidden transition-colors duration-300"
                    style={{
                      background: `${currentNotebook.lines}, ${currentNotebook.pageBg}`,
                    }}
                  >
                    {/* Right Margin Line */}
                    <div className={`absolute right-8 top-0 bottom-0 w-[1px] ${currentNotebook.margin}`} />
                    
                    {/* Render Note B of Spread */}
                    {renderNoteCard(philosophyNotes[currentSpread * 2 + 1])}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Notebook Container - Mobile (Single Page View) */}
          <div className="block md:hidden mt-8 select-none relative max-w-[345px] mx-auto">
            {/* Single Notebook Page */}
            <div className={`w-full aspect-[4/5] rounded-2xl border p-6 shadow-xl relative overflow-hidden flex flex-col justify-center pl-8 transition-all duration-300 ${currentNotebook.cover}`}>
              
              {/* Spiral rings on the left side */}
              <div className="absolute left-1.5 top-3 bottom-3 w-3 flex flex-col justify-between py-3 pointer-events-none z-30">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="relative w-full h-2 flex items-center justify-center">
                    <div className={`absolute w-6 h-2 rounded-full border border-zinc-400/50 shadow-sm ${currentNotebook.wire}`} />
                    <div className={`absolute left-[1px] w-1 h-1 rounded-full transition-colors duration-300 ${currentNotebook.holeBg}`} />
                    <div className={`absolute right-[1px] w-1 h-1 rounded-full transition-colors duration-300 ${currentNotebook.holeBg}`} />
                  </div>
                ))}
              </div>

              {/* Left Margin Line */}
              <div className={`absolute left-10 top-0 bottom-0 w-[1px] ${currentNotebook.margin}`} />

              {/* AnimatePresence for Mobile Page Flipping */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobilePage}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full flex flex-col justify-center relative z-10"
                >
                  {renderNoteCard(philosophyNotes[mobilePage])}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile Navigation Controls */}
            <div className="flex items-center justify-between mt-6 px-4">
              <button
                onClick={() => setMobilePage((p) => Math.max(0, p - 1))}
                disabled={mobilePage === 0}
                className="px-4 py-2 rounded-full border border-border text-xs bg-secondary/40 hover:bg-secondary transition disabled:opacity-30 disabled:pointer-events-none"
              >
                ← Prev
              </button>
              <span className="font-mono text-xs text-muted-foreground">
                Note {mobilePage + 1} of {philosophyNotes.length}
              </span>
              <button
                onClick={() => setMobilePage((p) => Math.min(philosophyNotes.length - 1, p + 1))}
                disabled={mobilePage === philosophyNotes.length - 1}
                className="px-4 py-2 rounded-full border border-border text-xs bg-secondary/40 hover:bg-secondary transition disabled:opacity-30 disabled:pointer-events-none"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About */}
      <section id="about" className="py-32 border-t border-border/40">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader eyebrow="03 — About me" title="Frontend & Backend Engineer driven by execution." />
          <div className="grid md:grid-cols-5 gap-10">
            <div className="md:col-span-3 space-y-6 text-lg text-muted-foreground leading-relaxed animate-in fade-in-50 duration-500">
              <p className="text-xl font-medium text-foreground italic border-l-4 border-primary pl-4 py-1 bg-primary/5 rounded-r-xl">
                "I live by goals, not dreams. Anyone can do the job, but not anyone can be me."
              </p>
              <p>
                I am a Frontend & Backend Engineer who believes that great systems are built on systematic progress, not wishful thinking. With this mentality, I ensure all tasks I tackle are driven by absolute focus and strict execution.
              </p>
              <p>
                By channeling consistency, discipline, and clear goal alignment, I can achieve any target or milestone I set my mind to plan.
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {[
                { k: "Philippines", v: "Based in" },
                { k: "1 yr", v: "Experience" },
                { k: "11", v: "Projects & Systems" },
                { k: "EN · FIL", v: "Languages" },
              ].map((s) => (
                <div key={s.v} className="rounded-2xl border border-border bg-card p-5">
                  <div className="font-display text-2xl text-foreground">{s.k}</div>
                  <div className="text-xs uppercase tracking-widest mt-2 text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Three Pillars Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 border-t border-border/40 pt-16">
            {[
              {
                title: "Consistency",
                desc: "Showing up day after day to build, test, and refine. Small daily improvements compound over time to build solid, scalable systems.",
                icon: "🔄"
              },
              {
                title: "Discipline",
                desc: "The commitment to focus on what matters most, maintaining high code quality and strict performance criteria even when shortcut solutions are easier.",
                icon: "🛡️"
              },
              {
                title: "Goal",
                desc: "Setting clear, structured milestones. Dreams are just ideas; goals are actionable roadmaps that lead to successful execution.",
                icon: "🎯"
              }
            ].map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-3xl border border-border bg-card p-6 relative overflow-hidden group hover:border-primary/60 transition-all duration-300"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 w-fit">{p.icon}</div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Experience */}
      <section id="experience" className="py-32 border-t border-border/40">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader eyebrow="04 — Experience" title="Where I've spent my hours." />
          <ol className="relative border-l border-border ml-2">
            {experience.map((e, i) => (
              <motion.li
                key={e.role}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="pl-8 pb-10 relative"
              >
                <span className="absolute -left-[7px] top-2 h-3 w-3 rounded-full bg-primary" />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-xl font-semibold">{e.role}</h3>
                  <span className="text-primary">· {e.company}</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground ml-auto">{e.years}</span>
                </div>
                <p className="mt-2 text-muted-foreground">{e.impact}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Achievements */}
      <section id="achievements" className="py-32 border-t border-border/40">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader eyebrow="05 — Achievements" title="Moments the industry noticed." />
          <div className="grid md:grid-cols-3 gap-4">
            {achievements.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition"
              >
                <div className="text-xs uppercase tracking-widest text-primary">{a.year}</div>
                <div className="font-display text-lg mt-2">{a.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Skills */}
      <section id="skills" className="py-32 border-t border-border/40">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader eyebrow="06 — Skills" title="Knowledgeable in these tech stack | or tools" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((s) => (
              <div key={s.group} className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/40 transition duration-300 animate-in fade-in-50 duration-500 relative overflow-hidden group">
                {/* Decorative background grid pattern for premium touch */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4 font-semibold">{s.group}</p>
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.04
                        }
                      }
                    }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex flex-wrap gap-2"
                  >
                    {s.items.map((it) => (
                      <motion.span
                        key={it}
                        variants={{
                          hidden: { opacity: 0, scale: 0.9, y: 8 },
                          show: { opacity: 1, scale: 1, y: 0 }
                        }}
                        className={`px-3 py-1.5 rounded-full border border-border text-xs bg-secondary/10 transition-all duration-300 cursor-default flex items-center gap-1.5 select-none ${getBrandHoverClass(it)}`}
                      >
                        <SkillIcon name={it} />
                        {it}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Hobbies */}
      <section id="hobbies" className="py-32 border-t border-border/40">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader eyebrow="07 — Hobbies" title={<span>Many hobbies, <span className="text-primary italic">but never mastered.</span></span>} />
          
          <p className="mt-4 text-muted-foreground text-sm max-w-xl">
            I believe that productivity starts with balance. Taking care of both my body and mind helps me stay focused, creative, and ready to tackle new challenges every day.
          </p>

          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
          >
            {hobbies.map((h) => (
              <motion.div
                key={h.label}
                drag
                dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }}
                dragElastic={0.15}
                dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
                style={{ rotate: h.rotate, y: h.yOffset }}
                variants={{
                  hidden: { opacity: 0, scale: 0.95, y: 30, rotate: h.rotate },
                  show: { opacity: 1, scale: 1, y: h.yOffset, rotate: h.rotate, transition: { type: "spring", stiffness: 80, damping: 15 } }
                }}
                whileHover={{ 
                  scale: 1.04, 
                  rotate: 0, 
                  y: h.yOffset - 10, 
                  zIndex: 40, 
                  transition: { type: "spring", stiffness: 300, damping: 20 } 
                }}
                whileTap={{ cursor: "grabbing" }}
                className={`rounded-3xl border bg-card/25 backdrop-blur-sm p-6 flex flex-col justify-between transition-shadow duration-300 relative select-none cursor-grab active:cursor-grabbing group overflow-hidden h-[260px] ${h.borderClass}`}
              >
                {/* Arrow up right */}
                <ArrowUpRight size={16} className="absolute top-5 right-5 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                
                {/* Top content */}
                <div className="flex flex-col gap-4">
                  {/* Circle Icon wrapper */}
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${h.iconClass}`}>
                    <HobbyIcon name={h.icon} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">{h.label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{h.desc}</p>
                  </div>
                </div>

                {/* Bottom content */}
                <div className="border-t border-border/30 pt-4 mt-auto">
                  <span className={`text-[10px] uppercase tracking-wider font-semibold ${h.subClass}`}>
                    {h.sub}
                  </span>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
                    {h.val}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Music Profile Dashboard Widget */}
          <div className="mt-24 border-t border-border/40 pt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">🎵 Profile Dashboard</span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {activeDashboardTab === "music" ? "My Read on Your Music Taste" : "Personality & Inner Growth"}
                </h3>
              </div>
              
              {/* Tab Selector */}
              <div className="flex items-center gap-1.5 bg-secondary/10 border border-border/85 p-1 rounded-xl shrink-0 self-start md:self-auto">
                <button
                  onClick={() => {
                    playClick('medium');
                    setActiveDashboardTab("music");
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeDashboardTab === "music"
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🎵 Music Playlist
                </button>
                <button
                  onClick={() => {
                    playClick('medium');
                    setActiveDashboardTab("personality");
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeDashboardTab === "personality"
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🧠 Personality Traits
                </button>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {activeDashboardTab === "music" ? (
                <motion.div
                  key="music-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Record Player Body (Deezer Widget Card) */}
                  <div className="lg:col-span-5 bg-card/45 border border-border rounded-3xl p-6 flex flex-col items-center shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary mb-4 select-none uppercase tracking-wider">
                      Interactive Deezer Player
                    </span>
                    
                    {/* Deezer Widget Iframe */}
                    <div className="w-full h-[220px] rounded-2xl overflow-hidden border border-border/80 bg-zinc-950/80 shadow-inner">
                      <iframe
                        title="Deezer Player"
                        src={`https://widget.deezer.com/widget/dark/track/${musicProfile[activeTrackIndex].deezerId}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowTransparency={true}
                        allow="encrypted-media; clipboard-write"
                        className="rounded-2xl"
                      />
                    </div>

                    {/* Cycle control buttons below the player */}
                    <div className="flex items-center justify-center gap-6 mt-6 w-full pt-4 border-t border-border/20">
                      <button 
                        onClick={() => {
                          playClick('medium');
                          setActiveTrackIndex((prev) => (prev === 0 ? musicProfile.length - 1 : prev - 1));
                        }}
                        className="p-2.5 rounded-full border border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground active:scale-95 transition"
                        title="Previous Mixtape"
                      >
                        <SkipBack size={18} />
                      </button>
                      <span className="text-xs font-semibold text-muted-foreground select-none">
                        Mixtape {activeTrackIndex + 1} of {musicProfile.length}
                      </span>
                      <button 
                        onClick={() => {
                          playClick('medium');
                          setActiveTrackIndex((prev) => (prev === musicProfile.length - 1 ? 0 : prev + 1));
                        }}
                        className="p-2.5 rounded-full border border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground active:scale-95 transition"
                        title="Next Mixtape"
                      >
                        <SkipForward size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Mixtapes and Details panel */}
                  <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-3">
                      {musicProfile.map((item, idx) => (
                        <button
                          key={item.category}
                          onClick={() => {
                            playClick('medium');
                            setActiveTrackIndex(idx);
                          }}
                          className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-300 ${
                            activeTrackIndex === idx 
                              ? `bg-gradient-to-br ${item.color.split(' ')[0]} ${item.color.split(' ')[1]} border-primary shadow-[0_0_15px_rgba(var(--color-primary),0.05)]` 
                              : "border-border bg-card/25 hover:border-foreground/30 hover:bg-card/45"
                          }`}
                        >
                          <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                          <div>
                            <p className={`text-xs font-bold leading-tight ${activeTrackIndex === idx ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {item.category}
                            </p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1">
                              {item.track}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Playlist detail display */}
                    <div className="rounded-3xl border border-border bg-card/25 p-6 flex flex-col gap-4">
                      <div>
                        <h5 className="text-xs uppercase tracking-wider text-primary font-semibold">Featured Playlist Artists</h5>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{musicProfile[activeTrackIndex].desc}</p>
                      </div>

                      {musicProfile[activeTrackIndex].category === "Hard Rock & Metal" ? (
                        <div className="grid md:grid-cols-2 gap-4 text-left border-t border-border/20 pt-4 mt-2">
                          <div>
                            <p className="text-[11px] font-bold text-primary flex items-center gap-1">🤘 Classic Heavy Metal</p>
                            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                              Metallica • Black Sabbath • Iron Maiden • Judas Priest • Dio • Accept • Saxon • Motörhead • Mercyful Fate • Diamond Head
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-primary flex items-center gap-1">⚡ Hard Rock / Heavy Rock</p>
                            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                              AC/DC • Led Zeppelin • Deep Purple • Aerosmith • Van Halen • Scorpions • Guns N' Roses • Def Leppard • Whitesnake • Rainbow
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-primary flex items-center gap-1">🎸 NWOBHM & NWOBHM Traditional</p>
                            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                              Iron Maiden • Judas Priest • Saxon • Diamond Head • Angel Witch • Raven • Tygers of Pan Tang
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-primary flex items-center gap-1">🎤 Great Vocals & Melodies</p>
                            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                              Dio • Queensrÿche • Savatage • Helloween • Crimson Glory • Iced Earth
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {musicProfile[activeTrackIndex].artists.map((artist) => (
                            <span
                              key={artist}
                              className="px-3 py-1.5 rounded-xl border border-border/60 bg-secondary/15 text-xs text-foreground/90 font-medium select-none hover:border-primary/50 transition duration-200"
                            >
                              {artist}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Personality Quote */}
                    <div className="rounded-3xl border border-border bg-gradient-to-r from-primary/5 to-transparent p-6 relative overflow-hidden">
                      <div className="absolute right-4 bottom-2 text-6xl font-serif text-primary/10 select-none">“</div>
                      <p className="text-sm font-semibold italic text-foreground leading-relaxed relative z-10">
                        "A mix of 90s and 2000s alternative rock, hard rock, classic rock legends, timeless OPM, soft rock classics, and modern chill pop—with the occasional movie soundtrack."
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3 border-t border-border/40 pt-4">
                        <span className="text-[10px] bg-secondary/35 text-muted-foreground px-2.5 py-1 rounded-full font-medium">💻 Clean aesthetics</span>
                        <span className="text-[10px] bg-secondary/35 text-muted-foreground px-2.5 py-1 rounded-full font-medium">🏃 Workout fuel</span>
                        <span className="text-[10px] bg-secondary/35 text-muted-foreground px-2.5 py-1 rounded-full font-medium">🥊 Energetic rock</span>
                        <span className="text-[10px] bg-secondary/35 text-muted-foreground px-2.5 py-1 rounded-full font-medium">🌙 Timeless classics</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="personality-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Personality Traits Grid (Column 1 - takes 5 cols on lg) */}
                  <div className="lg:col-span-5 flex flex-col gap-4">
                    <h4 className="text-xs uppercase tracking-widest text-primary font-semibold">Core Traits</h4>
                    <div className="flex flex-col gap-3">
                      {[
                        { trait: "Disciplined", icon: "💪", desc: "I value structure, intense training, and constant self-improvement." },
                        { trait: "Nostalgic", icon: "🎸", desc: "I gravitate toward 90s/2000s rock, classic hits, and OPM legends." },
                        { trait: "Creative", icon: "💻", desc: "I care deeply about design details, clean code, and user experience." },
                        { trait: "Curious", icon: "🧠", desc: "I am always exploring new frameworks and refining my engineering skills." },
                        { trait: "Grounded", icon: "🤝", desc: "I value authenticity over fleeting trends, looking for things that endure." }
                      ].map((t) => (
                        <div key={t.trait} className="rounded-2xl border border-border bg-card/45 p-4 flex gap-4 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--color-primary),0.03)] transition duration-300">
                          <span className="text-2xl mt-0.5">{t.icon}</span>
                          <div>
                            <p className="text-sm font-bold text-foreground">{t.trait}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-1">{t.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sayings and Personality Profiles (Column 2 - takes 7 cols on lg) */}
                  <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* Philosophy Block */}
                    <div className="rounded-3xl border border-border bg-card/25 p-6 flex flex-col gap-3">
                      <h4 className="text-xs uppercase tracking-widest text-primary font-semibold">My Philosophy</h4>
                      <p className="text-sm leading-relaxed text-foreground">
                        "I'm someone who values balance. I enjoy pushing myself through running, cycling, weightlifting, and martial arts, but I also appreciate slowing down with timeless music and meaningful stories. My taste in music ranges from 90s and 2000s rock to classic artists and OPM legends—reflecting both my energetic side and my appreciation for authenticity. Whether I'm building software, training, or listening to my favorite playlists, I believe consistency, discipline, and curiosity are what drive personal growth."
                      </p>
                    </div>

                    {/* Personality Quote Banner */}
                    <div className="rounded-3xl border border-border bg-gradient-to-r from-primary/10 to-transparent p-6 relative overflow-hidden">
                      <div className="absolute right-4 bottom-2 text-7xl font-serif text-primary/10 select-none">“</div>
                      <p className="text-sm font-bold italic text-foreground leading-relaxed relative z-10">
                        "I'm driven by discipline, inspired by creativity, and grounded by the timeless music and experiences that remind me to keep growing—both as a developer and as a person."
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 8. Goals */}
      <section id="goals" className="py-32 border-t border-border/40">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader eyebrow="08 — Goals" title="What I'm building toward." />
          <ul className="space-y-6">
            {goals.map((g, i) => (
              <motion.li
                key={g}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-6 items-baseline border-b border-border/60 pb-6"
              >
                <span className="font-display text-2xl text-primary shrink-0 w-12">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-2xl md:text-3xl leading-snug">{g}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. Connect */}
      <section id="connect" className="py-32 border-t border-border/40">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3">08 — Connect</p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display text-5xl md:text-6xl font-semibold tracking-tight"
            >
              Have an idea?<br />
              <span className="italic text-primary">Let's build it.</span>
            </motion.h2>
            <p className="mt-6 text-muted-foreground max-w-lg mx-auto">
              Drop a message below or reach me directly. I read every note.
            </p>
          </div>

          <div className="mt-12 rounded-3xl border border-border bg-card p-8 md:p-10">
            <ContactForm />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="mailto:hi@alexrivera.dev" className="hover:text-primary transition">hi@alexrivera.dev</a>
            <span className="text-muted-foreground">·</span>
            <a href="#" className="hover:text-primary transition">Twitter</a>
            <a href="#" className="hover:text-primary transition">GitHub</a>
            <a href="#" className="hover:text-primary transition">Read.cv</a>
            <a href="#" className="hover:text-primary transition">LinkedIn</a>
          </div>
        </div>

        <footer className="mt-24 border-t border-border/40 pt-8 pb-6 mx-auto max-w-6xl px-6 flex flex-wrap justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2026 Alex Rivera</span>
          <span>Built with care in Portland</span>
        </footer>
      </section>

      {/* Project detail modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setModal(null)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card"
              style={{ 
                border: `1px solid ${modal.themeColor}33`, 
                boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${modal.themeColor}15` 
              }}
            >
              <div className={`relative h-48 md:h-64 overflow-hidden rounded-t-3xl bg-gradient-to-br ${modal.color}`}>
                {modal.image && (
                  <img
                    src={modal.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 pointer-events-none"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/45 to-transparent" />
                <button
                  onClick={() => setModal(null)}
                  className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-4 py-2 text-xs font-mono uppercase tracking-widest hover:bg-background"
                >
                  <span aria-hidden>←</span> Back
                </button>
                <button
                  onClick={() => setModal(null)}
                  aria-label="Close"
                  className="absolute top-5 right-5 h-9 w-9 inline-flex items-center justify-center rounded-full border border-border bg-background/70 backdrop-blur hover:bg-background"
                >
                  ✕
                </button>
                <div className="absolute bottom-5 left-6 right-6">
                  <p 
                    className="text-xs font-mono uppercase tracking-[0.3em]"
                    style={{ color: modal.themeColor }}
                  >
                    {modal.tag}
                  </p>
                  <h3 className="font-display text-3xl md:text-4xl font-semibold mt-2">{modal.title}</h3>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  {modal.metrics.map((m) => (
                    <div 
                      key={m.v} 
                      className="rounded-2xl bg-background/40 p-4 text-center"
                      style={{ border: `1px solid ${modal.themeColor}22` }}
                    >
                      <div 
                        className="font-display text-xl md:text-2xl"
                        style={{ color: modal.themeColor, textShadow: `0 0 8px ${modal.themeColor}60` }}
                      >
                        {m.k}
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-widest mt-1 text-muted-foreground">{m.v}</div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Role</p>
                    <p className="font-display text-base">{modal.role}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Year</p>
                    <p className="font-display text-base">{modal.year}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {modal.stack.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-full border border-border text-xs font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Overview</p>
                  <p className="text-base md:text-lg text-foreground/90 leading-relaxed">{modal.details}</p>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => setModal(null)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border hover:bg-secondary font-mono text-sm uppercase tracking-widest"
                  >
                    <span aria-hidden>←</span> Back to work
                  </button>
                  <div className="flex gap-2">
                    {modal.liveUrl && (
                      <a
                        href={modal.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-all"
                        style={{
                          backgroundColor: modal.themeColor,
                          boxShadow: `0 0 15px ${modal.themeColor}80`
                        }}
                      >
                        Live Demo ↗
                      </a>
                    )}
                    <a
                      href="#connect"
                      onClick={() => setModal(null)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-muted-foreground font-mono text-sm uppercase tracking-widest hover:bg-secondary"
                    >
                      Discuss project →
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <CustomCursor isDark={isDark} />
    </main>
  );
}

/* ---------- ThemeSelector component ---------- */
function ThemeSelector({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  const options: { id: Theme; label: string; dotClass: string; activeClass: string }[] = [
    { id: "white", label: "White Theme", dotClass: "bg-white border-zinc-300", activeClass: "ring-2 ring-blue-500 ring-offset-2 ring-offset-background" },
    { id: "cream", label: "Cream Theme", dotClass: "bg-[#faf6ee] border-amber-800/30", activeClass: "ring-2 ring-amber-700 ring-offset-2 ring-offset-background" },
    { id: "dark", label: "Dark Theme", dotClass: "bg-[#0d0d11] border-emerald-500/30", activeClass: "ring-2 ring-emerald-400 ring-offset-2 ring-offset-background" },
    { id: "red-black", label: "Red & Black Theme", dotClass: "bg-[#000000] border-red-600/50", activeClass: "ring-2 ring-red-500 ring-offset-2 ring-offset-background" },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 rounded-full border border-border bg-card/60 backdrop-blur">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          title={opt.label}
          aria-label={opt.label}
          className={`w-5 h-5 rounded-full border cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 ${opt.dotClass} ${
            theme === opt.id ? opt.activeClass : ""
          }`}
        />
      ))}
    </div>
  );
}

/* ---------- CustomCursor component ---------- */
function CustomCursor({ isDark }: { isDark: boolean }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(
      window.matchMedia("(max-width: 768px)").matches || 
      "ontouchstart" in window || 
      navigator.maxTouchPoints > 0
    );
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isMobile]);

  // Smooth trail effect
  useEffect(() => {
    if (isMobile) return;

    let frameId: number;
    const updateTrail = () => {
      setTrail((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        const factor = 0.16; // Lerp speed
        return {
          x: prev.x + dx * factor,
          y: prev.y + dy * factor,
        };
      });
      frameId = requestAnimationFrame(updateTrail);
    };
    frameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(frameId);
  }, [position, isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const handleHoverStart = () => setHovered(true);
    const handleHoverEnd = () => setHovered(false);

    const updateInteractions = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, [drag], [onclick]'
      );
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleHoverStart);
        el.addEventListener("mouseleave", handleHoverEnd);
      });
    };

    updateInteractions();

    const observer = new MutationObserver(updateInteractions);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, [drag], [onclick]'
      );
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
    };
  }, [isMobile]);

  if (isMobile || hidden) return null;

  return (
    <>
      {/* Core Dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      />
      {/* Trailing Ring */}
      <div
        className={`fixed top-0 left-0 rounded-full border pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${
          hovered 
            ? "w-12 h-12 border-primary bg-primary/10" 
            : "w-6 h-6 border-primary/40 bg-transparent"
        }`}
        style={{
          transform: `translate3d(${trail.x}px, ${trail.y}px, 0)`,
        }}
      />
    </>
  );
}
