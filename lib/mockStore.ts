// In-memory state store used for initial seed & fallback runtime store

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // bcrypt hash or plain match for demo
  role: 'ADMIN' | 'STUDENT' | 'RECRUITER';
  avatar: string;
}

export interface DemoStudent {
  id: string;
  userId: string;
  registerNumber: string;
  name: string;
  email: string;
  department: string;
  batch: string;
  semester: number;
  cgpa: number;
  tenthPercentage: number;
  twelfthPercentage: number;
  backlogs: number;
  phone: string;
  gender: string;
  dob: string;
  skills: string[];
  projects: { title: string; description: string; technologies: string[]; githubUrl: string; liveUrl: string }[];
  certifications: { title: string; issuer: string; date: string }[];
  socials: { github?: string; linkedin?: string; portfolio?: string };
  placementStatus: 'UNPLACED' | 'SHORTLISTED' | 'PLACED';
  profileCompletion: number;
}

export interface DemoCompany {
  id: string;
  name: string;
  logo: string;
  industry: string;
  website: string;
  description: string;
  location: string;
  companySize: string;
  contactPerson: string;
  contactEmail: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}

export interface DemoJob {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  salary: string;
  salaryNum: number;
  location: string;
  jobType: 'FULL_TIME' | 'INTERNSHIP' | 'CONVERTIBLE';
  workMode: 'ON_SITE' | 'HYBRID' | 'REMOTE';
  minCgpa: number;
  maxBacklogs: number;
  eligibleDepartments: string[];
  eligibleBatches: string[];
  deadline: string;
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
}

export interface DemoApplication {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentDept: string;
  studentCgpa: number;
  jobTitle: string;
  companyId: string;
  companyName: string;
  appliedDate: string;
  status: 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'TEST' | 'INTERVIEW' | 'SELECTED' | 'REJECTED';
  notes?: string;
}

export interface DemoInterview {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  roundName: string;
  date: string;
  time: string;
  mode: 'ONLINE' | 'OFFLINE';
  venueOrLink: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  result?: 'PASSED' | 'FAILED' | 'ON_HOLD';
  feedback?: string;
}

export interface DemoPlacement {
  id: string;
  studentId: string;
  studentName: string;
  companyName: string;
  role: string;
  packageOffered: string;
  packageNum: number;
  joiningDate: string;
  department: string;
  batch: string;
}

export interface DemoNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'APPLICATION' | 'INTERVIEW' | 'JOB' | 'RESULT' | 'SYSTEM';
  read: boolean;
  createdAt: string;
}

export const initialUsers: DemoUser[] = [];

