import * as THREE from 'three';

// ─── COLOR PALETTE: "Lucy & David" (Light Cyberpunk) ────────────────
export const COLORS = {
  bgDeep: '#edeaf5',
  bgSurface: '#ffffff',
  primary: '#ff007a',     // Lucy Pink
  secondary: '#ffd300',   // David Yellow
  tertiary: '#8b5cf6',    // Lucy Purple
  text: '#180d30',
  textMuted: '#62597d',
  border: '#d3cde6',
  
  // Three.js color objects
  three: {
    bgDeep: new THREE.Color('#edeaf5'),
    bgSurface: new THREE.Color('#ffffff'),
    primary: new THREE.Color('#ff007a'),
    secondary: new THREE.Color('#ffd300'),
    tertiary: new THREE.Color('#8b5cf6'),
    ambient: new THREE.Color('#edeaf5'),
    floor: new THREE.Color('#edeaf5'),
    wall: new THREE.Color('#e2def2'),
  },
} as const;

// ─── CAMERA POSITIONS ─────────────────────────────────────────────
// Each position represents where the camera moves when an object is clicked
export const CAMERA_POSITIONS: Record<string, {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}> = {
  // Default overview position
  overview: {
    position: [0, 5, 12],
    target: [0, 1.5, 0],
  },
  // Entry position (camera starts here and flies in)
  entry: {
    position: [0, 8, 25],
    target: [0, 2, 0],
  },
  // Individual object focus positions
  'main-monitor': {
    position: [0, 3, 4],
    target: [0, 2.8, 0],
  },
  'laptop': {
    position: [-2.5, 2.5, 4],
    target: [-2.5, 2, 1],
  },
  'bookshelf': {
    position: [-4.5, 3.2, 1.0],
    target: [-6.5, 2.0, -1.5],
  },
  'workbench': {
    position: [3.8, 2.5, 1.2],
    target: [5.5, 1.4, -1.0],
  },
  'holographic-table': {
    position: [1.5, 2.2, 0.8],
    target: [2.2, 1.0, -1.2],
  },
  'server-rack': {
    position: [0, 3, -3],
    target: [0, 2.2, -7],
  },
  'entertainment-shelf': {
    position: [4.5, 3.2, 3.5],
    target: [6.5, 2.0, 1.0],
  },
  'panoramic-window': {
    position: [0, 4, -2],
    target: [0, 3, -8],
  },
  'communication-terminal': {
    position: [3, 2.5, 4],
    target: [4, 2, 1],
  },
  'pin-board': {
    position: [-1.5, 3.5, -4.5],
    target: [-3.5, 3.5, -7.5],
  },
} as const;

// ─── OBJECT LABELS ────────────────────────────────────────────────
export const OBJECT_LABELS: Record<string, { label: string; icon: string }> = {
  'main-monitor':          { label: 'Featured Projects',       icon: '🖥️' },
  'laptop':                { label: 'About Me',                icon: '💻' },
  'bookshelf':             { label: 'Education',               icon: '📚' },
  'workbench':             { label: 'Technical Skills',        icon: '🛠️' },
  'holographic-table':     { label: 'Project Showcase',        icon: '🧩' },
  'server-rack':           { label: 'Work Experience',         icon: '🖥️' },
  'entertainment-shelf':   { label: 'Hobbies & Interests',    icon: '🎮' },
  'panoramic-window':      { label: 'Future Goals',            icon: '🌆' },
  'communication-terminal':{ label: 'Contact',                 icon: '📡' },
  'pin-board':             { label: 'Pinned Projects',         icon: '📌' },
} as const;

// ─── ANIMATION TIMINGS ───────────────────────────────────────────
export const TIMINGS = {
  bootDuration: 4500,        // Boot sequence in ms
  cameraEntryDuration: 2.5,  // Camera fly-in in seconds (GSAP)
  cameraTransition: 1.5,     // Object focus transition in seconds
  panelRevealDelay: 0.3,     // Delay before panel slides in (seconds)
  panelRevealDuration: 0.5,  // Panel animation duration (seconds)
} as const;

// ─── POST-PROCESSING SETTINGS ────────────────────────────────────
export const POST_PROCESSING = {
  bloom: {
    intensity: 1.5,
    luminanceThreshold: 0.9,
    luminanceSmoothing: 0.4,
    mipmapBlur: true,
  },
  chromaticAberration: {
    offset: [0.0008, 0.0008] as [number, number],
  },
  noise: {
    opacity: 0.04,
  },
  vignette: {
    offset: 0.15,
    darkness: 1.1,
  },
} as const;
