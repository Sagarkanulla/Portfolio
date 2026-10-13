export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  stack: string[];
  demo_url?: string;
  repo_url?: string;
  image_url?: string;
  featured?: boolean;
  status?: string;
  details?: string;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issued_on?: string;
  credential_url?: string;
  file_url?: string;
  category: string;
  credential_id?: string;
  valid_until?: string;
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
};

export type EducationItem = {
  institution: string;
  degree: string;
  period: string;
  grade: string;
  certificate_url?: string;
  issued_on?: string;
};

export const profile = {
  name: 'Vijay Sagar Kanulla',
  headline: 'AI & Data Science | Data Analytics | Full-Stack Development',
  intro: 'I build practical machine-learning solutions, data-driven experiences, and full-stack applications. I enjoy turning complex ideas into useful products through experimentation, analysis, and thoughtful engineering.',
  email: 'vijaysagarkanulla@gmail.com',
  location: 'Andhra Pradesh, India',
  linkedin: 'https://www.linkedin.com/in/vijay-sagar-kanulla-087459320',
  github: 'https://github.com/Sagarkanulla',
  portfolio: 'https://portfolio-sagar-kanulla.vercel.app/',
  resume: '/resume.pdf'
};

export const projects: Project[] = [
  {
    id: 'crop-fertilizer',
    title: 'Crop & Fertilizer Prediction System',
    category: 'AI / ML',
    description: 'Machine-learning models that recommend crops and fertilizer choices from soil and weather features.',
    stack: ['Python', 'Pandas', 'Scikit-learn', 'Random Forest', 'Flask'],
    repo_url: 'https://github.com/Sagarkanulla/FORFARMER',
    featured: true,
    details: 'Dataset preprocessing, RandomForestClassifier training, feature evaluation, and web interface.'
  },
  {
    id: 'eye-blink',
    title: 'Eye Blink Detection',
    category: 'AI / ML',
    description: 'A real-time computer-vision prototype using facial landmarks and Eye Aspect Ratio to estimate blink activity.',
    stack: ['Python', 'OpenCV', 'MediaPipe', 'Flask'],
    repo_url: 'https://github.com/Sagarkanulla/eyeblink',
    featured: true,
    details: 'Real-time facial landmark detection, Eye Aspect Ratio (EAR) metric calculation, blink rate analysis, and live dashboard.'
  },
  {
    id: 'seminarsync',
    title: 'SeminarSync — Virtual Classroom',
    category: 'Full-Stack',
    description: 'A room-based virtual classroom concept with chat, file sharing, and role-based controls.',
    stack: ['Next.js', 'SQLite', 'REST APIs'],
    demo_url: 'https://seminardought.vercel.app/',
    repo_url: 'https://github.com/Sagarkanulla/seminardought',
    featured: true,
    details: 'Secure room-based virtual classroom platform with live chat, file sharing, and SHA-256 authentication.'
  },
  {
    id: 'taskflow',
    title: 'TaskFlow — Team Collaboration',
    category: 'Full-Stack',
    description: 'A task and team collaboration application with role-based access and a relational database.',
    stack: ['PostgreSQL', 'Prisma', 'JWT', 'Railway'],
    demo_url: 'https://taskflow-production-a420.up.railway.app',
    repo_url: 'https://github.com/Sagarkanulla/TaskFlow',
    featured: true,
    details: 'Full-stack team collaboration platform with JWT authentication, role-based access control, and PostgreSQL on Railway.'
  },
  {
    id: 'look2local',
    title: 'Look2Local — Hyperlocal Marketplace',
    category: 'Full-Stack',
    description: 'A hyperlocal discovery and commerce concept connecting nearby customers with local shops, products, and offers.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Google Maps'],
    featured: true,
    status: 'In Process',
    details: 'In process. Merchant onboarding, location search, offer flow, database design, and real-time hyperlocal discovery.'
  },
  {
    id: 'robotic-vehicle',
    title: 'AI & IoT Smart Robotic Vehicle',
    category: 'AI / ML',
    description: 'A robotic vehicle prototype combining Raspberry Pi and ultrasonic sensors for obstacle avoidance, voice commands, and surveillance.',
    stack: ['Python', 'Raspberry Pi', 'Ultrasonic Sensors', 'IoT'],
    details: 'Raspberry Pi 4, ultrasonic distance sensors, speech recognition module, motor controller, and video stream surveillance.'
  },
  {
    id: 'college-quality',
    title: 'College Quality Prediction',
    category: 'AI / ML',
    description: 'A machine-learning project exploring college quality indicators such as placements, higher studies, and academic performance.',
    stack: ['Python', 'Pandas', 'Scikit-learn'],
    repo_url: 'https://github.com/Sagarkanulla/prediction_for_college',
    details: 'Supervised regression and classification evaluating institutional performance indicators.'
  },
  {
    id: 'cafe-chat',
    title: 'Café Chat Web Application',
    category: 'Full-Stack',
    description: 'A responsive café ordering web application prototype.',
    stack: ['HTML', 'CSS', 'MySQL', 'Java'],
    details: 'Interactive customer ordering menu, database-backed cart, and order management system.'
  }
];