export const initialStudents: DemoStudent[] = [
  {
    id: 's-1',
    userId: 'u-student-1',
    registerNumber: 'CS2026001',
    name: 'John Doe',
    email: 'student@campushire.demo',
    department: 'CSE',
    batch: '2026',
    semester: 8,
    cgpa: 8.7,
    tenthPercentage: 92.5,
    twelfthPercentage: 91.0,
    backlogs: 0,
    phone: '+91 98765 43210',
    gender: 'Male',
    dob: '2004-05-14',
    skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'Tailwind CSS', 'Docker', 'Python'],
    projects: [
      {
        title: 'Campus Placement System',
        description: 'Full stack recruitment platform with Next.js & Mongoose',
        technologies: ['Next.js', 'TypeScript', 'MongoDB'],
        githubUrl: 'https://github.com/demo/campushire',
        liveUrl: 'https://campushire.demo',
      },
      {
        title: 'AI Resume Parser',
        description: 'NLP based keyword extraction for resumes',
        technologies: ['Python', 'FastAPI', 'spaCy'],
        githubUrl: 'https://github.com/demo/resume-ai',
        liveUrl: '',
      },
    ],
    certifications: [
      { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2025-08' },
      { title: 'Meta Front-End Developer Specialization', issuer: 'Coursera / Meta', date: '2024-11' },
    ],
    socials: {
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      portfolio: 'https://johndoe.dev',
    },
    placementStatus: 'SHORTLISTED',
    profileCompletion: 92,
  },
  {
    id: 's-2',
    userId: 'u-s2',
    registerNumber: 'CS2026002',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@student.demo',
    department: 'CSE',
    batch: '2026',
    semester: 8,
    cgpa: 9.2,
    tenthPercentage: 95.0,
    twelfthPercentage: 94.2,
    backlogs: 0,
    phone: '+91 98765 11111',
    gender: 'Male',
    dob: '2004-02-10',
    skills: ['C++', 'Python', 'Machine Learning', 'PyTorch', 'Data Structures', 'SQL'],
    projects: [
      {
        title: 'Real-time Object Detection',
        description: 'YOLOv8 based surveillance analytics',
        technologies: ['PyTorch', 'OpenCV', 'Flask'],
        githubUrl: 'https://github.com/aarav/yolo',
        liveUrl: '',
      },
    ],
    certifications: [{ title: 'Deep Learning Specialization', issuer: 'DeepLearning.AI', date: '2025-03' }],
    socials: { github: 'https://github.com/aarav', linkedin: 'https://linkedin.com/in/aarav' },
    placementStatus: 'PLACED',
    profileCompletion: 95,
  },
  {
    id: 's-3',
    userId: 'u-s3',
    registerNumber: 'EC2026015',
    name: 'Priya Sharma',
    email: 'priya.sharma@student.demo',
    department: 'ECE',
    batch: '2026',
    semester: 8,
    cgpa: 8.1,
    tenthPercentage: 88.0,
    twelfthPercentage: 86.5,
    backlogs: 0,
    phone: '+91 98765 22222',
    gender: 'Female',
    dob: '2004-09-22',
    skills: ['Embedded Systems', 'IoT', 'C', 'Python', 'MATLAB', 'VLSI'],
    projects: [
      {
        title: 'Smart Agriculture Sensor Network',
        description: 'ESP32 wireless node with LoRaWAN reporting',
        technologies: ['C++', 'ESP32', 'MQTT'],
        githubUrl: '',
        liveUrl: '',
      },
    ],
    certifications: [{ title: 'Embedded Systems & IoT Specialization', issuer: 'NPTEL', date: '2025-01' }],
    socials: { linkedin: 'https://linkedin.com/in/priyasharma' },
    placementStatus: 'SHORTLISTED',
    profileCompletion: 85,
  },
  {
    id: 's-4',
    userId: 'u-s4',
    registerNumber: 'IT2026008',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@student.demo',
    department: 'IT',
    batch: '2026',
    semester: 8,
    cgpa: 7.4,
    tenthPercentage: 82.0,
    twelfthPercentage: 79.5,
    backlogs: 1,
    phone: '+91 98765 33333',
    gender: 'Male',
    dob: '2004-11-05',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Angular', 'Docker'],
    projects: [
      {
        title: 'E-Banking API Service',
        description: 'Microservices architecture with Spring Cloud',
        technologies: ['Spring Boot', 'Docker', 'PostgreSQL'],
        githubUrl: 'https://github.com/rohan/bank-api',
        liveUrl: '',
      },
    ],
    certifications: [],
    socials: { github: 'https://github.com/rohang', linkedin: 'https://linkedin.com/in/rohang' },
    placementStatus: 'UNPLACED',
    profileCompletion: 78,
  },
  {
    id: 's-5',
    userId: 'u-s5',
    registerNumber: 'ME2026030',
    name: 'Ananya Verma',
    email: 'ananya.v@student.demo',
    department: 'MECH',
    batch: '2026',
    semester: 8,
    cgpa: 8.4,
    tenthPercentage: 90.0,
    twelfthPercentage: 88.0,
    backlogs: 0,
    phone: '+91 98765 44444',
    gender: 'Female',
    dob: '2004-03-18',
    skills: ['AutoCAD', 'SolidWorks', 'ANSYS', 'Python for Engineers', 'Robotics'],
    projects: [],
    certifications: [{ title: 'Certified SolidWorks Associate', issuer: 'Dassault Systèmes', date: '2024-09' }],
    socials: { linkedin: 'https://linkedin.com/in/ananyaverma' },
    placementStatus: 'UNPLACED',
    profileCompletion: 70,
  },
];

