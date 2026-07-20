import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Sparkles, ArrowUpRight, SkipForward, SkipBack, Menu, X, ChevronLeft, ChevronRight, ChevronDown, ArrowUp, Heart } from "lucide-react";
import { useSound } from "../hooks/useSound";
import profileCasual from "../assets/profile-casual.jpg";
import profileFormal from "../assets/profile-formal.jpg";
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
    <div className="relative rounded-3xl border border-border/60 bg-card p-4 sm:p-6 w-full max-w-[320px] sm:max-w-[400px] mx-auto shadow-2xl">
      <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-secondary">
        <AnimatePresence>
          <motion.img
            key={formal ? "formal" : "casual"}
            src={formal ? profileFormal : profileCasual}
            alt={formal ? "Erin — formal portrait" : "Erin — casual portrait"}
            width={768}
            height={1024}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            className="absolute inset-0 h-full w-full object-cover transform-gpu"
          />
        </AnimatePresence>
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-background/70 backdrop-blur border border-border/60">
          {formal ? "Formal" : "Casual"}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="font-display font-semibold">Erin Tuzon</p>
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
    category: "fullstack",
    isLive: true,
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
    category: "fullstack",
    isLive: true,
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
  { 
    title: "Nebula OS", 
    tag: "Product · 2025", 
    category: "ai-os",
    isLive: false,
    desc: "An AI-native OS with spatial windows.", 
    color: "from-[#5cf0a6]/40 to-transparent", 
    themeColor: "#5cf0a6", 
    image: projNebula,
    role: "Lead Design Engineer", 
    stack: ["React", "WebGPU", "Rust", "Motion"], 
    year: "2025",
    details: "A speculative operating system exploring what personal computing looks like when AI is the primary interface. Spatial window management, voice-first workflows, and a shader-driven compositor.",
    metrics: [{ k: "12k", v: "Beta users" }, { k: "4.9", v: "TestFlight" }, { k: "60fps", v: "Compositor" }],
    liveUrl: "",
  },
  { 
    title: "Kinetic Type", 
    tag: "WebGL · 2024", 
    category: "creative",
    isLive: false,
    desc: "Generative typeface reacting to sound.", 
    color: "from-[#ff5a3c]/40 to-transparent", 
    themeColor: "#ff5a3c", 
    image: projKinetic,
    role: "Creative Developer", 
    stack: ["Three.js", "GLSL", "Tone.js"], 
    year: "2024",
    details: "A live typographic instrument. Letterforms bend, fracture, and re-form in response to microphone input — used in live performances at Sónar and MUTEK.",
    metrics: [{ k: "SOTD", v: "Awwwards" }, { k: "3", v: "Live shows" }, { k: "180k", v: "Plays" }],
    liveUrl: "",
  },
  { 
    title: "Lumen", 
    tag: "App · 2023", 
    category: "creative",
    isLive: false,
    desc: "A quiet meditation app built for focus.", 
    color: "from-[#ff5a3c]/40 to-transparent", 
    themeColor: "#ff5a3c", 
    image: projLumen,
    role: "Product Designer", 
    stack: ["Swift", "SwiftUI", "Metal"], 
    year: "2023",
    details: "An iOS meditation app centered on ambient soundscapes and gentle breath pacing. Built around a single principle: nothing on screen should demand attention.",
    metrics: [{ k: "#3", v: "App Store" }, { k: "220k", v: "Downloads" }, { k: "4.8", v: "Rating" }],
    liveUrl: "",
  },
  { 
    title: "Prism", 
    tag: "Tool · 2022", 
    category: "creative",
    isLive: false,
    desc: "A color system generator for designers.", 
    color: "from-[#a78bfa]/40 to-transparent", 
    themeColor: "#a78bfa", 
    image: projPrism,
    role: "Solo Maker", 
    stack: ["React", "OKLCH", "Vite"], 
    year: "2022",
    details: "A perceptually-uniform color system generator. Input a brand color, get a token-ready palette with accessible pairings across every surface, mode, and state.",
    metrics: [{ k: "50k", v: "MAU" }, { k: "Open", v: "Source" }, { k: "2.1k", v: "Stars" }],
    liveUrl: "",
  },
];

type Project = (typeof projects)[number];



/* ---------- Section header ---------- */

function SectionHeader({ eyebrow, title, kicker }: { eyebrow: string; title: string | React.ReactNode; kicker?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3 sm:gap-4">
      <div>
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary mb-2 sm:mb-3 flex items-center gap-3"
        >
          {eyebrow}
          <span className="hidden sm:inline-block h-px w-12 bg-gradient-to-r from-primary/60 to-transparent" />
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
          className="font-display text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl leading-tight"
        >
          {title}
        </motion.h2>
      </div>
      {kicker && (
        <motion.p
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs sm:text-sm text-muted-foreground"
        >
          {kicker}
        </motion.p>
      )}
    </div>
  );
}

/* ---------- Data ---------- */

const experience = [
  {
    role: "Associate Software Engineer",
    company: "Inovers",
    years: "Nov 2025 — Present",
    impact: "Isabela, Philippines (Remote/Hybrid) · Developed the DORX Logistics Platform, designed and maintained RESTful APIs, optimized SQL queries, and implemented real-time tracking across 11 interconnected systems."
  },
  {
    role: "Technical Staff",
    company: "Universal Leaf Philippines, Inc.",
    years: "Jul 2025 — Nov 2025",
    impact: "Reina Mercedes, Cagayan Valley, Philippines (On-site) · Prepared invoices, billing records, service reports, maintenance tracking, operational reports, and managed parts inventory documentation."
  },
  {
    role: "Software Developer Intern",
    company: "Dory Delivery (Food Delivery Service)",
    years: "Feb 2025 — May 2025",
    impact: "Isabela, Philippines (Remote/Hybrid) · Developed features for customer and rider apps in React Native, built website modules in React.js, ran manual QA testing, and integrated RESTful APIs."
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
    items: ["JavaScript", "TypeScript", "HTML5", "CSS3", "React", "Tailwind CSS"]
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
    items: ["Git", "GitHub", "Vite", "WebSocket", "Docker Desktop", "Postman", "MySQL Workbench", "Vercel", "Netlify", "GitHub Pages", "OSRM"]
  },
  {
    group: "AI Tools",
    items: ["Claude Code", "ChatGPT", "Gemini API"]
  }
];

