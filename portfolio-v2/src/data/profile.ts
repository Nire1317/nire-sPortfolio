// All content here comes from Erin's existing portfolio (Nire1317/nire-sPortfolio):
// src/data/*.ts, src/routes/index.tsx and public/resume.pdf.
// Anything not found there is left as a TODO instead of being made up.

import leavelyImg from "../assets/project-leavely.webp";
import barangayImg from "../assets/project-barangay.webp";

export const profile = {
  name: "Christian Erin J. Tuzon",
  shortName: "Erin",
  role: "Full-Stack Software Developer",
  location: "Philippines",
  email: "hi@nire.dev",
  resumeUrl: "/resume.pdf",
  github: "https://github.com/Nire1317",
  linkedin: "https://www.linkedin.com/in/erin-tuzon-541038343",
  languages: "English · Filipino",
};

export const about = {
  // Written in Erin's voice from facts in the old site; edit freely.
  paragraphs: [
    "I'm Erin, a full-stack developer from Isabela, Philippines. I build web and mobile apps end to end, from the database schema and API to the screen people tap on, and I care about how they hold up once real users depend on them.",
    "By day I'm an Associate Software Engineer at Inovers, working on the DORX logistics platform. On my own I built and shipped Leavely and an E-Barangay system, and during my internship at Dory Delivery I wrote React Native features for the customer and rider apps.",
    "What I enjoy most is the part between the idea and the release: reading code I didn't write, tracing a bug to its cause, and making something work properly. AI helps me move faster. Understanding the code is still my job.",
  ],
  enjoys: [
    { title: "Building real applications", note: "Leavely and E-Barangay are both live." },
    { title: "Solving difficult problems", note: "Keeping 11 logistics systems in sync." },
    { title: "Debugging existing systems", note: "Reading code I didn't write until it makes sense." },
    { title: "Learning new technologies", note: "Currently pushing into DevOps and cloud." },
    { title: "Using AI to move faster", note: "Claude Code, ChatGPT and the Gemini API." },
    { title: "Knowing how things work", note: "Not just that it runs, but why." },
  ],
  learning:
    "Growing into DevOps and cloud over the next two years, on the way to becoming a senior full-stack engineer who can design and scale systems end to end.",
  // Quick facts shown under the portrait
  facts: [
    { label: "Now", value: "Associate Software Engineer at Inovers" },
    { label: "Stack", value: "React · TypeScript · Node.js · MySQL" },
    { label: "Studied", value: "BS Information Technology, Saint Ferdinand College" },
    { label: "Based in", value: "Isabela, Philippines" },
  ],
};

export type SkillGroup = { id: string; title: string; blurb: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    blurb: "Interfaces people actually use, on web and mobile.",
    items: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Redux", "TanStack Query", "React Native", "Expo"],
  },
  {
    id: "backend",
    title: "Backend",
    blurb: "APIs and services that hold real workflows together.",
    items: ["Node.js", "Express.js", "RESTful APIs", "Socket.IO", "JWT Auth", "PHP", "Resend API"],
  },
  {
    id: "database",
    title: "Database",
    blurb: "Schemas, queries and the performance work in between.",
    items: ["SQL", "MySQL", "Sequelize", "Supabase", "Firebase", "Redis", "SQL optimization"],
  },
  {
    id: "tools",
    title: "Tools & Deployment",
    blurb: "The everyday kit for building, testing and shipping.",
    items: ["Git", "GitHub", "VS Code", "Postman", "Docker", "Vite", "Jira", "Android Studio", "Vercel", "Railway", "Netlify", "Nginx"],
  },
];

export const aiSkills = {
  title: "AI-Assisted Development",
  blurb: "AI amplifies my workflow. It doesn't replace the engineering.",
  tools: ["Claude Code", "ChatGPT", "Gemini API"],
  uses: [
    "Debugging with AI as a second pair of eyes",
    "Code generation for repetitive work, reviewed line by line",
    "Researching unfamiliar libraries and APIs",
    "Drafting documentation",
    "Rapid prototyping of ideas before committing to one",
  ],
};

export type Project = {
  id: string;
  title: string;
  kind: string;
  year: string;
  summary: string;
  image?: string;
  // Shown instead of a screenshot when there isn't one (e.g. private client work)
  diagram?: { nodes: string[]; caption: string };
  liveUrl?: string;
  repoUrl?: string;
  stack: string[];
  problem: string;
  built: string;
  features: string[];
  contribution: string;
  challenge?: string;
  learned?: string;
};

