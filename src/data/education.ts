export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights: string[];
  courses?: string[];
}

export const education: Education[] = [
  {
    id: 'edu-1',
    institution: 'University of Technology',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: '2020',
    endDate: '2024',
    gpa: '3.8 / 4.0',
    highlights: [
      'Dean\'s List — All semesters',
      'Capstone Project: AI-powered code analysis tool',
      'Teaching Assistant for Data Structures & Algorithms',
      'Led university hackathon team to 1st place',
    ],
    courses: [
      'Data Structures & Algorithms',
      'Computer Graphics',
      'Machine Learning',
      'Distributed Systems',
      'Software Engineering',
      'Database Systems',
    ],
  },
  {
    id: 'edu-2',
    institution: 'Online Learning',
    degree: 'Certifications',
    field: 'Continuous Education',
    startDate: '2022',
    endDate: 'Present',
    highlights: [
      'AWS Cloud Practitioner Certification',
      'Three.js Journey — Complete Course',
      'Advanced React Patterns — Frontend Masters',
      'System Design — Educative.io',
    ],
  },
];