export const certificates: Certificate[] = [
  {
    id: 'oracle-ds',
    title: 'Oracle Cloud Infrastructure 2025 Certified Data Science Professional',
    issuer: 'Oracle',
    category: 'Data Analytics',
    issued_on: '31 October 2025',
    valid_until: '31 October 2027',
    credential_id: '103041833OCI25DSOCP',
    file_url: '/certificates/oracle_data_science.pdf'
  },
  {
    id: 'oracle-genai',
    title: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional',
    issuer: 'Oracle',
    category: 'AI & Machine Learning',
    issued_on: '31 October 2025',
    valid_until: '31 October 2027',
    credential_id: '103041833OCI25GAIOCP',
    file_url: '/certificates/oracle_gen_ai.pdf'
  },
  {
    id: 'accenture-da',
    title: 'Data Analytics and Visualization Job Simulation',
    issuer: 'Accenture / Forage',
    category: 'Data Analytics',
    issued_on: '25 March 2025',
    credential_id: 'j4W6Jwg6KDLBwpN7K',
    file_url: '/certificates/ACCENTURE_Data Analytics and Visualization Job Simulation.pdf'
  },
  {
    id: 'deloitte-forage',
    title: 'Data Analytics Job Simulation',
    issuer: 'Deloitte / Forage',
    category: 'Data Analytics',
    issued_on: '11 July 2025',
    credential_id: '8G3ngyS4JQs6ootwW',
    file_url: '/certificates/DELOITTE_Data Analytics Job Simulation.pdf'
  },
  {
    id: 'tata-dv',
    title: 'Data Visualisation: Empowering Business with Effective Insights',
    issuer: 'TATA / Forage',
    category: 'Data Analytics',
    issued_on: '14 March 2025',
    credential_id: 'mZKrraFYAPgCBbsLF',
    file_url: '/certificates/TATA_Data Visualisation- Empowering Business with Effective Insights.pdf'
  },
  {
    id: 'hp-life',
    title: 'Data Science & Analytics',
    issuer: 'HP LIFE',
    category: 'Data Analytics',
    issued_on: '11 July 2025',
    credential_id: 'ea677188-9f1d-4aaf-9ac4-fcc7926b28fe',
    file_url: '/certificates/hp_certificate.pdf'
  },
  {
    id: 'mits-aiml',
    title: 'Certificate of Internship Completion — AI/ML Intern',
    issuer: 'Micro Information Technology Services',
    category: 'AI & Machine Learning',
    issued_on: '06 June 2025',
    credential_id: 'MITS066641',
    file_url: '/certificates/ai&ml_certificate.pdf'
  },
  {
    id: 'nptel-da',
    title: 'Data Analytics with Python',
    issuer: 'NPTEL',
    category: 'Data Analytics',
    issued_on: 'Jan–Apr 2024',
    credential_id: 'NPTEL24CS20S969902814',
    file_url: '/certificates/NPTEL_DATA analystics with python.jpeg'
  },
  {
    id: 'nptel-jocp',
    title: 'The Joy of Computing Using Python',
    issuer: 'NPTEL',
    category: 'Programming',
    issued_on: 'Jul–Oct 2023',
    credential_id: 'NPTEL23CS108S34980493',
    file_url: '/certificates/NPTEL_joy of computing using pyton.jpeg'
  },
  {
    id: 'bist-ml-intern',
    title: 'Certificate of Internship — Machine Learning',
    issuer: 'BIST Technologies Private Limited',
    category: 'AI & Machine Learning',
    issued_on: 'June 2024',
    file_url: '/certificates/bist_technologies_internship.jpeg'
  },
  {
    id: 'smart-iot-intern',
    title: 'Certificate of Internship — Artificial Intelligence & Internet of Things (AI & IoT)',
    issuer: 'Smart Home & Industrial Solutions',
    category: 'AI & Machine Learning',
    issued_on: '28 June 2025',
    file_url: '/certificates/internship_smart home&industrial solutions.jpeg'
  },
  {
    id: 'pantech-powerbi',
    title: 'Internship on Power BI (30 Days)',
    issuer: 'Pantech Solutions / Pantech Prolabs',
    category: 'Data Analytics',
    issued_on: '04 August 2026',
    file_url: '/certificates/Internship_on_Power_BI_.pdf'
  },
  {
    id: 'brain-ovision-ds',
    title: 'One Week Workshop on Data Science Using Python',
    issuer: 'Brain O Vision & LBRCE',
    category: 'Data Analytics',
    issued_on: '30 Oct – 04 Nov 2023',
    file_url: '/certificates/hackthon_data science using python.jpeg'
  },
  {
    id: 'lbrce-flask',
    title: 'One Week Workshop on Building Realtime Web Application Using Python Flask',
    issuer: 'LBRCE',
    category: 'Programming',
    issued_on: '09 Dec – 14 Dec 2024',
    file_url: '/certificates/hackthon_using pyton flask.jpeg'
  },
  {
    id: 'officemaster-powerbi',
    title: 'Power BI Workshop — Certificate of Completion',
    issuer: 'OfficeMaster',
    category: 'Data Analytics',
    issued_on: '20 July 2025',
    file_url: '/certificates/workshop_powerbi.jpeg'
  },
  {
    id: 'prakruthi-3rd',
    title: '3rd Prize in Paper Presentation — Global Recycling Day',
    issuer: 'PRAKRUTHI / LBRCE',
    category: 'Achievements',
    issued_on: 'March 2025',
    file_url: '/certificates/3rdprize.jpeg'
  },
  {
    id: 'lakshya-promptmaster',
    title: 'Certificate of Participation — Prompt Master, Lakshya-2K24',
    issuer: 'Lakshya-2K24 / LBRCE',
    category: 'Workshops & Events',
    issued_on: '01 March 2024',
    file_url: '/certificates/participation_1.jpeg'
  },
  {
    id: 'techno-fiesta',
    title: 'Certificate of Appreciation — Preliminary Round, Techno Fiesta',
    issuer: "CIS'SOIRÉE-2024",
    category: 'Workshops & Events',
    issued_on: '28 December 2024',
    file_url: '/certificates/participation_2.jpeg'
  },
  {
    id: 'nexoria-2k24',
    title: 'Certificate of Participation — NEXORIA 2K24',
    issuer: 'NEXORIA 2K24',
    category: 'Workshops & Events',
    issued_on: '04 October 2024',
    file_url: '/certificates/participation_3.jpeg'
  },
  {
    id: 'gandhi-quiz',
    title: 'Certificate of Participation — Quiz, Spoorthi',
    issuer: 'Gandhi Jayanti / Spoorthi',
    category: 'Workshops & Events',
    file_url: '/certificates/participation_4.jpeg'
  },
  {
    id: 'sports-cricket',
    title: 'Certificate of Participation in Sports — Cricket',
    issuer: 'LBRCE Sports',
    category: 'Sports & Extra-Curricular',
    issued_on: 'Academic Year 2024–2025',
    file_url: '/certificates/sports_certificate.jpeg'
  }
];