export const projects: Project[] = [
  {
    id: "dorx",
    title: "DORX Logistics Platform",
    kind: "Professional work · Inovers",
    year: "2025 – now",
    summary: "Eleven interconnected systems running end-to-end parcel operations.",
    diagram: { nodes: ["Booking", "Dispatch", "Hub", "Satellite", "Delivery"], caption: "11 interconnected systems · one parcel status" },
    stack: ["Node.js", "Express.js", "MySQL", "RESTful APIs", "Socket.IO", "OSRM"],
    problem:
      "Parcels move through booking, dispatch, hubs, satellites and delivery, and every one of those steps lives in a different system that has to agree on where a parcel is.",
    built:
      "Backend modules and REST APIs for parcel management, booking, dispatching, hub and satellite operations and delivery workflows, plus real-time parcel tracking and status sync across platforms.",
    features: [
      "Real-time parcel tracking and status synchronization",
      "Parcel, booking, dispatch, hub and delivery modules",
      "Optimized SQL queries and backend processes",
    ],
    contribution:
      "Associate Software Engineer on a cross-functional team: designing and maintaining APIs, optimizing queries, debugging and extending existing modules across frontend, backend and database.",
    challenge:
      "Keeping tracking accurate when the same parcel's status is read and written by many systems at once.",
    // TODO(Erin): what did this role teach you? One or two sentences.
  },
  {
    id: "leavely",
    title: "Leavely",
    kind: "Product · Live",
    year: "2025",
    summary: "Automated leave and absence tracking for teams.",
    image: leavelyImg,
    liveUrl: "https://leavely-frontend.vercel.app/",
    // TODO(Erin): add repoUrl if the repository is public.
    stack: ["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js"],
    problem: "Teams were tracking leave in spreadsheets: manual, error-prone and hard to see at a glance.",
    built:
      "A leave management system with automated request flows, real-time allowance calculations, team calendars and coverage checks.",
    features: ["Automated request and approval flows", "Real-time allowance calculations", "Team calendars", "Coverage checks"],
    contribution: "Full-stack developer: frontend and backend.",
    // TODO(Erin): the hardest part, and what you learned.
  },
  {
    id: "e-barangay",
    title: "E-Barangay System",
    kind: "Web app · Live",
    year: "2025",
    summary: "Digital services and records for a local barangay.",
    image: barangayImg,
    liveUrl: "https://e-barangay-system.vercel.app/",
    // TODO(Erin): add repoUrl if the repository is public.
    stack: ["React", "TypeScript", "Supabase", "Tailwind CSS", "Vite"],
    problem: "Barangay services like document requests and complaints ran on paper and manual processing.",
    built:
      "A platform where residents request documents, file complaints and read announcements online, while admins get resident profiling, digital request processing and SMS notifications.",
    features: ["Online document requests", "Complaint submission", "Community announcements", "Resident profiling", "SMS notifications"],
    contribution: "Lead full-stack developer.",
    // TODO(Erin): the hardest part, and what you learned.
  },
];

export const workflow = [
  { step: "Idea", note: "Start from the problem, not the stack." },
  { step: "Research", note: "Read docs, existing code and prior art." },
  { step: "AI-Assisted Dev", note: "Draft, explore and prototype quickly." },
  { step: "Engineering", note: "Shape the architecture and data model." },
  { step: "Debugging", note: "Trace it until I know why it broke." },
  { step: "Testing", note: "Postman, manual QA and real flows." },
  { step: "Ship", note: "Deploy, watch it, improve it." },
];

export const aiUses = [
  "Accelerate repetitive work",
  "Explore different solutions",
  "Understand unfamiliar code",
  "Prototype ideas quickly",
];

export const responsibilities = [
  { title: "Architecture", note: "How the pieces fit and where data lives." },
  { title: "Code quality", note: "Every generated line gets read and owned." },
  { title: "Debugging", note: "Finding the cause, not just silencing the error." },
  { title: "Security", note: "Auth, validation and secrets handled on purpose." },
  { title: "Testing", note: "Verified against real flows before it ships." },
  { title: "Understanding", note: "I can explain the final implementation." },
];

export type JourneyItem = {
  stage: "Learning" | "Building" | "Working" | "Shipping" | "Improving";
  period: string;
  title: string;
  place: string;
  detail: string;
};

export const journey: JourneyItem[] = [
  {
    stage: "Learning",
    period: "2021 – 2025",
    title: "BS Information Technology",
    place: "Saint Ferdinand College · City of Ilagan, Isabela",
    detail: "Software engineering, database systems and web programming. Also earned a Diploma in ICT (2021 – 2024).",
  },
  {
    stage: "Building",
    period: "2025",
    title: "Leavely and E-Barangay System",
    place: "Independent projects",
    detail: "Built and deployed two full-stack apps with React, TypeScript, Node.js and Supabase.",
  },
  {
    stage: "Working",
    period: "Feb – May 2025",
    title: "Software Developer Intern",
    place: "Dory Delivery",
    detail: "React Native features for the customer and rider apps, React.js fixes on the website, API integration and manual QA.",
  },
  {
    stage: "Working",
    period: "Jul – Nov 2025",
    title: "Technical Staff",
    place: "Universal Leaf Philippines, Inc.",
    detail: "Technical documentation, reports, billing records and inventory tracking with cross-functional teams.",
  },
  {
    stage: "Shipping",
    period: "Nov 2025 – now",
    title: "Associate Software Engineer",
    place: "Inovers",
    detail: "Shipping APIs, modules and real-time tracking on the DORX logistics platform.",
  },
  {
    stage: "Improving",
    period: "Next",
    title: "DevOps, cloud and senior engineering",
    place: "Ongoing",
    detail: "Expanding into DevOps and growing toward designing and scaling systems end to end.",
  },
];
