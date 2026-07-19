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
    id: 'languages',
    name: 'Languages',
    icon: '🔤',
    skills: [
      { name: 'JavaScript', level: 92 },
      { name: 'TypeScript', level: 90 },
      { name: 'PHP', level: 80 },
      { name: 'HTML5', level: 95 },
      { name: 'CSS3', level: 92 },
      { name: 'SQL', level: 85 }
    ],
  },
  {
    id: 'frontend',
    name: 'Front-end',
    icon: '🎨',
    skills: [
      { name: 'React', level: 90 },
      { name: 'React Native', level: 88 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'Redux', level: 82 },
      { name: 'TanStack Query', level: 85 }
    ],
  },
  {
    id: 'backend',
    name: 'Backend',
    icon: '⚙️',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express.js', level: 82 },
      { name: 'Sequelize (ORM)', level: 80 }
    ],
  },
  {
    id: 'databases',
    name: 'Databases',
    icon: '💾',
    skills: [
      { name: 'MySQL', level: 85 },
      { name: 'Supabase', level: 80 },
      { name: 'Firebase', level: 75 }
    ],
  },
  {
    id: 'technologies',
    name: 'Technologies',
    icon: '📡',
    skills: [
      { name: 'RESTful APIs', level: 90 },
      { name: 'Socket.IO', level: 85 },
      { name: 'JWT Authentication', level: 88 }
    ],
  },
  {
    id: 'tools',
    name: 'Tools & Workspace',
    icon: '🛠️',
    skills: [
      { name: 'Git & GitHub', level: 92 },
      { name: 'VS Code', level: 90 },
      { name: 'Postman', level: 88 },
      { name: 'Docker', level: 80 },
      { name: 'Expo', level: 85 },
      { name: 'Android Studio', level: 78 },
      { name: 'Vite', level: 88 },
      { name: 'Jira', level: 80 }
    ],
  },
  {
    id: 'deployment',
    name: 'Deployment',
    icon: '☁️',
    skills: [
      { name: 'Vercel', level: 90 },
      { name: 'Nginx (engineX)', level: 80 },
      { name: 'Railway', level: 85 }
    ],
  },
];
