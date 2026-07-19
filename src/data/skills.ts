export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level: number; // 0-100
  icon?: string;
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    icon: '🎨',
    skills: [
      { name: 'React / Next.js', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Three.js / R3F', level: 80 },
      { name: 'CSS / SCSS', level: 92 },
      { name: 'Framer Motion', level: 85 },
      { name: 'Vue.js', level: 75 },
    ],
  },
  {
    id: 'backend',
    name: 'Backend',
    icon: '⚙️',
    skills: [
      { name: 'Node.js', level: 88 },
      { name: 'Python', level: 82 },
      { name: 'REST / GraphQL APIs', level: 90 },
      { name: 'PostgreSQL', level: 78 },
      { name: 'MongoDB', level: 80 },
      { name: 'Redis', level: 70 },
    ],
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    icon: '☁️',
    skills: [
      { name: 'Docker', level: 82 },
      { name: 'AWS / GCP', level: 75 },
      { name: 'CI/CD Pipelines', level: 80 },
      { name: 'Git / GitHub', level: 95 },
      { name: 'Linux / Shell', level: 78 },
      { name: 'Terraform', level: 60 },
    ],
  },
  {
    id: 'tools',
    name: 'Tools & Methods',
    icon: '🛠️',
    skills: [
      { name: 'Figma / Design', level: 72 },
      { name: 'Agile / Scrum', level: 85 },
      { name: 'Testing (Jest, Cypress)', level: 80 },
      { name: 'Performance Optimization', level: 78 },
      { name: 'Accessibility (WCAG)', level: 75 },
      { name: 'Technical Writing', level: 82 },
    ],
  },
];
