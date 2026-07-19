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
    institution: 'Saint Ferdinand College',
    degree: 'Bachelor of Science',
    field: 'Information Technology',
    startDate: '2021',
    endDate: '2025',
    highlights: [
      'Gained deep knowledge in Software Engineering, database systems, and web programming.',
      'Developed multiple web and mobile applications using modern JavaScript stacks.',
      'City of Ilagan, Isabela'
    ]
  },
  {
    id: 'edu-2',
    institution: 'Saint Ferdinand College',
    degree: 'Diploma',
    field: 'Information Communication and Technology',
    startDate: '2021',
    endDate: '2024',
    highlights: [
      'Focused on computer hardware, network administration, and databases.',
      'City of Ilagan, Isabela'
    ]
  },
  {
    id: 'edu-3',
    institution: 'San Antonino National High School',
    degree: 'High School Diploma',
    field: 'General Academic Strand (GAS)',
    startDate: '2019',
    endDate: '2021',
    highlights: [
      'Burgos, Isabela'
    ]
  }
];
