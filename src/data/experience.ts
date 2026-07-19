export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  responsibilities: string[];
  techStack: string[];
}

export const experience: Experience[] = [
  {
    id: 'exp-1',
    company: 'TechCorp Inc.',
    role: 'Full-Stack Developer',
    startDate: 'Jan 2024',
    endDate: 'Present',
    location: 'San Francisco, CA (Remote)',
    description: 'Building scalable web applications and internal tools for a fast-growing SaaS platform.',
    responsibilities: [
      'Architected and built a real-time analytics dashboard serving 10K+ daily users',
      'Reduced page load times by 40% through code splitting and lazy loading',
      'Implemented CI/CD pipeline reducing deployment time from hours to minutes',
      'Mentored 3 junior developers on React best practices and testing',
      'Led migration from JavaScript to TypeScript across 200+ components',
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
  },
  {
    id: 'exp-2',
    company: 'StartupXYZ',
    role: 'Frontend Developer',
    startDate: 'Jun 2022',
    endDate: 'Dec 2023',
    location: 'Austin, TX',
    description: 'First engineering hire at an early-stage startup building a collaborative design tool.',
    responsibilities: [
      'Built the entire frontend from scratch using React and Three.js',
      'Designed and implemented a component library used across 4 products',
      'Integrated WebSocket-based real-time collaboration features',
      'Achieved 95+ Lighthouse performance score across all pages',
      'Collaborated directly with CEO and designers on product strategy',
    ],
    techStack: ['React', 'Three.js', 'WebSocket', 'Figma', 'Vercel', 'MongoDB'],
  },
  {
    id: 'exp-3',
    company: 'University Research Lab',
    role: 'Research Assistant',
    startDate: 'Sep 2021',
    endDate: 'May 2022',
    location: 'University of Technology',
    description: 'Developed visualization tools for machine learning research data.',
    responsibilities: [
      'Built interactive data visualization dashboards using D3.js and React',
      'Processed and visualized datasets with 1M+ data points',
      'Published a co-authored paper on visual analytics for ML model interpretability',
      'Created automated data pipeline for real-time experiment monitoring',
    ],
    techStack: ['Python', 'React', 'D3.js', 'Flask', 'TensorFlow'],
  },
];
