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
  name: 'Erin',
  title: 'Full-Stack Developer',
  tagline: 'Building the future, one pixel at a time.',
  bio: [
    'I\'m a passionate full-stack developer who thrives at the intersection of design and engineering. I believe that beautiful code should create beautiful experiences.',
    'My journey into software development started with a curiosity about how things work—from tinkering with HTML as a teenager to building complex 3D web experiences today.',
    'When I\'m not coding, you\'ll find me exploring new technologies, contributing to open source, or getting lost in a good sci-fi novel. I believe in continuous learning and pushing the boundaries of what\'s possible on the web.',
    'I\'m currently focused on creative frontend development, combining 3D graphics, animation, and modern web technologies to build immersive digital experiences that tell compelling stories.',
  ],
  location: 'San Francisco, CA',
  email: 'hello@erin.dev',
  socials: [
    { platform: 'GitHub', url: 'https://github.com', icon: '⟨/⟩' },
    { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'in' },
    { platform: 'Twitter', url: 'https://twitter.com', icon: '𝕏' },
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
    'Lead a creative engineering team at a forward-thinking tech company',
    'Build open-source tools that make 3D web development more accessible',
    'Speak at major web development conferences about creative coding',
    'Launch a successful SaaS product combining AI with immersive web experiences',
    'Contribute to the WebGPU ecosystem and push the boundaries of browser graphics',
    'Mentor the next generation of creative developers',
  ],
  resumeUrl: '/resume.pdf',
};
