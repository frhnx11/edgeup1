// Internship and Summer Programs Data
import type { InternshipProgram } from '../types/portfolio';

export const internshipPrograms: InternshipProgram[] = [
  {
    id: 'prog-1',
    title: 'Google Code-in (GCI) - Open Source Program',
    organization: 'Google',
    type: 'summer-program',
    duration: '7-8 weeks',
    location: 'Remote',
    mode: 'online',
    eligibility: {
      minGrade: 9,
      maxGrade: 12,
      stream: 'Any'
    },
    category: 'technology',
    description: 'Introduce pre-university students to open source development. Work on tasks like code, documentation, design, and outreach for various open source organizations.',
    skills: ['Programming', 'Open Source', 'Git', 'Documentation'],
    deadline: '2025-11-30',
    featured: true,
    website: 'https://codein.withgoogle.com'
  },
  {
    id: 'prog-2',
    title: 'KVPY Summer Fellowship Program',
    organization: 'IISc Bangalore',
    type: 'summer-program',
    duration: '4 weeks',
    location: 'Bangalore',
    mode: 'offline',
    eligibility: {
      minGrade: 11,
      maxGrade: 12,
      stream: 'Science'
    },
    category: 'science',
    description: 'Research-oriented summer program for students passionate about science. Work on cutting-edge research projects under IISc faculty guidance.',
    skills: ['Research Skills', 'Scientific Method', 'Laboratory Work', 'Data Analysis'],
    deadline: '2025-05-15',
    stipend: '₹5,000/month',
    featured: true,
    website: 'https://iisc.ac.in/summer-programs'
  },
  {
    id: 'prog-3',
    title: 'Microsoft Garage Internship',
    organization: 'Microsoft',
    type: 'internship',
    duration: '8-12 weeks',
    location: 'Hyderabad',
    mode: 'hybrid',
    eligibility: {
      minGrade: 11,
      maxGrade: 12,
      stream: 'Science'
    },
    category: 'technology',
    description: 'Work on innovative tech projects at Microsoft. Learn from industry experts and collaborate with global teams on real-world products.',
    skills: ['Programming', 'Problem Solving', 'Team Collaboration', 'Product Development'],
    deadline: '2025-03-30',
    stipend: '₹15,000-25,000/month',
    featured: true,
    website: 'https://microsoft.com/garage'
  },
  {
    id: 'prog-4',
    title: 'Adobe Creative Camp',
    organization: 'Adobe',
    type: 'workshop',
    duration: '2 weeks',
    location: 'Bangalore',
    mode: 'offline',
    eligibility: {
      minGrade: 9,
      maxGrade: 12,
      stream: 'Any'
    },
    category: 'arts',
    description: 'Learn design thinking, UI/UX, and creative tools from Adobe experts. Create portfolio-worthy projects and get certified.',
    skills: ['Design', 'Photoshop', 'Illustrator', 'Creative Thinking'],
    deadline: '2025-06-01',
    featured: false,
    website: 'https://adobe.com/creativecamp'
  },
  {
    id: 'prog-5',
    title: 'IISER Summer Research Program',
    organization: 'IISER Pune',
    type: 'research',
    duration: '6-8 weeks',
    location: 'Pune',
    mode: 'offline',
    eligibility: {
      minGrade: 11,
      maxGrade: 12,
      stream: 'Science'
    },
    category: 'research',
    description: 'Conduct research in Biology, Chemistry, Physics, or Mathematics under IISER faculty. Publish findings and present at symposiums.',
    skills: ['Research Methodology', 'Scientific Writing', 'Laboratory Techniques', 'Critical Thinking'],
    deadline: '2025-04-20',
    stipend: '₹3,000/month',
    featured: true,
    website: 'https://iiserpune.ac.in/summer-research'
  },
  {
    id: 'prog-6',
    title: 'TCS IT Wiz Workshop',
    organization: 'Tata Consultancy Services',
    type: 'workshop',
    duration: '1 week',
    location: 'Multiple Cities',
    mode: 'offline',
    eligibility: {
      minGrade: 8,
      maxGrade: 10,
      stream: 'Any'
    },
    category: 'technology',
    description: 'Interactive workshop on technology trends, coding basics, and problem-solving. Participate in quizzes and win prizes.',
    skills: ['General Knowledge', 'Technology Trends', 'Coding Basics', 'Quiz'],
    deadline: '2025-09-15',
    featured: false,
    website: 'https://tcs.com/itwiz'
  },
  {
    id: 'prog-7',
    title: 'NASA Space School India',
    organization: 'NASA & Space Foundation',
    type: 'summer-program',
    duration: '10 days',
    location: 'Bangalore',
    mode: 'offline',
    eligibility: {
      minGrade: 9,
      maxGrade: 12,
      stream: 'Science'
    },
    category: 'science',
    description: 'Experience astronaut training, rocket science, and space exploration. Build and launch model rockets with guidance from NASA experts.',
    skills: ['Aerospace', 'Physics', 'Engineering Design', 'Teamwork'],
    deadline: '2025-05-31',
    stipend: 'Program Fee: ₹75,000',
    featured: true,
    website: 'https://spacefoundation.org/india'
  },
  {
    id: 'prog-8',
    title: 'Indian School of Business - Young Leaders Program',
    organization: 'ISB Hyderabad',
    type: 'summer-program',
    duration: '2 weeks',
    location: 'Hyderabad',
    mode: 'offline',
    eligibility: {
      minGrade: 10,
      maxGrade: 12,
      stream: 'Any'
    },
    category: 'business',
    description: 'Learn entrepreneurship, leadership, and business strategy. Work on case studies, pitch business ideas, and network with industry leaders.',
    skills: ['Leadership', 'Business Strategy', 'Entrepreneurship', 'Presentation'],
    deadline: '2025-04-30',
    stipend: 'Program Fee: ₹40,000',
    featured: false,
    website: 'https://isb.edu/ylp'
  },
  {
    id: 'prog-9',
    title: 'IBM SkillsBuild AI Workshop',
    organization: 'IBM',
    type: 'workshop',
    duration: '4 weeks (online)',
    location: 'Remote',
    mode: 'online',
    eligibility: {
      minGrade: 9,
      maxGrade: 12,
      stream: 'Any'
    },
    category: 'technology',
    description: 'Learn AI and Machine Learning fundamentals. Build projects using IBM Watson and earn industry-recognized certificates.',
    skills: ['AI Basics', 'Machine Learning', 'Python', 'IBM Watson'],
    deadline: '2025-12-31',
    featured: true,
    website: 'https://skillsbuild.org'
  },
  {
    id: 'prog-10',
    title: 'NITI Aayog Atal Innovation Mission',
    organization: 'NITI Aayog',
    type: 'bootcamp',
    duration: '3 days',
    location: 'Delhi',
    mode: 'offline',
    eligibility: {
      minGrade: 8,
      maxGrade: 12,
      stream: 'Any'
    },
    category: 'technology',
    description: 'Innovation bootcamp focused on problem-solving and product development. Build prototypes and present solutions to real-world challenges.',
    skills: ['Innovation', 'Problem Solving', 'Prototyping', 'Presentation'],
    deadline: '2025-08-15',
    featured: false,
    website: 'https://aim.gov.in'
  },
  {
    id: 'prog-11',
    title: 'Robotics Summer Camp by IIT Bombay',
    organization: 'IIT Bombay',
    type: 'summer-program',
    duration: '3 weeks',
    location: 'Mumbai',
    mode: 'offline',
    eligibility: {
      minGrade: 9,
      maxGrade: 12,
      stream: 'Science'
    },
    category: 'technology',
    description: 'Learn robotics, Arduino programming, and automation. Build and program robots to compete in challenges.',
    skills: ['Robotics', 'Arduino', 'Programming', 'Mechatronics'],
    deadline: '2025-05-10',
    stipend: 'Program Fee: ₹25,000',
    featured: true,
    website: 'https://iitb.ac.in/robotics-camp'
  },
  {
    id: 'prog-12',
    title: 'Wildlife Conservation Internship',
    organization: 'WWF India',
    type: 'internship',
    duration: '4 weeks',
    location: 'Various Sanctuaries',
    mode: 'offline',
    eligibility: {
      minGrade: 10,
      maxGrade: 12,
      stream: 'Science'
    },
    category: 'science',
    description: 'Work with wildlife conservationists on field projects. Study animal behavior, conservation strategies, and environmental protection.',
    skills: ['Conservation', 'Field Research', 'Environmental Science', 'Photography'],
    deadline: '2025-06-30',
    stipend: 'Accommodation provided',
    featured: false,
    website: 'https://wwfindia.org/internship'
  },
  {
    id: 'prog-13',
    title: 'Amazon Future Engineer Program',
    organization: 'Amazon',
    type: 'internship',
    duration: '6-8 weeks',
    location: 'Bangalore/Hyderabad',
    mode: 'hybrid',
    eligibility: {
      minGrade: 11,
      maxGrade: 12,
      stream: 'Science'
    },
    category: 'technology',
    description: 'Software development internship at Amazon. Work on real projects, learn cloud computing, and get mentorship from Amazon engineers.',
    skills: ['Programming', 'Cloud Computing', 'Software Development', 'AWS'],
    deadline: '2025-02-28',
    stipend: '₹20,000-30,000/month',
    featured: true,
    website: 'https://amazon.com/future-engineer'
  },
  {
    id: 'prog-14',
    title: 'TEDx Youth Speaker Workshop',
    organization: 'TEDx',
    type: 'workshop',
    duration: '3 days',
    location: 'Mumbai',
    mode: 'offline',
    eligibility: {
      minGrade: 9,
      maxGrade: 12,
      stream: 'Any'
    },
    category: 'social',
    description: 'Learn public speaking, storytelling, and presentation skills. Deliver a TED-style talk and build confidence.',
    skills: ['Public Speaking', 'Storytelling', 'Communication', 'Confidence'],
    deadline: '2025-07-20',
    stipend: 'Program Fee: ₹5,000',
    featured: false,
    website: 'https://tedxyouth.com'
  },
  {
    id: 'prog-15',
    title: 'Zomato Product Intern Program',
    organization: 'Zomato',
    type: 'internship',
    duration: '10 weeks',
    location: 'Gurugram',
    mode: 'hybrid',
    eligibility: {
      minGrade: 12,
      maxGrade: 12,
      stream: 'Any'
    },
    category: 'business',
    description: 'Product management internship. Work with product teams, analyze user data, and contribute to product decisions.',
    skills: ['Product Management', 'Data Analysis', 'User Research', 'Communication'],
    deadline: '2025-03-15',
    stipend: '₹18,000/month',
    featured: false,
    website: 'https://zomato.com/careers'
  },
  {
    id: 'prog-16',
    title: 'Digital Art & Animation Workshop',
    organization: 'MAAC',
    type: 'workshop',
    duration: '2 weeks',
    location: 'Multiple Cities',
    mode: 'offline',
    eligibility: {
      minGrade: 8,
      maxGrade: 12,
      stream: 'Any'
    },
    category: 'arts',
    description: 'Learn 2D/3D animation, digital illustration, and video editing. Create animated short films and build your creative portfolio.',
    skills: ['Animation', 'Digital Art', 'Video Editing', 'Creative Software'],
    deadline: '2025-06-15',
    stipend: 'Program Fee: ₹15,000',
    featured: false,
    website: 'https://maac.in'
  },
  {
    id: 'prog-17',
    title: 'Flipkart Grid 5.0 Hackathon',
    organization: 'Flipkart',
    type: 'bootcamp',
    duration: '48 hours',
    location: 'Bangalore',
    mode: 'offline',
    eligibility: {
      minGrade: 11,
      maxGrade: 12,
      stream: 'Science'
    },
    category: 'technology',
    description: 'National level hackathon. Solve real business challenges, build innovative solutions, and win prizes worth lakhs.',
    skills: ['Coding', 'Problem Solving', 'Innovation', 'Teamwork'],
    deadline: '2025-08-30',
    stipend: 'Prize: ₹5 Lakhs',
    featured: true,
    website: 'https://flipkart.com/grid'
  },
  {
    id: 'prog-18',
    title: 'Bharat Intern - Data Science Program',
    organization: 'Bharat Intern',
    type: 'internship',
    duration: '4 weeks',
    location: 'Remote',
    mode: 'online',
    eligibility: {
      minGrade: 10,
      maxGrade: 12,
      stream: 'Any'
    },
    category: 'technology',
    description: 'Virtual data science internship. Work on real datasets, build machine learning models, and earn completion certificate.',
    skills: ['Data Science', 'Python', 'Machine Learning', 'Data Visualization'],
    deadline: 'Rolling admission',
    featured: false,
    website: 'https://bharatintern.live'
  },
  {
    id: 'prog-19',
    title: 'Social Impact Fellowship',
    organization: 'Ashoka Innovators',
    type: 'summer-program',
    duration: '6 weeks',
    location: 'Delhi',
    mode: 'offline',
    eligibility: {
      minGrade: 10,
      maxGrade: 12,
      stream: 'Any'
    },
    category: 'social',
    description: 'Work on social innovation projects addressing community challenges. Develop leadership and changemaking skills.',
    skills: ['Social Innovation', 'Leadership', 'Community Work', 'Project Management'],
    deadline: '2025-04-10',
    stipend: '₹2,000/month',
    featured: false,
    website: 'https://ashoka.org/india'
  },
  {
    id: 'prog-20',
    title: 'Stanford Pre-Collegiate Summer Program',
    organization: 'Stanford University',
    type: 'summer-program',
    duration: '8 weeks',
    location: 'California, USA',
    mode: 'offline',
    eligibility: {
      minGrade: 10,
      maxGrade: 12,
      stream: 'Any'
    },
    category: 'other',
    description: 'Study at Stanford University. Choose from courses in engineering, humanities, sciences, and arts. Experience college life.',
    skills: ['Academic Excellence', 'Critical Thinking', 'Research', 'Independence'],
    deadline: '2025-03-01',
    stipend: 'Program Fee: $10,000-15,000',
    featured: true,
    website: 'https://summer.stanford.edu'
  }
];

export const getInternshipsByCategory = (category: string) => {
  if (category === 'all') return internshipPrograms;
  return internshipPrograms.filter(prog => prog.category === category);
};

export const getInternshipsByGrade = (grade: number) => {
  return internshipPrograms.filter(
    prog => grade >= prog.eligibility.minGrade && grade <= prog.eligibility.maxGrade
  );
};

export const getFeaturedInternships = () => {
  return internshipPrograms.filter(prog => prog.featured);
};