const skillMetadata: Record<string, { desc: string; projects: string[]; status: string }> = {
  JavaScript: { desc: "Core scripting language powering dynamic client & server logic.", projects: ["Leavely", "E-Barangay System", "DORX Platform"], status: "Core Language" },
  TypeScript: { desc: "Type-safe JavaScript for scalable full-stack applications.", projects: ["Leavely", "E-Barangay System", "Portfolio"], status: "Primary Standard" },
  HTML5: { desc: "Semantic structural markup & web accessibility standards.", projects: ["All Web Systems"], status: "Standard" },
  CSS3: { desc: "Responsive layout design, modern flexbox/grid & animations.", projects: ["All Web Systems"], status: "Standard" },
  React: { desc: "Declarative component-driven frontend user interface library.", projects: ["Leavely", "E-Barangay System", "Dory Delivery"], status: "Primary Framework" },
  "Tailwind CSS": { desc: "Utility-first CSS framework for rapid design systems & glassmorphism.", projects: ["Leavely", "E-Barangay System", "Portfolio"], status: "Primary Styling" },
  "Node.js": { desc: "Event-driven asynchronous JavaScript backend server runtime.", projects: ["Leavely Backend", "DORX Logistics", "Express APIs"], status: "Production Backend" },
  "Express.js": { desc: "Fast minimalist web framework for building Node REST APIs.", projects: ["DORX Platform", "Backend Services"], status: "API Framework" },
  Supabase: { desc: "Open-source Firebase alternative with PostgreSQL & Realtime Auth.", projects: ["E-Barangay System"], status: "Cloud DB & Auth" },
  MySQL: { desc: "Relational database management for structured data querying.", projects: ["DORX Platform", "Universal Leaf Systems"], status: "Production RDBMS" },
  Firebase: { desc: "Realtime NoSQL database, Google Auth, and Cloud Storage.", projects: ["Mobile App Prototype"], status: "Cloud Platform" },
  Sequelize: { desc: "Promise-based Node.js ORM for relational SQL databases.", projects: ["DORX Backend APIs"], status: "ORM Engine" },
  Redis: { desc: "In-memory data structure store for caching & pub/sub messaging.", projects: ["Session Cache"], status: "In-Memory Cache" },
  "Socket.IO": { desc: "Real-time bidirectional event-based communication engine.", projects: ["DORX Realtime Tracking"], status: "Realtime Engine" },
  JWT: { desc: "Stateless JSON Web Token security for API authentication.", projects: ["Leavely Auth", "DORX Auth"], status: "Security Standard" },
  "REST API": { desc: "RESTful HTTP API architectural design & contract design.", projects: ["All Microservices"], status: "Architecture" },
  "Resend API": { desc: "Transactional email API service for automated notifications.", projects: ["Leavely Email Alerts"], status: "Email Gateway" },
  "React Native": { desc: "Cross-platform mobile application framework for iOS & Android.", projects: ["Dory Delivery App"], status: "Mobile Framework" },
  Expo: { desc: "Universal React Native toolchain & native device runtime.", projects: ["Dory Delivery App"], status: "Mobile Toolchain" },
  "Android Studio": { desc: "Android SDK platform & emulator environment.", projects: ["Mobile Builds"], status: "Dev Environment" },
  Git: { desc: "Distributed version control system for source code tracking.", projects: ["All Repositories"], status: "VCS Standard" },
  GitHub: { desc: "Cloud repository hosting, code reviews & CI/CD automation.", projects: ["Nire1317 GitHub"], status: "DevOps Host" },
  Vite: { desc: "Next-generation frontend dev server & bundler.", projects: ["Leavely", "E-Barangay System", "Portfolio"], status: "Primary Bundler" },
  WebSocket: { desc: "Full-duplex persistent client-server protocol.", projects: ["Realtime Telemetry"], status: "Network Protocol" },
  "Docker Desktop": { desc: "Containerized app packaging & reproducible environment orchestration.", projects: ["Local Services"], status: "Containerization" },
  Postman: { desc: "API testing, automated endpoint validation & documentation.", projects: ["API Integration Test Suites"], status: "Testing Suite" },
  "MySQL Workbench": { desc: "Visual SQL schema design & database administration tool.", projects: ["Database Schemas"], status: "Admin Tool" },
  Vercel: { desc: "Serverless web application deployment & global CDN hosting.", projects: ["Leavely", "E-Barangay System"], status: "Deployment Platform" },
  Netlify: { desc: "Automated web application deployment and serverless platform.", projects: ["Web Applications"], status: "Cloud Host" },
  "GitHub Pages": { desc: "Static website deployment directly from GitHub branches.", projects: ["Static Demos"], status: "Static Host" },
  OSRM: { desc: "High-performance Open Source Routing Machine for GIS mapping.", projects: ["DORX Route Optimization"], status: "GIS Engine" },
  "Claude Code": { desc: "Agentic AI CLI assistant for automated coding & refactoring.", projects: ["AI Pair Developer"], status: "AI Tooling" },
  ChatGPT: { desc: "Conversational AI model for architecture & code optimization.", projects: ["Research Assistant"], status: "AI Tooling" },
  "Gemini API": { desc: "Google DeepMind multimodal AI API integration.", projects: ["AI Features"], status: "AI Integration" },
};

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
    val: "Black Belt, 1st Dan",
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
    desc: "Curating a soundscape of 60s to 90s classics, from old-school pop to rock",
    sub: "Favs & Genres",
    val: "60s-90s Classics, Elvis Presley to Tom Jones, Nirvana, Metal, OPM Legends",
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
    desc: "Classic 60s to 90s vocal legends, timeless crooners, and slow-dance ballads.",
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
  "Become a fully versatile Software Engineer and expand my skills into DevOps within the next 2 years.",
  "Grow into a Senior Full-Stack Software Engineer capable of designing, building, and scaling impactful systems.",
  "Build products that solve real-world problems and create meaningful value for people.",
  "Master modern web, mobile, cloud, and DevOps technologies through continuous learning.",
  "Build a comfortable and better life for my family through growth, dedication, and hard work.",
];

/* ---------- Contact form ---------- */

function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [visitorName, setVisitorName] = useState("");

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

    setVisitorName(name);

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
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6 text-center rounded-2xl bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-md transition-all duration-300">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-5 text-2xl animate-pulse">
          ✓
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Thank you, {visitorName}!</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
          Your message has been successfully delivered. I'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setError(null);
            setVisitorName("");
          }}
          className="px-6 py-2.5 rounded-full border border-border bg-secondary/60 text-xs font-semibold hover:bg-secondary transition active:scale-95"
        >
          Send another message
        </button>
      </div>
    );
  }

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
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
          <span className="text-base leading-none">⚠️</span>
          <div>
            <p className="font-semibold mb-0.5">Failed to send message</p>
            <p className="text-xs text-red-400/90 leading-relaxed">{error}</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-muted-foreground">
          Replies within 24 hours · booking Q3 2026
        </p>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50 active:scale-95"
        >
          {loading ? "Sending..." : "Send message"}
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

/* ---------- Spotlight Project Card Component ---------- */