export const initialCompanies: DemoCompany[] = [
  {
    id: 'c-1',
    name: 'TCS (Tata Consultancy Services)',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150',
    industry: 'IT Services & Consulting',
    website: 'https://tcs.com',
    description: 'Leading global IT services, consulting, and business solutions organization.',
    location: 'Mumbai / Pan-India',
    companySize: '500,000+ employees',
    contactPerson: 'Rahul Sen (Campus Lead)',
    contactEmail: 'campus.hiring@tcs.demo',
    status: 'APPROVED',
  },
  {
    id: 'c-2',
    name: 'Infosys',
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=150',
    industry: 'Information Technology',
    website: 'https://infosys.com',
    description: 'Global leader in next-generation digital services and consulting.',
    location: 'Bengaluru / Hybrid',
    companySize: '300,000+ employees',
    contactPerson: 'Neha Kapoor',
    contactEmail: 'campus@infosys.demo',
    status: 'APPROVED',
  },
  {
    id: 'c-3',
    name: 'Microsoft',
    logo: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&q=80&w=150',
    industry: 'Software & Cloud Computing',
    website: 'https://microsoft.com',
    description: 'Empowering every person and organization on the planet to achieve more.',
    location: 'Hyderabad / Bengaluru',
    companySize: '220,000+ employees',
    contactPerson: 'Sarah Jenkins',
    contactEmail: 'recruiter@campushire.demo',
    status: 'APPROVED',
  },
  {
    id: 'c-4',
    name: 'Deloitte',
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=150',
    industry: 'Management Consulting & Risk',
    website: 'https://deloitte.com',
    description: 'Global professional services network providing audit, consulting, and risk advisories.',
    location: 'Gurugram / Hyderabad',
    companySize: '400,000+ employees',
    contactPerson: 'Amitabh Roy',
    contactEmail: 'campus.india@deloitte.demo',
    status: 'APPROVED',
  },
  {
    id: 'c-5',
    name: 'Accenture',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=150',
    industry: 'Strategy & Technology Services',
    website: 'https://accenture.com',
    description: 'Global professional services company with leading capabilities in digital, cloud and security.',
    location: 'Pune / Noida / Bengaluru',
    companySize: '700,000+ employees',
    contactPerson: 'Vikram Singh',
    contactEmail: 'hiring@accenture.demo',
    status: 'APPROVED',
  },
  {
    id: 'c-6',
    name: 'Google India',
    logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=150',
    industry: 'Internet & Artificial Intelligence',
    website: 'https://careers.google.com',
    description: 'Organizing the world’s information and making it universally accessible and useful.',
    location: 'Bengaluru / Hyderabad',
    companySize: '180,000+ employees',
    contactPerson: 'Kavita Menon',
    contactEmail: 'university-india@google.demo',
    status: 'APPROVED',
  },
];

