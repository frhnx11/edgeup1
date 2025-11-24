// Emerging and Modern Career Paths
import type { CareerData } from '../types/career';

export const emergingCareersData: Record<string, CareerData> = {
  'ai-ml-engineer': {
    id: 'ai-ml-engineer',
    name: 'AI/ML Engineer',
    icon: 'fa-brain',
    color: '#8b5cf6',
    match: 0,
    tagline: 'Build intelligent systems and shape the future of artificial intelligence',
    timeline: [
      { year: 'Class 11-12', title: 'Foundation', description: 'Focus on PCM stream with computer science', icon: 'fa-book' },
      { year: 'Year 1-2', title: 'Entrance Prep', description: 'Prepare for JEE/BITSAT', icon: 'fa-pencil-alt' },
      { year: 'Year 3-6', title: 'B.Tech', description: 'Computer Science/AI specialization', icon: 'fa-graduation-cap' },
      { year: 'Year 7-9', title: 'Career Growth', description: 'ML Engineer to Senior AI Engineer', icon: 'fa-briefcase' },
      { year: 'Year 10+', title: 'Leadership', description: 'AI Architect & Research Lead', icon: 'fa-trophy' }
    ],
    roadmap: {
      class11_12: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
      entranceExam: 'JEE Main/Advanced / BITSAT',
      undergraduate: 'B.Tech in CS/AI/Data Science (4 years)',
      postgraduate: 'M.Tech in AI/ML or MS abroad (2 years)',
      careerEntry: 'ML Engineer / Data Scientist'
    },
    entranceExams: [
      {
        name: 'JEE',
        fullName: 'Joint Entrance Examination',
        pattern: '75 MCQs (Physics, Chemistry, Maths)',
        duration: '3 hours',
        dates: 'January & April',
        tips: ['Strong math foundation', 'Practice coding', 'Understand ML basics'],
        resources: ['JEE Main portal', 'Coursera AI courses', 'Kaggle competitions']
      }
    ],
    topColleges: [
      { name: 'IIT Delhi', location: 'Delhi', fees: '₹2L/year', cutoff: 'JEE Adv. Rank < 500', placement: '₹45 LPA avg', ranking: '1' },
      { name: 'IIIT Hyderabad', location: 'Hyderabad', fees: '₹3.5L/year', cutoff: 'JEE Main Rank < 2000', placement: '₹32 LPA avg', ranking: '3' },
      { name: 'BITS Pilani', location: 'Pilani', fees: '₹5L/year', cutoff: 'BITSAT Score > 350', placement: '₹28 LPA avg', ranking: '5' }
    ],
    skills: {
      technical: ['Python', 'TensorFlow', 'PyTorch', 'Neural Networks', 'Deep Learning', 'NLP', 'Computer Vision'],
      subjects: ['Mathematics', 'Statistics', 'Linear Algebra', 'Probability', 'Algorithms'],
      certifications: ['Google TensorFlow', 'AWS ML Specialty', 'Azure AI Engineer', 'Deep Learning Specialization'],
      softSkills: ['Problem-solving', 'Research mindset', 'Communication', 'Collaboration']
    },
    progression: [
      { title: 'Junior ML Engineer', years: '0-2', salary: '₹8-15 LPA', responsibilities: ['Build ML models', 'Data preprocessing', 'Model training'] },
      { title: 'ML Engineer', years: '2-4', salary: '₹15-25 LPA', responsibilities: ['Design pipelines', 'Optimize models', 'Deploy solutions'] },
      { title: 'Senior AI Engineer', years: '4-7', salary: '₹25-45 LPA', responsibilities: ['Lead AI projects', 'Architect systems', 'Mentor team'] },
      { title: 'AI Architect', years: '7+', salary: '₹45-80+ LPA', responsibilities: ['Strategic planning', 'Research leadership', 'Innovation'] }
    ],
    marketInsights: {
      demand: 'High',
      growth: '+35% annually',
      startingSalary: '₹8-15 LPA',
      experiencedSalary: '₹45-80+ LPA'
    },
    checklist: {
      immediate: ['Learn Python basics', 'Understand statistics', 'Explore Kaggle datasets'],
      shortTerm: ['Complete ML course', 'Build 2-3 projects', 'Participate in competitions'],
      longTerm: ['Master deep learning', 'Publish research paper', 'Contribute to open source']
    },
    resources: [
      { name: 'Coursera ML Course', url: 'https://coursera.org/ml', type: 'Learning' },
      { name: 'Kaggle', url: 'https://kaggle.com', type: 'Community' },
      { name: 'Papers with Code', url: 'https://paperswithcode.com', type: 'Learning' }
    ]
  },

  'data-scientist': {
    id: 'data-scientist',
    name: 'Data Scientist',
    icon: 'fa-chart-line',
    color: '#10b981',
    match: 0,
    tagline: 'Transform data into insights and drive business decisions',
    timeline: [
      { year: 'Class 11-12', title: 'Foundation', description: 'PCM or PCM + Economics', icon: 'fa-book' },
      { year: 'Year 1-2', title: 'Entrance Prep', description: 'JEE/CUET/other exams', icon: 'fa-pencil-alt' },
      { year: 'Year 3-6', title: 'Graduation', description: 'B.Sc/B.Tech in Stats/CS/Math', icon: 'fa-graduation-cap' },
      { year: 'Year 7-9', title: 'Career Growth', description: 'Data Analyst to Data Scientist', icon: 'fa-briefcase' },
      { year: 'Year 10+', title: 'Leadership', description: 'Lead Data Scientist', icon: 'fa-trophy' }
    ],
    roadmap: {
      class11_12: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'],
      entranceExam: 'JEE / CUET / College-specific',
      undergraduate: 'B.Sc Stats/Math/CS or B.Tech (4 years)',
      postgraduate: 'M.Sc in Data Science (2 years)',
      careerEntry: 'Data Analyst / Junior Data Scientist'
    },
    entranceExams: [],
    topColleges: [
      { name: 'ISI Kolkata', location: 'Kolkata', fees: '₹50K/year', cutoff: 'ISI Entrance', placement: '₹35 LPA avg', ranking: '1' },
      { name: 'CMI Chennai', location: 'Chennai', fees: '₹1L/year', cutoff: 'CMI Entrance', placement: '₹28 LPA avg', ranking: '2' },
      { name: 'IIT Madras', location: 'Chennai', fees: '₹2L/year', cutoff: 'JEE Adv. Rank < 1000', placement: '₹38 LPA avg', ranking: '3' }
    ],
    skills: {
      technical: ['Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Machine Learning', 'Statistics'],
      subjects: ['Statistics', 'Mathematics', 'Probability', 'Database Systems'],
      certifications: ['IBM Data Science', 'Google Data Analytics', 'Microsoft Data Analyst'],
      softSkills: ['Analytical thinking', 'Communication', 'Business acumen', 'Storytelling']
    },
    progression: [
      { title: 'Data Analyst', years: '0-2', salary: '₹6-12 LPA', responsibilities: ['Analyze data', 'Create dashboards', 'Generate reports'] },
      { title: 'Data Scientist', years: '2-5', salary: '₹12-25 LPA', responsibilities: ['Build ML models', 'Statistical analysis', 'Insights generation'] },
      { title: 'Senior Data Scientist', years: '5-8', salary: '₹25-45 LPA', responsibilities: ['Lead projects', 'Strategy development', 'Team mentoring'] },
      { title: 'Lead Data Scientist', years: '8+', salary: '₹45-70+ LPA', responsibilities: ['Department leadership', 'Business strategy', 'Innovation'] }
    ],
    marketInsights: {
      demand: 'High',
      growth: '+28% annually',
      startingSalary: '₹6-12 LPA',
      experiencedSalary: '₹45-70+ LPA'
    },
    checklist: {
      immediate: ['Learn Excel & SQL', 'Understand statistics basics', 'Explore data visualization'],
      shortTerm: ['Complete data science course', 'Build analysis projects', 'Learn Python/R'],
      longTerm: ['Master machine learning', 'Develop domain expertise', 'Build portfolio']
    },
    resources: [
      { name: 'Kaggle Learn', url: 'https://kaggle.com/learn', type: 'Learning' },
      { name: 'DataCamp', url: 'https://datacamp.com', type: 'Learning' },
      { name: 'Towards Data Science', url: 'https://towardsdatascience.com', type: 'Community' }
    ]
  },

  'cybersecurity-specialist': {
    id: 'cybersecurity-specialist',
    name: 'Cybersecurity Specialist',
    icon: 'fa-shield-alt',
    color: '#ef4444',
    match: 0,
    tagline: 'Protect digital assets and defend against cyber threats',
    timeline: [
      { year: 'Class 11-12', title: 'Foundation', description: 'PCM with Computer Science', icon: 'fa-book' },
      { year: 'Year 1-2', title: 'Entrance Prep', description: 'JEE/BITSAT preparation', icon: 'fa-pencil-alt' },
      { year: 'Year 3-6', title: 'B.Tech', description: 'CS/Cybersecurity degree', icon: 'fa-graduation-cap' },
      { year: 'Year 7-9', title: 'Career Growth', description: 'Security Analyst to Specialist', icon: 'fa-briefcase' },
      { year: 'Year 10+', title: 'Leadership', description: 'Security Architect / CISO', icon: 'fa-trophy' }
    ],
    roadmap: {
      class11_12: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
      entranceExam: 'JEE Main/Advanced / BITSAT',
      undergraduate: 'B.Tech in CS/Cybersecurity (4 years)',
      postgraduate: 'M.Tech in Cybersecurity (Optional)',
      careerEntry: 'Security Analyst / SOC Analyst'
    },
    entranceExams: [],
    topColleges: [
      { name: 'IIT Kanpur', location: 'Kanpur', fees: '₹2L/year', cutoff: 'JEE Adv. Rank < 800', placement: '₹42 LPA avg', ranking: '2' },
      { name: 'NIT Trichy', location: 'Trichy', fees: '₹1.5L/year', cutoff: 'JEE Main Rank < 5000', placement: '₹28 LPA avg', ranking: '8' },
      { name: 'VIT Vellore', location: 'Vellore', fees: '₹2L/year', cutoff: 'VITEEE Rank < 10000', placement: '₹20 LPA avg', ranking: '15' }
    ],
    skills: {
      technical: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Penetration Testing', 'Security Tools', 'Linux'],
      subjects: ['Computer Networks', 'Operating Systems', 'Cryptography', 'Security Protocols'],
      certifications: ['CEH', 'CISSP', 'CompTIA Security+', 'OSCP', 'Security Blue Team'],
      softSkills: ['Analytical thinking', 'Attention to detail', 'Communication', 'Problem-solving']
    },
    progression: [
      { title: 'Security Analyst', years: '0-3', salary: '₹6-15 LPA', responsibilities: ['Monitor threats', 'Incident response', 'Security analysis'] },
      { title: 'Cybersecurity Specialist', years: '3-6', salary: '₹15-30 LPA', responsibilities: ['Implement security', 'Conduct audits', 'Threat hunting'] },
      { title: 'Senior Security Engineer', years: '6-10', salary: '₹30-50 LPA', responsibilities: ['Design security architecture', 'Lead teams', 'Strategy'] },
      { title: 'CISO / Security Architect', years: '10+', salary: '₹50-100+ LPA', responsibilities: ['Organization security', 'Risk management', 'Compliance'] }
    ],
    marketInsights: {
      demand: 'High',
      growth: '+31% annually',
      startingSalary: '₹6-15 LPA',
      experiencedSalary: '₹50-100+ LPA'
    },
    checklist: {
      immediate: ['Learn networking basics', 'Set up virtual labs', 'Understand Linux'],
      shortTerm: ['Get CompTIA Security+', 'Practice on HackTheBox', 'Learn ethical hacking'],
      longTerm: ['Obtain CEH/OSCP', 'Specialize in area', 'Build security portfolio']
    },
    resources: [
      { name: 'TryHackMe', url: 'https://tryhackme.com', type: 'Learning' },
      { name: 'HackTheBox', url: 'https://hackthebox.com', type: 'Learning' },
      { name: 'Cybersecurity & Infrastructure Security Agency', url: 'https://cisa.gov', type: 'Official' }
    ]
  },

  'ux-designer': {
    id: 'ux-designer',
    name: 'UX/UI Designer',
    icon: 'fa-palette',
    color: '#f59e0b',
    match: 0,
    tagline: 'Design intuitive experiences that delight users',
    timeline: [
      { year: 'Class 11-12', title: 'Foundation', description: 'Any stream with design interest', icon: 'fa-book' },
      { year: 'Year 1-2', title: 'Portfolio Building', description: 'NIFT/NID entrance prep', icon: 'fa-pencil-alt' },
      { year: 'Year 3-6', title: 'Design Degree', description: 'B.Des or related field', icon: 'fa-graduation-cap' },
      { year: 'Year 7-9', title: 'Career Growth', description: 'UI Designer to UX Designer', icon: 'fa-briefcase' },
      { year: 'Year 10+', title: 'Leadership', description: 'Design Lead / Product Designer', icon: 'fa-trophy' }
    ],
    roadmap: {
      class11_12: ['Any stream', 'Focus on creativity', 'Build design portfolio'],
      entranceExam: 'NIFT / NID / UCEED / College-specific',
      undergraduate: 'B.Des in UX/Visual Design (4 years)',
      postgraduate: 'M.Des (Optional, 2 years)',
      careerEntry: 'Junior UI Designer / Visual Designer'
    },
    entranceExams: [],
    topColleges: [
      { name: 'NID Ahmedabad', location: 'Ahmedabad', fees: '₹2L/year', cutoff: 'NID Entrance', placement: '₹12 LPA avg', ranking: '1' },
      { name: 'IIT Bombay IDC', location: 'Mumbai', fees: '₹2L/year', cutoff: 'UCEED', placement: '₹18 LPA avg', ranking: '2' },
      { name: 'Srishti Institute', location: 'Bangalore', fees: '₹3L/year', cutoff: 'Portfolio review', placement: '₹8 LPA avg', ranking: '5' }
    ],
    skills: {
      technical: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'Wireframing', 'Design Systems', 'HTML/CSS'],
      subjects: ['Design Thinking', 'Psychology', 'Visual Communication', 'User Research'],
      certifications: ['Google UX Design', 'Nielsen Norman Group', 'Interaction Design Foundation'],
      softSkills: ['Empathy', 'Communication', 'Collaboration', 'Problem-solving', 'Creativity']
    },
    progression: [
      { title: 'Junior UI Designer', years: '0-2', salary: '₹4-8 LPA', responsibilities: ['Design interfaces', 'Create mockups', 'Learn UX principles'] },
      { title: 'UX Designer', years: '2-5', salary: '₹8-18 LPA', responsibilities: ['User research', 'Create wireframes', 'Usability testing'] },
      { title: 'Senior UX Designer', years: '5-8', salary: '₹18-35 LPA', responsibilities: ['Lead design projects', 'Mentor designers', 'Design strategy'] },
      { title: 'Design Lead', years: '8+', salary: '₹35-60+ LPA', responsibilities: ['Team management', 'Product vision', 'Design leadership'] }
    ],
    marketInsights: {
      demand: 'High',
      growth: '+22% annually',
      startingSalary: '₹4-8 LPA',
      experiencedSalary: '₹35-60+ LPA'
    },
    checklist: {
      immediate: ['Learn Figma basics', 'Study design principles', 'Build first project'],
      shortTerm: ['Complete UX course', 'Create 3-5 projects', 'Build portfolio website'],
      longTerm: ['Specialize in UX research', 'Work on real products', 'Build strong portfolio']
    },
    resources: [
      { name: 'Figma Learn', url: 'https://figma.com/resources/learn-design', type: 'Learning' },
      { name: 'Laws of UX', url: 'https://lawsofux.com', type: 'Learning' },
      { name: 'Dribbble', url: 'https://dribbble.com', type: 'Community' }
    ]
  },

  'blockchain-developer': {
    id: 'blockchain-developer',
    name: 'Blockchain Developer',
    icon: 'fa-cube',
    color: '#06b6d4',
    match: 0,
    tagline: 'Build decentralized applications and smart contracts',
    timeline: [
      { year: 'Class 11-12', title: 'Foundation', description: 'PCM with Computer Science', icon: 'fa-book' },
      { year: 'Year 1-2', title: 'Entrance Prep', description: 'JEE/BITSAT preparation', icon: 'fa-pencil-alt' },
      { year: 'Year 3-6', title: 'B.Tech', description: 'Computer Science degree', icon: 'fa-graduation-cap' },
      { year: 'Year 7-9', title: 'Specialization', description: 'Learn blockchain & Web3', icon: 'fa-briefcase' },
      { year: 'Year 10+', title: 'Leadership', description: 'Blockchain Architect', icon: 'fa-trophy' }
    ],
    roadmap: {
      class11_12: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
      entranceExam: 'JEE Main/Advanced / BITSAT',
      undergraduate: 'B.Tech in Computer Science (4 years)',
      postgraduate: 'Self-study in Blockchain (certifications)',
      careerEntry: 'Junior Blockchain Developer'
    },
    entranceExams: [],
    topColleges: [
      { name: 'IIT Bombay', location: 'Mumbai', fees: '₹2L/year', cutoff: 'JEE Adv. Rank < 200', placement: '₹48 LPA avg', ranking: '1' },
      { name: 'BITS Pilani', location: 'Pilani', fees: '₹5L/year', cutoff: 'BITSAT Score > 360', placement: '₹28 LPA avg', ranking: '5' },
      { name: 'IIIT Bangalore', location: 'Bangalore', fees: '₹3L/year', cutoff: 'JEE Main Rank < 3000', placement: '₹30 LPA avg', ranking: '7' }
    ],
    skills: {
      technical: ['Solidity', 'Ethereum', 'Web3.js', 'Smart Contracts', 'Cryptography', 'JavaScript', 'Rust'],
      subjects: ['Cryptography', 'Distributed Systems', 'Computer Networks', 'Algorithms'],
      certifications: ['Certified Blockchain Developer', 'Ethereum Developer', 'Hyperledger Fabric'],
      softSkills: ['Problem-solving', 'Security mindset', 'Collaboration', 'Continuous learning']
    },
    progression: [
      { title: 'Junior Blockchain Developer', years: '0-2', salary: '₹8-15 LPA', responsibilities: ['Develop smart contracts', 'Test blockchain apps', 'Learn platforms'] },
      { title: 'Blockchain Developer', years: '2-5', salary: '₹15-30 LPA', responsibilities: ['Build dApps', 'Optimize contracts', 'Security audits'] },
      { title: 'Senior Blockchain Developer', years: '5-8', salary: '₹30-55 LPA', responsibilities: ['Architect solutions', 'Lead projects', 'Mentor team'] },
      { title: 'Blockchain Architect', years: '8+', salary: '₹55-90+ LPA', responsibilities: ['Design systems', 'Strategy', 'Innovation leadership'] }
    ],
    marketInsights: {
      demand: 'Medium',
      growth: '+67% annually',
      startingSalary: '₹8-15 LPA',
      experiencedSalary: '₹55-90+ LPA'
    },
    checklist: {
      immediate: ['Learn blockchain basics', 'Understand cryptography', 'Set up Ethereum wallet'],
      shortTerm: ['Learn Solidity', 'Build 2-3 dApps', 'Contribute to Web3 projects'],
      longTerm: ['Master smart contract security', 'Specialize in platform', 'Build DeFi projects']
    },
    resources: [
      { name: 'CryptoZombies', url: 'https://cryptozombies.io', type: 'Learning' },
      { name: 'Ethereum.org', url: 'https://ethereum.org/developers', type: 'Official' },
      { name: 'Web3 University', url: 'https://web3.university', type: 'Learning' }
    ]
  },

  'green-energy-engineer': {
    id: 'green-energy-engineer',
    name: 'Green Energy Engineer',
    icon: 'fa-leaf',
    color: '#10b981',
    match: 0,
    tagline: 'Design sustainable energy solutions for a greener future',
    timeline: [
      { year: 'Class 11-12', title: 'Foundation', description: 'PCM with focus on Physics', icon: 'fa-book' },
      { year: 'Year 1-2', title: 'Entrance Prep', description: 'JEE Main/Advanced', icon: 'fa-pencil-alt' },
      { year: 'Year 3-6', title: 'B.Tech', description: 'Renewable Energy Engineering', icon: 'fa-graduation-cap' },
      { year: 'Year 7-9', title: 'Career Growth', description: 'Energy Analyst to Engineer', icon: 'fa-briefcase' },
      { year: 'Year 10+', title: 'Leadership', description: 'Sustainability Director', icon: 'fa-trophy' }
    ],
    roadmap: {
      class11_12: ['Physics', 'Chemistry', 'Mathematics', 'Environmental Science'],
      entranceExam: 'JEE Main/Advanced',
      undergraduate: 'B.Tech in Renewable Energy / Electrical (4 years)',
      postgraduate: 'M.Tech in Sustainable Energy (2 years)',
      careerEntry: 'Energy Analyst / Junior Engineer'
    },
    entranceExams: [],
    topColleges: [
      { name: 'IIT Delhi', location: 'Delhi', fees: '₹2L/year', cutoff: 'JEE Adv. Rank < 1500', placement: '₹35 LPA avg', ranking: '1' },
      { name: 'MNIT Jaipur', location: 'Jaipur', fees: '₹1.5L/year', cutoff: 'JEE Main Rank < 8000', placement: '₹18 LPA avg', ranking: '12' },
      { name: 'Amity University', location: 'Noida', fees: '₹2.5L/year', cutoff: 'Merit-based', placement: '₹12 LPA avg', ranking: '20' }
    ],
    skills: {
      technical: ['Solar Systems', 'Wind Energy', 'Energy Modeling', 'AutoCAD', 'Simulation Tools', 'Grid Management'],
      subjects: ['Thermodynamics', 'Electrical Systems', 'Environmental Engineering', 'Energy Economics'],
      certifications: ['NABCEP Solar PV', 'LEED Green Associate', 'Renewable Energy Professional'],
      softSkills: ['Sustainability mindset', 'Project management', 'Communication', 'Analytical thinking']
    },
    progression: [
      { title: 'Energy Analyst', years: '0-3', salary: '₹5-10 LPA', responsibilities: ['Energy audits', 'Data analysis', 'Report generation'] },
      { title: 'Renewable Energy Engineer', years: '3-6', salary: '₹10-20 LPA', responsibilities: ['Design systems', 'Project execution', 'Optimization'] },
      { title: 'Senior Energy Engineer', years: '6-10', salary: '₹20-35 LPA', responsibilities: ['Lead projects', 'Strategic planning', 'Team management'] },
      { title: 'Sustainability Director', years: '10+', salary: '₹35-60+ LPA', responsibilities: ['Organization strategy', 'Policy making', 'Innovation'] }
    ],
    marketInsights: {
      demand: 'Medium',
      growth: '+24% annually',
      startingSalary: '₹5-10 LPA',
      experiencedSalary: '₹35-60+ LPA'
    },
    checklist: {
      immediate: ['Learn energy basics', 'Understand solar/wind tech', 'Explore sustainability'],
      shortTerm: ['Get LEED certification', 'Work on energy projects', 'Join green initiatives'],
      longTerm: ['Specialize in renewable tech', 'Lead sustainability projects', 'Build expertise']
    },
    resources: [
      { name: 'IRENA', url: 'https://irena.org', type: 'Official' },
      { name: 'MNRE India', url: 'https://mnre.gov.in', type: 'Official' },
      { name: 'Renewable Energy World', url: 'https://renewableenergyworld.com', type: 'Learning' }
    ]
  }
};

export const emergingCareersList = Object.values(emergingCareersData);