export const experience: ExperienceItem[] = [
  {
    role: 'AI/IoT Intern — Smart Robotic Vehicle Development',
    company: 'Smart Home and Industrial Solutions',
    period: 'May 2025 – June 2025',
    location: 'Vijayawada, India',
    description: 'Worked on an AI-powered robotic vehicle using Raspberry Pi and ultrasonic sensors, including navigation, voice-command automation, and surveillance features.'
  },
  {
    role: 'Machine Learning Intern',
    company: 'Bist Technologies',
    period: 'June 2024 – July 2024',
    location: 'Vijayawada, India',
    description: 'Worked on a face-orientation model classifying left, center, and right orientations and contributed to preprocessing, model training, and evaluation workflows.'
  }
];

export const education: EducationItem[] = [
  {
    institution: 'Lakireddy Bali Reddy College of Engineering',
    degree: 'B.Tech, Artificial Intelligence and Data Science',
    period: '2022–2026',
    grade: 'CGPA: 7.35',
    certificate_url: '/certificates/btech_certificate_27_06_2026.jpeg',
    issued_on: '27 June 2026'
  },
  {
    institution: 'Sri Sarada Junior College, Nuzvid',
    degree: 'Intermediate (MPC)',
    period: '2022',
    grade: '66.6%',
    certificate_url: '/certificates/inter_certificate_22_06_2022.jpeg',
    issued_on: '22 June 2022'
  },
  {
    institution: 'Leah Jones High School',
    degree: 'SSC',
    period: '2020',
    grade: '99.33%',
    certificate_url: '/certificates/10th_certificate_06_08_2021.jpeg',
    issued_on: '06 August 2021'
  }
];

export const achievements: string[] = [
  'Third prize in Paper Presentation on Global Recycling Day, PRAKRUTHI (March 2025).',
  'Participated in ideathons, hackathons, and technical club events at LBRCE.',
  'Workshop and hackathon on Data Science using Python with BRAIN O Vision (2022).',
  'Workshop and hackathon on Python using Flask at LBRCE (2025).',
  'Volunteered in college-level data analytics workshops and peer mentoring sessions.'
];