export const initialJobs: DemoJob[] = [
  {
    id: 'j-1',
    title: 'Software Development Engineer I (SDE-1)',
    companyId: 'c-3',
    companyName: 'Microsoft',
    companyLogo: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&q=80&w=150',
    description: 'Join Microsoft Cloud & AI team as an SDE-1 building large-scale distributed cloud systems.',
    responsibilities: [
      'Architect, develop, and maintain cloud services on Azure platform',
      'Write clean, efficient, and well-tested C# / C++ / TypeScript code',
      'Participate in code reviews, design discussions, and operational support',
    ],
    skills: ['C++', 'C#', 'Data Structures', 'Algorithms', 'Azure', 'System Design'],
    salary: '₹ 24.5 LPA',
    salaryNum: 24.5,
    location: 'Hyderabad / Bengaluru',
    jobType: 'FULL_TIME',
    workMode: 'HYBRID',
    minCgpa: 8.0,
    maxBacklogs: 0,
    eligibleDepartments: ['CSE', 'IT', 'ECE'],
    eligibleBatches: ['2026'],
    deadline: '2026-09-30',
    status: 'ACTIVE',
  },
  {
    id: 'j-2',
    title: 'Full Stack Engineer - Digital Practice',
    companyId: 'c-2',
    companyName: 'Infosys',
    companyLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=150',
    description: 'Build modern enterprise web applications using React, Node.js, and Microservices.',
    responsibilities: [
      'Develop responsive frontend UI components using React & Tailwind',
      'Implement REST APIs using Node.js/Express and MongoDB',
      'Deploy applications to AWS cloud infrastructure',
    ],
    skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'SQL', 'Git'],
    salary: '₹ 9.5 LPA',
    salaryNum: 9.5,
    location: 'Bengaluru / Mysuru',
    jobType: 'FULL_TIME',
    workMode: 'ON_SITE',
    minCgpa: 7.0,
    maxBacklogs: 0,
    eligibleDepartments: ['CSE', 'IT', 'ECE', 'EEE'],
    eligibleBatches: ['2026'],
    deadline: '2026-09-25',
    status: 'ACTIVE',
  },
  {
    id: 'j-3',
    title: 'Associate IT Consultant',
    companyId: 'c-4',
    companyName: 'Deloitte',
    companyLogo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=150',
    description: 'Help fortune 500 clients transform their technology landscape and enterprise systems.',
    responsibilities: [
      'Analyze client business requirements and formulate digital strategies',
      'Configure SAP, Salesforce, or Oracle Cloud solutions',
      'Conduct risk assessments and cybersecurity compliance checks',
    ],
    skills: ['SQL', 'Python', 'Business Analysis', 'Communication', 'Excel', 'Problem Solving'],
    salary: '₹ 11.0 LPA',
    salaryNum: 11.0,
    location: 'Gurugram / Hyderabad',
    jobType: 'FULL_TIME',
    workMode: 'HYBRID',
    minCgpa: 7.5,
    maxBacklogs: 0,
    eligibleDepartments: ['CSE', 'IT', 'ECE', 'MECH', 'EEE'],
    eligibleBatches: ['2026'],
    deadline: '2026-10-15',
    status: 'ACTIVE',
  },
  {
    id: 'j-4',
    title: 'Systems Engineer - Ninja & Digital',
    companyId: 'c-1',
    companyName: 'TCS (Tata Consultancy Services)',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150',
    description: 'Premier engineering entry role across cloud, data science, and AI solutions.',
    responsibilities: [
      'Build resilient software modules for financial and healthcare verticals',
      'Optimize database queries and automated build pipelines',
    ],
    skills: ['Java', 'Python', 'DBMS', 'Linux', 'Data Structures'],
    salary: '₹ 7.2 LPA',
    salaryNum: 7.2,
    location: 'Pan-India',
    jobType: 'FULL_TIME',
    workMode: 'ON_SITE',
    minCgpa: 6.5,
    maxBacklogs: 1,
    eligibleDepartments: ['ALL'],
    eligibleBatches: ['2026'],
    deadline: '2026-10-01',
    status: 'ACTIVE',
  },
  {
    id: 'j-5',
    title: 'Software Engineer - University Graduate',
    companyId: 'c-6',
    companyName: 'Google India',
    companyLogo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=150',
    description: 'Work on core products like Search, Maps, Chrome, and Cloud infrastructure.',
    responsibilities: [
      'Write production code in C++, Java, or Python',
      'Design distributed low-latency database systems',
    ],
    skills: ['C++', 'Python', 'Java', 'Algorithms', 'Operating Systems', 'System Design'],
    salary: '₹ 32.0 LPA',
    salaryNum: 32.0,
    location: 'Bengaluru / Hyderabad',
    jobType: 'FULL_TIME',
    workMode: 'HYBRID',
    minCgpa: 8.5,
    maxBacklogs: 0,
    eligibleDepartments: ['CSE', 'IT'],
    eligibleBatches: ['2026'],
    deadline: '2026-09-15',
    status: 'ACTIVE',
  },
];