function ProjectSpotlightCard({ 
  p, 
  index, 
  onSelect 
}: { 
  p: Project; 
  index: number; 
  onSelect: (p: Project) => void;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      transition={{ type: "spring", stiffness: 90, damping: 20, delay: index * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group rounded-3xl border border-border bg-card/60 backdrop-blur-xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:shadow-2xl relative"
      style={{
        borderColor: isHovered ? `${p.themeColor}88` : undefined,
        boxShadow: isHovered 
          ? `0 20px 40px -15px ${p.themeColor}33, 0 0 25px ${p.themeColor}15`
          : `0 4px 20px rgba(0,0,0,0.15)`,
      }}
    >
      {/* Interactive Mouse Spotlight Gradient Glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 opacity-100 z-10"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${p.themeColor}25, transparent 80%)`,
          }}
        />
      )}

      {/* Top Banner / Image Area */}
      <div className={`relative h-52 sm:h-60 w-full overflow-hidden bg-gradient-to-br ${p.color} border-b border-border/40`}>
        {p.image && (
          <img
            src={p.image}
            alt={p.title}
            className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-85 transition-all duration-700 pointer-events-none"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/25 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-20">
          <span 
            className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest font-bold bg-background/80 backdrop-blur border border-border/80 text-foreground shadow-sm"
            style={{ color: p.themeColor }}
          >
            {p.tag}
          </span>

          {p.isLive ? (
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 backdrop-blur flex items-center gap-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live App
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-secondary/80 text-muted-foreground border border-border/60 backdrop-blur">
              ✦ Concept
            </span>
          )}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-3.5 left-4.5 right-4.5 z-20">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground drop-shadow-md group-hover:text-primary transition-colors flex items-center justify-between">
            <span>{p.title}</span>
            <span className="text-xs font-mono font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: p.themeColor }}>
              {p.year}
            </span>
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-4 relative z-20">
        <div>
          {/* Role Line */}
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono mb-2.5">
            <div>
              <span className="text-primary font-semibold">Role:</span> {p.role}
            </div>
          </div>

          {/* Purpose Box */}
          <div className="p-3 rounded-xl bg-secondary/15 border border-border/50 text-xs text-foreground/90 leading-relaxed font-medium mb-3">
            <span className="font-semibold text-primary block mb-0.5 text-[10px] uppercase tracking-wider">Purpose:</span>
            {p.desc}
          </div>

          {/* Detailed Overview */}
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {p.details}
          </p>
        </div>

        <div className="space-y-4 pt-2 border-t border-border/40">
          {/* Tech Stack Badges */}
          <div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono font-semibold block mb-2">
              Tech Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {p.stack.map((st) => (
                <span
                  key={st}
                  className={`px-2.5 py-1 rounded-full border border-border text-[10px] bg-secondary/20 text-foreground font-medium select-none flex items-center gap-1 ${getBrandHoverClass(st)}`}
                >
                  <SkillIcon name={st} />
                  {st}
                </span>
              ))}
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-3 gap-1.5 bg-secondary/10 border border-border/40 rounded-xl p-2 text-center">
            {p.metrics.map((m) => (
              <div key={m.v} className="px-1">
                <div className="text-xs font-bold font-mono" style={{ color: p.themeColor }}>
                  {m.k}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground truncate">{m.v}</div>
              </div>
            ))}
          </div>

          {/* Interactive Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                onSelect(p);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl border border-border bg-secondary/30 hover:bg-secondary text-xs font-semibold text-foreground transition active:scale-95 flex items-center justify-center gap-1.5 group/btn"
            >
              <span>Inspect Architecture</span>
              <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
            </button>

            {p.liveUrl && (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3.5 rounded-xl text-white text-xs font-semibold tracking-wide transition hover:opacity-90 active:scale-95 flex items-center justify-center shrink-0 shadow-md gap-1"
                style={{ backgroundColor: p.themeColor }}
              >
                <span>Demo</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Animated Skills Wheel (Silky Smooth Spring Physics) ---------- */

function SkillsWheel() {
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const progressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { playClick } = useSound();

  // Filter tech items based on category
  const filteredSkills = useMemo(() => {
    if (activeGroup === "all") {
      return skills.flatMap((s) => s.items.map((it) => ({ item: it, group: s.group })));
    }
    const groupData = skills.find((s) => s.group === activeGroup);
    return groupData ? groupData.items.map((it) => ({ item: it, group: groupData.group })) : [];
  }, [activeGroup]);

  const count = filteredSkills.length;

  // Currently active center skill (fallback when not hovering)
  const activeCenterIndex = count > 0 ? (Math.round(progress) % count + count) % count : 0;
  const currentSkillItem = hoveredTech || (filteredSkills[activeCenterIndex]?.item ?? "TypeScript");
  const currentSkillGroup = filteredSkills.find((s) => s.item === currentSkillItem)?.group || "Languages & Frontend";
  const currentMeta = skillMetadata[currentSkillItem] || {
    desc: "Production software engineering stack component.",
    projects: ["Leavely", "E-Barangay System"],
    status: "Production Tech",
  };

  // Continuous smooth wheel loop animation
  useEffect(() => {
    if (paused || count === 0) return;
    let frameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      const speed = 0.00025; // Smooth speed factor
      progressRef.current = (progressRef.current + speed * delta) % count;
      setProgress(progressRef.current);

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [paused, count]);

  // Touch Swipe Support
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 25) {
      if (diff > 0) {
        progressRef.current = (progressRef.current + 1) % count;
      } else {
        progressRef.current = (progressRef.current - 1 + count) % count;
      }
      setProgress(progressRef.current);
    }
    touchStartX.current = null;
  };

  const wrapDiff = (diff: number, max: number) => {
    const half = max / 2;
    return ((diff + half) % max + max) % max - half;
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      {/* Category Filter Pills with Framer Motion layoutId */}
      <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
        {[
          { id: "all", label: "All Tech" },
          ...skills.map((s) => ({ id: s.group, label: s.group })),
        ].map((cat) => {
          const isActive = activeGroup === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => {
                playClick('medium');
                setActiveGroup(cat.id);
                setHoveredTech(null);
                progressRef.current = 0;
                setProgress(0);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors duration-300 select-none flex items-center gap-1.5 ${
                isActive
                  ? "text-primary-foreground"
                  : "bg-secondary/20 hover:bg-secondary/40 text-muted-foreground border border-border/50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSkillTab"
                  className="absolute inset-0 bg-primary rounded-full shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
              <span className={`relative z-10 text-[9px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-secondary/40 text-muted-foreground"}`}>
                {cat.id === "all" ? skills.reduce((acc, s) => acc + s.items.length, 0) : skills.find(s => s.group === cat.id)?.items.length}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* 3D Wheel Stage */}
      <div
        className="relative w-full h-[260px] sm:h-[300px] flex items-center justify-center select-none overflow-hidden touch-pan-y"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          setHoveredTech(null);
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Soft Ambient Center Glow */}
        <div className="absolute w-72 h-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        {/* 3D Orbit Node Container with Framer Motion AnimatePresence */}
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={activeGroup}
            className="relative w-full h-full flex items-center justify-center" 
            style={{ transformStyle: "preserve-3d" }}
          >
            {filteredSkills.map((st: { item: string; group: string }, i: number) => {
              const diff = wrapDiff(i - progress, count);
              const isActive = Math.abs(diff) < 0.5;

              // Compute cylindrical spacing and rotation
              const spacing = typeof window !== "undefined" && window.innerWidth < 640 ? 120 : 160;
              const xOffset = diff * spacing;
              const rotateY = diff * -20;
              const zOffset = -Math.abs(diff) * 90 + (isActive ? 40 : 0);
              const scale = isActive ? 1.15 : Math.max(0.75, 1 - Math.abs(diff) * 0.15);
              const opacity = Math.abs(diff) > 3 ? 0 : Math.max(0.2, 1.0 - Math.abs(diff) * 0.25);

              return (
                <motion.div
                  key={`${st.item}-${i}`}
                  onClick={() => {
                    playClick('medium');
                    setPaused(true);
                    progressRef.current = i;
                    setProgress(i);
                    setHoveredTech(st.item);
                  }}
                  onMouseEnter={() => {
                    playClick('low');
                    setHoveredTech(st.item);
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    x: xOffset,
                    rotateY: rotateY,
                    z: zOffset,
                    scale: scale,
                    opacity: opacity,
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  whileHover={{ scale: scale * 1.12, zIndex: 100 }}
                  whileTap={{ scale: scale * 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 20,
                    mass: 0.9,
                  }}
                  style={{
                    position: "absolute",
                    transformStyle: "preserve-3d",
                    zIndex: Math.round(50 - Math.abs(diff) * 10),
                  }}
                  className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border backdrop-blur-xl cursor-pointer select-none group transition-colors duration-300 ${
                    isActive || hoveredTech === st.item
                      ? "bg-card/95 border-primary text-foreground shadow-[0_10px_30px_rgba(var(--primary-rgb),0.35)] ring-2 ring-primary/40 font-bold"
                      : "bg-card/40 border-border/60 text-muted-foreground hover:border-primary/60 hover:text-foreground"
                  }`}
                >
                  <div className="text-lg sm:text-xl shrink-0 group-hover:scale-125 transition-transform duration-300">
                    <SkillIcon name={st.item} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap font-display">
                    {st.item}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live Technology Inspection Card */}
      <div className="max-w-xl mx-auto my-4 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSkillItem}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-2xl glass-strong p-4 sm:p-5 border border-primary/30 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 mb-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/30 text-xl text-primary flex items-center justify-center">
                  <SkillIcon name={currentSkillItem} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                    {currentSkillItem}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 font-semibold">
                      {currentSkillGroup}
                    </span>
                  </h4>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{currentMeta.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">● Active Inspector</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed mb-3 font-body">
              {currentMeta.desc}
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground flex-wrap pt-1 border-t border-border/40">
              <span className="text-primary font-bold text-[11px] uppercase tracking-wider">Used in:</span>
              {currentMeta.projects.map((proj) => (
                <span key={proj} className="px-2 py-0.5 rounded-md bg-secondary/40 border border-border/60 text-foreground text-[10px] font-semibold">
                  {proj}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Wheel Navigation Controls */}
      <div className="flex items-center justify-between max-w-sm mx-auto mt-3 px-4 text-xs font-mono text-muted-foreground">
        <button
          onClick={() => {
            playClick('medium');
            setPaused(true);
            const prev = (Math.ceil(progressRef.current) - 1 + count) % count;
            progressRef.current = prev;
            setProgress(prev);
          }}
          className="hover:text-primary transition flex items-center gap-1 py-1 px-2.5 rounded-lg border border-border/60 bg-card/60 active:scale-95"
        >
          <ChevronLeft size={14} /> Prev Tech
        </button>

        <button
          onClick={() => setPaused(!paused)}
          className="uppercase tracking-widest text-[10px] text-primary font-bold hover:opacity-80 transition"
        >
          {paused ? "▶ Resume Orbit" : "❚❚ Pause Orbit"}
        </button>

        <button
          onClick={() => {
            playClick('medium');
            setPaused(true);
            const next = (Math.floor(progressRef.current) + 1) % count;
            progressRef.current = next;
            setProgress(next);
          }}
          className="hover:text-primary transition flex items-center gap-1 py-1 px-2.5 rounded-lg border border-border/60 bg-card/60 active:scale-95"
        >
          Next Tech <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ---------- Hero Terminal Console Component (Ultra Glassmorphism & Interactive Terminal Input) ---------- */

function HeroConsole() {
  const [activeTab, setActiveTab] = useState<"status" | "bio" | "projects" | "stack" | "telemetry">("status");
  const [cmdInput, setCmdInput] = useState("");
  const [terminalLog, setTerminalLog] = useState<string | null>(null);
  const { playClick } = useSound();

  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = cmdInput.trim().toLowerCase();
    setCmdInput("");
    if (!query) return;

    playClick('medium');

    if (query === "help") {
      setTerminalLog("Available commands: status, bio, projects, stack, telemetry, whoami, contact, clear");
    } else if (query === "status") {
      setActiveTab("status");
      setTerminalLog(null);
    } else if (query === "bio") {
      setActiveTab("bio");
      setTerminalLog(null);
    } else if (query === "projects") {
      setActiveTab("projects");
      setTerminalLog("Navigating to Featured Projects...");
      const el = document.getElementById("projects");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (query === "stack" || query === "skills") {
      setActiveTab("stack");
      setTerminalLog("Navigating to Skills Orbit...");
      const el = document.getElementById("skills");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (query === "telemetry") {
      setActiveTab("telemetry");
      setTerminalLog(null);
    } else if (query === "whoami") {
      setTerminalLog("Guest User @ Erin's Software Engineering Portfolio");
    } else if (query === "contact" || query === "hire") {
      setTerminalLog("Scrolling to Contact section...");
      const el = document.getElementById("connect");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (query === "clear") {
      setTerminalLog(null);
    } else {
      setTerminalLog(`zsh: command not found: ${query}. Type 'help' for available commands.`);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-primary/30 bg-[#0c0d14]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(var(--primary-rgb),0.15)] relative overflow-hidden text-left font-mono group">
      {/* Decorative Ambient Radial Glow & Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent pointer-events-none opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {/* Terminal Header Bar */}
      <div className="bg-[#141624]/95 backdrop-blur-md px-3.5 sm:px-5 py-2.5 border-b border-white/10 flex items-center justify-between select-none relative z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/90 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 inline-block" />
          <span className="text-[11px] text-zinc-400 font-semibold ml-2 hidden sm:inline tracking-wide">
            erin@system-terminal:~ (zsh)
          </span>
        </div>

        {/* Command Tabs with Motion layoutId */}
        <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-xl border border-white/10 backdrop-blur-md">
          {[
            { id: "status", cmd: "$ status" },
            { id: "bio", cmd: "$ bio" },
            { id: "projects", cmd: "$ projects" },
            { id: "stack", cmd: "$ stack" },
            { id: "telemetry", cmd: "$ telemetry" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => {
                  playClick('medium');
                  setActiveTab(tab.id as any);
                  setTerminalLog(null);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-colors select-none ${
                  isActive ? "text-primary-foreground" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeHeroConsoleTab"
                    className="absolute inset-0 bg-primary rounded-lg shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.cmd}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="p-4 sm:p-5 text-xs text-zinc-200 min-h-[130px] flex flex-col justify-between relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "status" && (
            <motion.div
              key="status"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>[SYSTEM OK] Production Web Systems Operational</span>
                </div>
                {/* Equalizer animation */}
                <div className="flex items-center gap-0.5 h-4">
                  {[40, 75, 55, 90, 65, 80, 45, 95, 70].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: [`${h * 0.35}%`, `${h}%`, `${h * 0.45}%`] }}
                      transition={{ repeat: Infinity, duration: 1.2 + i * 0.1, ease: "easeInOut" }}
                      className="w-0.5 rounded-full bg-primary/80 inline-block h-full"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-zinc-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Active Deployments</span>
                  <span className="text-primary font-bold text-xs block">Leavely & E-Barangay</span>
                  <span className="text-[9px] text-emerald-400/90 font-semibold block">● Live Production</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-zinc-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Architecture</span>
                  <span className="text-primary font-bold text-xs block">React, Vite & Supabase</span>
                  <span className="text-[9px] text-zinc-400 block">Type-Safe System</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-zinc-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Availability</span>
                  <span className="text-emerald-400 font-bold text-xs block">Open for Hire</span>
                  <span className="text-[9px] text-zinc-400 block">Full-Stack / Remote</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "bio" && (
            <motion.div
              key="bio"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-1 text-xs text-emerald-300/90 font-mono leading-relaxed"
            >
              <p className="text-zinc-400">// Developer Telemetry Data Structure</p>
              <p><span className="text-primary font-bold">"name"</span>: <span className="text-amber-300">"Erin"</span>,</p>
              <p><span className="text-primary font-bold">"title"</span>: <span className="text-amber-300">"Software & Full-Stack Systems Developer"</span>,</p>
              <p><span className="text-primary font-bold">"location"</span>: <span className="text-amber-300">"Philippines (Open for Global Remote & Hybrid Roles)"</span>,</p>
              <p><span className="text-primary font-bold">"focus"</span>: <span className="text-amber-300">"Full-Stack Web Systems, Realtime Applications & AI Tooling"</span></p>
            </motion.div>
          )}

          {activeTab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5"
            >
              <p className="text-zinc-400 text-xs">// Executable Navigation Triggers:</p>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {[
                  { name: "05 — Featured Projects Showcase", href: "#projects" },
                  { name: "06 — Interactive Skills Orbit", href: "#skills" },
                  { name: "04 — Experience & Roles", href: "#experience" },
                  { name: "08 — Connect & Contact", href: "#connect" },
                ].map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => playClick('low')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{link.name}</span>
                    <span>→</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "stack" && (
            <motion.div
              key="stack"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 text-xs"
            >
              <p className="text-zinc-400">// Core Stack Matrix:</p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {["TypeScript", "React", "Node.js", "Supabase", "React Native", "Tailwind CSS", "Express.js", "MySQL", "Docker", "Claude Code", "Gemini API", "Vite", "Firebase"].map((tech) => (
                  <span key={tech} className={`px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-200 text-xs font-medium flex items-center gap-1 select-none ${getBrandHoverClass(tech)}`}>
                    <SkillIcon name={tech} />
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "telemetry" && (
            <motion.div
              key="telemetry"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 text-xs"
            >
              <p className="text-zinc-400">// Live Telemetry Metrics:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
                {[
                  { k: "Latency", v: "14ms" },
                  { k: "Frame Rate", v: "60 FPS" },
                  { k: "Bundle Size", v: "Optimized" },
                  { k: "CSS Engine", v: "Tailwind v4" },
                ].map((m) => (
                  <div key={m.k} className="p-2 rounded-lg bg-white/5 border border-white/10 text-center">
                    <span className="text-primary font-bold text-xs block">{m.v}</span>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 block">{m.k}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Command Output Log */}
        {terminalLog && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2.5 p-2 rounded-lg bg-primary/10 border border-primary/30 text-primary font-mono text-xs"
          >
            {terminalLog}
          </motion.div>
        )}

        {/* Real Interactive Command Prompt Input */}
        <form onSubmit={handleCommandSubmit} className="pt-3 mt-2.5 border-t border-white/10 flex items-center gap-2 text-xs">
          <span className="text-primary font-bold select-none">$</span>
          <input
            type="text"
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            placeholder="Type 'help', 'whoami', 'projects', 'skills', or 'clear'..."
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-zinc-500 font-mono text-xs"
          />
          <button
            type="submit"
            className="px-2.5 py-1 rounded-md bg-primary/20 border border-primary/40 hover:bg-primary hover:text-primary-foreground text-primary font-bold text-[10px] transition active:scale-95 shrink-0"
          >
            RUN
          </button>
        </form>
      </div>
    </div>
  );
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
  const [activeHobbyIndex, setActiveHobbyIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right">("left");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notebookTouchStartX = useRef<number | null>(null);

  const handleNotebookTouchStart = (e: React.TouchEvent) => {
    notebookTouchStartX.current = e.touches[0].clientX;
  };

  const handleNotebookTouchEnd = (e: React.TouchEvent) => {
    if (notebookTouchStartX.current === null) return;
    const diff = notebookTouchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        setMobilePage((p) => Math.min(philosophyNotes.length - 1, p + 1));
      } else {
        setMobilePage((p) => Math.max(0, p - 1));
      }
    }
    notebookTouchStartX.current = null;
  };

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

  const handleHobbyDragEnd = (event: any, info: any) => {
    if (info.offset.x < -60) {
      setSwipeDirection("left");
      setActiveHobbyIndex((prev) => (prev + 1) % hobbies.length);
    } else if (info.offset.x > 60) {
      setSwipeDirection("right");
      setActiveHobbyIndex((prev) => (prev - 1 + hobbies.length) % hobbies.length);
    }
  };

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
  const [projectCategory, setProjectCategory] = useState<string>("all");

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
          className="relative rounded-2xl border border-black/5 dark:border-white/5 p-4 sm:p-8 overflow-hidden cursor-grab active:cursor-grabbing group select-none max-w-full sm:max-w-[340px] mx-auto w-full"
          style={{
            background: `${currentNotebook.lines}, ${currentNotebook.pageBg}`,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 backdrop-blur-sm rotate-1 origin-center shadow-sm pointer-events-none" />
          <div className={`pl-4 sm:pl-6 border-l-2 ${note.borderClass} relative`}>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-primary/80 font-semibold">{note.title}</span>
            <div className="mt-3 sm:mt-4 relative">
              <textarea
                value={customMantra}
                onChange={(e) => setCustomMantra(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                placeholder="Type your own philosophy here..."
                className="w-full bg-transparent border-none outline-none font-mono text-xs sm:text-sm text-foreground resize-none h-[90px] sm:h-[110px] focus:ring-0 placeholder:text-muted-foreground/30 placeholder:italic select-text cursor-text"
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
        className="relative rounded-2xl border border-black/5 dark:border-white/5 p-4 sm:p-8 overflow-hidden cursor-grab active:cursor-grabbing group select-none max-w-full sm:max-w-[340px] mx-auto w-full"
        style={{
          background: `${currentNotebook.lines}, ${currentNotebook.pageBg}`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 backdrop-blur-sm -rotate-1 origin-center shadow-sm pointer-events-none" />
        <div className={`pl-4 sm:pl-6 border-l-2 ${note.borderClass} relative`}>
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-primary/80 font-semibold">{note.title}</span>
          {note.isLatin ? (
            <>
              <blockquote style={{ fontFamily: "'Caveat', cursive" }} className={`mt-2 text-2xl sm:text-3xl text-foreground ${note.hoverColor} transition-colors duration-300`}>
                "{note.quote}"
              </blockquote>
              <p className="mt-3 sm:mt-4 font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">means:</p>
              <p className="mt-1 font-mono text-xs sm:text-sm text-muted-foreground">"{note.translation}"</p>
            </>
          ) : (
            <blockquote className={`mt-3 sm:mt-4 font-mono text-sm sm:text-base font-semibold leading-relaxed text-foreground ${note.hoverColor} transition-colors duration-300`}>
              "{note.quote}"
            </blockquote>
          )}
        </div>
      </motion.div>
    );
  };

  // Generate the top 3 cards in the visible stack starting from activeHobbyIndex
  const visibleHobbyCards = [];
  for (let i = 0; i < 3; i++) {
    const idx = (activeHobbyIndex + i) % hobbies.length;
    visibleHobbyCards.push({ ...hobbies[idx], stackIndex: i, originalIndex: idx });
  }
  const renderedHobbyCards = [...visibleHobbyCards].reverse();

  return (
    <main className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/40"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          <a 
            href="#home" 
            onClick={() => setMobileMenuOpen(false)}
            className="font-display text-lg sm:text-xl font-semibold tracking-tight focus:outline-none"
          >
            nire<span className="text-primary">.</span>
          </a>
          
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#philosophy" className="hover:text-foreground transition">Philosophy</a>
            <a href="#about" className="hover:text-foreground transition">About</a>
            <a href="#experience" className="hover:text-foreground transition">Experience</a>
            <a href="#projects" className="hover:text-foreground transition">Projects</a>
            <a href="#skills" className="hover:text-foreground transition">Skills</a>
            <a href="#hobbies" className="hover:text-foreground transition">Hobbies</a>
            <a href="#goals" className="hover:text-foreground transition">Goals</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeSelector theme={theme} onChange={toggleTheme} />
            <a
              href="#connect"
              className="hidden sm:inline-flex text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition shadow-sm"
            >
              Let's talk
            </a>
            
            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => {
                playClick('medium');
                setMobileMenuOpen((v) => !v);
              }}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-xl border border-border bg-card/60 text-foreground hover:bg-secondary transition active:scale-95 flex items-center justify-center"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-2xl overflow-hidden shadow-2xl"
            >
              <div className="px-5 sm:px-6 py-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                  {[
                    { href: "#philosophy", label: "Philosophy", num: "02" },
                    { href: "#about", label: "About", num: "03" },
                    { href: "#experience", label: "Experience", num: "04" },
                    { href: "#projects", label: "Projects", num: "05" },
                    { href: "#skills", label: "Skills", num: "06" },
                    { href: "#hobbies", label: "Hobbies", num: "07" },
                    { href: "#goals", label: "Goals", num: "08" },
                    { href: "#connect", label: "Connect", num: "08" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl border border-border/50 bg-card/40 hover:bg-primary/10 hover:border-primary/40 text-foreground transition active:scale-[0.98]"
                    >
                      <span className="font-display font-semibold text-sm">{item.label}</span>
                      <span className="text-[10px] font-mono text-primary font-bold">{item.num}</span>
                    </a>
                  ))}
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                  <a
                    href="#connect"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-2xl bg-primary text-primary-foreground font-medium text-sm shadow-md hover:opacity-90 transition"
                  >
                    Let's talk →
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* 1. Landing / Hero */}
      <section id="home" className="min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-20 relative overflow-hidden">
        {/* Animated gradient blob background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full opacity-[0.07] gradient-shift"
            style={{
              background: "radial-gradient(circle, var(--color-primary), transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute -bottom-1/4 -right-1/4 w-[50vw] h-[50vw] rounded-full opacity-[0.05] gradient-shift"
            style={{
              background: "radial-gradient(circle, var(--color-accent), transparent 70%)",
              filter: "blur(100px)",
              animationDelay: "4s",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 sm:gap-16 items-center relative z-10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary mb-4 sm:mb-6 flex items-center gap-2"
            >
              Portfolio — 2026
              <span className="inline-block w-[2px] h-4 bg-primary typewriter-blink" />
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1.08] tracking-tight grid grid-cols-[auto_1fr] gap-x-2 sm:gap-x-4 md:gap-x-6 gap-y-1 sm:gap-y-2"
            >
              {[
                { letter: "E", word: "Evolve", delay: 0.3 },
                { letter: "R", word: "Relentlessly", delay: 0.4 },
                { letter: "I", word: "Innovate", delay: 0.5 },
                { letter: "N", word: "Never Settle", delay: 0.6 },
              ].map((item) => (
                <motion.div key={item.letter} className="contents"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: item.delay }}
                >
                  <div className="text-primary font-black whitespace-nowrap">{item.letter} —</div>
                  <div className="text-foreground">{item.word}</div>
                </motion.div>
              ))}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
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

        {/* Hero Interactive Terminal Console */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 sm:mt-12 pt-6 sm:pt-8 relative z-10 max-w-4xl mx-auto px-4"
        >
          <div className="gradient-divider w-full mb-6 sm:mb-8" />
          <HeroConsole />
        </motion.div>

        {/* Scroll-down indicator */}
        <motion.a
          href="#philosophy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-10 sm:mt-14 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer relative z-10"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 bounce-scroll" />
        </motion.a>
      </section>

      {/* 2. Philosophy */}
      <section id="philosophy" className="py-16 sm:py-24 md:py-32 bg-background relative">
        <div className="gradient-divider w-full absolute top-0 left-0" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader eyebrow="02 — Philosophy" title={<span>Personal <span className="text-primary italic">Philosophy</span></span>} />
          {/* Notebook Container - Desktop (Side-by-Side Pages) */}
          <div className="hidden md:flex justify-center mt-12 select-none relative max-w-4xl mx-auto px-4 lg:px-0">
            {/* Index Tabs sticking out the right side */}
            <div className="absolute right-[-35px] lg:right-[-45px] top-12 flex flex-col gap-2 z-0">
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
            <div className={`w-full aspect-[16/10] rounded-3xl border p-4 sm:p-6 relative z-10 flex gap-6 overflow-hidden transition-all duration-300 ${currentNotebook.cover}`}>
              
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
                  className="w-full h-full grid grid-cols-2 gap-4 sm:gap-8"
                >
                  {/* Left Page */}
                  <div 
                    className="relative w-full h-full rounded-2xl border border-black/5 dark:border-white/5 p-4 sm:p-8 flex flex-col justify-center overflow-hidden transition-colors duration-300"
                    style={{
                      background: `${currentNotebook.lines}, ${currentNotebook.pageBg}`,
                    }}
                  >
                    {/* Left Margin Line */}
                    <div className={`absolute left-6 sm:left-8 top-0 bottom-0 w-[1px] ${currentNotebook.margin}`} />
                    
                    {/* Render Note A of Spread */}
                    {renderNoteCard(philosophyNotes[currentSpread * 2])}
                  </div>

                  {/* Right Page */}
                  <div 
                    className="relative w-full h-full rounded-2xl border border-black/5 dark:border-white/5 p-4 sm:p-8 flex flex-col justify-center overflow-hidden transition-colors duration-300"
                    style={{
                      background: `${currentNotebook.lines}, ${currentNotebook.pageBg}`,
                    }}
                  >
                    {/* Right Margin Line */}
                    <div className={`absolute right-6 sm:right-8 top-0 bottom-0 w-[1px] ${currentNotebook.margin}`} />
                    
                    {/* Render Note B of Spread */}
                    {renderNoteCard(philosophyNotes[currentSpread * 2 + 1])}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Notebook Container - Mobile (Single Page View) */}
          <div className="block md:hidden mt-6 sm:mt-8 select-none relative max-w-[345px] mx-auto px-1">
            {/* Single Notebook Page */}
            <div 
              onTouchStart={handleNotebookTouchStart}
              onTouchEnd={handleNotebookTouchEnd}
              className={`w-full aspect-[4/5] min-h-[350px] rounded-2xl border p-4 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-center pl-6 sm:pl-8 transition-all duration-300 touch-pan-y ${currentNotebook.cover}`}
            >
              
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
              <div className={`absolute left-7 sm:left-10 top-0 bottom-0 w-[1px] ${currentNotebook.margin}`} />

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
            <div className="flex items-center justify-between mt-5 px-2">
              <button
                onClick={() => setMobilePage((p) => Math.max(0, p - 1))}
                disabled={mobilePage === 0}
                className="px-4 py-2 rounded-full border border-border text-xs font-medium bg-secondary/40 hover:bg-secondary transition disabled:opacity-30 disabled:pointer-events-none min-h-[40px] flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <span className="font-mono text-xs text-muted-foreground">
                Note {mobilePage + 1} of {philosophyNotes.length}
              </span>
              <button
                onClick={() => setMobilePage((p) => Math.min(philosophyNotes.length - 1, p + 1))}
                disabled={mobilePage === philosophyNotes.length - 1}
                className="px-4 py-2 rounded-full border border-border text-xs font-medium bg-secondary/40 hover:bg-secondary transition disabled:opacity-30 disabled:pointer-events-none min-h-[40px] flex items-center gap-1"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About */}
      <section id="about" className="py-16 sm:py-24 md:py-32 relative">
        <div className="gradient-divider w-full absolute top-0 left-0" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader eyebrow="03 — About me" title="Frontend & Backend Engineer driven by execution." />
          <div className="grid md:grid-cols-5 gap-8 sm:gap-10">
            <div className="md:col-span-3 space-y-4 sm:space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-lg sm:text-xl font-medium text-foreground italic border-l-4 border-primary pl-4 py-1.5 bg-primary/5 rounded-r-xl"
              >
                "I live by goals, not dreams. Anyone can do the job, but not anyone can be me."
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                I am a Frontend & Backend Engineer who believes that great systems are built on systematic progress, not wishful thinking. With this mentality, I ensure all tasks I tackle are driven by absolute focus and strict execution.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                By channeling consistency, discipline, and clear goal alignment, I can achieve any target or milestone I set my mind to plan.
              </motion.p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { k: "Philippines", v: "Based in" },
                { k: "1 yr", v: "Experience" },
                { k: "11", v: "Projects & Systems" },
                { k: "EN · FIL", v: "Languages" },
              ].map((s, i) => (
                <motion.div
                  key={s.v}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, damping: 18, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="rounded-2xl glass-strong p-3.5 sm:p-5 group cursor-default hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-300"
                >
                  <div className="font-display text-xl sm:text-2xl text-foreground font-semibold group-hover:text-primary transition-colors duration-300">{s.k}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest mt-1.5 text-muted-foreground">{s.v}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Three Pillars Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 pt-12 sm:pt-16 relative">
            <div className="gradient-divider w-full absolute top-0 left-0" />
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 80, damping: 18, delay: i * 0.12 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-3xl glass-strong p-5 sm:p-6 relative overflow-hidden group cursor-default hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
              >
                {/* Gradient accent stripe */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/40 to-transparent rounded-l-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 w-fit">{p.icon}</div>
                <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Experience */}
      <section id="experience" className="py-16 sm:py-24 md:py-32 relative">
        <div className="gradient-divider w-full absolute top-0 left-0" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader eyebrow="04 — Experience" title="Where I've spent my hours." />
          <ol className="relative ml-2 sm:ml-4" style={{ borderLeft: '2px solid transparent', borderImage: 'linear-gradient(to bottom, var(--color-primary), var(--color-border), transparent) 1' }}>
            {experience.map((e, i) => (
              <motion.li
                key={e.role}
                initial={{ opacity: 0, x: 100, scale: 0.98 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ type: "spring", stiffness: 70, damping: 18, mass: 1.1, delay: i * 0.08 }}
                className="pl-5 sm:pl-8 pb-8 sm:pb-10 relative group"
              >
                {/* Pulsing timeline dot */}
                <span className="absolute -left-[8px] top-2 h-3.5 w-3.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)] group-hover:shadow-[0_0_16px_var(--color-primary)] transition-shadow duration-300" />
                <span className="absolute -left-[8px] top-2 h-3.5 w-3.5 rounded-full bg-primary/40 pulse-ring" />
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-3">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <h3 className="font-display text-lg sm:text-xl font-semibold">{e.role}</h3>
                    <span className="text-primary font-medium text-sm sm:text-base">· {e.company}</span>
                  </div>
                  <span className="text-[11px] sm:text-xs uppercase tracking-widest text-muted-foreground shrink-0 font-mono">{e.years}</span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{e.impact}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Projects */}
      <section id="projects" className="py-16 sm:py-24 md:py-32 relative">
        <div className="gradient-divider w-full absolute top-0 left-0" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader 
            eyebrow="05 — Projects" 
            title={<span>Featured Systems & <span className="text-primary italic">Software Works</span></span>} 
          />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-3 sm:mt-4 mb-8 sm:mb-12">
            <p className="text-muted-foreground text-xs sm:text-sm max-w-xl leading-relaxed">
              A showcase of web applications, digital platforms, and software solutions built with clear purpose, scalable architecture, and meticulous detail.
            </p>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-secondary/15 border border-border/80 p-1.5 rounded-2xl shrink-0 self-start md:self-auto flex-wrap sm:flex-nowrap">
              {[
                { id: "all", label: "All Works", count: projects.length },
                { id: "fullstack", label: "Full-Stack & Web Apps", count: projects.filter(p => p.category === "fullstack").length },
                { id: "ai-os", label: "AI & Systems", count: projects.filter(p => p.category === "ai-os").length },
                { id: "creative", label: "Creative & WebGL", count: projects.filter(p => p.category === "creative").length },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    playClick('medium');
                    setProjectCategory(cat.id);
                  }}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors select-none flex items-center gap-1.5 ${
                    projectCategory === cat.id
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {projectCategory === cat.id && (
                    <motion.div
                      layoutId="projectTabPill"
                      className="absolute inset-0 bg-primary rounded-xl shadow-md"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                  <span className={`relative z-10 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    projectCategory === cat.id ? "bg-white/20 text-white" : "bg-secondary/40 text-muted-foreground"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Animated Projects Grid */}
          <AnimatePresence mode="popLayout">
            <motion.div 
              key={projectCategory}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {projects
                .filter((p) => projectCategory === "all" || p.category === projectCategory)
                .map((p, i) => (
                  <ProjectSpotlightCard
                    key={p.title}
                    p={p}
                    index={i}
                    onSelect={(proj) => setModal(proj)}
                  />
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 6. Skills */}
      <section id="skills" className="py-16 sm:py-24 md:py-32 relative">
        <div className="gradient-divider w-full absolute top-0 left-0" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader eyebrow="06 — Skills" title="Knowledgeable in these tech stack | or tools" />
          <div className="mt-8 sm:mt-12">
            <SkillsWheel />
          </div>
        </div>
      </section>

      {/* 7. Hobbies */}
      <section id="hobbies" className="py-16 sm:py-24 md:py-32 relative">
        <div className="gradient-divider w-full absolute top-0 left-0" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader eyebrow="07 — Hobbies" title={<span>Hobbies & <span className="text-primary italic">Life Telemetry Dashboard.</span></span>} />
          
          <p className="mt-3 sm:mt-4 text-muted-foreground text-xs sm:text-sm max-w-xl">
            I believe that peak productivity starts with operational balance. Monitoring my physical and mental loops keeps my creative threads running smoothly.
          </p>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 mt-8 sm:mt-12 max-w-4xl mx-auto">
            {/* Left Column: Description & Indicators */}
            <div className="flex-1 text-left w-full">
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">SYSTEM TELEMETRY</span>
              <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mt-2">
                Life & Activities
              </h3>
              <p className="mt-3 sm:mt-4 text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-md">
                Cycle through active pursuits to inspect live capacity logs. Drag left or right on the card stack to navigate activities, or click the indicators below.
              </p>
              
              {/* Pagination indicators */}
              <div className="flex flex-wrap items-center gap-2 mt-5 sm:mt-6">
                {hobbies.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playClick('medium');
                      setActiveHobbyIndex(idx);
                    }}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === activeHobbyIndex ? "w-6 bg-primary" : "w-2.5 bg-secondary/40"
                    }`}
                    aria-label={`Go to node ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Stacked Cards Deck */}
            <div className="flex flex-col items-center shrink-0 mt-4 lg:mt-0 w-full lg:w-auto">
              <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[440px] h-[330px] sm:h-[360px] mx-auto">
                <AnimatePresence initial={false}>
                  {renderedHobbyCards.map((h) => {
                    const isTop = h.stackIndex === 0;
                    
                    const progressMap: Record<string, number> = {
                      "movies-series": 85,
                      "running": 92,
                      "cycling": 78,
                      "taekwondo": 95,
                      "working-out": 88,
                      "lifting-weights": 90,
                      "chess": 82,
                      "cooking": 100,
                      "music": 96,
                    };
                    const progress = progressMap[h.id] || 85;

                    const offsetStyles = [
                      { x: 0, y: 0, scale: 1, zIndex: 3, opacity: 1, rotate: 0 },
                      { x: 16, y: 16, scale: 0.95, zIndex: 2, opacity: 0.85, rotate: 4 },
                      { x: 32, y: 32, scale: 0.90, zIndex: 1, opacity: 0.6, rotate: -4 },
                    ][h.stackIndex] || { x: 0, y: 0, scale: 1, zIndex: 0, opacity: 0, rotate: 0 };

                    return (
                      <motion.div
                        key={h.id}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          zIndex: isTop ? 10 : (3 - h.stackIndex),
                          backgroundColor: "var(--card)",
                        }}
                        initial={{ 
                          opacity: 0, 
                          scale: isTop ? 0.95 : 0.9, 
                          x: isTop ? (swipeDirection === "left" ? 180 : -350) : 24, 
                          y: isTop ? 0 : 24,
                          rotate: offsetStyles.rotate
                        }}
                        animate={{
                          x: isTop ? 0 : offsetStyles.x,
                          y: isTop ? 0 : offsetStyles.y,
                          scale: offsetStyles.scale,
                          opacity: offsetStyles.opacity,
                          rotate: offsetStyles.rotate
                        }}
                        exit={{ 
                          x: swipeDirection === "left" ? -350 : 350, 
                          opacity: 0, 
                          scale: 0.88, 
                          rotate: swipeDirection === "left" ? -18 : 18,
                          zIndex: 20 
                        }}
                        drag={isTop ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={isTop ? handleHobbyDragEnd : undefined}
                        whileDrag={isTop ? { scale: 1.03, rotate: 2 } : undefined}
                        transition={{ type: "spring", stiffness: 280, damping: 24 }}
                        className={`w-full h-full rounded-3xl border bg-card/95 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-colors duration-300 ${
                          isTop ? `${h.borderClass} cursor-grab active:cursor-grabbing border-primary/40 shadow-[0_20px_50px_rgba(0,0,0,0.35)]` : "border-border/70 shadow-md pointer-events-none"
                        }`}
                      >
                        {/* Decorative Radial Grid Glow Header */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none opacity-60" />
                        
                        <div className="relative z-10 flex flex-col justify-between h-full w-full">
                          {/* Top Header: Node Category Label & Icon */}
                          <div>
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <span className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold text-primary font-mono flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                {h.label}
                              </span>
                              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${h.iconClass}`}>
                                <HobbyIcon name={h.icon} />
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                              {h.desc}
                            </p>
                          </div>

                          {/* Telemetry Capacity Progress Bar */}
                          <div className="my-2.5 p-3 rounded-2xl bg-secondary/15 border border-border/40">
                            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                              <span className="text-muted-foreground uppercase tracking-widest font-semibold text-[10px] sm:text-xs">Active Output</span>
                              <span className="font-bold text-primary">{progress}% Logged</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-secondary/50 overflow-hidden border border-border/30">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full rounded-full bg-gradient-to-r from-primary/70 via-primary to-primary"
                              />
                            </div>
                          </div>

                          {/* Bottom Badges */}
                          <div className="border-t border-border/30 pt-3.5 mt-auto">
                            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold font-mono text-muted-foreground block mb-2">
                              {h.sub}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {h.val.split(', ').map((valItem) => (
                                <span 
                                  key={valItem} 
                                  className="px-3 py-1 sm:py-1.5 rounded-full border border-border/80 text-[10px] sm:text-[11px] bg-secondary/25 text-foreground font-semibold select-none shadow-2xs"
                                >
                                  {valItem}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Navigation Indicator & Click Controls */}
              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={() => {
                    playClick('medium');
                    setSwipeDirection("right");
                    setActiveHobbyIndex((prev) => (prev === 0 ? hobbies.length - 1 : prev - 1));
                  }}
                  className="p-2 rounded-full border border-border bg-card/60 hover:bg-secondary hover:border-primary/50 text-muted-foreground hover:text-foreground active:scale-95 transition shadow-sm"
                  title="Previous Activity"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono font-semibold select-none">
                  ← Swipe or Click →
                </span>

                <button
                  onClick={() => {
                    playClick('medium');
                    setSwipeDirection("left");
                    setActiveHobbyIndex((prev) => (prev + 1) % hobbies.length);
                  }}
                  className="p-2 rounded-full border border-border bg-card/60 hover:bg-secondary hover:border-primary/50 text-muted-foreground hover:text-foreground active:scale-95 transition shadow-sm"
                  title="Next Activity"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Music Profile Dashboard Widget */}
          <div className="mt-16 sm:mt-24 border-t border-border/40 pt-14 sm:pt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">🎵 Profile Dashboard</span>
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                  {activeDashboardTab === "music" ? "My Read on Your Music Taste" : "Personality & Inner Growth"}
                </h3>
              </div>
              
              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-secondary/10 border border-border/85 p-1 rounded-xl shrink-0 self-start md:self-auto flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => {
                    playClick('medium');
                    setActiveDashboardTab("music");
                  }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold tracking-wide transition ${
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
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold tracking-wide transition ${
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
                  className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start"
                >
                  {/* Record Player Body (Deezer Widget Card) */}
                  <div className="lg:col-span-5 bg-card/45 border border-border rounded-3xl p-4 sm:p-6 flex flex-col items-center shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary mb-3 sm:mb-4 select-none uppercase tracking-wider">
                      Interactive Deezer Player
                    </span>
                    
                    {/* Deezer Widget Iframe */}
                    <div className="w-full h-[200px] sm:h-[220px] rounded-2xl overflow-hidden border border-border/80 bg-zinc-950/80 shadow-inner">
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
                    <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6 w-full pt-3 sm:pt-4 border-t border-border/20">
                      <button 
                        onClick={() => {
                          playClick('medium');
                          setActiveTrackIndex((prev) => (prev === 0 ? musicProfile.length - 1 : prev - 1));
                        }}
                        className="p-2 sm:p-2.5 rounded-full border border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground active:scale-95 transition"
                        title="Previous Mixtape"
                      >
                        <SkipBack size={16} />
                      </button>
                      <span className="text-xs font-semibold text-muted-foreground select-none font-mono">
                        Mixtape {activeTrackIndex + 1} of {musicProfile.length}
                      </span>
                      <button 
                        onClick={() => {
                          playClick('medium');
                          setActiveTrackIndex((prev) => (prev === musicProfile.length - 1 ? 0 : prev + 1));
                        }}
                        className="p-2 sm:p-2.5 rounded-full border border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground active:scale-95 transition"
                        title="Next Mixtape"
                      >
                        <SkipForward size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Mixtapes and Details panel */}
                  <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {musicProfile.map((item, idx) => (
                        <button
                          key={item.category}
                          onClick={() => {
                            playClick('medium');
                            setActiveTrackIndex(idx);
                          }}
                          className={`p-3 sm:p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-300 ${
                            activeTrackIndex === idx 
                              ? `bg-gradient-to-br ${item.color.split(' ')[0]} ${item.color.split(' ')[1]} border-primary shadow-[0_0_15px_rgba(var(--color-primary),0.05)]` 
                              : "border-border bg-card/25 hover:border-foreground/30 hover:bg-card/45"
                          }`}
                        >
                          <span className="text-lg sm:text-xl shrink-0 mt-0.5">{item.icon}</span>
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
                    <div className="rounded-3xl border border-border bg-card/25 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                      <div>
                        <h5 className="text-xs uppercase tracking-wider text-primary font-semibold">Featured Playlist Artists</h5>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{musicProfile[activeTrackIndex].desc}</p>
                      </div>

                      {musicProfile[activeTrackIndex].category === "Hard Rock & Metal" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left border-t border-border/20 pt-3 sm:pt-4 mt-1">
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
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                          {musicProfile[activeTrackIndex].artists.map((artist) => (
                            <span
                              key={artist}
                              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-border/60 bg-secondary/15 text-[11px] sm:text-xs text-foreground/90 font-medium select-none hover:border-primary/50 transition duration-200"
                            >
                              {artist}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Personality Quote */}
                    <div className="rounded-3xl border border-border bg-gradient-to-r from-primary/5 to-transparent p-4 sm:p-6 relative overflow-hidden">
                      <div className="absolute right-4 bottom-2 text-5xl sm:text-6xl font-serif text-primary/10 select-none">“</div>
                      <p className="text-xs sm:text-sm font-semibold italic text-foreground leading-relaxed relative z-10">
                        "A rich, curated soundscape spanning 60s to 90s classics—from vintage pop and timeless crooners of the Elvis Presley and Tom Jones eras, to energetic rock anthems, OPM legends, and modern chill vibes—with the occasional movie soundtrack."
                      </p>
                      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3 border-t border-border/40 pt-3 sm:pt-4">
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
                  className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start"
                >
                  {/* Personality Traits Grid */}
                  <div className="lg:col-span-5 flex flex-col gap-4">
                    <h4 className="text-xs uppercase tracking-widest text-primary font-semibold font-mono">Core Traits</h4>
                    <div className="flex flex-col gap-3">
                      {[
                        { trait: "Disciplined", icon: "💪", desc: "I value structure, intense training, and constant self-improvement." },
                        { trait: "Nostalgic", icon: "🎸", desc: "I gravitate toward 90s/2000s rock, classic hits, and OPM legends." },
                        { trait: "Creative", icon: "💻", desc: "I care deeply about design details, clean code, and user experience." },
                        { trait: "Curious", icon: "🧠", desc: "I am always exploring new frameworks and refining my engineering skills." },
                        { trait: "Grounded", icon: "🤝", desc: "I value authenticity over fleeting trends, looking for things that endure." }
                      ].map((t) => (
                        <div key={t.trait} className="rounded-2xl border border-border bg-card/45 p-3.5 sm:p-4 flex gap-3.5 sm:gap-4 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--color-primary),0.03)] transition duration-300">
                          <span className="text-xl sm:text-2xl mt-0.5">{t.icon}</span>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-foreground">{t.trait}</p>
                            <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed mt-1">{t.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sayings and Personality Profiles */}
                  <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
                    {/* Philosophy Block */}
                    <div className="rounded-3xl border border-border bg-card/25 p-4 sm:p-6 flex flex-col gap-3">
                      <h4 className="text-xs uppercase tracking-widest text-primary font-semibold font-mono">My Philosophy</h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-foreground">
                        "I'm someone who values balance. I enjoy pushing myself through running, cycling, weightlifting, and martial arts, but I also appreciate slowing down with timeless music and meaningful stories. My taste in music ranges from 90s and 2000s rock to classic artists in the time of Elvis Presley to Tom Jones, and OPM legends—reflecting both my energetic side and my appreciation for authenticity. Whether I'm building software, training, or listening to my favorite playlists, I believe consistency, discipline, and curiosity are what drive personal growth."
                      </p>
                    </div>

                    {/* Personality Quote Banner */}
                    <div className="rounded-3xl border border-border bg-gradient-to-r from-primary/10 to-transparent p-4 sm:p-6 relative overflow-hidden">
                      <div className="absolute right-4 bottom-2 text-6xl sm:text-7xl font-serif text-primary/10 select-none">“</div>
                      <p className="text-xs sm:text-sm font-bold italic text-foreground leading-relaxed relative z-10">
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
      <section id="goals" className="py-16 sm:py-24 md:py-32 relative">
        <div className="gradient-divider w-full absolute top-0 left-0" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader eyebrow="08 — Goals" title="What I'm building toward." />
          <ul className="space-y-4 sm:space-y-6">
            {goals.map((g, i) => (
              <motion.li
                key={g}
                initial={{ opacity: 0, x: 50, scale: 0.98 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ type: "spring", stiffness: 70, damping: 18, mass: 1.1, delay: i * 0.08 }}
                whileHover={{ x: 8 }}
                className="group flex gap-4 sm:gap-6 items-baseline border-b border-border/60 pb-4 sm:pb-6 transition-colors duration-300 hover:border-primary/50"
              >
                <span className="font-display text-lg sm:text-2xl text-primary shrink-0 w-8 sm:w-12 font-bold group-hover:scale-110 transition-transform duration-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg sm:text-2xl md:text-3xl leading-snug font-medium group-hover:text-primary transition-colors duration-300">{g}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 9. Connect */}
      <section id="connect" className="py-16 sm:py-24 md:py-32 relative">
        <div className="gradient-divider w-full absolute top-0 left-0" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary mb-2 sm:mb-3"
            >
              09 — Connect
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight"
            >
              Have an idea?<br />
              <span className="italic text-primary">Let's build it.</span>
            </motion.h2>
            <p className="mt-4 sm:mt-6 text-xs sm:text-base text-muted-foreground max-w-lg mx-auto">
              Drop a message below or reach me directly. I read every note.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 sm:mt-12 rounded-3xl glass-strong p-5 sm:p-8 md:p-10 shadow-2xl hover:shadow-primary/5 transition-shadow duration-500"
          >
            <ContactForm />
          </motion.div>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <a href="mailto:hi@nire.dev" className="hover:text-primary transition font-mono hover:scale-105 active:scale-95 inline-block">hi@nire.dev</a>
            <span className="text-muted-foreground">·</span>
            <a href="https://github.com/Nire1317" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition font-mono hover:scale-105 active:scale-95 inline-block">GitHub</a>
            <span className="text-muted-foreground">·</span>
            <a href="/cv" className="hover:text-primary transition font-mono hover:scale-105 active:scale-95 inline-block">Read.cv</a>
            <span className="text-muted-foreground">·</span>
            <a href="https://www.linkedin.com/in/erin-tuzon-541038343" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition font-mono hover:scale-105 active:scale-95 inline-block">LinkedIn</a>
          </div>
        </div>

        <footer className="mt-16 sm:mt-24 border-t border-border/40 pt-6 sm:pt-8 pb-6 mx-auto max-w-6xl px-4 sm:px-6 flex flex-wrap justify-between items-center gap-4 text-xs text-muted-foreground font-mono">
          <span>© 2026 Erin</span>
          <span className="inline-flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-primary heartbeat fill-primary/30" /> in the Philippines
          </span>
          <a
            href="#home"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-card/40 hover:border-primary hover:text-primary transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </a>
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
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 md:p-8"
            onClick={() => setModal(null)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-card shadow-2xl"
              style={{ 
                border: `1px solid ${modal.themeColor}33`, 
                boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${modal.themeColor}15` 
              }}
            >
              <div className={`relative h-40 sm:h-56 md:h-64 overflow-hidden rounded-t-3xl bg-gradient-to-br ${modal.color}`}>
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
                  className="absolute top-3 sm:top-5 left-3 sm:left-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 backdrop-blur px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest hover:bg-background transition"
                >
                  <span aria-hidden>←</span> Back
                </button>
                <button
                  onClick={() => setModal(null)}
                  aria-label="Close"
                  className="absolute top-3 sm:top-5 right-3 sm:right-5 h-8 w-8 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-full border border-border bg-background/70 backdrop-blur hover:bg-background transition text-xs sm:text-sm"
                >
                  ✕
                </button>
                <div className="absolute bottom-3 sm:bottom-5 left-4 sm:left-6 right-4 sm:right-6">
                  <p 
                    className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em]"
                    style={{ color: modal.themeColor }}
                  >
                    {modal.tag}
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold mt-1 sm:mt-2">{modal.title}</h3>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
                  {modal.metrics.map((m) => (
                    <div 
                      key={m.v} 
                      className="rounded-2xl bg-background/40 p-3 sm:p-4 text-center"
                      style={{ border: `1px solid ${modal.themeColor}22` }}
                    >
                      <div 
                        className="font-display text-lg sm:text-xl md:text-2xl font-bold"
                        style={{ color: modal.themeColor, textShadow: `0 0 8px ${modal.themeColor}60` }}
                      >
                        {m.k}
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest mt-1 text-muted-foreground">{m.v}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 sm:mb-2">Role</p>
                    <p className="font-display text-sm sm:text-base font-semibold">{modal.role}</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 sm:mb-2">Year</p>
                    <p className="font-display text-sm sm:text-base font-semibold">{modal.year}</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 sm:mb-2">Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {modal.stack.map((s) => (
                        <span key={s} className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-border text-[10px] sm:text-xs font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3">Overview</p>
                  <p className="text-sm sm:text-base md:text-lg text-foreground/90 leading-relaxed">{modal.details}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => setModal(null)}
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full border border-border hover:bg-secondary font-mono text-xs sm:text-sm uppercase tracking-widest"
                  >
                    <span aria-hidden>←</span> Back to work
                  </button>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {modal.liveUrl && (
                      <a
                        href={modal.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-white font-mono text-xs sm:text-sm uppercase tracking-widest hover:opacity-90 transition-all"
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
                      className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-full border border-border text-muted-foreground font-mono text-xs sm:text-sm uppercase tracking-widest hover:bg-secondary"
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
