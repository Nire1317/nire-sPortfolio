export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string[];
  location: string;
  email: string;
  socials: Social[];
  hobbies: Hobby[];
  goals: string[];
  resumeUrl: string;
}

export interface Social {
  platform: string;
  url: string;
  icon: string;
}

export interface Hobby {
  name: string;
  icon: string;
  description: string;
}

export const personal: PersonalInfo = {
  name: 'Christian Erin J. Tuzon',
  title: 'Full-Stack Developer',
  tagline: 'Building the future, one pixel at a time.',
  bio: [
    'I\'m a passionate full-stack developer who thrives at the intersection of design and engineering. I believe that beautiful code should create beautiful experiences.',
    'My journey into software development started with a curiosity about how things work—from tinkering with HTML as a teenager to building complex 3D web experiences today.',
    'When I\'m not coding, you\'ll find me exploring new technologies, contributing to open source, or getting lost in a good sci-fi novel. I believe in continuous learning and pushing the boundaries of what\'s possible on the web.',
    'I\'m currently focused on creative frontend development, combining 3D graphics, animation, and modern web technologies to build immersive digital experiences that tell compelling stories.',
  ],
  location: 'Philippines',
  email: 'hi@nire.dev',
  socials: [
    { platform: 'GitHub', url: 'https://github.com/Nire1317', icon: '⟨/⟩' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/erin-tuzon-541038343', icon: 'in' },
    { platform: 'CodePen', url: 'https://codepen.io', icon: '⬡' },
  ],
  hobbies: [
    {
      name: 'Gaming',
      icon: '🎮',
      description: 'From immersive RPGs to competitive FPS games — gaming fuels my creativity and appreciation for interactive design.',
    },
    {
      name: 'Digital Art',
      icon: '🎨',
      description: 'Creating concept art and UI designs. Tools of choice: Figma, Procreate, and Blender.',
    },
    {
      name: 'Music Production',
      icon: '🎵',
      description: 'Producing synthwave and lo-fi beats. There\'s something deeply satisfying about creating sounds from scratch.',
    },
    {
      name: 'Sci-Fi & Anime',
      icon: '📺',
      description: 'Cyberpunk, Ghost in the Shell, Akira — the visual storytelling in these worlds constantly inspires my work.',
    },
    {
      name: 'Open Source',
      icon: '🌐',
      description: 'Contributing to projects I care about and building tools that help other developers.',
    },
    {
      name: 'Photography',
      icon: '📷',
      description: 'Urban and night photography — capturing the cyberpunk aesthetic that exists in real cities.',
    },
  ],
  goals: [
    'Become a fully versatile Software Engineer and expand my skills into DevOps within the next 2 years',
    'Grow into a Senior Full-Stack Software Engineer capable of designing, building, and scaling impactful systems',
    'Build products that solve real-world problems and create meaningful value for people',
    'Master modern web, mobile, cloud, and DevOps technologies through continuous learning',
    'Build a comfortable and better life for my family through growth, dedication, and hard work',
  ],
  resumeUrl: '/resume.pdf',
};