export const initialApplications: DemoApplication[] = [
  {
    id: 'app-1',
    jobId: 'j-1',
    studentId: 's-1',
    studentName: 'John Doe',
    studentDept: 'CSE',
    studentCgpa: 8.7,
    jobTitle: 'Software Development Engineer I (SDE-1)',
    companyId: 'c-3',
    companyName: 'Microsoft',
    appliedDate: '2026-08-20',
    status: 'INTERVIEW',
    notes: 'Candidate passed Technical Assessment (CodeSignals 560/600). Scheduled for Tech Interview Round 1.',
  },
  {
    id: 'app-2',
    jobId: 'j-2',
    studentId: 's-1',
    studentName: 'John Doe',
    studentDept: 'CSE',
    studentCgpa: 8.7,
    jobTitle: 'Full Stack Engineer - Digital Practice',
    companyId: 'c-2',
    companyName: 'Infosys',
    appliedDate: '2026-08-22',
    status: 'SHORTLISTED',
  },
  {
    id: 'app-3',
    jobId: 'j-5',
    studentId: 's-2',
    studentName: 'Aarav Mehta',
    studentDept: 'CSE',
    studentCgpa: 9.2,
    jobTitle: 'Software Engineer - University Graduate',
    companyId: 'c-6',
    companyName: 'Google India',
    appliedDate: '2026-08-18',
    status: 'SELECTED',
    notes: 'Cleared Google Hiring Committee evaluation. Offer extended for 32.0 LPA.',
  },
  {
    id: 'app-4',
    jobId: 'j-3',
    studentId: 's-3',
    studentName: 'Priya Sharma',
    studentDept: 'ECE',
    studentCgpa: 8.1,
    jobTitle: 'Associate IT Consultant',
    companyId: 'c-4',
    companyName: 'Deloitte',
    appliedDate: '2026-08-25',
    status: 'SHORTLISTED',
  },
];

export const initialInterviews: DemoInterview[] = [
  {
    id: 'int-1',
    applicationId: 'app-1',
    studentId: 's-1',
    studentName: 'John Doe',
    jobId: 'j-1',
    jobTitle: 'Software Development Engineer I (SDE-1)',
    companyName: 'Microsoft',
    roundName: 'Technical Interview Round 1 (Data Structures & System Design)',
    date: '2026-08-29',
    time: '11:00 AM - 12:00 PM IST',
    mode: 'ONLINE',
    venueOrLink: 'https://teams.microsoft.com/l/meetup-join/demo-campushire-msft',
    status: 'SCHEDULED',
  },
  {
    id: 'int-2',
    applicationId: 'app-2',
    studentId: 's-1',
    studentName: 'John Doe',
    jobId: 'j-2',
    jobTitle: 'Full Stack Engineer',
    companyName: 'Infosys',
    roundName: 'Managerial & HR Interview',
    date: '2026-09-02',
    time: '02:30 PM - 03:15 PM IST',
    mode: 'ONLINE',
    venueOrLink: 'https://meet.google.com/abc-demo-xyz',
    status: 'SCHEDULED',
  },
];

export const initialPlacements: DemoPlacement[] = [
  {
    id: 'p-1',
    studentId: 's-2',
    studentName: 'Aarav Mehta',
    companyName: 'Google India',
    role: 'Software Engineer',
    packageOffered: '₹ 32.0 LPA',
    packageNum: 32.0,
    joiningDate: '2026-07-15',
    department: 'CSE',
    batch: '2026',
  },
  {
    id: 'p-2',
    studentId: 's-6',
    studentName: 'Siddharth Nair',
    companyName: 'Microsoft',
    role: 'SDE-1',
    packageOffered: '₹ 24.5 LPA',
    packageNum: 24.5,
    joiningDate: '2026-07-01',
    department: 'CSE',
    batch: '2026',
  },
  {
    id: 'p-3',
    studentId: 's-7',
    studentName: 'Neha Deshmukh',
    companyName: 'Deloitte',
    role: 'Associate IT Consultant',
    packageOffered: '₹ 11.0 LPA',
    packageNum: 11.0,
    joiningDate: '2026-08-01',
    department: 'ECE',
    batch: '2026',
  },
];

export const initialNotifications: DemoNotification[] = [
  {
    id: 'n-1',
    userId: 'u-student-1',
    title: 'Interview Scheduled - Microsoft',
    message: 'Your Technical Round 1 interview with Microsoft is scheduled for Aug 29 at 11:00 AM.',
    type: 'INTERVIEW',
    read: false,
    createdAt: '2026-08-26T10:00:00Z',
  },
  {
    id: 'n-2',
    userId: 'u-student-1',
    title: 'Application Shortlisted',
    message: 'Congratulations! Your profile has been shortlisted for Infosys Full Stack Role.',
    type: 'APPLICATION',
    read: true,
    createdAt: '2026-08-24T14:30:00Z',
  },
];
