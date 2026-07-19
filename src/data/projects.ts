export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured: boolean;
  category: 'web' | 'mobile' | 'ai' | 'game' | 'tool';
  themeColor?: string;
}

export const projects: Project[] = [
  {
    id: 'leavely',
    title: 'Leavely',
    description: 'An automated leave and absence tracking software for modern teams.',
    longDescription: 'Leavely is a streamlined, user-friendly leave management system designed to eliminate manual spreadsheet tracking. It features automated request flows, real-time allowance calculations, team calendars, and comprehensive coverage checks to ensure smooth operations.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js'],
    liveUrl: 'https://leavely-frontend.vercel.app/',
    githubUrl: '#',
    featured: true,
    category: 'web',
    themeColor: '#4f46e5',
  },
  {
    id: 'e-barangay',
    title: 'E-Barangay System',
    description: 'A digital governance platform for local community management.',
    longDescription: 'A complete digital management platform for local barangays. Residents can request documents, submit complaints, and view community announcements online. Administrators benefit from automated resident profiling, digitised request processing, and SMS notifications.',
    techStack: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vite'],
    liveUrl: 'https://e-barangay-system.vercel.app/',
    githubUrl: '#',
    featured: true,
    category: 'web',
    themeColor: '#0ea5e9',
  },
  {
    id: 'project-3',
    title: 'Synth Studio',
    description: 'Browser-based music synthesizer with modular audio processing and MIDI controller support.',
    longDescription: 'An interactive web-based synthesizer leveraging the Web Audio API for real-time sound generation and processing. Features a visual modular routing system, preset management, and full MIDI device integration.',
    techStack: ['React', 'Web Audio API', 'Canvas API', 'WebMIDI', 'TypeScript'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    category: 'tool',
    themeColor: '#a78bfa',
  },
  {
    id: 'project-4',
    title: 'UrbanPulse',
    description: 'Smart city monitoring platform with IoT sensor integration and geospatial visualization.',
    longDescription: 'A platform for visualizing urban data including traffic patterns, air quality, noise levels, and energy consumption. Uses real-time IoT sensor data displayed on interactive 3D maps with historical trend analysis.',
    techStack: ['Vue.js', 'Mapbox GL', 'Three.js', 'Node.js', 'MongoDB', 'MQTT'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
    category: 'web',
    themeColor: '#0ea5e9',
  },
  {
    id: 'project-5',
    title: 'CodeMentor AI',
    description: 'AI-powered code review assistant that provides real-time suggestions and learning resources.',
    longDescription: 'An intelligent code analysis tool that reviews code in real-time, suggests improvements, identifies potential bugs, and recommends relevant documentation. Uses fine-tuned language models with context-aware analysis.',
    techStack: ['Python', 'FastAPI', 'GPT-4', 'React', 'VS Code Extension API'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
    category: 'ai',
    themeColor: '#5cf0a6',
  },
  {
    id: 'project-6',
    title: 'This Portfolio',
    description: 'The immersive 3D cyberpunk portfolio you\'re exploring right now.',
    longDescription: 'A fully interactive 3D workspace built with React Three Fiber, featuring procedural geometry, post-processing effects, and cinematic camera transitions. Every object in the scene is interactive and reveals a different part of my story.',
    techStack: ['React', 'Three.js', 'R3F', 'GSAP', 'Framer Motion', 'TypeScript'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    category: 'web',
    themeColor: '#ff007a',
  },
];
