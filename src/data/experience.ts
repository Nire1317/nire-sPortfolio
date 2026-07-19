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
    company: 'Inovers',
    role: 'Associate Software Engineer',
    startDate: 'Nov 2025',
    endDate: 'Present',
    location: 'Isabela, Philippines (Remote/Hybrid)',
    description: 'Engineering the DORX Logistics Platform, contributing to 11 interconnected systems supporting end-to-end parcel operations.',
    responsibilities: [
      'Developed and enhanced the DORX Logistics Platform, contributing to 11 interconnected logistics systems that support end-to-end parcel operations.',
      'Designed, developed, and maintained RESTful APIs, backend modules, and optimized SQL queries to support logistics workflows.',
      'Implemented real-time parcel tracking and status synchronization to improve tracking accuracy across multiple logistics platforms.',
      'Built and enhanced logistics modules, including parcel management, booking, dispatching, hub operations, satellite operations, and delivery workflows.',
      'Improved data accuracy, system performance, and operational efficiency by optimizing backend processes and database operations.',
      'Debugged, maintained, and enhanced existing modules while ensuring seamless integration between frontend, backend, and database services.',
      'Collaborated with a cross-functional development team to continuously enhance the DORX logistics ecosystem by delivering new features, resolving technical issues, and improving overall system performance and user experience.'
    ],
    techStack: ['Node.js', 'Express.js', 'MySQL', 'RESTful APIs', 'SQL Optimization']
  },
  {
    id: 'exp-2',
    company: 'Universal Leaf Philippines, Inc.',
    role: 'Technical Staff',
    startDate: 'Jul 2025',
    endDate: 'Nov 2025',
    location: 'Reina Mercedes, Cagayan Valley, Philippines (On-site)',
    description: 'Managed seasonal operational logs, inventory records, and cross-functional compliance coordination.',
    responsibilities: [
      'Prepared and maintained invoices, billing records, service reports, and technical documentation with accuracy and attention to detail.',
      'Coordinated with cross-functional teams to ensure maintenance records and compliance documents were complete and up to date.',
      'Compiled technical reports and operational data to support management decision-making and reporting.',
      'Managed inventory documentation by issuing and tracking parts and supplies while maintaining accurate records.'
    ],
    techStack: ['Documentation', 'Billing Records', 'Inventory Tracking', 'Reporting']
  },
  {
    id: 'exp-3',
    company: 'Dory Delivery (Food Delivery Service)',
    role: 'Software Developer Intern',
    startDate: 'Feb 17, 2025',
    endDate: 'May 12, 2025',
    location: 'Isabela, Philippines (Remote/Hybrid)',
    description: 'Developed cross-platform mobile apps and web features, integrating RESTful APIs and verifying quality through QA cycles.',
    responsibilities: [
      'Developed and enhanced features for the customer and rider mobile applications using React Native.',
      'Built new features and resolved bugs in the Dory Delivery website using React.js, improving functionality and user experience.',
      'Conducted manual QA testing across both web and mobile applications to identify, document, and verify bug fixes.',
      'Integrated frontend applications with backend RESTful APIs for seamless real-time data synchronization.',
      'Collaborated with the development team to implement new features, improve UI/UX, and enhance overall application quality.'
    ],
    techStack: ['React Native', 'React.js', 'RESTful APIs', 'Manual QA Testing']
  }
];
