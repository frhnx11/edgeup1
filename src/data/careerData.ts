// Comprehensive Career Path Data for Indian Students
import type { CareerData } from '../types/career';

export const careerPathsData: Record<string, CareerData> = {
  'software-engineer': {
    id: 'software-engineer',
    name: 'Software Engineer',
    icon: 'fa-laptop-code',
    color: '#3b82f6',
    match: 92,
    tagline: 'Build innovative software solutions and shape the digital future',
    timeline: [
      {
        year: 'Class 11-12',
        title: 'Foundation',
        description: 'Focus on PCM stream with computer science',
        icon: 'fa-book'
      },
      {
        year: 'Year 1-2',
        title: 'Entrance Prep',
        description: 'Prepare for JEE Main/Advanced',
        icon: 'fa-pencil-alt'
      },
      {
        year: 'Year 3-6',
        title: 'B.Tech',
        description: 'Computer Science Engineering degree',
        icon: 'fa-graduation-cap'
      },
      {
        year: 'Year 7-9',
        title: 'Career Growth',
        description: 'Software Engineer to Senior Engineer',
        icon: 'fa-briefcase'
      },
      {
        year: 'Year 10+',
        title: 'Leadership',
        description: 'Tech Lead & Architect roles',
        icon: 'fa-trophy'
      }
    ],
    roadmap: {
      class11_12: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
      entranceExam: 'JEE Main & Advanced / BITSAT / State CETs',
      undergraduate: 'B.Tech in Computer Science Engineering (4 years)',
      postgraduate: 'M.Tech or MS (Optional - 2 years)',
      careerEntry: 'Software Developer / Associate Engineer'
    },
    entranceExams: [
      {
        name: 'JEE Main',
        fullName: 'Joint Entrance Examination Main',
        pattern: 'MCQs + Numerical - Physics, Chemistry, Mathematics',
        duration: '3 hours',
        dates: 'January & April (Twice a year)',
        tips: [
          'Start preparation from Class 11',
          'Focus on NCERT thoroughly for basics',
          'Practice previous 10 years papers',
          'Take regular mock tests',
          'Maintain equal focus on all three subjects'
        ],
        resources: [
          'NCERT Books',
          'HC Verma Physics',
          'RD Sharma Maths',
          'Previous Year Papers'
        ]
      },
      {
        name: 'JEE Advanced',
        fullName: 'Joint Entrance Examination Advanced',
        pattern: 'MCQs + Numerical (Advanced Level)',
        duration: '6 hours (2 papers)',
        dates: 'May (After JEE Main)',
        tips: [
          'Top 2.5 lakh JEE Main rankers eligible',
          'More conceptual and challenging',
          'Strong fundamentals required',
          'Practice IIT-level questions'
        ],
        resources: [
          'Cengage Series',
          'Arihant Series',
          'IIT Past Papers',
          'Online Test Platforms'
        ]
      }
    ],
    topColleges: [
      {
        name: 'IIT Bombay',
        location: 'Mumbai, Maharashtra',
        fees: '₹2-3 lakhs/year',
        cutoff: 'JEE Adv Rank: 1-100',
        placement: '₹20-30 LPA',
        ranking: 'NIRF #3'
      },
      {
        name: 'IIT Delhi',
        location: 'New Delhi',
        fees: '₹2-3 lakhs/year',
        cutoff: 'JEE Adv Rank: 50-150',
        placement: '₹18-25 LPA',
        ranking: 'NIRF #2'
      },
      {
        name: 'BITS Pilani',
        location: 'Pilani, Rajasthan',
        fees: '₹4-5 lakhs/year',
        cutoff: 'BITSAT: 320+/450',
        placement: '₹15-20 LPA',
        ranking: 'NIRF #30'
      },
      {
        name: 'NIT Trichy',
        location: 'Tiruchirappalli, TN',
        fees: '₹1.5-2 lakhs/year',
        cutoff: 'JEE Main: 2000-5000',
        placement: '₹12-18 LPA',
        ranking: 'NIRF #10'
      },
      {
        name: 'IIIT Hyderabad',
        location: 'Hyderabad, Telangana',
        fees: '₹2-3 lakhs/year',
        cutoff: 'JEE Main: 1000-3000',
        placement: '₹18-25 LPA',
        ranking: 'NIRF #68'
      }
    ],
    skills: {
      technical: [
        'Programming Languages (Python, Java, C++)',
        'Data Structures & Algorithms',
        'Web Development (HTML, CSS, JavaScript)',
        'Database Management (SQL, NoSQL)',
        'Version Control (Git)',
        'Cloud Computing Basics'
      ],
      subjects: [
        'Mathematics - Strong focus on Algebra & Calculus',
        'Physics - Especially mechanics & electronics',
        'Computer Science - Programming fundamentals'
      ],
      certifications: [
        'AWS Certified Developer',
        'Google Cloud Professional',
        'Microsoft Azure Fundamentals',
        'Oracle Java Certification',
        'Full Stack Development Courses'
      ],
      softSkills: [
        'Problem Solving & Logical Thinking',
        'Team Collaboration',
        'Communication Skills',
        'Time Management',
        'Continuous Learning Mindset'
      ]
    },
    progression: [
      {
        title: 'Junior Software Engineer',
        years: '0-2 years',
        salary: '₹4-8 LPA',
        responsibilities: [
          'Write clean, maintainable code',
          'Bug fixing and testing',
          'Learn from senior developers',
          'Work on small features'
        ]
      },
      {
        title: 'Software Engineer',
        years: '2-4 years',
        salary: '₹8-15 LPA',
        responsibilities: [
          'Develop complete features',
          'Code reviews',
          'Mentor junior developers',
          'System design basics'
        ]
      },
      {
        title: 'Senior Software Engineer',
        years: '4-7 years',
        salary: '₹15-30 LPA',
        responsibilities: [
          'Lead complex projects',
          'Architecture decisions',
          'Technical mentorship',
          'Stakeholder management'
        ]
      },
      {
        title: 'Tech Lead / Architect',
        years: '7-10 years',
        salary: '₹30-60 LPA',
        responsibilities: [
          'Team leadership',
          'System architecture',
          'Technical strategy',
          'Cross-team collaboration'
        ]
      },
      {
        title: 'Engineering Manager',
        years: '10+ years',
        salary: '₹50-100+ LPA',
        responsibilities: [
          'Team management',
          'Product strategy',
          'Hiring & mentoring',
          'Business alignment'
        ]
      }
    ],
    marketInsights: {
      demand: 'High' as const,
      growth: '+15-20%/year',
      startingSalary: '₹4-8 LPA',
      experiencedSalary: '₹15-50 LPA'
    },
    checklist: {
      immediate: [
        'Focus on Mathematics & Computer Science',
        'Start basic coding practice',
        'Join online coding platforms',
        'Build strong PCM foundation'
      ],
      shortTerm: [
        'Register for JEE Main coaching',
        'Practice coding daily (1-2 hours)',
        'Build small projects (calculator, games)',
        'Participate in coding competitions',
        'Complete Class 12 with 90%+ marks'
      ],
      longTerm: [
        'Clear JEE Main/Advanced with good rank',
        'Join top engineering college',
        'Complete internships during UG',
        'Build strong GitHub portfolio',
        'Prepare for campus placements'
      ]
    },
    resources: [
      {
        name: 'JEE Official Website',
        url: 'https://jeemain.nta.nic.in',
        type: 'Official' as const
      },
      {
        name: 'Coursera - CS Courses',
        url: 'https://www.coursera.org',
        type: 'Learning' as const
      },
      {
        name: 'LeetCode - Coding Practice',
        url: 'https://leetcode.com',
        type: 'Learning' as const
      },
      {
        name: 'Stack Overflow Community',
        url: 'https://stackoverflow.com',
        type: 'Community' as const
      },
      {
        name: 'Career Guidance Portal',
        url: 'https://www.careers360.com',
        type: 'Counseling' as const
      },
      {
        name: 'GitHub - Portfolio Building',
        url: 'https://github.com',
        type: 'Learning' as const
      }
    ]
  },

  'medical-doctor': {
    id: 'medical-doctor',
    name: 'Medical Doctor',
    icon: 'fa-user-md',
    color: '#10b981',
    match: 90,
    tagline: 'Serve humanity by healing and saving lives',
    timeline: [
      {
        year: 'Class 11-12',
        title: 'Foundation',
        description: 'Focus on PCB stream with Biology',
        icon: 'fa-book'
      },
      {
        year: 'Year 1-2',
        title: 'NEET Prep',
        description: 'Prepare for NEET-UG examination',
        icon: 'fa-pencil-alt'
      },
      {
        year: 'Year 3-7.5',
        title: 'MBBS',
        description: '5.5 years medical degree + internship',
        icon: 'fa-graduation-cap'
      },
      {
        year: 'Year 8-10',
        title: 'Specialization',
        description: 'MD/MS post-graduation',
        icon: 'fa-stethoscope'
      },
      {
        year: 'Year 11+',
        title: 'Practice',
        description: 'Consultant/Senior Doctor',
        icon: 'fa-hospital'
      }
    ],
    roadmap: {
      class11_12: ['Physics', 'Chemistry', 'Biology', 'English'],
      entranceExam: 'NEET-UG (National Eligibility cum Entrance Test)',
      undergraduate: 'MBBS (Bachelor of Medicine & Surgery) - 5.5 years',
      postgraduate: 'MD (Doctor of Medicine) or MS (Master of Surgery) - 3 years',
      careerEntry: 'Junior Resident / Medical Officer'
    },
    entranceExams: [
      {
        name: 'NEET-UG',
        fullName: 'National Eligibility cum Entrance Test - Under Graduate',
        pattern: 'MCQs - Physics (45), Chemistry (45), Biology (90)',
        duration: '3 hours 20 minutes',
        dates: 'May (Once a year)',
        tips: [
          'NCERT is the bible for NEET - master it completely',
          'Biology carries double weightage - focus heavily',
          'Practice 10+ years of previous papers',
          'Accuracy is crucial - negative marking exists',
          'Join a good test series for practice'
        ],
        resources: [
          'NCERT Biology (11th & 12th)',
          'NCERT Physics & Chemistry',
          'Previous Year Papers',
          'Arihant NEET Guide',
          'MTG NEET Series'
        ]
      }
    ],
    topColleges: [
      {
        name: 'AIIMS Delhi',
        location: 'New Delhi',
        fees: '₹1,500/year (Govt)',
        cutoff: 'NEET: 680-700/720',
        placement: 'N/A (Govt Jobs)',
        ranking: 'NIRF #1'
      },
      {
        name: 'CMC Vellore',
        location: 'Vellore, Tamil Nadu',
        fees: '₹80,000/year',
        cutoff: 'NEET: 650+/720',
        placement: 'Excellent reputation',
        ranking: 'NIRF #5'
      },
      {
        name: 'JIPMER Puducherry',
        location: 'Puducherry',
        fees: 'Free (Govt)',
        cutoff: 'NEET: 640+/720',
        placement: 'Govt medical services',
        ranking: 'NIRF #7'
      },
      {
        name: 'Madras Medical College',
        location: 'Chennai, Tamil Nadu',
        fees: '₹3,000/year (Govt)',
        cutoff: 'NEET: 600+/720 (TN quota)',
        placement: 'State medical services',
        ranking: 'State #1'
      },
      {
        name: 'Kasturba Medical College',
        location: 'Manipal, Karnataka',
        fees: '₹18-22 lakhs/year',
        cutoff: 'NEET: 550+/720',
        placement: 'Hospital placements',
        ranking: 'NIRF #17'
      }
    ],
    skills: {
      technical: [
        'Human Anatomy & Physiology',
        'Pathology & Microbiology',
        'Pharmacology & Therapeutics',
        'Clinical Diagnosis',
        'Surgical Techniques',
        'Medical Research Methods'
      ],
      subjects: [
        'Biology - Botany & Zoology (Most Important)',
        'Chemistry - Organic & Inorganic',
        'Physics - Biophysics concepts'
      ],
      certifications: [
        'BLS (Basic Life Support)',
        'ACLS (Advanced Cardiac Life Support)',
        'USMLE (For US practice)',
        'Specialty Board Certifications',
        'Medical Council Registration'
      ],
      softSkills: [
        'Empathy & Patient Care',
        'Strong Communication',
        'Stress Management',
        'Decision Making Under Pressure',
        'Continuous Medical Learning'
      ]
    },
    progression: [
      {
        title: 'Junior Resident',
        years: '0-2 years',
        salary: '₹50,000-80,000/month',
        responsibilities: [
          'Patient care under supervision',
          'Emergency duty rotations',
          'Learning clinical skills',
          'Assisting senior doctors'
        ]
      },
      {
        title: 'Medical Officer',
        years: '2-4 years',
        salary: '₹6-10 LPA',
        responsibilities: [
          'Independent patient treatment',
          'OPD consultations',
          'Emergency management',
          'Report documentation'
        ]
      },
      {
        title: 'Senior Resident / MD/MS',
        years: '4-7 years',
        salary: '₹10-15 LPA',
        responsibilities: [
          'Specialized treatment',
          'Teaching medical students',
          'Research work',
          'Complex case management'
        ]
      },
      {
        title: 'Consultant Doctor',
        years: '7-12 years',
        salary: '₹15-40 LPA',
        responsibilities: [
          'Expert consultations',
          'Specialized procedures',
          'Department management',
          'Clinical research'
        ]
      },
      {
        title: 'Senior Consultant / HOD',
        years: '12+ years',
        salary: '₹40-100+ LPA',
        responsibilities: [
          'Department leadership',
          'Complex surgeries',
          'Medical education',
          'Hospital administration'
        ]
      }
    ],
    marketInsights: {
      demand: 'High' as const,
      growth: '+10-12%/year',
      startingSalary: '₹6-10 LPA',
      experiencedSalary: '₹15-50 LPA'
    },
    checklist: {
      immediate: [
        'Master NCERT Biology completely',
        'Build strong PCB foundation',
        'Start human body system studies',
        'Practice NEET sample papers'
      ],
      shortTerm: [
        'Join reputed NEET coaching',
        'Complete NCERT 3 times minimum',
        'Solve 10 years previous papers',
        'Take weekly mock tests',
        'Score 95%+ in Class 12 board'
      ],
      longTerm: [
        'Clear NEET with 650+ score',
        'Secure admission in top medical college',
        'Excel in MBBS clinical years',
        'Complete 1-year internship',
        'Prepare for MD/MS entrance'
      ]
    },
    resources: [
      {
        name: 'NEET Official Website',
        url: 'https://neet.nta.nic.in',
        type: 'Official' as const
      },
      {
        name: 'Medical Council of India',
        url: 'https://www.nmc.org.in',
        type: 'Official' as const
      },
      {
        name: 'Marrow Medical Learning',
        url: 'https://www.marrow.me',
        type: 'Learning' as const
      },
      {
        name: 'Medscape - Medical Resource',
        url: 'https://www.medscape.com',
        type: 'Learning' as const
      },
      {
        name: 'NEET Preparation Forum',
        url: 'https://www.pagalguy.com/neet',
        type: 'Community' as const
      },
      {
        name: 'Medical Career Counseling',
        url: 'https://www.collegedekho.com',
        type: 'Counseling' as const
      }
    ]
  },

  'data-scientist': {
    id: 'data-scientist',
    name: 'Data Scientist',
    icon: 'fa-chart-bar',
    color: '#8b5cf6',
    match: 88,
    tagline: 'Transform data into insights and drive business decisions',
    timeline: [
      {
        year: 'Class 11-12',
        title: 'Foundation',
        description: 'Focus on PCM with Statistics',
        icon: 'fa-book'
      },
      {
        year: 'Year 1-2',
        title: 'Entrance Prep',
        description: 'Prepare for JEE/entrance exams',
        icon: 'fa-pencil-alt'
      },
      {
        year: 'Year 3-6',
        title: 'B.Tech/B.Sc',
        description: 'CS/Stats/Maths degree',
        icon: 'fa-graduation-cap'
      },
      {
        year: 'Year 7-8',
        title: 'Entry Level',
        description: 'Junior Data Analyst/Scientist',
        icon: 'fa-briefcase'
      },
      {
        year: 'Year 9+',
        title: 'Senior Roles',
        description: 'Lead Data Scientist',
        icon: 'fa-trophy'
      }
    ],
    roadmap: {
      class11_12: ['Physics', 'Chemistry', 'Mathematics', 'Statistics (if available)'],
      entranceExam: 'JEE Main / State CETs / University Entrance',
      undergraduate: 'B.Tech (CS/IT) or B.Sc (Statistics/Maths) - 3-4 years',
      postgraduate: 'M.Sc Data Science / MBA Analytics - 2 years',
      careerEntry: 'Data Analyst / Junior Data Scientist'
    },
    entranceExams: [
      {
        name: 'JEE Main',
        fullName: 'Joint Entrance Examination Main',
        pattern: 'MCQs + Numerical - Physics, Chemistry, Mathematics',
        duration: '3 hours',
        dates: 'January & April',
        tips: [
          'Strong mathematics foundation crucial',
          'Statistics knowledge is a plus',
          'Focus on probability and calculus',
          'Practice analytical problems'
        ],
        resources: [
          'NCERT Mathematics',
          'RD Sharma',
          'Previous Year Papers',
          'Statistics Textbooks'
        ]
      }
    ],
    topColleges: [
      {
        name: 'IIT Madras',
        location: 'Chennai, Tamil Nadu',
        fees: '₹2-3 lakhs/year',
        cutoff: 'JEE Adv: 200-500',
        placement: '₹18-30 LPA',
        ranking: 'NIRF #1'
      },
      {
        name: 'ISI Kolkata',
        location: 'Kolkata, West Bengal',
        fees: '₹50,000/year',
        cutoff: 'ISI Entrance Exam',
        placement: '₹15-25 LPA',
        ranking: 'Top Stats Institute'
      },
      {
        name: 'IIIT Bangalore',
        location: 'Bangalore, Karnataka',
        fees: '₹3-4 lakhs/year',
        cutoff: 'PGEE Entrance',
        placement: '₹20-35 LPA',
        ranking: 'NIRF #82'
      },
      {
        name: 'IIM Bangalore (MBA Analytics)',
        location: 'Bangalore, Karnataka',
        fees: '₹24 lakhs (Total)',
        cutoff: 'CAT: 99+ percentile',
        placement: '₹25-40 LPA',
        ranking: 'NIRF #1 (MBA)'
      },
      {
        name: 'BITS Pilani',
        location: 'Pilani, Rajasthan',
        fees: '₹4-5 lakhs/year',
        cutoff: 'BITSAT: 300+',
        placement: '₹15-25 LPA',
        ranking: 'NIRF #30'
      }
    ],
    skills: {
      technical: [
        'Python Programming & Libraries (NumPy, Pandas)',
        'Machine Learning Algorithms',
        'Statistical Analysis & Modeling',
        'Data Visualization (Tableau, PowerBI)',
        'SQL & Database Management',
        'Big Data Technologies (Hadoop, Spark)'
      ],
      subjects: [
        'Mathematics - Statistics, Probability, Calculus',
        'Computer Science - Programming, Algorithms',
        'Business Studies - Domain knowledge'
      ],
      certifications: [
        'Google Data Analytics Professional',
        'IBM Data Science Professional',
        'Microsoft Certified: Azure Data Scientist',
        'AWS Machine Learning Specialty',
        'TensorFlow Developer Certificate'
      ],
      softSkills: [
        'Analytical Thinking',
        'Business Acumen',
        'Data Storytelling',
        'Collaboration with Teams',
        'Curiosity & Research Mindset'
      ]
    },
    progression: [
      {
        title: 'Junior Data Analyst',
        years: '0-2 years',
        salary: '₹4-7 LPA',
        responsibilities: [
          'Data cleaning and preparation',
          'Basic statistical analysis',
          'Creating reports and dashboards',
          'Supporting senior analysts'
        ]
      },
      {
        title: 'Data Analyst',
        years: '2-4 years',
        salary: '₹7-12 LPA',
        responsibilities: [
          'Complex data analysis',
          'Building predictive models',
          'Business insights generation',
          'Stakeholder presentations'
        ]
      },
      {
        title: 'Data Scientist',
        years: '4-6 years',
        salary: '₹12-25 LPA',
        responsibilities: [
          'ML model development',
          'Advanced analytics',
          'A/B testing & experiments',
          'Cross-functional collaboration'
        ]
      },
      {
        title: 'Senior Data Scientist',
        years: '6-9 years',
        salary: '₹25-45 LPA',
        responsibilities: [
          'Leading data projects',
          'Team mentorship',
          'Strategic decision making',
          'Research & innovation'
        ]
      },
      {
        title: 'Lead Data Scientist / Manager',
        years: '9+ years',
        salary: '₹40-80 LPA',
        responsibilities: [
          'Team leadership',
          'Data strategy',
          'Stakeholder management',
          'Product innovation'
        ]
      }
    ],
    marketInsights: {
      demand: 'High' as const,
      growth: '+25-30%/year',
      startingSalary: '₹4-8 LPA',
      experiencedSalary: '₹15-45 LPA'
    },
    checklist: {
      immediate: [
        'Master Mathematics & Statistics',
        'Learn basic Python programming',
        'Understand probability concepts',
        'Practice data interpretation'
      ],
      shortTerm: [
        'Complete online courses (Coursera, edX)',
        'Work on data analysis projects',
        'Learn Excel & SQL basics',
        'Join coding competitions',
        'Build project portfolio on GitHub'
      ],
      longTerm: [
        'Complete degree in relevant field',
        'Gain internship experience',
        'Master ML algorithms',
        'Build strong analytics portfolio',
        'Network with data professionals'
      ]
    },
    resources: [
      {
        name: 'Kaggle - Competitions',
        url: 'https://www.kaggle.com',
        type: 'Learning' as const
      },
      {
        name: 'Coursera - Data Science',
        url: 'https://www.coursera.org/specializations/jhu-data-science',
        type: 'Learning' as const
      },
      {
        name: 'Analytics Vidhya',
        url: 'https://www.analyticsvidhya.com',
        type: 'Community' as const
      },
      {
        name: 'DataCamp - Practice',
        url: 'https://www.datacamp.com',
        type: 'Learning' as const
      },
      {
        name: 'Towards Data Science',
        url: 'https://towardsdatascience.com',
        type: 'Community' as const
      },
      {
        name: 'Career in Analytics',
        url: 'https://www.shiksha.com',
        type: 'Counseling' as const
      }
    ]
  }
};
